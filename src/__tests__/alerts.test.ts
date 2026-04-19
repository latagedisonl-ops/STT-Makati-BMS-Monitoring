import { describe, it, expect } from 'vitest';
import { detectAlerts } from '../utils/alerts';
import type { HourlyLog } from '../types';

const mk = (overrides: Partial<HourlyLog>): HourlyLog => ({
  id: 'x',
  timestamp: new Date('2026-04-19T10:00:00'),
  hall: 'A',
  hour: '10:00',
  temperature: 22,
  humidity: 55,
  itLoad: 150,
  totalPower: 200,
  ...overrides,
});

describe('detectAlerts', () => {
  it('returns empty when all halls are within safe ranges', () => {
    const logs = ['A', 'B'].map((h) => mk({ hall: h, id: h }));
    expect(detectAlerts(logs)).toEqual([]);
  });

  it('flags critical temperature breach', () => {
    const logs = [mk({ hall: 'A', temperature: 34 })];
    const alerts = detectAlerts(logs);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('critical');
    expect(alerts[0].metric).toBe('temperature');
  });

  it('flags warning humidity + critical PUE in the same hall', () => {
    const logs = [mk({ hall: 'B', humidity: 75, totalPower: 400, itLoad: 150 })];
    const alerts = detectAlerts(logs);
    expect(alerts.some((a) => a.metric === 'humidity' && a.severity === 'warning')).toBe(true);
    expect(alerts.some((a) => a.metric === 'pue' && a.severity === 'critical')).toBe(true);
  });

  it('only considers the most recent log per hall', () => {
    const logs: HourlyLog[] = [
      mk({ hall: 'A', id: '1', temperature: 40, timestamp: new Date('2026-04-19T08:00') }),
      mk({ hall: 'A', id: '2', temperature: 22, timestamp: new Date('2026-04-19T09:00') }),
    ];
    expect(detectAlerts(logs)).toEqual([]);
  });

  it('sorts critical alerts before warnings', () => {
    const logs = [
      mk({ hall: 'A', temperature: 34 }),
      mk({ hall: 'B', id: 'B', humidity: 72 }),
    ];
    const alerts = detectAlerts(logs);
    expect(alerts[0].severity).toBe('critical');
  });
});
