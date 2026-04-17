import React from 'react';
import { getPUEStatus } from '../types';

interface HallDataItem {
  hall: string;
  hasData: boolean;
  pue: number;
}

interface FacilityPUEProps {
  hallData: HallDataItem[];
  facilityPUE: number;
}

const FacilityPUE: React.FC<FacilityPUEProps> = ({ hallData, facilityPUE }) => {
  const status = getPUEStatus(facilityPUE);

  const getColor = () => {
    if (facilityPUE === 0) return 'text-gray-400';
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getGlow = () => {
    if (facilityPUE === 0) return '';
    switch (status) {
      case 'good': return 'drop-shadow-[0_0_30px_rgba(34,197,94,0.6)]';
      case 'warning': return 'drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]';
      case 'critical': return 'drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]';
      default: return '';
    }
  };

  const maxPUE = Math.max(...hallData.map(h => h.pue), facilityPUE, 3);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-6">Facility Average PUE</h2>
      
      {/* Large Glowing PUE Number */}
      <div className="text-center mb-8">
        <div className={`text-7xl font-bold tabular-nums ${getColor()} ${getGlow()} transition-all duration-500`}>
          {facilityPUE > 0 ? facilityPUE.toFixed(2) : '--'}
        </div>
        <div className="text-sm text-slate-400 mt-2">
          {status === 'good' && facilityPUE > 0 && 'Excellent Efficiency'}
          {status === 'warning' && 'Moderate Efficiency'}
          {status === 'critical' && 'Poor Efficiency'}
          {facilityPUE === 0 && 'No Data'}
        </div>
      </div>

      {/* Per-Hall PUE Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Per-Hall Breakdown</h3>
        {hallData.map(({ hall, pue, hasData }) => {
          const hallStatus = getPUEStatus(pue);
          const barColor = 
            !hasData || pue === 0 ? 'bg-gray-600' :
            hallStatus === 'good' ? 'bg-green-500' :
            hallStatus === 'warning' ? 'bg-amber-500' :
            'bg-red-500';

          return (
            <div key={hall} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Hall {hall}</span>
                <span className="font-mono text-slate-400">
                  {pue > 0 ? pue.toFixed(2) : '--'}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${barColor}`}
                  style={{ width: pue > 0 ? `${(pue / maxPUE) * 100}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilityPUE;
