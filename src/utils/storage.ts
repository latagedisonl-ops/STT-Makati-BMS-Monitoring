import type { HourlyLog, DailyLog } from '../types';

const KEY_HOURLY = 'stt-bms-hourly';
const KEY_DAILY = 'stt-bms-daily';

export function loadHourly(): HourlyLog[] {
  try {
    const raw = localStorage.getItem(KEY_HOURLY);
    if (!raw) return [];
    return JSON.parse(raw).map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
  } catch {
    return [];
  }
}

export function loadDaily(): DailyLog[] {
  try {
    const raw = localStorage.getItem(KEY_DAILY);
    if (!raw) return [];
    return JSON.parse(raw).map((l: any) => ({ ...l, date: new Date(l.date) }));
  } catch {
    return [];
  }
}

export function saveHourly(logs: HourlyLog[]): void {
  try {
    localStorage.setItem(KEY_HOURLY, JSON.stringify(logs));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function saveDaily(logs: DailyLog[]): void {
  try {
    localStorage.setItem(KEY_DAILY, JSON.stringify(logs));
  } catch {
    /* quota exceeded — ignore */
  }
}
