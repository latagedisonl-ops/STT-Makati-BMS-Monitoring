import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HourlyLog, DailyLog, calculateHourlyPUE, calculatePUE } from '../types';

interface LogReadingModalProps {
  onClose: () => void;
  onAddHourly: (log: Omit<HourlyLog, 'id' | 'timestamp'>) => void;
  onAddDaily: (log: Omit<DailyLog, 'id'>) => void;
}

const HALLS = ['A', 'B', 'C', 'D', 'E'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const LogReadingModal: React.FC<LogReadingModalProps> = ({ onClose, onAddHourly, onAddDaily }) => {
  const [tab, setTab] = useState<'hourly' | 'daily'>('hourly');

  // Hourly form state
  const [hourlyForm, setHourlyForm] = useState({
    hall: 'A',
    hour: HOURS[new Date().getHours()],
    temperature: '',
    humidity: '',
    itLoad: '',
    totalPower: ''
  });

  // Daily form state
  const [dailyForm, setDailyForm] = useState({
    date: new Date().toISOString().split('T')[0],
    cooling: '',
    it: '',
    others: '',
    supsLoss: '',
    txLoss: ''
  });

  // Calculated values
  const hourlyPUE = hourlyForm.itLoad && hourlyForm.totalPower
    ? calculateHourlyPUE(parseFloat(hourlyForm.totalPower), parseFloat(hourlyForm.itLoad))
    : 0;

  const dailyTotalUtility = 
    (parseFloat(dailyForm.cooling) || 0) +
    (parseFloat(dailyForm.it) || 0) +
    (parseFloat(dailyForm.others) || 0) +
    (parseFloat(dailyForm.supsLoss) || 0) +
    (parseFloat(dailyForm.txLoss) || 0);

  const dailyPUE = dailyForm.it
    ? calculatePUE(dailyTotalUtility, parseFloat(dailyForm.it))
    : 0;

  const handleHourlySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHourly({
      hall: hourlyForm.hall,
      hour: hourlyForm.hour,
      temperature: parseFloat(hourlyForm.temperature),
      humidity: parseFloat(hourlyForm.humidity),
      itLoad: parseFloat(hourlyForm.itLoad),
      totalPower: parseFloat(hourlyForm.totalPower)
    });
    
    // Reset form
    setHourlyForm({
      hall: 'A',
      hour: HOURS[new Date().getHours()],
      temperature: '',
      humidity: '',
      itLoad: '',
      totalPower: ''
    });
    
    onClose();
  };

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDaily({
      date: new Date(dailyForm.date),
      totalUtility: dailyTotalUtility,
      cooling: parseFloat(dailyForm.cooling),
      it: parseFloat(dailyForm.it),
      others: parseFloat(dailyForm.others),
      supsLoss: parseFloat(dailyForm.supsLoss),
      txLoss: parseFloat(dailyForm.txLoss),
      pue: dailyPUE
    });
    
    // Reset form
    setDailyForm({
      date: new Date().toISOString().split('T')[0],
      cooling: '',
      it: '',
      others: '',
      supsLoss: '',
      txLoss: ''
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Log Reading</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setTab('hourly')}
            className={`flex-1 px-6 py-3 font-medium transition-all relative ${
              tab === 'hourly' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hourly Reading
            {tab === 'hourly' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
            )}
          </button>
          <button
            onClick={() => setTab('daily')}
            className={`flex-1 px-6 py-3 font-medium transition-all relative ${
              tab === 'daily' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Summary
            {tab === 'daily' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === 'hourly' ? (
            <form onSubmit={handleHourlySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Hall Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hall</label>
                  <select
                    value={hourlyForm.hall}
                    onChange={e => setHourlyForm({ ...hourlyForm, hall: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    {HALLS.map(hall => (
                      <option key={hall} value={hall}>Hall {hall}</option>
                    ))}
                  </select>
                </div>

                {/* Hour Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hour</label>
                  <select
                    value={hourlyForm.hour}
                    onChange={e => setHourlyForm({ ...hourlyForm, hour: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    {HOURS.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hourlyForm.temperature}
                    onChange={e => setHourlyForm({ ...hourlyForm, temperature: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="25.5"
                    required
                  />
                </div>

                {/* Humidity */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hourlyForm.humidity}
                    onChange={e => setHourlyForm({ ...hourlyForm, humidity: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="55.0"
                    required
                  />
                </div>

                {/* IT Load */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    IT Load (kW)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hourlyForm.itLoad}
                    onChange={e => setHourlyForm({ ...hourlyForm, itLoad: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="150.00"
                    required
                  />
                </div>

                {/* Total Power */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Total Power (kW)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hourlyForm.totalPower}
                    onChange={e => setHourlyForm({ ...hourlyForm, totalPower: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="225.00"
                    required
                  />
                </div>
              </div>

              {/* PUE Preview */}
              {hourlyPUE > 0 && (
                <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Calculated PUE:</span>
                    <span className={`text-2xl font-bold ${
                      hourlyPUE <= 1.5 ? 'text-green-400' :
                      hourlyPUE <= 2.0 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {hourlyPUE.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-medium text-white transition-all shadow-lg shadow-cyan-500/20"
              >
                Add Hourly Reading
              </button>
            </form>
          ) : (
            <form onSubmit={handleDailySubmit} className="space-y-4">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={dailyForm.date}
                  onChange={e => setDailyForm({ ...dailyForm, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Cooling */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cooling (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dailyForm.cooling}
                    onChange={e => setDailyForm({ ...dailyForm, cooling: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="1200.00"
                    required
                  />
                </div>

                {/* IT */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    IT (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dailyForm.it}
                    onChange={e => setDailyForm({ ...dailyForm, it: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="3600.00"
                    required
                  />
                </div>

                {/* Others */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Others (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dailyForm.others}
                    onChange={e => setDailyForm({ ...dailyForm, others: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="800.00"
                    required
                  />
                </div>

                {/* SUPS Loss */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    SUPS Loss (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dailyForm.supsLoss}
                    onChange={e => setDailyForm({ ...dailyForm, supsLoss: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="200.00"
                    required
                  />
                </div>

                {/* TX Loss */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    TX Loss (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dailyForm.txLoss}
                    onChange={e => setDailyForm({ ...dailyForm, txLoss: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="400.00"
                    required
                  />
                </div>
              </div>

              {/* Auto-calculated Preview */}
              {dailyTotalUtility > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Total Utility (Auto-calculated):</span>
                      <span className="text-xl font-bold text-blue-400">
                        {dailyTotalUtility.toFixed(2)} kWh
                      </span>
                    </div>
                  </div>
                  
                  {dailyPUE > 0 && (
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Calculated PUE:</span>
                        <span className={`text-2xl font-bold ${
                          dailyPUE <= 1.5 ? 'text-green-400' :
                          dailyPUE <= 2.0 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {dailyPUE.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-medium text-white transition-all shadow-lg shadow-cyan-500/20"
              >
                Add Daily Summary
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogReadingModal;
