# 🏢 STT Makati BMS Dashboard

A comprehensive Building Management System (BMS) dashboard for monitoring data center operations at STT Makati.

## 📚 Documentation Index

### 🎯 Start Here
- **[🚀 HOW_TO_USE.md](HOW_TO_USE.md)** ⭐ **START HERE!** Complete guide to using the app and Google Sheets integration

### 📖 Detailed Guides
- **[📖 USER_GUIDE.md](USER_GUIDE.md)** - Complete step-by-step user manual with feature explanations
- **[📊 GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md)** - Full Google Sheets integration with Apps Script automation
- **[🎯 PRACTICAL_USAGE.md](PRACTICAL_USAGE.md)** - Real-world scenarios, workflows, and best practices
- **[🎨 QUICK_START_VISUAL.md](QUICK_START_VISUAL.md)** - Visual diagrams, charts, and quick reference cards

### 💡 In-Dashboard Help
- Click the **purple "Help" button** in the dashboard header for quick access to:
  - Quick start guide
  - Google Sheets integration steps
  - Sample CSV downloads
  - Key metrics reference table
  - Pro tips

### 📥 Sample Files
Download sample CSV templates to see proper format:
- `/public/sample-hourly-data.csv` - Example hourly readings (15 entries across 5 halls)
- `/public/sample-daily-data.csv` - Example daily energy data (5 days)

## Features

### 🔝 Sticky Header
- **Gradient server-rack icon** with BMS MONITORING branding
- **Live KPI strip** with real-time updates:
  - Average PUE (Power Usage Effectiveness)
  - Average Temperature
  - Average Humidity
  - Total IT Load
- **Action buttons**: Import CSV, Export CSV, + Log Reading
- **Live digital clock** with full date display (e.g., "FRI, 17 APR 2026")

### 🏢 Hall Cards (A-E)
- **Temperature & Humidity gauges** with color-coded status (green/amber/red)
- **Live status indicator**: Green pulsing dot when data exists, grey when no data
- **Mini PUE badge** appears once data is logged
- **Click to activate** - select a hall to focus on its data in charts

### ⚡ Facility Average PUE
- **Large glowing number** with neon shadow effect
- **Color-coded status** (green ≤1.5, amber ≤2.0, red >2.0)
- **Per-hall PUE breakdown** with horizontal bar chart

### 📈 Multi-Hall Trend Chart
- **Toggle between metrics**: Temperature / Humidity / PUE
- **All 5 halls** displayed on one chart with distinct colors
- **Reference lines** with dashed yellow indicators:
  - Temperature: 26°C
  - Humidity: 60%
  - PUE: 1.83
- **Interactive tooltips** and legends

### 📅 5-Day Summary Tab
- **Comprehensive energy table** with columns:
  - Total Utility
  - Cooling
  - IT
  - Others
  - SUPS Loss
  - TX Loss
  - PUE
- **Average row** showing column averages
- **5-day PUE area chart** with color-coded dots per day
- **5-day stacked energy breakdown** bar chart

### 📥 + Log Reading Modal
Two tabs for different data entry modes:

**Hourly Tab:**
- Hall selector
- Hour selector (00:00 - 23:00)
- Temperature (°C)
- Humidity (%)
- IT Load (kW)
- Total Power (kW)
- **Auto-calculated PUE** with live preview

**Daily Tab:**
- Date picker
- Cooling (kWh)
- IT (kWh)
- Others (kWh)
- SUPS Loss (kWh)
- TX Loss (kWh)
- **Auto-calculated Total Utility and PUE** with live preview

### 💾 CSV Import/Export
- **Export**: Generates properly formatted CSV ready for Google Sheets
  - Includes both hourly and daily logs in separate sections
  - Proper headers and formatting
- **Import**: Reads CSV files in both hourly and daily formats
  - Automatically detects and parses sections
  - Merges with existing data

## Color Coding

### PUE Status
- 🟢 **Green** (Good): PUE ≤ 1.5
- 🟡 **Amber** (Warning): 1.5 < PUE ≤ 2.0
- 🔴 **Red** (Critical): PUE > 2.0

### Temperature Status
- 🟢 **Green** (Good): 18°C - 27°C
- 🟡 **Amber** (Warning): 15°C - 18°C or 27°C - 30°C
- 🔴 **Red** (Critical): <15°C or >30°C

### Humidity Status
- 🟢 **Green** (Good): 40% - 70%
- 🟡 **Amber** (Warning): 30% - 40% or 70% - 80%
- 🔴 **Red** (Critical): <30% or >80%

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **Vite** - Build tool

## Usage

1. **Add hourly readings**: Click "+ Log Reading" → Hourly tab → Fill in the form
2. **Add daily summaries**: Click "+ Log Reading" → Daily tab → Fill in the form
3. **Export data**: Click "Export CSV" to download all logs
4. **Import data**: Click "Import CSV" to load previously exported data
5. **View trends**: Toggle between Temperature, Humidity, and PUE metrics
6. **Focus on a hall**: Click any Hall Card to highlight it in the trend chart
7. **View 5-day summary**: Click the "5-Day Summary" tab

## CSV Format

The exported CSV contains two sections:

### Hourly Logs
```
HOURLY LOGS
Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE
2026-04-17 14:30:00,A,14:00,25.5,55.0,150.00,225.00,1.50
```

### Daily Logs
```
DAILY LOGS
Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
2026-04-17,6200.00,1200.00,3600.00,800.00,200.00,400.00,1.72
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🚀 Quick Start Guide

### First Time Using the Dashboard

1. **Open the dashboard** in your web browser
2. **Click the purple "Help" button** in the header for a complete guide
3. **Log your first reading:**
   - Click "+ Log Reading"
   - Choose "Hourly Tab"
   - Fill in Hall, Hour, Temperature, Humidity, IT Load, Total Power
   - Click "Save Hourly Log"
4. **Watch the dashboard update** - Hall cards light up, KPIs update, charts populate!

### Integrating with Google Sheets

#### Export from Dashboard → Import to Sheets
1. In dashboard: Click "⬇ Export CSV"
2. Go to [Google Sheets](https://sheets.google.com)
3. Create new spreadsheet: "STT Makati BMS Data"
4. Click **File → Import → Upload**
5. Select your CSV file
6. Import settings: Separator = Comma, Convert text to numbers = ✓
7. Click "Import data" ✨

#### Import from Sheets → Load to Dashboard
1. In Google Sheets: **File → Download → CSV**
2. In dashboard: Click "⬆ Import CSV"
3. Select the CSV file
4. Data loads automatically! ✨

### Recommended Daily Workflow

**For Small Teams (Dashboard Primary):**
- Log all readings in the dashboard throughout the day
- End of day: Export CSV → Import to Google Sheets for backup
- Beautiful real-time visualizations + cloud backup ✓

**For Large Teams (Sheets Primary):**
- Multiple team members log data in Google Sheets (collaborative!)
- Import to dashboard for visualization and trend analysis
- Full revision history + gorgeous charts ✓

**Hybrid Approach (Best of Both):**
- Morning: Import from Sheets → Dashboard
- Day: Monitor live on dashboard
- Evening: Export from Dashboard → Sheets for backup

### Pro Tips 💡

✅ **Export daily** - Don't lose data if browser clears!  
✅ **Use Google Sheets for backup** - Free, unlimited storage  
✅ **Click hall cards** to highlight them on charts  
✅ **Download sample CSVs** from the Help modal to see proper format  
✅ **Set up Apps Script alerts** (see GOOGLE_SHEETS_INTEGRATION.md)  
✅ **Target PUE < 1.5** for world-class efficiency  

## 📊 Understanding the Metrics

| Metric | 🟢 Optimal | 🟡 Acceptable | 🔴 Critical |
|--------|-----------|--------------|------------|
| **Temperature** | 22-26°C | 20-28°C | <20°C or >28°C |
| **Humidity** | 45-60% | 40-70% | <40% or >70% |
| **PUE** | <1.5 | 1.5-2.0 | >2.0 |

## 🆘 Common Questions

**Q: Where is my data stored?**  
A: Dashboard stores data in browser localStorage. Always export to CSV for backup!

**Q: Can multiple people use this?**  
A: Yes! Use Google Sheets for collaborative data entry, then import to dashboard for visualization.

**Q: What if I close my browser?**  
A: Data persists in localStorage, but export CSV daily to be safe!

**Q: How do I share with management?**  
A: Export CSV → Import to Google Sheets → Share link (viewer access)

**Q: Can I automate alerts?**  
A: Yes! Use Google Apps Script to email alerts when temperature/humidity is out of range. See GOOGLE_SHEETS_INTEGRATION.md

## License

MIT
