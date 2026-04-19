import { describe, it, expect } from 'vitest';
import { parseCSV } from '../utils/csvParser';

const SAMPLE_HOURLY = `Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
B,2026-04-17,1,24.8,59,178,238,1.34`;

const SAMPLE_DAILY = `Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
2026-04-13,10000,5000,4000,500,300,200,1.43
2026-04-14,9800,4900,3950,480,290,180,1.42`;

const COMBINED_EXPORT = `HOURLY LOGS
Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE
2026-04-17 00:00:00,A,00:00,24.5,55,150,200,1.33

DAILY LOGS
Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
2026-04-17,10100,5050,4020,500,300,230,1.43`;

describe('parseCSV', () => {
  it('parses the sample hourly format', () => {
    const { hourly, daily } = parseCSV(SAMPLE_HOURLY);
    expect(daily).toHaveLength(0);
    expect(hourly).toHaveLength(2);
    expect(hourly[0]).toMatchObject({
      hall: 'A',
      hour: '00:00',
      temperature: 24.5,
      humidity: 55,
      itLoad: 150,
      totalPower: 200,
    });
    expect(hourly[0].timestamp).toBeInstanceOf(Date);
  });

  it('parses the sample daily format', () => {
    const { hourly, daily } = parseCSV(SAMPLE_DAILY);
    expect(hourly).toHaveLength(0);
    expect(daily).toHaveLength(2);
    expect(daily[0]).toMatchObject({
      totalUtility: 10000,
      cooling: 5000,
      it: 4000,
      pue: 1.43,
    });
  });

  it('parses the exported combined format with section markers', () => {
    const { hourly, daily } = parseCSV(COMBINED_EXPORT);
    expect(hourly).toHaveLength(1);
    expect(daily).toHaveLength(1);
    expect(hourly[0].hall).toBe('A');
    expect(daily[0].totalUtility).toBe(10100);
  });

  it('returns empty arrays for empty input', () => {
    expect(parseCSV('')).toEqual({ hourly: [], daily: [] });
  });
});
