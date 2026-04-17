import React from 'react';
import { getTemperatureStatus, getHumidityStatus, getPUEStatus } from '../types';

interface HallCardProps {
  hall: string;
  temperature: number;
  humidity: number;
  pue: number;
  hasData: boolean;
  isActive: boolean;
  onClick: () => void;
}

const HallCard: React.FC<HallCardProps> = ({
  hall,
  temperature,
  humidity,
  pue,
  hasData,
  isActive,
  onClick
}) => {
  const tempStatus = getTemperatureStatus(temperature);
  const humidityStatus = getHumidityStatus(humidity);
  const pueStatus = getPUEStatus(pue);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'good': return 'shadow-green-500/50';
      case 'warning': return 'shadow-amber-500/50';
      case 'critical': return 'shadow-red-500/50';
      default: return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20'
          : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
      }`}
    >
      {/* Hall Name + Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">Hall {hall}</h3>
        <div className="relative">
          <div
            className={`w-3 h-3 rounded-full ${
              hasData ? 'bg-green-500' : 'bg-gray-500'
            } ${hasData ? 'animate-pulse' : ''}`}
          />
          {hasData && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Temperature Gauge */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Temperature</span>
          <span className="font-mono">{temperature > 0 ? `${temperature.toFixed(1)}°C` : '--'}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getStatusColor(tempStatus)} ${getStatusGlow(tempStatus)}`}
            style={{ width: temperature > 0 ? `${Math.min((temperature / 35) * 100, 100)}%` : '0%' }}
          />
        </div>
      </div>

      {/* Humidity Gauge */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Humidity</span>
          <span className="font-mono">{humidity > 0 ? `${humidity.toFixed(1)}%` : '--'}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getStatusColor(humidityStatus)} ${getStatusGlow(humidityStatus)}`}
            style={{ width: humidity > 0 ? `${Math.min(humidity, 100)}%` : '0%' }}
          />
        </div>
      </div>

      {/* PUE Badge */}
      {pue > 0 && (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
          pueStatus === 'good' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          pueStatus === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
          'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          PUE: {pue.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default HallCard;
