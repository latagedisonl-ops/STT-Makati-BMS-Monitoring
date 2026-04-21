export interface HallReading {
  temp: number;
  hum: number;
  itLoad: number;
  totalPwr: number;
  pue: number;
}

export type HourlyData = Record<string, Record<string, HallReading>>;
