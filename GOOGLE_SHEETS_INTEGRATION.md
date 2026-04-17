# 📊 Google Sheets Integration Guide

## 🎯 Why Integrate with Google Sheets?

Google Sheets integration allows you to:
- ✅ **Backup your data** automatically
- ✅ **Create custom reports** and dashboards
- ✅ **Share data** with your team
- ✅ **Archive historical data** for compliance
- ✅ **Build custom analysis** with formulas and pivot tables
- ✅ **Automate alerts** using Google Apps Script

---

## 🚀 Quick Start: Manual Sync

### Method 1: Export from Dashboard → Import to Sheets

#### Step 1: Export from Dashboard
1. Open your BMS Dashboard
2. Log some readings using "+ Log Reading"
3. Click **"⬇ Export CSV"** button
4. File `bms-data-export.csv` downloads to your computer

#### Step 2: Import to Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet: **"STT Makati BMS Data"**
3. Click **File → Import**
4. Select **Upload** tab
5. Drag and drop `bms-data-export.csv` or click **Browse**
6. In import settings:
   - Import location: **Replace current sheet**
   - Separator type: **Comma**
   - Convert text to numbers: **✓ Yes**
7. Click **Import data**

Your data is now in Google Sheets! ✨

---

## 📋 Setting Up Your Google Sheets Template

### Create Two Sheets: Hourly & Daily

#### Sheet 1: "Hourly Readings"
Headers (Row 1):
```
Hall | Date | Hour | Temperature (°C) | Humidity (%) | IT Load (kW) | Total Power (kW) | PUE
```

Example data:
```
A | 2026-04-17 | 9 | 24.5 | 55 | 150 | 200 | 1.33
B | 2026-04-17 | 9 | 25.0 | 58 | 180 | 240 | 1.33
```

#### Sheet 2: "Daily Energy"
Headers (Row 1):
```
Date | Total Utility (kWh) | Cooling (kWh) | IT (kWh) | Others (kWh) | SUPS Loss (kWh) | TX Loss (kWh) | PUE
```

Example data:
```
2026-04-17 | 10000 | 5000 | 4000 | 500 | 300 | 200 | 1.43
```

---

## 🔄 Workflow Options

### Option A: Dashboard as Primary (Recommended for Small Teams)

**Daily Workflow:**
1. Log all readings in the BMS Dashboard throughout the day
2. At end of day/week, click "Export CSV"
3. Import to Google Sheets for backup and reporting

**Pros:**
- Fast real-time monitoring on dashboard
- Beautiful visualizations
- Backup to Google Sheets for archival

**Cons:**
- Manual export/import step

---

### Option B: Google Sheets as Primary (Recommended for Large Teams)

**Daily Workflow:**
1. Team members log data directly in Google Sheets
2. Export from Google Sheets: **File → Download → CSV**
3. Import CSV to BMS Dashboard for visualization

**Pros:**
- Multiple people can edit simultaneously
- Full revision history
- Easier data validation with Sheets formulas

**Cons:**
- Need to import to dashboard for visualizations

---

### Option C: Hybrid Approach (Best of Both Worlds)

**Setup:**
1. Use BMS Dashboard for **real-time monitoring** (live KPIs, alerts, trend charts)
2. Use Google Sheets for **data entry and storage**
3. Sync daily: Export from Sheets → Import to Dashboard

**Workflow:**
```
Morning:
- Download latest from Google Sheets → Import to Dashboard

Throughout Day:
- Monitor live data on Dashboard
- Quick readings can be logged in Dashboard

Evening:
- Export from Dashboard → Import to Google Sheets
- Or manually enter day's data in Google Sheets
```

---

## 📊 Advanced: Google Sheets Formulas

### Auto-Calculate PUE in Sheets

In your hourly readings sheet, column H (PUE):
```excel
=IF(AND(F2>0, G2>0), ROUND(G2/F2, 2), "")
```
Where:
- F = IT Load (kW)
- G = Total Power (kW)

### Color-Code Temperature

Select Temperature column → Format → Conditional formatting:
- **Green**: Value between 22 and 26
- **Amber**: Value between 20 and 22 OR between 26 and 28
- **Red**: Value <20 OR >28

### Monthly Average Dashboard

Create a summary sheet with formulas:
```excel
=AVERAGEIFS('Hourly Readings'!D:D, 'Hourly Readings'!B:B, ">=2026-04-01", 'Hourly Readings'!B:B, "<=2026-04-30")
```

---

## 🤖 Automation with Google Apps Script

### Auto-Email Weekly Report

1. In Google Sheets, click **Extensions → Apps Script**
2. Paste this code:

```javascript
function sendWeeklyReport() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Daily Energy');
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(lastRow-6, 1, 7, 8).getValues(); // Last 7 days
  
  var avgPUE = 0;
  for (var i = 1; i < data.length; i++) {
    avgPUE += data[i][7]; // Column H = PUE
  }
  avgPUE = (avgPUE / 6).toFixed(2);
  
  var subject = 'STT Makati BMS - Weekly Report';
  var body = 'Average PUE this week: ' + avgPUE + '\n\n';
  body += 'View full dashboard: [YOUR_DASHBOARD_URL]';
  
  MailApp.sendEmail('facilities@sttmakati.com', subject, body);
}
```

3. Set trigger: **Clock icon → Add Trigger**
   - Function: `sendWeeklyReport`
   - Event source: **Time-driven**
   - Type: **Week timer**
   - Day: **Monday**
   - Time: **8am-9am**

### Auto-Alert on High Temperature

```javascript
function checkTemperatureAlerts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hourly Readings');
  var lastRow = sheet.getLastRow();
  var lastReading = sheet.getRange(lastRow, 1, 1, 8).getValues()[0];
  
  var hall = lastReading[0];
  var temp = lastReading[3];
  
  if (temp > 28) {
    MailApp.sendEmail(
      'alerts@sttmakati.com',
      '🚨 ALERT: High Temperature in Hall ' + hall,
      'Temperature: ' + temp + '°C\nAction required immediately!'
    );
  }
}
```

Set to run **every hour**.

---

## 📱 Mobile Access

### Google Sheets Mobile App
1. Install Google Sheets app on your phone
2. Open your "STT Makati BMS Data" sheet
3. Log readings on the go
4. Data syncs automatically

### BMS Dashboard on Mobile
1. Open the dashboard URL in your mobile browser
2. Responsive design works on phones/tablets
3. Import/export works on mobile too

---

## 🔐 Data Security Best Practices

### Google Sheets Security
1. **Share carefully**: File → Share → Add specific emails only
2. **Set permissions**:
   - Editors: Facility team only
   - Viewers: Management, auditors
3. **Enable version history**: File → Version history
4. **Create backups**: Weekly export to CSV, store in Google Drive

### BMS Dashboard Security
- Dashboard runs locally in browser (no server)
- Data stored in browser localStorage
- Export CSV for backup (not synced to cloud)
- Clear browser data = data lost (use CSV backups!)

---

## 📈 Reporting Templates

### Monthly Energy Report Template

Create a new sheet: "Monthly Report"

```
STT MAKATI DATA CENTER - MONTHLY ENERGY REPORT
Month: April 2026

SUMMARY METRICS
- Average PUE: =AVERAGE('Daily Energy'!H:H)
- Total Energy: =SUM('Daily Energy'!B:B)
- IT Energy: =SUM('Daily Energy'!D:D)
- Cooling Energy: =SUM('Daily Energy'!C:C)

TEMPERATURE PERFORMANCE
- Average Temp: =AVERAGE('Hourly Readings'!D:D)
- Hours >26°C: =COUNTIF('Hourly Readings'!D:D, ">26")
- Hours >28°C: =COUNTIF('Hourly Readings'!D:D, ">28")

EFFICIENCY TREND
- Days PUE <1.5: =COUNTIF('Daily Energy'!H:H, "<1.5")
- Days PUE >2.0: =COUNTIF('Daily Energy'!H:H, ">2.0")
```

---

## 🎓 Real-World Use Cases

### Use Case 1: Daily Operations Team
**Role**: Facility Manager
**Workflow**:
1. Dashboard on main monitor for live monitoring
2. Log hourly readings throughout shift
3. Export at end of shift to Google Sheets
4. Next shift imports from Sheets to continue

### Use Case 2: Management Reporting
**Role**: Director
**Workflow**:
1. View Google Sheets on phone for quick checks
2. Monthly: Open dashboard, import latest data
3. Export charts as images for presentations
4. Share Google Sheets with executives

### Use Case 3: Compliance & Audit
**Role**: Compliance Officer
**Workflow**:
1. All data logged in Google Sheets (audit trail)
2. Version history shows who changed what
3. Monthly export to CSV for archival
4. Dashboard for visual analysis during reviews

---

## 📞 Quick Tips

✅ **Export from dashboard daily** - Don't lose data if browser clears  
✅ **Use Google Sheets for backup** - Free, unlimited storage  
✅ **Set up Apps Script alerts** - Get notified of critical issues  
✅ **Create monthly snapshots** - Duplicate sheet for each month  
✅ **Share read-only links** - Let stakeholders view without editing  
✅ **Use pivot tables** - Analyze data by hall, time, or metric  
✅ **Embed charts in Docs** - Create reports with live data  

---

## 🆘 Need Help?

Common scenarios:

**"I want to see last month's data"**
→ Import the CSV backup from Google Drive into dashboard

**"Multiple people need to log data"**
→ Use Google Sheets as primary, import to dashboard for visualization

**"I need to present to management"**
→ Import latest data to dashboard, use F11 for fullscreen, take screenshots

**"I accidentally deleted data"**
→ Google Sheets: File → Version history → Restore
→ Dashboard: Import your last CSV backup

---

## 🔗 Resources

- [Google Sheets Help](https://support.google.com/sheets)
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [CSV Format Specification](https://tools.ietf.org/html/rfc4180)
