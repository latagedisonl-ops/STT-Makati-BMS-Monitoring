# 🚀 Quick Reference - CSV Import/Export

## 📥 Importing CSV Files

### Method
1. Click **"Import CSV"** button (blue button with upload icon)
2. Select your CSV file
3. Wait for success message
4. Done! Data appears on dashboard

### Supported Formats
✅ App export format (with "HOURLY LOGS" header)  
✅ Simple CSV (like sample files)  
✅ Headers with units: "Temperature (°C)"  
✅ Headers without units: "Temperature"  

### Sample Files Available
- `public/sample-hourly-data.csv` - 15 hourly readings
- `public/sample-daily-data.csv` - 5 daily summaries

---

## 📤 Exporting CSV Files

### Method 1: Direct Download (Recommended)
1. Click **"Export CSV"** button (green button with download icon)
2. Wait for "Exporting..." animation
3. See success alert
4. Check Downloads folder

### Method 2: Clipboard Copy (If Download Blocked)
1. Click **"Export CSV"**
2. If download fails, alert asks: "Copy to clipboard?"
3. Click **OK**
4. Open Notepad/Text Editor
5. Paste (Ctrl+V)
6. Save as `.csv` file

---

## 🔧 Quick Troubleshooting

### "No data to export"
→ Import a CSV file first OR add readings via "+ Log Reading"

### Export button does nothing
→ Open console (F12), check for errors, try clipboard method

### Import shows "No valid data"
→ Check CSV format in Help modal, ensure headers match

### Download blocked
→ Disable popup blocker OR use clipboard method

---

## 🎯 Expected CSV Formats

### Hourly Format (Simple)
```csv
Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
B,2026-04-17,0,25.0,58,180,240,1.33
```

### Daily Format (Simple)
```csv
Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
2026-04-13,10000,5000,4000,500,300,200,1.43
2026-04-14,9800,4900,3950,480,290,180,1.42
```

---

## ⚡ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Help | Click Help button |
| Open Console | F12 |
| Copy (clipboard) | Ctrl+V (after export) |
| Save File | Ctrl+S (in text editor) |

---

## ✅ Success Indicators

**Import Success:**
```
✓ Alert: "Successfully imported 15 record(s)!"
✓ Hall cards light up with data
✓ Charts populate with trends
```

**Export Success:**
```
✓ Button shows "Exporting..."
✓ Alert: "Export successful! Exported: 15 hourly log(s)..."
✓ File in Downloads folder
```

---

## 📞 Need More Help?

1. **In-App Help:** Click yellow "Help" button
2. **Console Logs:** Press F12 → Console tab
3. **Documentation:** 
   - `README.md` - Complete guide
   - `EXPORT_FIX_GUIDE.md` - Export troubleshooting
   - `WHATS_FIXED.md` - What's changed

---

## 🎉 That's It!

Import and export are now super reliable with multiple fallback methods. Enjoy! 🚀
