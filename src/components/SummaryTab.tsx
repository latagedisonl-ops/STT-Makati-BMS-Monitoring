import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { DailyLog } from '../types';

interface SummaryTabProps {
  dailyLogs: DailyLog[];
}

export default function SummaryTab({ dailyLogs }: SummaryTabProps) {
  const sortedLogs = [...dailyLogs].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(-5);

  const averages = sortedLogs.length > 0 ? {
    totalUtility: sortedLogs.reduce((sum, log) => sum + log.totalUtility, 0) / sortedLogs.length,
    cooling: sortedLogs.reduce((sum, log) => sum + log.cooling, 0) / sortedLogs.length,
    it: sortedLogs.reduce((sum, log) => sum + log.it, 0) / sortedLogs.length,
    others: sortedLogs.reduce((sum, log) => sum + log.others, 0) / sortedLogs.length,
    supsLoss: sortedLogs.reduce((sum, log) => sum + log.supsLoss, 0) / sortedLogs.length,
    txLoss: sortedLogs.reduce((sum, log) => sum + log.txLoss, 0) / sortedLogs.length,
    pue: sortedLogs.reduce((sum, log) => sum + log.pue, 0) / sortedLogs.length
  } : null;

  const pueChartData = sortedLogs.map(log => ({
    date: format(log.date, 'MMM dd'),
    PUE: log.pue
  }));

  const energyChartData = sortedLogs.map(log => ({
    date: format(log.date, 'MMM dd'),
    Cooling: log.cooling,
    IT: log.it,
    Others: log.others,
    'SUPS Loss': log.supsLoss,
    'TX Loss': log.txLoss
  }));

  const getPUEColor = (pue: number) => {
    if (pue <= 1.5) return 'text-green-500';
    if (pue <= 2.0) return 'text-amber-500';
    return 'text-red-500';
  };

  if (sortedLogs.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-blue-500/20">
        <div className="text-center text-gray-400">
          <p className="text-lg mb-2">No daily summary data available</p>
          <p className="text-sm">Add daily logs using the "Log Reading" button</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Table */}
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20 overflow-x-auto">
        <h3 className="text-lg font-medium text-blue-300 mb-4">Energy Summary (Last 5 Days)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-500/20">
              <th className="text-left py-2 text-blue-300 font-medium">Date</th>
              <th className="text-right py-2 text-blue-300 font-medium">Total Utility</th>
              <th className="text-right py-2 text-blue-300 font-medium">Cooling</th>
              <th className="text-right py-2 text-blue-300 font-medium">IT</th>
              <th className="text-right py-2 text-blue-300 font-medium">Others</th>
              <th className="text-right py-2 text-blue-300 font-medium">SUPS Loss</th>
              <th className="text-right py-2 text-blue-300 font-medium">TX Loss</th>
              <th className="text-right py-2 text-blue-300 font-medium">PUE</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-700/50">
                <td className="py-2 text-gray-300">{format(log.date, 'MMM dd, yyyy')}</td>
                <td className="text-right py-2 text-gray-300">{log.totalUtility.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-gray-300">{log.cooling.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-gray-300">{log.it.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-gray-300">{log.others.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-gray-300">{log.supsLoss.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-gray-300">{log.txLoss.toFixed(0)} kWh</td>
                <td className={`text-right py-2 font-bold ${getPUEColor(log.pue)}`}>{log.pue.toFixed(2)}</td>
              </tr>
            ))}
            {averages && (
              <tr className="bg-blue-500/10 font-medium">
                <td className="py-2 text-blue-300">Average</td>
                <td className="text-right py-2 text-blue-300">{averages.totalUtility.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-blue-300">{averages.cooling.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-blue-300">{averages.it.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-blue-300">{averages.others.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-blue-300">{averages.supsLoss.toFixed(0)} kWh</td>
                <td className="text-right py-2 text-blue-300">{averages.txLoss.toFixed(0)} kWh</td>
                <td className={`text-right py-2 font-bold ${getPUEColor(averages.pue)}`}>{averages.pue.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* PUE Trend */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-medium text-blue-300 mb-4">5-Day PUE Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={pueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="PUE" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-medium text-blue-300 mb-4">Energy Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={energyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Cooling" stackId="a" fill="#06b6d4" />
              <Bar dataKey="IT" stackId="a" fill="#10b981" />
              <Bar dataKey="Others" stackId="a" fill="#f59e0b" />
              <Bar dataKey="SUPS Loss" stackId="a" fill="#ef4444" />
              <Bar dataKey="TX Loss" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
