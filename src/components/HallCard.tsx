import { Thermometer, Droplets, Zap } from 'lucide-react';

interface HallCardProps {
  hall: string;
  hasData: boolean;
  temperature: number;
  humidity: number;
  pue: number;
  isActive: boolean;
  onClick: () => void;
}

export default function HallCard({
  hall,
  hasData,
  temperature,
  humidity,
  pue,
  isActive,
  onClick
}: HallCardProps) {
  const getTempColor = (temp: number) => {
    if (temp === 0) return 'text-gray-400';
    if (temp >= 18 && temp <= 27) return 'text-green-500';
    if ((temp >= 15 && temp < 18) || (temp > 27 && temp <= 30)) return 'text-amber-500';
    return 'text-red-500';
  };

  const getHumidityColor = (hum: number) => {
    if (hum === 0) return 'text-gray-400';
    if (hum >= 40 && hum <= 70) return 'text-green-500';
    if ((hum >= 30 && hum < 40) || (hum > 70 && hum <= 80)) return 'text-amber-500';
    return 'text-red-500';
  };

  const getPUEColor = (pueValue: number) => {
    if (pueValue === 0) return 'text-gray-400';
    if (pueValue <= 1.5) return 'text-green-500';
    if (pueValue <= 2.0) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-slate-800/50 backdrop-blur rounded-xl p-4 border-2 transition-all ${
        isActive
          ? 'border-blue-500 shadow-lg shadow-blue-500/50 scale-105'
          : 'border-blue-500/20 hover:border-blue-500/50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-bold text-white">Hall {hall}</h3>
        <div className={`w-3 h-3 rounded-full ${hasData ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400">Temp</span>
          </div>
          <span className={`text-lg font-bold ${getTempColor(temperature)}`}>
            {temperature > 0 ? `${temperature.toFixed(1)}°C` : '--'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Humidity</span>
          </div>
          <span className={`text-lg font-bold ${getHumidityColor(humidity)}`}>
            {humidity > 0 ? `${humidity.toFixed(0)}%` : '--'}
          </span>
        </div>

        {pue > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-blue-500/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">PUE</span>
            </div>
            <span className={`text-lg font-bold ${getPUEColor(pue)}`}>
              {pue.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
