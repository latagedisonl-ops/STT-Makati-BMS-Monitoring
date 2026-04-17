# 🎯 STT Makati BMS Dashboard - Practical Usage & Integration

## 📱 Real-World Scenarios

### Scenario 1: Daily Operations (Facility Manager)

**Your Goal**: Monitor data center conditions in real-time and log readings every hour

#### Morning Routine (8:00 AM)
1. Open the BMS Dashboard in your browser (bookmark it!)
2. If you have yesterday's backup from Google Sheets:
   - Download the CSV from your Sheets
   - Click **⬆ Import CSV** to load yesterday's data
3. Check the **Live KPIs** - are all metrics green?

#### Hourly Monitoring (Every Hour 9:00-18:00)
1. Walk through each hall (A, B, C, D, E) with your tablet/laptop
2. For each hall:
   - Note the temperature from the thermometer
   - Note the humidity from the hygrometer  
   - Check the power meter for IT Load and Total Power
3. Click **+ Log Reading** → **Hourly Tab**
4. Select Hall, Hour, enter all 4 values
5. Verify the PUE preview looks correct (should be 1.2-1.5)
6. Click **Save Hourly Log**
7. Watch the dashboard update:
   - Hall card turns green with pulsing dot ✓
   - Live KPIs update immediately
   - Trend chart adds new data point

#### End of Day (18:00)
1. Click **⬇ Export CSV** 
2. Save the file
3. Upload to Google Sheets for backup (see steps below)
4. Review the **Multi-Hall Trend Chart**:
   - Toggle TEMP/HUM/PUE
   - Look for anomalies (spikes, drops)
   - Click hall cards to highlight specific halls

#### Weekly Energy Log (Monday Morning)
1. Gather last week's energy meter readings
2. For each day (Mon-Sun):
   - Click **+ Log Reading** → **Daily Tab**
   - Select the date
   - Enter: Cooling, IT, Others, SUPS Loss, TX Loss
   - Watch Total Utility and PUE calculate automatically
   - Click **Save Daily Log**
3. Switch to **5-Day Summary** tab to review the week
4. Export to Google Sheets for management reports

---

### Scenario 2: Management Reporting (Director)

**Your Goal**: Generate monthly performance reports for stakeholders

#### Monthly Report Workflow

**Week 1-4: Data Collection**
- Facility team logs hourly + daily readings
- End of each week: Export CSV → Import to Google Sheets
- Keep a folder: "BMS Reports 2026" in Google Drive

**End of Month: Analysis**
1. Download the master CSV from Google Sheets
2. Import to BMS Dashboard
3. Open **5-Day Summary** tab (shows last 5 days)
4. Take screenshots:
   - Hall Cards with KPIs
   - Facility Average PUE
   - 5-day PUE trend chart
   - Energy breakdown chart
5. Export to PowerPoint/Slides with insights

**Google Sheets Analysis**
1. In your "STT Makati BMS Data" sheet, create a new tab: "April 2026 Summary"
2. Use formulas to calculate:
   ```
   Average Temperature: =AVERAGE('Hourly Readings'!D:D)
   Average Humidity: =AVERAGE('Hourly Readings'!E:E)
   Average PUE: =AVERAGE('Daily Energy'!H:H)
   Total Energy: =SUM('Daily Energy'!B:B)
   Hours >28°C: =COUNTIF('Hourly Readings'!D:D, ">28")
   ```
3. Create a summary table
4. Insert charts: File → Insert → Chart → Area chart for PUE trend
5. Share with stakeholders: **Share → Anyone with link → Viewer**

---

### Scenario 3: Multi-User Team (Large Facility)

**Your Goal**: 3 shift workers need to log data collaboratively

#### Setup (One-Time)
1. Create Google Sheet: "STT Makati BMS Master Data"
2. Set up two sheets:
   - **Hourly Readings** with columns: Hall, Date, Hour, Temp, Humidity, IT Load, Total Power, PUE
   - **Daily Energy** with columns: Date, Total Utility, Cooling, IT, Others, SUPS Loss, TX Loss, PUE
3. Share with team: **Share → Add people → Editor access**
4. Pin to everyone's Sheets dashboard

#### Daily Workflow

**Shift 1 (6:00-14:00)**
- Log readings directly in Google Sheets
- At end of shift: File → Download → CSV
- Upload to team Slack/Drive: "shift1-2026-04-17.csv"

**Shift 2 (14:00-22:00)**
- Continue logging in Google Sheets
- At end of shift: Download CSV

**Shift 3 (22:00-6:00)**
- Continue logging in Google Sheets
- At 6:00 AM: Download final daily CSV

**Morning Manager Review**
- Download yesterday's CSV from Sheets
- Import to BMS Dashboard for visualization
- Review trends, check for anomalies
- Share dashboard screenshots in team meeting

**Why This Works:**
- ✅ Google Sheets has revision history (track who changed what)
- ✅ Multiple people can edit simultaneously
- ✅ No data loss (cloud-backed)
- ✅ Dashboard provides beautiful visualization for reviews

---

## 📊 Google Sheets Integration - Step by Step

### First-Time Setup (10 minutes)

#### Step 1: Create Your Spreadsheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **Blank** to create new spreadsheet
3. Rename it: **STT Makati BMS Data**

#### Step 2: Set Up Hourly Readings Sheet
1. First sheet, rename to: **Hourly Readings**
2. Row 1 (headers):
   ```
   A1: Hall
   B1: Date
   C1: Hour
   D1: Temperature (°C)
   E1: Humidity (%)
   F1: IT Load (kW)
   G1: Total Power (kW)
   H1: PUE
   ```
3. Select row 1, make it **bold**, background **light blue**
4. Select column H, add formula in H2:
   ```
   =IF(AND(F2>0, G2>0), ROUND(G2/F2, 2), "")
   ```
5. Drag H2 formula down to H1000

#### Step 3: Set Up Daily Energy Sheet
1. Click **+** to add new sheet, rename to: **Daily Energy**
2. Row 1 (headers):
   ```
   A1: Date
   B1: Total Utility (kWh)
   C1: Cooling (kWh)
   D1: IT (kWh)
   E1: Others (kWh)
   F1: SUPS Loss (kWh)
   G1: TX Loss (kWh)
   H1: PUE
   ```
3. Format row 1: **bold**, background **light green**
4. Add formulas:
   - B2 (Total Utility): `=C2+D2+E2+F2+G2`
   - H2 (PUE): `=IF(D2>0, ROUND(B2/D2, 2), "")`
5. Drag formulas down to row 1000

#### Step 4: Add Conditional Formatting

**Temperature Color Coding:**
1. Select column D (Temperature) in Hourly Readings
2. Format → Conditional formatting
3. Add 3 rules:
   - **Green**: Custom formula `=AND(D2>=22, D2<=26)`
   - **Amber**: Custom formula `=OR(AND(D2>=20, D2<22), AND(D2>26, D2<=28))`
   - **Red**: Custom formula `=OR(D2<20, D2>28)`

**Humidity Color Coding:**
1. Select column E (Humidity)
2. Add 3 rules:
   - **Green**: `=AND(E2>=45, E2<=60)`
   - **Amber**: `=OR(AND(E2>=40, E2<45), AND(E2>60, E2<=70))`
   - **Red**: `=OR(E2<40, E2>70)`

**PUE Color Coding:**
1. Select column H in Daily Energy
2. Add 3 rules:
   - **Green**: `=H2<1.5`
   - **Amber**: `=AND(H2>=1.5, H2<=2.0)`
   - **Red**: `=H2>2.0`

#### Step 5: Test Import/Export

**Test Export from Dashboard:**
1. In BMS Dashboard, add a few test readings
2. Click **⬇ Export CSV**
3. File downloads as `bms-data-export.csv`

**Test Import to Sheets:**
1. In Google Sheets, click **File → Import**
2. Select **Upload** tab
3. Drag `bms-data-export.csv`
4. Import settings:
   - Import location: **Append to current sheet**
   - Separator: **Comma**
   - Convert text to numbers: **✓**
5. Click **Import data**
6. Data appears! ✨

**Test Export from Sheets:**
1. File → Download → Comma Separated Values (.csv)
2. Save as `sheets-export.csv`

**Test Import to Dashboard:**
1. In BMS Dashboard, click **⬆ Import CSV**
2. Select `sheets-export.csv`
3. Data loads! ✨

---

## 🤖 Advanced: Google Apps Script Automation

### Auto-Email Daily Summary

1. In Google Sheets: **Extensions → Apps Script**
2. Delete default code, paste this:

```javascript
function emailDailySummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hourlySheet = ss.getSheetByName('Hourly Readings');
  const dailySheet = ss.getSheetByName('Daily Energy');
  
  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = Utilities.formatDate(yesterday, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  
  // Get yesterday's hourly data
  const hourlyData = hourlySheet.getDataRange().getValues();
  const yesterdayHourly = hourlyData.filter(row => row[1] === dateStr);
  
  // Calculate averages
  let totalTemp = 0, totalHum = 0, totalPUE = 0, count = 0;
  yesterdayHourly.forEach(row => {
    if (row[3]) totalTemp += row[3]; // Temperature
    if (row[4]) totalHum += row[4];   // Humidity
    if (row[7]) totalPUE += row[7];   // PUE
    count++;
  });
  
  const avgTemp = count > 0 ? (totalTemp / count).toFixed(1) : 'N/A';
  const avgHum = count > 0 ? (totalHum / count).toFixed(1) : 'N/A';
  const avgPUE = count > 0 ? (totalPUE / count).toFixed(2) : 'N/A';
  
  // Get daily energy data
  const dailyData = dailySheet.getDataRange().getValues();
  const yesterdayDaily = dailyData.find(row => row[0] === dateStr);
  const totalEnergy = yesterdayDaily ? yesterdayDaily[1] : 'N/A';
  
  // Build email
  const subject = `BMS Daily Summary - ${dateStr}`;
  const body = `
STT Makati Data Center - Daily Summary

Date: ${dateStr}
Readings Logged: ${count}

HOURLY AVERAGES:
• Temperature: ${avgTemp}°C
• Humidity: ${avgHum}%
• PUE: ${avgPUE}

DAILY ENERGY:
• Total Utility: ${totalEnergy} kWh

View full dashboard: [YOUR_DASHBOARD_URL]
  `;
  
  // Send email (replace with your email)
  MailApp.sendEmail('facilities@sttmakati.com', subject, body);
}
```

3. **Save** the script (Ctrl+S or Cmd+S)
4. Click **Triggers** (clock icon on left)
5. Click **+ Add Trigger**
6. Settings:
   - Function: `emailDailySummary`
   - Event source: **Time-driven**
   - Type: **Day timer**
   - Time: **6am-7am**
7. Click **Save**
8. Grant permissions when prompted

Now you'll get a daily email at 6 AM with yesterday's summary!

### Auto-Alert on High Temperature

```javascript
function checkTemperatureAlerts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hourly Readings');
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return; // No data
  
  const lastReading = sheet.getRange(lastRow, 1, 1, 8).getValues()[0];
  const hall = lastReading[0];
  const temp = lastReading[3];
  const timestamp = lastReading[1] + ' ' + lastReading[2] + ':00';
  
  // Alert thresholds
  if (temp > 28) {
    MailApp.sendEmail(
      'alerts@sttmakati.com',
      `🚨 CRITICAL: High Temperature in Hall ${hall}`,
      `Temperature: ${temp}°C\nHall: ${hall}\nTime: ${timestamp}\n\nACTION REQUIRED IMMEDIATELY!`
    );
  } else if (temp > 26) {
    MailApp.sendEmail(
      'alerts@sttmakati.com',
      `⚠️ WARNING: Elevated Temperature in Hall ${hall}`,
      `Temperature: ${temp}°C\nHall: ${hall}\nTime: ${timestamp}\n\nPlease monitor closely.`
    );
  }
  
  // Check humidity too
  const humidity = lastReading[4];
  if (humidity > 70 || humidity < 40) {
    MailApp.sendEmail(
      'alerts@sttmakati.com',
      `⚠️ WARNING: Humidity Out of Range in Hall ${hall}`,
      `Humidity: ${humidity}%\nHall: ${hall}\nTime: ${timestamp}\n\nRecommended range: 45-60%`
    );
  }
}
```

Set this to run **every hour** during business hours:
- Trigger: Time-driven → Hour timer → Every hour

---

## 📈 Monthly Reporting Template

Create a new sheet in your Google Sheets: **Monthly Summary**

### Template Structure:

```
A1: STT MAKATI DATA CENTER - MONTHLY REPORT
A2: Month: [Month Year]

A4: KEY METRICS
A5: Average PUE:          B5: =AVERAGE('Daily Energy'!H:H)
A6: Target PUE:           B6: 1.50
A7: Performance:          B7: =IF(B5<1.5, "✓ Excellent", IF(B5<2, "△ Good", "✗ Needs Improvement"))

A9: ENERGY CONSUMPTION
A10: Total Energy:        B10: =SUM('Daily Energy'!B:B)
A11: IT Energy:           B11: =SUM('Daily Energy'!D:D)
A12: Cooling Energy:      B12: =SUM('Daily Energy'!C:C)
A13: Cooling %:           B13: =B12/B10

A15: TEMPERATURE PERFORMANCE
A16: Average Temp:        B16: =AVERAGE('Hourly Readings'!D:D)
A17: Min Temp:            B17: =MIN('Hourly Readings'!D:D)
A18: Max Temp:            B18: =MAX('Hourly Readings'!D:D)
A19: Hours >26°C:         B19: =COUNTIF('Hourly Readings'!D:D, ">26")
A20: Hours >28°C:         B20: =COUNTIF('Hourly Readings'!D:D, ">28")

A22: HUMIDITY PERFORMANCE
A23: Average Humidity:    B23: =AVERAGE('Hourly Readings'!E:E)
A24: Min Humidity:        B24: =MIN('Hourly Readings'!E:E)
A25: Max Humidity:        B25: =MAX('Hourly Readings'!E:E)
A26: Hours <40%:          B26: =COUNTIF('Hourly Readings'!E:E, "<40")
A27: Hours >70%:          B27: =COUNTIF('Hourly Readings'!E:E, ">70")
```

### Add Charts:

1. **PUE Trend Chart:**
   - Select Daily Energy columns A & H (Date, PUE)
   - Insert → Chart → Line chart
   - Title: "Monthly PUE Trend"

2. **Energy Breakdown:**
   - Select Daily Energy columns C, D, E (Cooling, IT, Others)
   - Insert → Chart → Stacked column chart
   - Title: "Daily Energy Breakdown"

---

## 💾 Backup Strategy

### Daily Backup (Automated)
1. Google Sheets auto-saves (nothing to do!)
2. Revision history: File → Version history → See version history

### Weekly Backup (Manual)
1. End of week: Download CSV from Google Sheets
2. Upload to Google Drive folder: "BMS Weekly Backups"
3. Name: `STT-BMS-Week-[Week#]-2026.csv`

### Monthly Archive (Manual)
1. End of month: Duplicate entire Google Sheet
2. Rename: `STT Makati BMS - April 2026 (ARCHIVE)`
3. Move to folder: "BMS Archives"
4. Clear current sheet for new month

---

## 🆘 Troubleshooting

### "My data disappeared from the dashboard!"
**Solution**: Dashboard stores data in browser localStorage. If you cleared browser data, it's gone. Always export to CSV daily!
1. Import your last CSV backup from Google Sheets
2. Set a reminder to export daily

### "Google Sheets import isn't working"
**Check:**
1. Is your CSV format correct? (comma-separated, proper headers)
2. Try: File → Import → Upload → Replace current sheet
3. Make sure Separator type is set to "Comma"

### "PUE showing as 0.00 or N/A"
**Check:**
1. IT Load must be > 0
2. Total Power must be > IT Load
3. Formula in Google Sheets: `=G2/F2` (Total Power ÷ IT Load)

### "Can't see yesterday's data on dashboard"
**Solution**: Dashboard shows data from browser memory only.
1. Export from Google Sheets: File → Download → CSV
2. Import to dashboard: ⬆ Import CSV

---

## 🎓 Best Practices

### ✅ DO:
- Export from dashboard daily (before closing browser)
- Keep Google Sheets as master backup
- Log readings at consistent times (every hour on the hour)
- Review trends weekly
- Set up automated email alerts
- Share Google Sheets with team (read-only for most, editor for facility team)
- Create monthly snapshots in Sheets

### ❌ DON'T:
- Rely only on dashboard (browser can clear data)
- Delete old data (archive instead)
- Share CSV files via email (use Google Sheets)
- Manually calculate PUE (let formulas do it)
- Ignore yellow/red alerts on dashboard

---

## 📞 Quick Reference Card

### Dashboard Keyboard Shortcuts
- Click hall cards → Highlight on chart
- Esc → Close modal
- Tab → Navigate between input fields

### Google Sheets Formulas
```
Average PUE:        =AVERAGE('Daily Energy'!H:H)
Total Energy:       =SUM('Daily Energy'!B:B)
Avg Temperature:    =AVERAGE('Hourly Readings'!D:D)
Hours >28°C:        =COUNTIF('Hourly Readings'!D:D, ">28")
```

### Optimal Ranges
| Metric | Optimal | Warning | Critical |
|--------|---------|---------|----------|
| Temp | 22-26°C | 20-28°C | <20 or >28 |
| Humidity | 45-60% | 40-70% | <40 or >70 |
| PUE | <1.5 | 1.5-2.0 | >2.0 |

### Daily Checklist
- [ ] 9 AM: Import yesterday's backup from Sheets
- [ ] Every hour: Log temperature, humidity, power
- [ ] 6 PM: Export CSV to Google Sheets
- [ ] Weekly: Log daily energy data
- [ ] Monthly: Generate report from Sheets

---

**Need more help?** Click the **Help** button in the dashboard header for quick access to integration guides and examples!
