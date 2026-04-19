import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Alert } from '../utils/alerts';

interface AlertBannerProps {
  alerts: Alert[];
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (alerts.length === 0 || dismissed) return null;

  const critical = alerts.filter((a) => a.severity === 'critical');
  const warnings = alerts.filter((a) => a.severity === 'warning');
  const topSeverity = critical.length > 0 ? 'critical' : 'warning';

  const colors =
    topSeverity === 'critical'
      ? {
          bg: 'from-red-900/60 to-red-950/60',
          border: 'border-red-500/50',
          icon: 'text-red-400',
          text: 'text-red-100',
        }
      : {
          bg: 'from-amber-900/60 to-amber-950/60',
          border: 'border-amber-500/50',
          icon: 'text-amber-400',
          text: 'text-amber-100',
        };

  const Icon = topSeverity === 'critical' ? AlertOctagon : AlertTriangle;

  return (
    <div
      role="alert"
      className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-xl px-4 py-3 shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`w-5 h-5 mt-0.5 ${colors.icon} animate-pulse`} />
          <div className="flex-1">
            <div className={`font-semibold ${colors.text}`}>
              {critical.length > 0 && `${critical.length} critical`}
              {critical.length > 0 && warnings.length > 0 && ', '}
              {warnings.length > 0 && `${warnings.length} warning`}
              {alerts.length > 1 ? ' alerts detected' : ' alert detected'}
            </div>
            {!expanded && (
              <div className={`text-sm mt-0.5 ${colors.text} opacity-80`}>
                {alerts[0].message}
              </div>
            )}
            {expanded && (
              <ul className={`mt-2 space-y-1 text-sm ${colors.text}`}>
                {alerts.map((a) => (
                  <li key={a.id} className="flex items-center gap-2">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        a.severity === 'critical' ? 'bg-red-400' : 'bg-amber-400'
                      }`}
                    />
                    {a.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {alerts.length > 1 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${colors.icon}`}
              aria-label={expanded ? 'Collapse alerts' : 'Expand alerts'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${colors.icon}`}
            aria-label="Dismiss alerts"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
