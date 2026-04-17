import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { HourlyLog, calculateHourlyPUE } from '../types';

interface TrendChartProps {
  hourlyLogs: HourlyLog[];
  activeHall: string | null;
}

type MetricType = 'temperature' | 'humidity' | 'pue';

const HALLS = ['A', 'B', 'C', 'D', 'E'];
const HALL_COLORS = {
  A: '#06b6d4', // cyan
  B: '#3b82f6', // blue
  C: '#8b5cf6', // purple
  D: '#ec4899', // pink
  E: '#f97316', // orange
};

const TrendChart: React.FC<TrendChartProps> = ({ hourlyLogs, activeHall }) => {
  const [metric, setMetric] = useState<MetricType>('temperature');

  const chartData = useMemo(() => {
    if (hourlyLogs.length === 0) return [];

    // Group by timestamp
    const grouped = new Map<string, Record<string, any>>();
    
    hourlyLogs.forEach(log => {
      const key = format(log.timestamp, 'HH:mm');
      if (!grouped.has(key)) {
        grouped.set(key, { time: key });
      }
      const entry = grouped.get(key)!;
      
      if (metric === 'temperature') {
        entry[`Hall ${log.hall}`] = log.temperature;
      } else if (metric === 'humidity') {
        entry[`Hall ${log.hall}`] = log.humidity;
      } else if (metric === 'pue') {
        entry[`Hall ${log.hall}`] = calculateHourlyPUE(log.totalPower, log.itLoad);
      }
    });

    return Array.from(grouped.values()).sort((a, b) => a.time.localeCompare(b.time));
  }, [hourlyLogs, metric]);

  const getReferenceLine = () => {
    switch (metric) {
      case 'temperature': return { value: 26, label: '26°C', stroke: '#eab308' };
      case 'humidity': return { value: 60, label: '60%', stroke: '#eab308' };
      case 'pue': return { value: 1.83, label: '1.83 PUE', stroke: '#eab308' };
    }
  };

  const refLine = getReferenceLine();

  const displayHalls = activeHall ? [activeHall] : HALLS;

  const getYAxisLabel = () => {
    switch (metric) {
      case 'temperature': return 'Temperature (°C)';
      case 'humidity': return 'Humidity (%)';
      case 'pue': return 'PUE';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      {/* Header with Metric Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Multi-Hall Trend</h2>
        <div className="flex gap-2 bg-slate-900/50 rounded-lg p-1">
          <button
            onClick={() => setMetric('temperature')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              metric === 'temperature'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TEMP
          </button>
          <button
            onClick={() => setMetric('humidity')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              metric === 'humidity'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HUM
          </button>
          <button
            onClick={() => setMetric('pue')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              metric === 'pue'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PUE
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              
              {/* Reference Line */}
              <ReferenceLine
                y={refLine.value}
                stroke={refLine.stroke}
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: refLine.label,
                  fill: refLine.stroke,
                  fontSize: 12,
                  position: 'right'
                }}
              />

              {/* Lines for each hall */}
              {displayHalls.map(hall => (
                <Line
                  key={hall}
                  type="monotone"
                  dataKey={`Hall ${hall}`}
                  stroke={HALL_COLORS[hall as keyof typeof HALL_COLORS]}
                  strokeWidth={2}
                  dot={{ fill: HALL_COLORS[hall as keyof typeof HALL_COLORS], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            No data available. Add hourly readings to see trends.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChart;
