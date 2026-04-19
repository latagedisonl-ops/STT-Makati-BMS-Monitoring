import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface HourlyLog {
  timestamp: string;
  hall: string;
  hour: string;
  temperature: number;
  humidity: number;
  itLoad: number;
  totalPower: number;
  pue: number;
}

export interface DailyLog {
  date: string;
  totalUtility: number;
  cooling: number;
  it: number;
  others: number;
  supsLoss: number;
  txLoss: number;
  pue: number;
}

// Read hourly logs from sheet
export async function getHourlyLogs(): Promise<HourlyLog[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Hourly!A2:H', // Adjust sheet name if needed
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    timestamp: row[0],
    hall: row[1],
    hour: row[2],
    temperature: parseFloat(row[3]),
    humidity: parseFloat(row[4]),
    itLoad: parseFloat(row[5]),
    totalPower: parseFloat(row[6]),
    pue: parseFloat(row[7]),
  }));
}

// Write hourly log to sheet
export async function addHourlyLog(log: HourlyLog): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Hourly!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          log.timestamp,
          log.hall,
          log.hour,
          log.temperature,
          log.humidity,
          log.itLoad,
          log.totalPower,
          log.pue,
        ],
      ],
    },
  });
}

// Read daily logs from sheet
export async function getDailyLogs(): Promise<DailyLog[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Daily!A2:H', // Adjust sheet name if needed
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    date: row[0],
    totalUtility: parseFloat(row[1]),
    cooling: parseFloat(row[2]),
    it: parseFloat(row[3]),
    others: parseFloat(row[4]),
    supsLoss: parseFloat(row[5]),
    txLoss: parseFloat(row[6]),
    pue: parseFloat(row[7]),
  }));
}

// Write daily log to sheet
export async function addDailyLog(log: DailyLog): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Daily!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          log.date,
          log.totalUtility,
          log.cooling,
          log.it,
          log.others,
          log.supsLoss,
          log.txLoss,
          log.pue,
        ],
      ],
    },
  });
}