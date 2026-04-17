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

export const calculateHourlyPUE = (totalPower: number, itLoad: number): number => {
  return itLoad > 0 ? totalPower / itLoad : 0;
};

export const calculatePUE = (totalUtility: number, it: number): number => {
  return it > 0 ? totalUtility / it : 0;
};

export const getPUEStatus = (pue: number): 'good' | 'warning' | 'critical' => {
  if (pue === 0 || pue <= 1.5) return 'good';
  if (pue <= 2.0) return 'warning';
  return 'critical';
};

export const getTemperatureStatus = (temp: number): 'good' | 'warning' | 'critical' => {
  if (temp === 0 || (temp >= 18 && temp <= 27)) return 'good';
  if ((temp >= 15 && temp < 18) || (temp > 27 && temp <= 30)) return 'warning';
  return 'critical';
};

export const getHumidityStatus = (humidity: number): 'good' | 'warning' | 'critical' => {
  if (humidity === 0 || (humidity >= 40 && humidity <= 70)) return 'good';
  if ((humidity >= 30 && humidity < 40) || (humidity > 70 && humidity <= 80)) return 'warning';
  return 'critical';
};
