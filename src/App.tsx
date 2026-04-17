import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Download, Upload, Plus, HelpCircle, Server } from 'lucide-react';
import { HourlyLog, DailyLog, HALLS, calculateHourlyPUE } from './types';
import { parseCSV } from './utils/csvParser';
import HallCard from './components/HallCard';
import FacilityPUE from './components/FacilityPUE';
import TrendChart from './components/TrendChart';
import SummaryTab from './components/SummaryTab';
import LogModal from './components/LogModal';
import HelpModal from './components/HelpModal';

function App() {
  const [hourlyLogs, setHourlyLogs] = useState<HourlyLog[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [activeHall, setActiveHall] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'trends' | 'summary'>('trends');
  const [isExporting, setIsExporting] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedHourly = localStorage.getItem('bms-hourly-logs');
    const savedDaily = localStorage.getItem('bms-daily-logs');
    if (savedHourly) {
      setHourlyLogs(JSON.parse(savedHourly, (key, value) => {
        if (key === 'timestamp' || key === 'date') return new Date(value);
        return value;
      }));
    }
    if (savedDaily) {
      setDailyLogs(JSON.parse(savedDaily, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      }));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (hourlyLogs.length > 0) {
      localStorage.setItem('bms-hourly-logs', JSON.stringify(hourlyLogs));
    }
  }, [hourlyLogs]);

  useEffect(() => {
    if (dailyLogs.length > 0) {
      localStorage.setItem('bms-daily-logs', JSON.stringify(dailyLogs));
    }
  }, [dailyLogs]);

  // Calculate live KPIs
  const kpis = useMemo(() => {
    if (hourlyLogs.length === 0) {
      return { avgPUE: 0, avgTemp: 0, avgHumidity: 0, totalITLoad: 0 };
    }

    // Get latest logs for each hall
    const latestByHall = HALLS.map(hall => {
      const hallLogs = hourlyLogs.filter(log => log.hall === hall);
      return hallLogs.length > 0 ? hallLogs[hallLogs.length - 1] : null;
    }).filter(Boolean) as HourlyLog[];

    const avgTemp = latestByHall.reduce((sum, log) => sum + log.temperature, 0) / latestByHall.length || 0;
    const avgHumidity = latestByHall.reduce((sum, log) => sum + log.humidity, 0) / latestByHall.length || 0;
    const totalITLoad = latestByHall.reduce((sum, log) => sum + log.itLoad, 0);
    
    // Calculate facility PUE
    const totalPower = latestByHall.reduce((sum, log) => sum + log.totalPower, 0);
    const avgPUE = totalITLoad > 0 ? totalPower / totalITLoad : 0;

    return { avgPUE, avgTemp, avgHumidity, totalITLoad };
  }, [hourlyLogs]);

  // Get latest data for each hall
  const hallData = useMemo(() => {
    return HALLS.map(hall => {
      const hallLogs = hourlyLogs.filter(log => log.hall === hall);
      const latest = hallLogs.length > 0 ? hallLogs[hallLogs.length - 1] : null;
      return {
        hall,
        hasData: !!latest,
        temperature: latest?.temperature || 0,
        humidity: latest?.humidity || 0,
        pue: latest ? calculateHourlyPUE(latest.totalPower, latest.itLoad) : 0
      };
    });
  }, [hourlyLogs]);

  // Add hourly log
  const addHourlyLog = (log: Omit<HourlyLog, 'id' | 'timestamp'>) => {
    const newLog: HourlyLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setHourlyLogs(prev => [...prev, newLog]);
  };

  // Add daily log
  const addDailyLog = (log: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = {
      ...log,
      id: Date.now().toString()
    };
    setDailyLogs(prev => [...prev, newLog]);
  };

  // Generate CSV content
  const generateCSVContent = () => {
    let csvContent = '';

    if (hourlyLogs.length > 0) {
      csvContent += 'HOURLY LOGS\n';
      csvContent += 'Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE\n';
      hourlyLogs.forEach(log => {
        const pue = calculateHourlyPUE(log.totalPower, log.itLoad);
        csvContent += `${format(log.timestamp, 'yyyy-MM-dd HH:mm:ss')},${log.hall},${log.hour},${log.temperature},${log.humidity},${log.itLoad},${log.totalPower},${pue.toFixed(2)}\n`;
      });
      csvContent += '\n';
    }

    if (dailyLogs.length > 0) {
      csvContent += 'DAILY LOGS\n';
      csvContent += 'Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE\n';
      dailyLogs.forEach(log => {
        csvContent += `${format(log.date, 'yyyy-MM-dd')},${log.totalUtility},${log.cooling},${log.it},${log.others},${log.supsLoss},${log.txLoss},${log.pue.toFixed(2)}\n`;
      });
    }

    return csvContent;
  };

  // Export CSV
  const exportCSV = async () => {
    console.log('Export CSV clicked');
    console.log('Hourly logs:', hourlyLogs.length);
    console.log('Daily logs:', dailyLogs.length);

    if (hourlyLogs.length === 0 && dailyLogs.length === 0) {
      alert('No data to export. Please import data or add readings first.');
      return;
    }

    setIsExporting(true);

    try {
      const csvContent = generateCSVContent();
      console.log('CSV Content generated:', csvContent.substring(0, 200));

      // Method 1: Try standard download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stt-makati-bms-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      
      console.log('Triggering download...');
      
      // Try multiple download methods for better browser compatibility
      let downloadSuccess = false;
      try {
        link.click();
        downloadSuccess = true;
      } catch (clickError) {
        // Fallback: try dispatching a mouse event
        console.warn('Direct click failed, trying mouse event');
        try {
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          link.dispatchEvent(event);
          downloadSuccess = true;
        } catch (eventError) {
          console.error('Mouse event failed', eventError);
        }
      }
      
      // Clean up
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        console.log('Download cleanup completed');
      }, 100);

      if (downloadSuccess) {
        alert(`✅ Export successful!\n\n📊 Exported:\n• ${hourlyLogs.length} hourly log(s)\n• ${dailyLogs.length} daily log(s)\n\nCheck your Downloads folder.`);
      } else {
        // Offer clipboard copy as fallback
        const copyToClipboard = window.confirm(
          '⚠️ Download blocked by browser.\n\nWould you like to copy the CSV data to clipboard instead?\n\nYou can then paste it into a text editor and save as .csv file.'
        );
        
        if (copyToClipboard) {
          await navigator.clipboard.writeText(csvContent);
          alert('✅ CSV data copied to clipboard!\n\n1. Open a text editor (Notepad, etc.)\n2. Paste (Ctrl+V)\n3. Save as .csv file');
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      
      // Last resort: offer clipboard copy
      const copyToClipboard = window.confirm(
        '❌ Export failed.\n\nWould you like to copy the CSV data to clipboard instead?'
      );
      
      if (copyToClipboard) {
        try {
          const csvContent = generateCSVContent();
          await navigator.clipboard.writeText(csvContent);
          alert('✅ CSV data copied to clipboard!\n\n1. Open a text editor\n2. Paste the content\n3. Save as .csv file');
        } catch (clipError) {
          alert('❌ Clipboard access denied.\n\nPlease check:\n1. Browser popup blocker\n2. Browser permissions\n3. Try a different browser');
        }
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Import CSV
  const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { hourlyLogs: newHourlyLogs, dailyLogs: newDailyLogs } = parseCSV(text);

        let importedCount = 0;
        
        if (newHourlyLogs.length > 0) {
          setHourlyLogs(prev => [...prev, ...newHourlyLogs]);
          importedCount += newHourlyLogs.length;
        }
        
        if (newDailyLogs.length > 0) {
          setDailyLogs(prev => [...prev, ...newDailyLogs]);
          importedCount += newDailyLogs.length;
        }

        if (importedCount > 0) {
          alert(`Successfully imported ${importedCount} record(s)!\n\n${newHourlyLogs.length} hourly log(s)\n${newDailyLogs.length} daily log(s)`);
        } else {
          alert('No valid data found in CSV file. Please check the file format.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing CSV file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getPUEColor = (pue: number) => {
    if (pue === 0) return 'text-gray-400';
    if (pue <= 1.5) return 'text-green-500';
    if (pue <= 2.0) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Top Row: Branding + Actions + Clock */}
          <div className="flex items-center justify-between mb-4">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Server className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">BMS MONITORING</h1>
                <p className="text-xs text-blue-300">FOR STT MAKATI</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Import CSV</span>
                <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
              </label>

              <button
                onClick={exportCSV}
                disabled={isExporting}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-lg ${
                  isExporting 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/50'
                }`}
              >
                <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                <span className="text-sm font-medium">
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Log Reading</span>
              </button>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-lg hover:shadow-amber-500/50"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Help</span>
              </button>
            </div>

            {/* Live Clock */}
            <div className="text-right">
              <div className="text-2xl font-bold text-white tabular-nums">
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <div className="text-xs text-blue-300 uppercase">
                {format(currentTime, 'EEE, dd MMM yyyy')}
              </div>
            </div>
          </div>

          {/* Live KPI Strip */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-3 border border-blue-500/20">
              <div className="text-xs text-blue-300 mb-1">Avg PUE</div>
              <div className={`text-2xl font-bold ${getPUEColor(kpis.avgPUE)}`}>
                {kpis.avgPUE > 0 ? kpis.avgPUE.toFixed(2) : '--'}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-3 border border-blue-500/20">
              <div className="text-xs text-blue-300 mb-1">Avg Temperature</div>
              <div className="text-2xl font-bold text-orange-400">
                {kpis.avgTemp > 0 ? `${kpis.avgTemp.toFixed(1)}°C` : '--'}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-3 border border-blue-500/20">
              <div className="text-xs text-blue-300 mb-1">Avg Humidity</div>
              <div className="text-2xl font-bold text-cyan-400">
                {kpis.avgHumidity > 0 ? `${kpis.avgHumidity.toFixed(1)}%` : '--'}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-3 border border-blue-500/20">
              <div className="text-xs text-blue-300 mb-1">Total IT Load</div>
              <div className="text-2xl font-bold text-yellow-400">
                {kpis.totalITLoad > 0 ? `${kpis.totalITLoad.toFixed(0)} kW` : '--'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hall Cards */}
        <div className="grid grid-cols-5 gap-4">
          {hallData.map(data => (
            <HallCard
              key={data.hall}
              {...data}
              isActive={activeHall === data.hall}
              onClick={() => setActiveHall(activeHall === data.hall ? null : data.hall)}
            />
          ))}
        </div>

        {/* Facility PUE + Trend Chart */}
        <div className="grid grid-cols-3 gap-6">
          <FacilityPUE hallData={hallData} />
          <div className="col-span-2">
            <TrendChart
              hourlyLogs={hourlyLogs}
              activeHall={activeHall}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && <SummaryTab dailyLogs={dailyLogs} />}
      </div>

      {/* Log Reading Modal */}
      {isModalOpen && (
        <LogModal
          onClose={() => setIsModalOpen(false)}
          onAddHourly={addHourlyLog}
          onAddDaily={addDailyLog}
        />
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
