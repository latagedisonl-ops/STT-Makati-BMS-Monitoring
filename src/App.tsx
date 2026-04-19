import { fetchHourlyLogs, saveHourlyLog, fetchDailyLogs, saveDailyLog } from './services/api';
import React, { useState, useEffect, useMemo } from 'react';
import { Server, Download, Upload, Plus, TrendingUp, Calendar, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import HallCard from './components/HallCard';
import FacilityPUE from './components/FacilityPUE';
import TrendChart from './components/TrendChart';
import FiveDaySummary from './components/FiveDaySummary';
import LogReadingModal from './components/LogReadingModal';
import { HelpModal } from './components/HelpModal';
import { HourlyLog, DailyLog, calculateHourlyPUE } from './types';

const HALLS = ['A', 'B', 'C', 'D', 'E'];

function App() {
  const [hourlyLogs, setHourlyLogs] = useState<HourlyLog[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [activeHall, setActiveHall] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily' | 'summary'>('hourly');

  // Load data from Google Sheets on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [hourly, daily] = await Promise.all([
          fetchHourlyLogs(),
          fetchDailyLogs(),
        ]);
        setHourlyLogs(hourly);
        setDailyLogs(daily);
      } catch (error) {
        console.error('Failed to load data from Google Sheets:', error);
        // Fallback to localStorage if API fails
      }
    };
    loadData();
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
  const addHourlyLog = async (log: Omit<HourlyLog, 'id'>) => {
    const newLog: HourlyLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
  
    // Save to Google Sheets
    try {
      await saveHourlyLog(newLog);
      setHourlyLogs(prev => [...prev, newLog]);
    } catch (error) {
      console.error('Failed to save to Google Sheets:', error);
      alert('Failed to sync with Google Sheets. Data saved locally only.');
      setHourlyLogs(prev => [...prev, newLog]);
    }
  };

  // Add daily log
  const addDailyLog = async (log: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = {
      ...log,
      id: Date.now().toString(),
    };
  
    // Save to Google Sheets
    try {
      await saveDailyLog(newLog);
      setDailyLogs(prev => [...prev, newLog]);
    } catch (error) {
      console.error('Failed to save to Google Sheets:', error);
      alert('Failed to sync with Google Sheets. Data saved locally only.');
      setDailyLogs(prev => [...prev, newLog]);
    }
  };

  // Export CSV
  const exportCSV = () => {
    if (hourlyLogs.length === 0 && dailyLogs.length === 0) {
      alert('No data to export');
      return;
    }

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

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stt-makati-bms-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import CSV
  const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

      let i = 0;
      const newHourlyLogs: HourlyLog[] = [];
      const newDailyLogs: DailyLog[] = [];

      while (i < lines.length) {
        const line = lines[i];
        
        if (line === 'HOURLY LOGS') {
          i += 2; // Skip header
          while (i < lines.length && lines[i] !== 'DAILY LOGS') {
            const parts = lines[i].split(',');
            if (parts.length >= 7) {
              newHourlyLogs.push({
                id: Date.now().toString() + Math.random(),
                timestamp: new Date(parts[0]),
                hall: parts[1],
                hour: parts[2],
                temperature: parseFloat(parts[3]),
                humidity: parseFloat(parts[4]),
                itLoad: parseFloat(parts[5]),
                totalPower: parseFloat(parts[6])
              });
            }
            i++;
          }
        } else if (line === 'DAILY LOGS') {
          i += 2; // Skip header
          while (i < lines.length) {
            const parts = lines[i].split(',');
            if (parts.length >= 7) {
              newDailyLogs.push({
                id: Date.now().toString() + Math.random(),
                date: new Date(parts[0]),
                totalUtility: parseFloat(parts[1]),
                cooling: parseFloat(parts[2]),
                it: parseFloat(parts[3]),
                others: parseFloat(parts[4]),
                supsLoss: parseFloat(parts[5]),
                txLoss: parseFloat(parts[6]),
                pue: parseFloat(parts[7])
              });
            }
            i++;
          }
        } else {
          i++;
        }
      }

      if (newHourlyLogs.length > 0) {
        setHourlyLogs(prev => [...prev, ...newHourlyLogs]);
      }
      if (newDailyLogs.length > 0) {
        setDailyLogs(prev => [...prev, ...newDailyLogs]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          {/* Top Row: Branding + Actions + Clock */}
          <div className="flex items-center justify-between mb-4">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Server className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BMS MONITORING</h1>
                <p className="text-sm text-cyan-400">FOR STT MAKATI</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                title="Help & Integration Guide"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Help</span>
              </button>

              <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2 border border-slate-700">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Import CSV</span>
                <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
              </label>
              
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Log Reading</span>
              </button>
            </div>

            {/* Live Clock */}
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400 tabular-nums">
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <div className="text-sm text-slate-400 uppercase">
                {format(currentTime, 'EEE, dd MMM yyyy')}
              </div>
            </div>
          </div>

          {/* Live KPI Strip */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Avg PUE</div>
              <div className={`text-2xl font-bold tabular-nums ${getPUEColor(kpis.avgPUE)}`}>
                {kpis.avgPUE > 0 ? kpis.avgPUE.toFixed(2) : '--'}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Avg Temperature</div>
              <div className="text-2xl font-bold tabular-nums text-orange-400">
                {kpis.avgTemp > 0 ? `${kpis.avgTemp.toFixed(1)}°C` : '--'}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Avg Humidity</div>
              <div className="text-2xl font-bold tabular-nums text-blue-400">
                {kpis.avgHumidity > 0 ? `${kpis.avgHumidity.toFixed(1)}%` : '--'}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Total IT Load</div>
              <div className="text-2xl font-bold tabular-nums text-purple-400">
                {kpis.totalITLoad > 0 ? `${kpis.totalITLoad.toFixed(0)} kW` : '--'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Hall Cards */}
        <div className="grid grid-cols-5 gap-4">
          {hallData.map(data => (
            <HallCard
              key={data.hall}
              hall={data.hall}
              temperature={data.temperature}
              humidity={data.humidity}
              pue={data.pue}
              hasData={data.hasData}
              isActive={activeHall === data.hall}
              onClick={() => setActiveHall(activeHall === data.hall ? null : data.hall)}
            />
          ))}
        </div>

        {/* Facility PUE + Trend Chart */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <FacilityPUE hallData={hallData} facilityPUE={kpis.avgPUE} />
          </div>
          <div className="col-span-2">
            <TrendChart hourlyLogs={hourlyLogs} activeHall={activeHall} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === 'hourly'
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Hourly Trends
            {activeTab === 'hourly' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === 'summary'
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            5-Day Summary
            {activeTab === 'summary' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && <FiveDaySummary dailyLogs={dailyLogs} />}
      </main>

      {/* Log Reading Modal */}
      {isModalOpen && (
        <LogReadingModal
          onClose={() => setIsModalOpen(false)}
          onAddHourly={addHourlyLog}
          onAddDaily={addDailyLog}
        />
      )}

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
