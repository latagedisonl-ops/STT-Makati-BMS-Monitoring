import { HourlyLog, DailyLog } from '../types';

interface ParsedCSV {
  hourlyLogs: HourlyLog[];
  dailyLogs: DailyLog[];
}

/**
 * Enhanced CSV parser that handles multiple formats:
 * 1. App's export format with "HOURLY LOGS" and "DAILY LOGS" sections
 * 2. Sample CSV format with simple headers
 */
export function parseCSV(text: string): ParsedCSV {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const newHourlyLogs: HourlyLog[] = [];
  const newDailyLogs: DailyLog[] = [];

  // Check if it's the app's format (with sections)
  const hasHourlySection = lines.some(line => line === 'HOURLY LOGS');
  const hasDailySection = lines.some(line => line === 'DAILY LOGS');

  if (hasHourlySection || hasDailySection) {
    // Parse app's export format
    parseAppFormat(lines, newHourlyLogs, newDailyLogs);
  } else {
    // Parse sample CSV format
    parseSampleFormat(lines, newHourlyLogs, newDailyLogs);
  }

  return { hourlyLogs: newHourlyLogs, dailyLogs: newDailyLogs };
}

function parseAppFormat(lines: string[], hourlyLogs: HourlyLog[], dailyLogs: DailyLog[]): void {
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    if (line === 'HOURLY LOGS') {
      i += 2; // Skip "HOURLY LOGS" and header
      while (i < lines.length && lines[i] !== 'DAILY LOGS') {
        const parts = lines[i].split(',');
        if (parts.length >= 7) {
          hourlyLogs.push({
            id: Date.now().toString() + Math.random(),
            timestamp: new Date(parts[0]),
            hall: parts[1].trim(),
            hour: parts[2].trim(),
            temperature: parseFloat(parts[3]),
            humidity: parseFloat(parts[4]),
            itLoad: parseFloat(parts[5]),
            totalPower: parseFloat(parts[6])
          });
        }
        i++;
      }
    } else if (line === 'DAILY LOGS') {
      i += 2; // Skip "DAILY LOGS" and header
      while (i < lines.length) {
        const parts = lines[i].split(',');
        if (parts.length >= 7) {
          dailyLogs.push({
            id: Date.now().toString() + Math.random(),
            date: new Date(parts[0]),
            totalUtility: parseFloat(parts[1]),
            cooling: parseFloat(parts[2]),
            it: parseFloat(parts[3]),
            others: parseFloat(parts[4]),
            supsLoss: parseFloat(parts[5]),
            txLoss: parseFloat(parts[6]),
            pue: parseFloat(parts[7] || '0')
          });
        }
        i++;
      }
    } else {
      i++;
    }
  }
}

function parseSampleFormat(lines: string[], hourlyLogs: HourlyLog[], dailyLogs: DailyLog[]): void {
  if (lines.length === 0) return;

  const header = lines[0].toLowerCase();
  
  // Detect if it's hourly or daily based on header
  if (header.includes('hall') && header.includes('hour')) {
    // Parse hourly format
    parseHourlySampleFormat(lines, hourlyLogs);
  } else if (header.includes('total utility') || header.includes('cooling')) {
    // Parse daily format
    parseDailySampleFormat(lines, dailyLogs);
  }
}

function parseHourlySampleFormat(lines: string[], hourlyLogs: HourlyLog[]): void {
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim());
    
    if (parts.length >= 7) {
      // Format: Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
      const hall = parts[0];
      const date = parts[1];
      const hour = parts[2];
      const temperature = parseFloat(parts[3]);
      const humidity = parseFloat(parts[4]);
      const itLoad = parseFloat(parts[5]);
      const totalPower = parseFloat(parts[6]);

      // Create timestamp from date and hour
      const timestamp = new Date(date);
      const hourNum = parseInt(hour);
      if (!isNaN(hourNum)) {
        timestamp.setHours(hourNum);
      }

      hourlyLogs.push({
        id: Date.now().toString() + Math.random() + i,
        timestamp,
        hall,
        hour: `${hour.toString().padStart(2, '0')}:00`,
        temperature,
        humidity,
        itLoad,
        totalPower
      });
    }
  }
}

function parseDailySampleFormat(lines: string[], dailyLogs: DailyLog[]): void {
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim());
    
    if (parts.length >= 7) {
      // Format: Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
      const date = new Date(parts[0]);
      const totalUtility = parseFloat(parts[1]);
      const cooling = parseFloat(parts[2]);
      const it = parseFloat(parts[3]);
      const others = parseFloat(parts[4]);
      const supsLoss = parseFloat(parts[5]);
      const txLoss = parseFloat(parts[6]);
      const pue = parts.length > 7 ? parseFloat(parts[7]) : it > 0 ? totalUtility / it : 0;

      dailyLogs.push({
        id: Date.now().toString() + Math.random() + i,
        date,
        totalUtility,
        cooling,
        it,
        others,
        supsLoss,
        txLoss,
        pue
      });
    }
  }
}
