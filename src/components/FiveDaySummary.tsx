import React, { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { DailyLog, getPUEStatus } from '../types';

interface FiveDaySummaryProps {
  dailyLogs: DailyLog[];
}

const FiveDaySummary: React.FC<FiveDaySummaryProps> = ({ dailyLogs }) => {
  const last5Days = useMemo(() => {
    return dailyLogs.slice(-5);
  }, [dailyLogs]);

  const averages = useMemo(() => {
    if (last5Days.length === 0) return null;

    const sum = last5Days.reduce(
      (acc, log) => ({
        totalUtility: acc.totalUtility + log.totalUtility,
        cooling: acc.cooling + log.cooling,
        it: acc.it + log.it,
        others: acc.others + log.others,
        supsLoss: acc.supsLoss + log.supsLoss,
        txLoss: acc.txLoss + log.txLoss,
        pue: acc.pue + log.pue
      }),
      { totalUtility: 0, cooling: 0, it: 0, others: 0, supsLoss: 0, txLoss: 0, pue: 0 }
    );

    const count = last5Days.length;
    return {
      totalUtility: sum.totalUtility / count,
      cooling: sum.cooling / count,
      it: sum.it / count,
      others: sum.others / count,
      supsLoss: sum.supsLoss / count,
      txLoss: sum.txLoss / count,
      pue: sum.pue / count
    };
  }, [last5Days]);

  const pueChartData = useMemo(() => {
    return last5Days.map(log => ({
      date: format(log.date, 'MMM dd'),
      pue: log.pue,
      status: getPUEStatus(log.pue)
    }));
  }, [last5Days]);

  const energyChartData = useMemo(() => {
    return last5Days.map(log => ({
      date: format(log.date, 'MMM dd'),
      Cooling: log.cooling,
      IT: log.it,
      Others: log.others,
      'SUPS Loss': log.supsLoss,
      'TX Loss': log.txLoss
    }));
  }, [last5Days]);

  const CustomPUEDot = (props: any) => {
    const { cx, cy, payload } = props;
    const status = payload.status;
    const color = status === 'good' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
    
    return (
      <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={2} />
    );
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Utility (kWh)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Cooling (kWh)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">IT (kWh)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Others (kWh)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">SUPS Loss (kWh)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">TX Loss (kWh)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">PUE</th>
              </tr>
            </thead>
            <tbody>
              {last5Days.map((log, index) => (
                <tr key={log.id} className={index % 2 === 0 ? 'bg-slate-800/30' : ''}>
                  <td className="px-4 py-3 text-sm text-slate-300">{format(log.date, 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">{log.totalUtility.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">{log.cooling.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">{log.it.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">{log.others.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">{log.supsLoss.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">{log.txLoss.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-right">
                    <span className={
                      getPUEStatus(log.pue) === 'good' ? 'text-green-400' :
                      getPUEStatus(log.pue) === 'warning' ? 'text-amber-400' :
                      'text-red-400'
                    }>
                      {log.pue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
              {averages && (
                <tr className="bg-cyan-900/20 border-t-2 border-cyan-500/30 font-bold">
                  <td className="px-4 py-3 text-sm text-cyan-400">AVERAGE</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.totalUtility.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.cooling.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.it.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.others.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.supsLoss.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.txLoss.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-cyan-400 text-right font-mono">{averages.pue.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* 5-Day PUE Chart */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">5-Day PUE Trend</h3>
          <div className="h-64">
            {pueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pueChartData}>
                  <defs>
                    <linearGradient id="pueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#pueFill)"
                    dot={<CustomPUEDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No daily data available
              </div>
            )}
          </div>
        </div>

        {/* 5-Day Energy Breakdown */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Energy Breakdown</h3>
          <div className="h-64">
            {energyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="Cooling" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="IT" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Others" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="SUPS Loss" stackId="a" fill="#ec4899" />
                  <Bar dataKey="TX Loss" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No daily data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveDaySummary;
