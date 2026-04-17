import { useState } from 'react';
import { X } from 'lucide-react';
import { HourlyLog, DailyLog, HALLS, calculateHourlyPUE, calculateDailyPUE } from '../types';

interface LogModalProps {
  onClose: () => void;
  onAddHourly: (log: Omit<HourlyLog, 'id' | 'timestamp'>) => void;
  onAddDaily: (log: Omit<DailyLog, 'id'>) => void;
}

type TabType = 'hourly' | 'daily';

export default function LogModal({ onClose, onAddHourly, onAddDaily }: LogModalProps) {
  const [tab, setTab] = useState<TabType>('hourly');

  // Hourly form state
  const [hall, setHall] = useState('A');
  const [hour, setHour] = useState('00:00');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [itLoad, setItLoad] = useState('');
  const [totalPower, setTotalPower] = useState('');

  // Daily form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cooling, setCooling] = useState('');
  const [it, setIt] = useState('');
  const [others, setOthers] = useState('');
  const [supsLoss, setSupsLoss] = useState('');
  const [txLoss, setTxLoss] = useState('');

  const hourlyPUE = itLoad && totalPower 
    ? calculateHourlyPUE(parseFloat(totalPower), parseFloat(itLoad))
    : 0;

  const dailyTotalUtility = [cooling, it, others, supsLoss, txLoss]
    .filter(v => v)
    .reduce((sum, v) => sum + parseFloat(v), 0);

  const dailyPUE = it && dailyTotalUtility
    ? calculateDailyPUE(dailyTotalUtility, parseFloat(it))
    : 0;

  const handleHourlySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHourly({
      hall,
      hour,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      itLoad: parseFloat(itLoad),
      totalPower: parseFloat(totalPower)
    });
    // Reset form
    setTemperature('');
    setHumidity('');
    setItLoad('');
    setTotalPower('');
    onClose();
  };

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDaily({
      date: new Date(date),
      totalUtility: dailyTotalUtility,
      cooling: parseFloat(cooling),
      it: parseFloat(it),
      others: parseFloat(others),
      supsLoss: parseFloat(supsLoss),
      txLoss: parseFloat(txLoss),
      pue: dailyPUE
    });
    // Reset form
    setCooling('');
    setIt('');
    setOthers('');
    setSupsLoss('');
    setTxLoss('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-blue-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-blue-500/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Log Reading</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('hourly')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                tab === 'hourly'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              Hourly
            </button>
            <button
              onClick={() => setTab('daily')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                tab === 'daily'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              Daily
            </button>
          </div>

          {/* Hourly Form */}
          {tab === 'hourly' && (
            <form onSubmit={handleHourlySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Hall</label>
                  <select
                    value={hall}
                    onChange={(e) => setHall(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {HALLS.map(h => (
                      <option key={h} value={h}>Hall {h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Hour</label>
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const h = i.toString().padStart(2, '0');
                      return <option key={h} value={`${h}:00`}>{h}:00</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Humidity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="55"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">IT Load (kW)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itLoad}
                    onChange={(e) => setItLoad(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Total Power (kW)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalPower}
                    onChange={(e) => setTotalPower(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="225"
                  />
                </div>
              </div>

              {hourlyPUE > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="text-sm text-blue-300">Calculated PUE</div>
                  <div className="text-3xl font-bold text-blue-400">{hourlyPUE.toFixed(2)}</div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/50"
              >
                Save Hourly Log
              </button>
            </form>
          )}

          {/* Daily Form */}
          {tab === 'daily' && (
            <form onSubmit={handleDailySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Cooling (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cooling}
                    onChange={(e) => setCooling(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">IT (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={it}
                    onChange={(e) => setIt(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Others (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={others}
                    onChange={(e) => setOthers(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">SUPS Loss (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={supsLoss}
                    onChange={(e) => setSupsLoss(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">TX Loss (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={txLoss}
                    onChange={(e) => setTxLoss(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="400"
                  />
                </div>
              </div>

              {dailyPUE > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-blue-300">Total Utility</div>
                    <div className="text-2xl font-bold text-blue-400">{dailyTotalUtility.toFixed(0)} kWh</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-300">Calculated PUE</div>
                    <div className="text-2xl font-bold text-blue-400">{dailyPUE.toFixed(2)}</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/50"
              >
                Save Daily Log
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
