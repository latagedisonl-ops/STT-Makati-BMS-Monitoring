# ⚡ Quick Fix Guide: CSV Import Not Working

## 🎯 TL;DR - The Fix

**Problem:** External CSV files won't import  
**Cause:** Format mismatch  
**Solution:** Smart parser now handles multiple formats automatically

---

## 🔥 Quick Test (30 seconds)

### Step 1: Try Sample Files
```bash
1. Open the app
2. Click "Import CSV" button (blue, top-right)
3. Navigate to /public/ folder
4. Select "sample-hourly-data.csv"
5. Click Open
```

**Expected Result:**
```
✅ Alert: "Successfully imported 15 record(s)!"
✅ Hall cards A-E light up with green dots
✅ Charts show data
```

### Step 2: Import Daily Data
```bash
1. Click "Import CSV" again
2. Select "sample-daily-data.csv"
3. Click Open
```

**Expected Result:**
```
✅ Alert: "Successfully imported 5 record(s)!"
✅ Click "5-Day Summary" tab
✅ See energy table with 5 days
```

---

## ❓ Still Not Working?

### Issue 1: "No valid data found"

**Quick Fix:**
```csv
✅ Check your CSV headers match one of these:

Hourly Option 1:
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE

Hourly Option 2:
Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE

Daily Option 1:
Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE

Daily Option 2:
Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
```

### Issue 2: Numbers Show as Zero

**Quick Fix:**
```csv
❌ Remove thousand separators:
10,000 → 10000

❌ Use dots for decimals:
24,5 → 24.5

❌ Remove units from data:
24.5°C → 24.5
```

### Issue 3: Dates Not Parsing

**Quick Fix:**
```csv
❌ Wrong formats:
04/17/2026
17-04-2026
Apr 17, 2026

✅ Correct format:
2026-04-17
```

---

## 📋 Working CSV Examples

### Copy-Paste Ready: Hourly
```csv
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
B,2026-04-17,0,25.0,58,180,240,1.33
C,2026-04-17,0,25.5,52,200,270,1.35
```

### Copy-Paste Ready: Daily
```csv
Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
2026-04-13,10000,5000,4000,500,300,200,1.43
2026-04-14,9800,4900,3950,480,290,180,1.42
```

---

## 🛠️ Debug in 3 Steps

### Step 1: Open Browser Console
```
Press F12 → Click "Console" tab
```

### Step 2: Try Import
```
Click "Import CSV" → Select file → Check console
```

### Step 3: Look for Errors
```
✅ No errors = File imported successfully
❌ Red errors = Check error message for clues
```

---

## 📞 Quick Checks

Before asking for help, verify:

- [ ] Tried importing sample files first (they work = app is OK)
- [ ] CSV opens in text editor (not Excel)
- [ ] Date format is YYYY-MM-DD
- [ ] No commas in numbers (10000 not 10,000)
- [ ] No units in data cells (24.5 not 24.5°C)
- [ ] Each row has same number of commas
- [ ] File encoding is UTF-8

---

## 💡 Pro Tips

### Tip 1: Use Sample Files as Templates
```bash
1. Copy sample-hourly-data.csv
2. Edit with your data
3. Keep same format
4. Import!
```

### Tip 2: Export Then Edit
```bash
1. Add 1 manual entry
2. Export CSV
3. Use exported file as template
4. Add more rows
5. Re-import
```

### Tip 3: Test Small First
```bash
Start with 2-3 rows, verify they work, then add more
```

---

## 🎯 Common Scenarios

### Scenario 1: Have Old CSV Files
```
1. Compare headers with examples above
2. Adjust headers if needed
3. Import
```

### Scenario 2: Exporting from Excel
```
1. Save As → CSV UTF-8
2. Check dates stayed YYYY-MM-DD
3. Import
```

### Scenario 3: Using Google Sheets
```
1. File → Download → CSV
2. Import (should work directly)
```

---

## ✅ Success Indicators

After successful import, you should see:

- ✓ Alert message with record count
- ✓ Hall cards with green pulsing dots
- ✓ Temperature/humidity values displayed
- ✓ Charts populated with lines
- ✓ PUE values showing

---

## 📚 More Help

- **In-App Help:** Click "Help" button (amber, top-right)
- **Detailed Troubleshooting:** See CSV_TROUBLESHOOTING.md
- **Full Documentation:** See README.md
- **Technical Details:** See SOLUTION_SUMMARY.md

---

## 🎊 That's It!

The CSV import should now work with your files. If you followed the quick checks and it's still not working, check the detailed troubleshooting guide or browser console for specific error messages.

**Remember:** The app now supports multiple formats automatically - just make sure your CSV has the right column structure!
