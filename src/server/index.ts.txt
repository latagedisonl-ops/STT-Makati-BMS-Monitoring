import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getHourlyLogs, addHourlyLog, getDailyLogs, addDailyLog } from './services/googleSheets';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'STT Makati BMS API is running' });
});

// Get all hourly logs
app.get('/api/hourly', async (req, res) => {
  try {
    const logs = await getHourlyLogs();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching hourly logs:', error);
    res.status(500).json({ error: 'Failed to fetch hourly logs' });
  }
});

// Add hourly log
app.post('/api/hourly', async (req, res) => {
  try {
    await addHourlyLog(req.body);
    res.json({ success: true, message: 'Hourly log added successfully' });
  } catch (error) {
    console.error('Error adding hourly log:', error);
    res.status(500).json({ error: 'Failed to add hourly log' });
  }
});

// Get all daily logs
app.get('/api/daily', async (req, res) => {
  try {
    const logs = await getDailyLogs();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    res.status(500).json({ error: 'Failed to fetch daily logs' });
  }
});

// Add daily log
app.post('/api/daily', async (req, res) => {
  try {
    await addDailyLog(req.body);
    res.json({ success: true, message: 'Daily log added successfully' });
  } catch (error) {
    console.error('Error adding daily log:', error);
    res.status(500).json({ error: 'Failed to add daily log' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Spreadsheet ID: ${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}`);
});