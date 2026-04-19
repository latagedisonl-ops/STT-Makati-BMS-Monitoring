import { HourlyLog, calculateHourlyPUE } from '../types';

export type AlertSeverity = 'warning' | 'critical';

export interface Alert {
  id: string;
  hall: string;
  metric: 'temperature' | 'humidity' | 'pue';
  value: number;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
}

const HALLS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Scans the latest reading for each hall and returns any threshold breaches.
 * Critical: temp > 30 or < 15, humidity > 80 or < 30, PUE > 2.0.
 * Warning : temp 27-30 or 15-18, humidity 70-80 or 30-40, PUE 1.5-2.0.
 */
export function detectAlerts(hourlyLogs: HourlyLog[]): Alert[] {
  const alerts: Alert[] = [];

  for (const hall of HALLS) {
    const hallLogs = hourlyLogs.filter((l) => l.hall === hall);
    if (hallLogs.length === 0) continue;
    const latest = hallLogs[hallLogs.length - 1];

    // Temperature
    if (latest.temperature > 30 || latest.temperature < 15) {
      alerts.push({
        id: `temp-${hall}-${latest.id}`,
        hall,
        metric: 'temperature',
        value: latest.temperature,
        severity: 'critical',
        message: `Hall ${hall}: Temperature ${latest.temperature.toFixed(1)}°C out of safe range (15–30°C)`,
        timestamp: latest.timestamp,
      });
    } else if (latest.temperature > 27 || latest.temperature < 18) {
      alerts.push({
        id: `temp-${hall}-${latest.id}`,
        hall,
        metric: 'temperature',
        value: latest.temperature,
        severity: 'warning',
        message: `Hall ${hall}: Temperature ${latest.temperature.toFixed(1)}°C approaching threshold`,
        timestamp: latest.timestamp,
      });
    }

    // Humidity
    if (latest.humidity > 80 || latest.humidity < 30) {
      alerts.push({
        id: `hum-${hall}-${latest.id}`,
        hall,
        metric: 'humidity',
        value: latest.humidity,
        severity: 'critical',
        message: `Hall ${hall}: Humidity ${latest.humidity.toFixed(1)}% out of safe range (30–80%)`,
        timestamp: latest.timestamp,
      });
    } else if (latest.humidity > 70 || latest.humidity < 40) {
      alerts.push({
        id: `hum-${hall}-${latest.id}`,
        hall,
        metric: 'humidity',
        value: latest.humidity,
        severity: 'warning',
        message: `Hall ${hall}: Humidity ${latest.humidity.toFixed(1)}% approaching threshold`,
        timestamp: latest.timestamp,
      });
    }

    // PUE
    const pue = calculateHourlyPUE(latest.totalPower, latest.itLoad);
    if (pue > 2.0) {
      alerts.push({
        id: `pue-${hall}-${latest.id}`,
        hall,
        metric: 'pue',
        value: pue,
        severity: 'critical',
        message: `Hall ${hall}: PUE ${pue.toFixed(2)} indicates poor efficiency (>2.0)`,
        timestamp: latest.timestamp,
      });
    } else if (pue > 1.5) {
      alerts.push({
        id: `pue-${hall}-${latest.id}`,
        hall,
        metric: 'pue',
        value: pue,
        severity: 'warning',
        message: `Hall ${hall}: PUE ${pue.toFixed(2)} above target (>1.5)`,
        timestamp: latest.timestamp,
      });
    }
  }

  return alerts.sort((a) => (a.severity === 'critical' ? -1 : 1));
}
