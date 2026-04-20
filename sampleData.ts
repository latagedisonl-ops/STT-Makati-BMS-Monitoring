// Sample data for visualization — replace with real readings

export const SAMPLE_HOURLY: Record<string, Record<string, {
  temp: number; hum: number; itLoad: number; totalPwr: number; pue: number;
}>> = {
  "08:00": {
    A: { temp: 23.1, hum: 54, itLoad: 112, totalPwr: 162, pue: 1.45 },
    B: { temp: 24.0, hum: 57, itLoad: 135, totalPwr: 204, pue: 1.51 },
    C: { temp: 22.8, hum: 52, itLoad: 98,  totalPwr: 138, pue: 1.41 },
    D: { temp: 23.5, hum: 55, itLoad: 120, totalPwr: 180, pue: 1.50 },
    E: { temp: 24.2, hum: 58, itLoad: 145, totalPwr: 226, pue: 1.56 },
  },
  "09:00": {
    A: { temp: 23.4, hum: 55, itLoad: 118, totalPwr: 173, pue: 1.47 },
    B: { temp: 24.3, hum: 58, itLoad: 140, totalPwr: 214, pue: 1.53 },
    C: { temp: 23.1, hum: 53, itLoad: 102, totalPwr: 145, pue: 1.42 },
    D: { temp: 23.8, hum: 56, itLoad: 125, totalPwr: 189, pue: 1.51 },
    E: { temp: 24.6, hum: 59, itLoad: 150, totalPwr: 237, pue: 1.58 },
  },
  "10:00": {
    A: { temp: 23.8, hum: 56, itLoad: 124, totalPwr: 184, pue: 1.48 },
    B: { temp: 24.7, hum: 59, itLoad: 148, totalPwr: 229, pue: 1.55 },
    C: { temp: 23.5, hum: 54, itLoad: 108, totalPwr: 155, pue: 1.44 },
    D: { temp: 24.2, hum: 57, itLoad: 132, totalPwr: 201, pue: 1.52 },
    E: { temp: 25.0, hum: 60, itLoad: 158, totalPwr: 252, pue: 1.59 },
  },
  "11:00": {
    A: { temp: 24.1, hum: 57, itLoad: 130, totalPwr: 195, pue: 1.50 },
    B: { temp: 25.0, hum: 61, itLoad: 155, totalPwr: 242, pue: 1.56 },
    C: { temp: 23.8, hum: 55, itLoad: 114, totalPwr: 165, pue: 1.45 },
    D: { temp: 24.6, hum: 58, itLoad: 138, totalPwr: 212, pue: 1.54 },
    E: { temp: 25.4, hum: 62, itLoad: 163, totalPwr: 261, pue: 1.60 },
  },
  "12:00": {
    A: { temp: 25.2, hum: 59, itLoad: 138, totalPwr: 210, pue: 1.52 },
    B: { temp: 26.1, hum: 63, itLoad: 162, totalPwr: 256, pue: 1.58 },
    C: { temp: 24.9, hum: 57, itLoad: 122, totalPwr: 178, pue: 1.46 },
    D: { temp: 25.5, hum: 61, itLoad: 145, totalPwr: 225, pue: 1.55 },
    E: { temp: 26.3, hum: 64, itLoad: 170, totalPwr: 275, pue: 1.62 },
  },
  "13:00": {
    A: { temp: 25.8, hum: 60, itLoad: 142, totalPwr: 218, pue: 1.54 },
    B: { temp: 26.8, hum: 64, itLoad: 167, totalPwr: 267, pue: 1.60 },
    C: { temp: 25.4, hum: 58, itLoad: 128, totalPwr: 188, pue: 1.47 },
    D: { temp: 26.1, hum: 62, itLoad: 150, totalPwr: 234, pue: 1.56 },
    E: { temp: 27.0, hum: 65, itLoad: 175, totalPwr: 285, pue: 1.63 },
  },
  "14:00": {
    A: { temp: 26.3, hum: 61, itLoad: 148, totalPwr: 229, pue: 1.55 },
    B: { temp: 27.4, hum: 65, itLoad: 172, totalPwr: 279, pue: 1.62 },
    C: { temp: 25.9, hum: 59, itLoad: 133, totalPwr: 196, pue: 1.47 },
    D: { temp: 26.7, hum: 63, itLoad: 155, totalPwr: 244, pue: 1.57 },
    E: { temp: 27.6, hum: 66, itLoad: 180, totalPwr: 295, pue: 1.64 },
  },
};

export const SAMPLE_DAILY = [
  { date: "17 Apr '26", totalUtility: 18420, cooling: 5820, it: 9800, others: 1400, supsLoss: 820, txLoss: 580, pue: 1.88 },
  { date: "18 Apr '26", totalUtility: 17950, cooling: 5610, it: 9650, others: 1350, supsLoss: 790, txLoss: 550, pue: 1.86 },
  { date: "19 Apr '26", totalUtility: 18800, cooling: 6020, it: 9900, others: 1420, supsLoss: 840, txLoss: 620, pue: 1.90 },
  { date: "20 Apr '26", totalUtility: 17600, cooling: 5480, it: 9500, others: 1320, supsLoss: 760, txLoss: 540, pue: 1.85 },
  { date: "21 Apr '26", totalUtility: 18100, cooling: 5720, it: 9720, others: 1380, supsLoss: 800, txLoss: 480, pue: 1.86 },
];
