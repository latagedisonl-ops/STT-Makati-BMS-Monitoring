import type { HourlyLog, DailyLog } from '../types';

export interface ParseResult {
  hourly: HourlyLog[];
  daily: DailyLog[];
}

const splitRow = (line: string): string[] =>
  line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

const makeId = (prefix: string, i: number): string =>
  `${prefix}-${i}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Parses a CSV that may be either:
 *   - Sample hourly format:  Hall,Date,Hour,Temperature,Humidity,IT Load,Total Power,PUE
 *   - Sample daily format:   Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
 *   - Exported combined file with "HOURLY LOGS" / "DAILY LOGS" section markers.
 */
export function parseCSV(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const hourly: HourlyLog[] = [];
  const daily: DailyLog[] = [];

  if (lines.length === 0) return { hourly, daily };

  // Combined / exported format
  if (lines.some((l) => l === 'HOURLY LOGS' || l === 'DAILY LOGS')) {
    let i = 0;
    while (i < lines.length) {
      if (lines[i] === 'HOURLY LOGS') {
        i += 2; // skip marker + header
        while (i < lines.length && lines[i] !== 'DAILY LOGS') {
          const p = splitRow(lines[i]);
          if (p.length >= 7) {
            hourly.push({
              id: makeId('h', i),
              timestamp: new Date(p[0]),
              hall: p[1],
              hour: p[2],
              temperature: parseFloat(p[3]),
              humidity: parseFloat(p[4]),
              itLoad: parseFloat(p[5]),
              totalPower: parseFloat(p[6]),
            });
          }
          i++;
        }
      } else if (lines[i] === 'DAILY LOGS') {
        i += 2;
        while (i < lines.length) {
          const p = splitRow(lines[i]);
          if (p.length >= 8) {
            daily.push({
              id: makeId('d', i),
              date: new Date(p[0]),
              totalUtility: parseFloat(p[1]),
              cooling: parseFloat(p[2]),
              it: parseFloat(p[3]),
              others: parseFloat(p[4]),
              supsLoss: parseFloat(p[5]),
              txLoss: parseFloat(p[6]),
              pue: parseFloat(p[7]),
            });
          }
          i++;
        }
      } else {
        i++;
      }
    }
    return { hourly, daily };
  }

  // Single-section (sample) formats — detect by header
  const header = splitRow(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1);

  if (header[0] === 'hall') {
    rows.forEach((line, i) => {
      const p = splitRow(line);
      if (p.length < 7) return;
      hourly.push({
        id: makeId('h', i),
        timestamp: new Date(`${p[1]}T${String(p[2]).padStart(2, '0')}:00:00`),
        hall: p[0],
        hour: `${String(p[2]).padStart(2, '0')}:00`,
        temperature: parseFloat(p[3]),
        humidity: parseFloat(p[4]),
        itLoad: parseFloat(p[5]),
        totalPower: parseFloat(p[6]),
      });
    });
  } else if (header[0] === 'date') {
    rows.forEach((line, i) => {
      const p = splitRow(line);
      if (p.length < 8) return;
      daily.push({
        id: makeId('d', i),
        date: new Date(p[0]),
        totalUtility: parseFloat(p[1]),
        cooling: parseFloat(p[2]),
        it: parseFloat(p[3]),
        others: parseFloat(p[4]),
        supsLoss: parseFloat(p[5]),
        txLoss: parseFloat(p[6]),
        pue: parseFloat(p[7]),
      });
    });
  }

  return { hourly, daily };
}

/** Fetches a CSV from the public/ folder and parses it. */
export async function fetchAndParseCSV(url: string): Promise<ParseResult> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}
