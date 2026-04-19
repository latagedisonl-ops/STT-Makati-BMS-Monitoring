const API_URL =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  'http://localhost:3001';

async function fetchWithTimeout(url: string, opts: RequestInit = {}, ms = 3000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function isApiAvailable(): Promise<boolean> {
  try {
    const r = await fetchWithTimeout(`${API_URL}/api/health`, {}, 1500);
    return r.ok;
  } catch {
    return false;
  }
}

export interface HourlyLog {
  id: string;
  timestamp: Date;
  hall: string;
  hour: string;
  temperature: number;
  humidity: number;
  itLoad: number;
  totalPower: number;
}

export interface DailyLog {
  id: string;
  date: Date;
  totalUtility: number;
  cooling: number;
  it: number;
  others: number;
  supsLoss: number;
  txLoss: number;
  pue: number;
}

// Fetch hourly logs from Google Sheets
export async function fetchHourlyLogs(): Promise<HourlyLog[]> {
  const response = await fetchWithTimeout(`${API_URL}/api/hourly`);
  if (!response.ok) throw new Error('Failed to fetch hourly logs');
  const data = await response.json();
  return data.map((log: any) => ({
    ...log,
    id: `${log.hall}-${log.hour}-${log.timestamp}`,
    timestamp: new Date(log.timestamp),
  }));
}

// Save hourly log to Google Sheets
export async function saveHourlyLog(log: Omit<HourlyLog, 'id'>): Promise<void> {
  const pue = log.itLoad > 0 ? log.totalPower / log.itLoad : 0;
  const response = await fetch(`${API_URL}/api/hourly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: log.timestamp.toISOString(),
      hall: log.hall,
      hour: log.hour,
      temperature: log.temperature,
      humidity: log.humidity,
      itLoad: log.itLoad,
      totalPower: log.totalPower,
      pue,
    }),
  });
  if (!response.ok) throw new Error('Failed to save hourly log');
}

// Fetch daily logs from Google Sheets
export async function fetchDailyLogs(): Promise<DailyLog[]> {
  const response = await fetchWithTimeout(`${API_URL}/api/daily`);
  if (!response.ok) throw new Error('Failed to fetch daily logs');
  const data = await response.json();
  return data.map((log: any) => ({
    ...log,
    id: log.date,
    date: new Date(log.date),
  }));
}

// Save daily log to Google Sheets
export async function saveDailyLog(log: Omit<DailyLog, 'id'>): Promise<void> {
  const response = await fetch(`${API_URL}/api/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: log.date.toISOString().split('T')[0],
      totalUtility: log.totalUtility,
      cooling: log.cooling,
      it: log.it,
      others: log.others,
      supsLoss: log.supsLoss,
      txLoss: log.txLoss,
      pue: log.pue,
    }),
  });
  if (!response.ok) throw new Error('Failed to save daily log');
}