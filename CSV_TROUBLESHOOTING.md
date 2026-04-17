# CSV Import/Export Troubleshooting Guide

## 🔍 Quick Diagnosis

### ✅ Working Correctly
- ✓ You can manually enter data via "Log Reading"
- ✓ Export CSV downloads a file
- ✓ Re-importing your own exported CSV works
- ✓ Sample CSV files (`sample-hourly-data.csv`, `sample-daily-data.csv`) import successfully

### ❌ Common Problems & Solutions

---

## Problem 1: "No valid data found in CSV file"

### Symptoms
- Import completes but shows "0 records imported"
- Dashboard doesn't update after import

### Solutions

#### Check 1: File Format
**Your CSV must have proper headers in the first row:**

**For Hourly Data:**
```csv
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
```
OR
```csv
Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE
```

**For Daily Data:**
```csv
Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
```
OR
```csv
Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
```

#### Check 2: Column Count
Make sure each data row has the same number of columns as the header:
```csv
❌ WRONG (missing PUE column):
A,2026-04-17,0,24.5,55,150,200

✅ CORRECT (all 8 columns):
A,2026-04-17,0,24.5,55,150,200,1.33
```

#### Check 3: Date Format
Use YYYY-MM-DD format:
```csv
❌ WRONG:
04/17/2026
17-04-2026
Apr 17, 2026

✅ CORRECT:
2026-04-17
```

---

## Problem 2: Numbers Not Parsing

### Symptoms
- Import succeeds but numbers show as 0 or NaN
- Charts don't display properly

### Solutions

#### Remove Thousand Separators
```csv
❌ WRONG:
10,000

✅ CORRECT:
10000
```

#### Use Decimal Points, Not Commas
```csv
❌ WRONG:
24,5

✅ CORRECT:
24.5
```

#### Don't Include Units in Data Cells
```csv
❌ WRONG:
24.5°C,55%,150kW

✅ CORRECT:
24.5,55,150
```

---

## Problem 3: File Encoding Issues

### Symptoms
- Strange characters in imported data
- Import fails silently

### Solutions

#### Save CSV as UTF-8
**In Excel:**
1. File → Save As
2. Choose "CSV UTF-8 (Comma delimited)"

**In Google Sheets:**
1. File → Download → Comma Separated Values (.csv)
(Already UTF-8 by default)

**In Notepad++:**
1. Encoding → Convert to UTF-8
2. File → Save

---

## Problem 4: Excel Auto-Formatting Dates

### Symptoms
- Dates look weird after opening CSV in Excel
- Hours show as dates (e.g., "Jan-00" instead of "0")

### Solutions

#### Fix Hour Column
If Excel converts "0" to "Jan-00":
1. Open CSV in Notepad or text editor
2. Replace all instances of date-formatted hours with plain numbers
3. Save and re-import

#### Better: Use Google Sheets
Google Sheets handles CSVs better than Excel for this use case.

---

## Problem 5: Mixed Hourly and Daily Data

### Symptoms
- Only one type of data imports
- Partial import

### Solutions

#### Separate Files for Different Types
```csv
❌ WRONG (mixing in one file):
Hall,Date,Hour,Temperature,...
A,2026-04-17,0,24.5,...
Date,Total Utility,Cooling,...
2026-04-17,10000,5000,...

✅ CORRECT (separate files):
File 1: hourly-data.csv with only hourly logs
File 2: daily-data.csv with only daily logs
```

#### OR Use App Export Format
```csv
✅ CORRECT (app's format handles both):
HOURLY LOGS
Timestamp,Hall,Hour,Temperature,...
2026-04-17 00:00:00,A,00:00,24.5,...

DAILY LOGS
Date,Total Utility,Cooling,...
2026-04-17,10000,5000,...
```

---

## Problem 6: Extra Commas or Spaces

### Symptoms
- Parse errors
- Columns misaligned

### Solutions

#### Remove Trailing Commas
```csv
❌ WRONG:
A,2026-04-17,0,24.5,55,150,200,1.33,,,

✅ CORRECT:
A,2026-04-17,0,24.5,55,150,200,1.33
```

#### Trim Spaces (if using Excel/Sheets this is automatic)
The parser handles leading/trailing spaces, but it's good practice to avoid them.

---

## 🧪 Testing Your CSV

### Step 1: Try Sample Files First
Import the included sample files to verify the app works:
```
public/sample-hourly-data.csv
public/sample-daily-data.csv
```

### Step 2: Test Your Format
Create a minimal test file with just 1-2 rows:

**test-hourly.csv:**
```csv
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
```

### Step 3: Validate Structure
1. Open in text editor (not Excel)
2. Count commas - should be 7 per row (8 columns)
3. Check no quotes unless necessary
4. Verify dates are YYYY-MM-DD

---

## 📋 CSV Templates

### Hourly Template
```csv
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
A,2026-04-17,1,24.3,56,148,198,1.34
B,2026-04-17,0,25.0,58,180,240,1.33
```

### Daily Template
```csv
Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
2026-04-13,10000,5000,4000,500,300,200,1.43
2026-04-14,9800,4900,3950,480,290,180,1.42
```

---

## 🆘 Still Having Issues?

### Debug Checklist
- [ ] Tried importing sample files (from /public/)
- [ ] Checked CSV in text editor (not Excel)
- [ ] Verified date format is YYYY-MM-DD
- [ ] Confirmed no commas in numbers
- [ ] Removed units from data cells
- [ ] File saved as UTF-8
- [ ] Each row has same number of columns
- [ ] No trailing commas
- [ ] Headers match expected format

### Browser Console
1. Press F12 to open Developer Tools
2. Go to "Console" tab
3. Try importing CSV
4. Look for error messages
5. Share error details if asking for help

---

## ✨ Pro Tips

### Tip 1: Use Google Sheets for Editing
1. Upload CSV to Google Sheets
2. Edit data in the spreadsheet
3. Download as CSV
4. Import to dashboard

### Tip 2: Export Then Edit
1. Enter 1-2 records manually in the app
2. Export CSV
3. Use exported file as template
4. Add more rows following the same format
5. Re-import

### Tip 3: Keep Backups
- Export your data daily
- Name files with dates: `bms-data-2026-04-17.csv`
- Keep original files before editing

### Tip 4: Test Incrementally
- Import small batches (5-10 rows)
- Verify they appear correctly
- Then import larger files

---

## 📞 Need Help?

If you're still stuck:
1. Check the README.md for full documentation
2. Click "Help" button in the app for examples
3. Open browser console (F12) for error details
4. Compare your CSV with sample files byte-by-byte

**Remember:** The app now supports multiple formats, so if one format doesn't work, try the other format shown in the examples above!
