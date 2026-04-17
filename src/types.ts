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

export const HALLS = ['A', 'B', 'C', 'D', 'E'];

export const calculateHourlyPUE = (totalPower: number, itLoad: number): number => {
  return itLoad > 0 ? totalPower / itLoad : 0;
};

export const calculateDailyPUE = (totalUtility: number, it: number): number => {
  return it > 0 ? totalUtility / it : 0;
};
