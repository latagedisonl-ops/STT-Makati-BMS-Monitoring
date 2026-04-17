import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { HourlyLog, HALLS } from '../types';

interface TrendChartProps {
  hourlyLogs: HourlyLog[];
  activeHall: string | null;
  activeTab: 'trends' | 'summary';
  onTabChange: (tab: 'trends' | 'summary') => void;
}

type MetricType = 'temperature' | 'humidity' | 'pue';

export default function TrendChart({ hourlyLogs, activeHall, activeTab, onTabChange }: TrendChartProps) {
  const [metric, setMetric] = useState<MetricType>('temperature');

  const hallColors: Record<string, string> = {
    A: '#ef4444',
    B: '#f59e0b',
    C: '#10b981',
    D: '#3b82f6',
    E: '#8b5cf6'
  };

  // Group data by timestamp
  const chartData = hourlyLogs.reduce((acc, log) => {
    const time = format(log.timestamp, 'HH:mm');
    let existing = acc.find(d => d.time === time);
    
    if (!existing) {
      existing = { time };
      acc.push(existing);
    }
    
    if (metric === 'temperature') {
      existing[`Hall ${log.hall}`] = log.temperature;
    } else if (metric === 'humidity') {
      existing[`Hall ${log.hall}`] = log.humidity;
    } else {
      const pue = log.itLoad > 0 ? log.totalPower / log.itLoad : 0;
      existing[`Hall ${log.hall}`] = pue;
    }
    
    return acc;
  }, [] as any[]);

  const getMetricConfig = () => {
    switch (metric) {
      case 'temperature':
        return { label: 'Temperature (°C)', refValue: 26, refLabel: 'Target: 26°C' };
      case 'humidity':
        return { label: 'Humidity (%)', refValue: 60, refLabel: 'Target: 60%' };
      case 'pue':
        return { label: 'PUE', refValue: 1.83, refLabel: 'Target: 1.83' };
    }
  };

  const config = getMetricConfig();

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => onTabChange('trends')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'trends'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            Multi-Hall Trends
          </button>
          <button
            onClick={() => onTabChange('summary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'summary'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            5-Day Summary
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMetric('temperature')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              metric === 'temperature'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setMetric('humidity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              metric === 'humidity'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            Humidity
          </button>
          <button
            onClick={() => setMetric('pue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              metric === 'pue'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            PUE
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
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
          <ReferenceLine y={config.refValue} stroke="#eab308" strokeDasharray="5 5" label={config.refLabel} />
          
          {HALLS.map(hall => {
            const isActive = !activeHall || activeHall === hall;
            return (
              <Line
                key={hall}
                type="monotone"
                dataKey={`Hall ${hall}`}
                stroke={hallColors[hall]}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.2}
                dot={isActive}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
