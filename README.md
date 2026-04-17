# STT Makati BMS Monitoring Dashboard - CSV Import/Export Fix

## 🎯 Problem Solved

### The Issue
The original app had CSV import problems:
- ✅ **Export worked** when data was manually entered in the app
- ✅ **Import worked** when importing data that was exported from the app  
- ❌ **Import FAILED** when trying to import sample CSV files or externally created CSVs

### Root Cause
The app only supported one specific CSV format (with "HOURLY LOGS" and "DAILY LOGS" section headers), but the sample CSV files provided used a different, simpler format without these section markers.

## ✨ The Solution

I've implemented a **smart CSV parser** that automatically detects and handles **multiple CSV formats**:

### Format 1: App Export Format (Original)
```csv
HOURLY LOGS
Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE
2026-04-17 14:30:00,A,14:00,25.5,55.0,150.00,225.00,1.50

DAILY LOGS
Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
2026-04-17,6200.00,1200.00,3600.00,800.00,200.00,400.00,1.72
```

### Format 2: Sample CSV Format (Now Supported!)
**Hourly:**
```csv
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
B,2026-04-17,0,25.0,58,180,240,1.33
```

**Daily:**
```csv
Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
2026-04-13,10000,5000,4000,500,300,200,1.43
2026-04-14,9800,4900,3950,480,290,180,1.42
```

## 🔧 Technical Changes

### 1. Enhanced CSV Parser (`src/utils/csvParser.ts`)
Created a smart parser with:
- **Automatic format detection** - detects section headers vs simple headers
- **Multi-format support** - handles both app exports and sample CSVs
- **Column header flexibility** - works with headers that have units in parentheses
- **Robust error handling** - gracefully handles malformed data

### 2. Improved Import Function
- Shows detailed success message with count of imported records
- Better error messages when import fails
- Preserves existing data while adding new imports

### 3. Sample Files Included
- `/public/sample-hourly-data.csv` - 15 sample hourly readings
- `/public/sample-daily-data.csv` - 5 sample daily summaries
- Users can download and test import immediately

## 📥 How to Use

### Importing CSV Files

1. **Click "Import CSV"** button in the dashboard header
2. **Select any of these formats:**
   - Files exported from this app (with sections)
   - Simple hourly CSV (with Hall, Date, Hour columns)
   - Simple daily CSV (with Date, Total Utility columns)
   - Even sample files with units in headers like "Temperature (°C)"
3. **See confirmation** with count of imported records
4. **Watch the dashboard update** with your data!

### Exporting CSV Files

1. **Click "Export CSV"** button
2. File downloads with both hourly and daily data
3. Format is compatible for re-import or use in Excel/Google Sheets

## 🎓 Testing the Fix

### Test with Sample Files:
```bash
# The app includes sample CSV files in /public/
# Try importing them to see the fix in action:
- public/sample-hourly-data.csv
- public/sample-daily-data.csv
```

### Test Flow:
1. Open the app
2. Import `sample-hourly-data.csv` - you'll see 15 records imported
3. Import `sample-daily-data.csv` - you'll see 5 records imported  
4. Check that Hall cards light up with data
5. View trends in the charts
6. Export the data - verify it works
7. Re-import the exported file - verify round-trip works

## 🆕 Additional Features

### Smart Help Modal
- Click the "Help" button for complete documentation
- CSV format examples
- Troubleshooting guide
- Metrics reference table
- Pro tips

### Enhanced UI/UX
- Success alerts show how many records were imported
- Error messages are more descriptive
- All imports are additive (don't overwrite existing data)
- Timestamp added to exported filenames for versioning

## 🔍 Troubleshooting

### Import shows "No valid data found"
- ✅ Check CSV has proper column headers
- ✅ Ensure date format is YYYY-MM-DD
- ✅ Don't use commas in numbers (1000 not 1,000)
- ✅ Make sure file encoding is UTF-8

### Data not showing after import
- ✅ Check browser console for errors
- ✅ Verify CSV columns match expected format
- ✅ Try with sample files first to verify app works

### Numbers not parsing correctly  
- ✅ Remove thousand separators (commas)
- ✅ Use dots for decimals (1.5 not 1,5)
- ✅ Don't include units in the data cells

## 💾 Data Persistence

- Data is saved in browser localStorage
- **Important:** Export your data regularly!
- Clearing browser data will delete logs
- Use CSV export for backup and archival

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Features
- ✅ Multi-hall monitoring (A-E)
- ✅ Real-time KPIs
- ✅ Temperature, Humidity, PUE tracking
- ✅ Interactive charts
- ✅ 5-day energy summary
- ✅ **Multi-format CSV import/export**
- ✅ Sample data included
- ✅ Comprehensive help documentation

## 📊 Metrics Targets

| Metric | 🟢 Optimal | 🟡 Acceptable | 🔴 Critical |
|--------|-----------|---------------|-------------|
| **Temperature** | 18-27°C | 15-18°C or 27-30°C | <15°C or >30°C |
| **Humidity** | 40-70% | 30-40% or 70-80% | <30% or >80% |
| **PUE** | ≤ 1.5 | 1.5-2.0 | > 2.0 |

## 🎯 Summary of Fixes

✅ **Fixed:** CSV import now works with sample files  
✅ **Fixed:** Parser handles multiple CSV formats automatically  
✅ **Fixed:** Headers with units (e.g., "Temperature (°C)") now supported  
✅ **Added:** Detailed import success/error messages  
✅ **Added:** Sample CSV files for testing  
✅ **Added:** Comprehensive help documentation  
✅ **Improved:** User experience with better feedback  

---

**Version:** 2.0 (CSV Import/Export Fix)  
**License:** MIT  
**Author:** Arena Web Dev Assistant
