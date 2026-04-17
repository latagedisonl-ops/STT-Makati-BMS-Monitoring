interface HallData {
  hall: string;
  hasData: boolean;
  pue: number;
}

interface FacilityPUEProps {
  hallData: HallData[];
}

export default function FacilityPUE({ hallData }: FacilityPUEProps) {
  const facilityPUE = hallData
    .filter(h => h.hasData)
    .reduce((sum, h) => sum + h.pue, 0) / hallData.filter(h => h.hasData).length || 0;

  const getPUEColor = (pue: number) => {
    if (pue === 0) return { text: 'text-gray-400', bg: 'bg-gray-500', border: 'border-gray-500' };
    if (pue <= 1.5) return { text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500' };
    if (pue <= 2.0) return { text: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500' };
    return { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500' };
  };

  const colors = getPUEColor(facilityPUE);

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20">
      <h3 className="text-sm font-medium text-blue-300 mb-4">Facility Average PUE</h3>
      
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold ${colors.text} relative`}>
          {facilityPUE > 0 ? facilityPUE.toFixed(2) : '--'}
          <div className={`absolute inset-0 blur-2xl ${colors.bg} opacity-30`}></div>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {facilityPUE <= 1.5 && facilityPUE > 0 && '🟢 Excellent'}
          {facilityPUE > 1.5 && facilityPUE <= 2.0 && '🟡 Good'}
          {facilityPUE > 2.0 && '🔴 Needs Improvement'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-medium text-blue-300 mb-2">Per-Hall Breakdown</div>
        {hallData.map(hall => {
          const hallColors = getPUEColor(hall.pue);
          const percentage = hall.pue > 0 ? Math.min((hall.pue / 3) * 100, 100) : 0;
          
          return (
            <div key={hall.hall} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Hall {hall.hall}</span>
                <span className={`font-bold ${hallColors.text}`}>
                  {hall.pue > 0 ? hall.pue.toFixed(2) : '--'}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${hallColors.bg} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
