# 🚀 How to Use the STT Makati BMS Dashboard

## 📚 Complete Documentation Suite

Welcome! Here's your complete guide to using and integrating the BMS Dashboard with Google Sheets.

### 📖 Documentation Files

1. **[README.md](README.md)** - Overview and features list
2. **[USER_GUIDE.md](USER_GUIDE.md)** - Complete step-by-step user manual
3. **[GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md)** - Full Google Sheets integration
4. **[PRACTICAL_USAGE.md](PRACTICAL_USAGE.md)** - Real-world scenarios and workflows
5. **[QUICK_START_VISUAL.md](QUICK_START_VISUAL.md)** - Visual diagrams and quick reference
6. **[HOW_TO_USE.md](HOW_TO_USE.md)** ← You are here!

---

## 🎯 Choose Your Journey

### I'm New - Show Me the Basics!

**Start Here:**
1. Open the dashboard in your browser
2. Click the **💜 Help button** in the top-right header
3. Read the "Quick Start Guide" section
4. Click **+ Log Reading** to add your first data point

**Then Read:**
- [QUICK_START_VISUAL.md](QUICK_START_VISUAL.md) - See visual diagrams
- [USER_GUIDE.md](USER_GUIDE.md) - Learn all features

**Quick Video Tutorial (3 minutes):**
1. Watch the hall cards light up as you add data
2. See live KPIs update instantly
3. Toggle between TEMP/HUM/PUE charts
4. Export to CSV for backup

---

### I Need to Integrate with Google Sheets

**For Small Teams (Dashboard Primary):**
```
Daily: Log in Dashboard → Export CSV → Import to Google Sheets
```
Read: [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) - Section "Option A"

**For Large Teams (Sheets Primary):**
```
Daily: Log in Google Sheets → Download CSV → Import to Dashboard
```
Read: [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) - Section "Option B"

**For Best Results (Hybrid):**
```
Morning: Import from Sheets
Throughout Day: Monitor on Dashboard  
Evening: Export to Sheets
```
Read: [PRACTICAL_USAGE.md](PRACTICAL_USAGE.md) - "Scenario 3: Multi-User Team"

---

### I'm a Facility Manager

**Your Daily Workflow:**

**9:00 AM:**
- [ ] Open dashboard
- [ ] Import yesterday's backup from Google Sheets
- [ ] Check Live KPIs - all green?

**Every Hour (9:00-18:00):**
- [ ] Walk through halls
- [ ] Note Temp, Humidity, IT Load, Total Power
- [ ] Click + Log Reading → Hourly Tab
- [ ] Log for each hall
- [ ] Verify dashboard updated

**18:00:**
- [ ] Review trend charts
- [ ] Click ⬇ Export CSV
- [ ] Import to Google Sheets

**Monday Morning (Weekly):**
- [ ] Gather energy meter readings
- [ ] Click + Log Reading → Daily Tab
- [ ] Log last week's energy data
- [ ] View 5-Day Summary tab

**Read Full Guide:** [PRACTICAL_USAGE.md](PRACTICAL_USAGE.md) - "Scenario 1"

---

### I'm Management / Need Reports

**Monthly Reporting Workflow:**

1. **Throughout Month:** Facility team logs data
2. **End of Month:** Download master CSV from Google Sheets
3. **Import to Dashboard** for visualization
4. **Take Screenshots:**
   - Hall cards with live status
   - Facility Average PUE (glowing number)
   - 5-Day Summary charts
   - Multi-Hall Trend Chart
5. **Google Sheets Analysis:**
   - Create "Monthly Summary" tab
   - Use formulas to calculate averages
   - Generate charts
   - Share with stakeholders

**Templates & Formulas:** [PRACTICAL_USAGE.md](PRACTICAL_USAGE.md) - "Monthly Reporting Template"

---

### I Have a Multi-User Team

**Setup (One-Time):**

1. Create Google Sheet: "STT Makati BMS Master Data"
2. Set up two sheets:
   - **Hourly Readings** (Hall, Date, Hour, Temp, Humidity, IT Load, Total Power, PUE)
   - **Daily Energy** (Date, Total Utility, Cooling, IT, Others, SUPS Loss, TX Loss, PUE)
3. Share with team (Editor access)
4. Add conditional formatting for alerts

**Daily Workflow:**
- **Shift 1-3:** Log directly in Google Sheets
- **Morning Manager:** Download CSV → Import to Dashboard for visualization
- **Weekly Review:** Dashboard screenshots for team meeting

**Why This Works:**
- ✅ Multiple editors simultaneously
- ✅ Full revision history
- ✅ Beautiful dashboard visualizations
- ✅ Cloud-backed (never lose data)

**Full Guide:** [PRACTICAL_USAGE.md](PRACTICAL_USAGE.md) - "Scenario 3"

---

## 📊 Google Sheets Integration - The Easy Way

### First-Time Setup (10 minutes)

**Step 1: Create Spreadsheet**
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new → Name it "STT Makati BMS Data"

**Step 2: Set Up Sheets**
- Download sample templates from dashboard Help modal
- Import samples to see proper format
- Or follow detailed setup: [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) - "First-Time Setup"

**Step 3: Test Integration**
1. Dashboard: Add test data → ⬇ Export CSV
2. Sheets: File → Import → Upload CSV
3. Sheets: File → Download → CSV
4. Dashboard: ⬆ Import CSV
5. ✅ Both directions work!

### Daily Sync - Two Ways

**Way 1: Dashboard → Sheets (Backup)**
```
1. Click ⬇ Export CSV in dashboard
2. Go to Google Sheets
3. File → Import → Upload tab
4. Select CSV file
5. Import settings: Separator = Comma
6. Click Import data
```

**Way 2: Sheets → Dashboard (Visualization)**
```
1. In Google Sheets: File → Download → CSV
2. Save to computer
3. In Dashboard: Click ⬆ Import CSV
4. Select downloaded file
5. Data loads automatically!
```

---

## 🤖 Automation (Advanced)

### Auto-Email Daily Summary

Want to get daily email at 6 AM with yesterday's stats?

**Setup (5 minutes):**
1. Google Sheets → Extensions → Apps Script
2. Copy script from: [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) - "Auto-Email Daily Summary"
3. Set trigger: Time-driven → Day timer → 6-7am
4. Done! Automatic emails ✅

### Auto-Alert on High Temperature

Want instant email when temperature >28°C?

**Setup (5 minutes):**
1. Google Sheets → Extensions → Apps Script
2. Copy script from: [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) - "Auto-Alert on High Temperature"
3. Set trigger: Time-driven → Hour timer
4. Done! Automatic alerts ✅

---

## 🎨 Understanding the Dashboard

### Color Coding System

**Temperature:**
- 🟢 Green: 22-26°C (Optimal)
- 🟡 Amber: 20-28°C (Acceptable)
- 🔴 Red: <20°C or >28°C (Critical - Check cooling!)

**Humidity:**
- 🟢 Green: 45-60% (Optimal)
- 🟡 Amber: 40-70% (Acceptable)
- 🔴 Red: <40% or >70% (Critical - Adjust HVAC!)

**PUE (Power Usage Effectiveness):**
- 🟢 Green: <1.5 (Excellent - World-class!)
- 🟡 Amber: 1.5-2.0 (Good)
- 🔴 Red: >2.0 (Needs improvement)

**Status Dot:**
- 🟢 Pulsing Green: Data logged today
- ⚫ Grey: No data yet

### What Each Section Does

**🔝 Sticky Header:**
- Live KPIs that update instantly
- Import/Export/Log buttons always accessible
- Live clock with date

**🏢 Hall Cards:**
- Click to highlight on charts
- Mini gauges show current status
- PUE badge appears when data logged

**⚡ Facility PUE:**
- Large glowing number = overall efficiency
- Bars show per-hall contribution

**📈 Trend Chart:**
- Toggle TEMP/HUM/PUE to compare
- All 5 halls on one chart
- Yellow dashed = benchmark lines

**📅 5-Day Summary:**
- Table of daily energy data
- PUE trend area chart
- Stacked energy breakdown

---

## 📱 Mobile Access

### Dashboard on Mobile
1. Open dashboard URL in mobile browser
2. Responsive design works on phones/tablets
3. All features work (log, import, export)

### Google Sheets Mobile App
1. Install Google Sheets app
2. Open "STT Makati BMS Data"
3. Log readings on the go
4. Auto-syncs to cloud

---

## 💡 Pro Tips

### Must-Know Tips

✅ **Export daily** - Dashboard data is in browser localStorage. Export to CSV daily!

✅ **Use Sheets for backup** - Google Sheets is cloud-backed. Never lose data.

✅ **Click hall cards** - Highlights them on trend chart. Great for comparing specific halls.

✅ **Download sample CSVs** - From Help modal. See proper format before logging.

✅ **Set up automated alerts** - Apps Script can email you when temp/humidity is out of range.

✅ **Target PUE <1.5** - World-class data centers achieve PUE of 1.2-1.5.

✅ **Log at consistent times** - Every hour on the hour for accurate trends.

✅ **Review trends weekly** - Look for patterns, anomalies, improvement opportunities.

### Time-Saving Shortcuts

- **Import yesterday's data first thing** - Continue from where you left off
- **Use Tab key** in log modal - Quick navigation between fields
- **Press Esc** to close modal - Keyboard shortcut
- **Screenshot dashboard for reports** - F11 for fullscreen, then screenshot
- **Share Sheets link** instead of CSV files - Easier collaboration

---

## 🆘 Troubleshooting

### "My data disappeared!"

**Problem:** Dashboard data is gone after closing browser.

**Solution:** 
1. Dashboard stores data in browser localStorage
2. If you cleared browser data, it's gone
3. **Always export to CSV daily!**
4. Import your last backup from Google Sheets

**Prevention:** Set daily reminder to export CSV

---

### "CSV import not working"

**Problem:** Import shows error or data doesn't load.

**Check:**
1. Is CSV format correct? (comma-separated)
2. Are headers exactly as expected?
3. Download sample CSV from Help modal
4. Compare your CSV to sample format

**Solution:** 
1. Open CSV in text editor
2. Verify format matches sample
3. Re-export from dashboard or Sheets if corrupted

---

### "PUE showing 0.00 or N/A"

**Problem:** PUE not calculating.

**Check:**
1. IT Load > 0 (can't divide by zero)
2. Total Power > IT Load (PUE must be ≥1.0)
3. Both values entered correctly

**Formula:** PUE = Total Power ÷ IT Load

---

### "No data on trend chart"

**Problem:** Chart is empty.

**Check:**
1. Have you logged readings? (Click + Log Reading)
2. Is correct metric selected? (TEMP/HUM/PUE toggle)
3. Is active hall filter enabled? (Click hall card to deselect)

**Solution:** Log some readings first!

---

### "Google Sheets formulas not working"

**Problem:** PUE or Total Utility not auto-calculating.

**Check:**
1. Formula in correct column? (H for PUE, B for Total Utility)
2. Cell references correct?
3. Data in expected columns?

**Solution:**
1. Hourly PUE (H2): `=IF(AND(F2>0, G2>0), ROUND(G2/F2, 2), "")`
2. Daily Total Utility (B2): `=C2+D2+E2+F2+G2`
3. Daily PUE (H2): `=IF(D2>0, ROUND(B2/D2, 2), "")`

---

## 📞 Quick Reference

### Common Tasks

| I want to... | Do this... |
|-------------|-----------|
| Log hourly reading | + Log Reading → Hourly → Fill → Save |
| Log daily energy | + Log Reading → Daily → Fill → Save |
| Backup to Sheets | ⬇ Export CSV → Sheets: File → Import |
| Load from Sheets | Sheets: Download CSV → ⬆ Import CSV |
| View trends | Toggle TEMP/HUM/PUE buttons |
| Compare halls | Click hall cards to highlight |
| See weekly energy | Switch to 5-Day Summary tab |
| Get help | Click 💜 Help button |
| Download samples | Help modal → Sample CSVs |

### Data Entry Schedule

| Time | Task | Where |
|------|------|-------|
| 9:00 AM | Import yesterday's backup | Dashboard |
| Hourly | Log Temp, Humidity, Power | Dashboard or Sheets |
| 6:00 PM | Export CSV | Dashboard |
| 6:05 PM | Import to Sheets | Google Sheets |
| Weekly | Log daily energy data | Dashboard or Sheets |
| Monthly | Generate report | Google Sheets |

### Support Resources

1. **In-App Help** - Click 💜 Help button
2. **Sample CSVs** - Download from Help modal
3. **Documentation** - All .md files in project
4. **Visual Guide** - [QUICK_START_VISUAL.md](QUICK_START_VISUAL.md)
5. **Full Manual** - [USER_GUIDE.md](USER_GUIDE.md)

---

## 🎓 Next Steps

### Just Starting?
1. ✅ Read this file (you're almost done!)
2. ✅ Open dashboard → Click Help button
3. ✅ Log your first reading
4. ✅ Export to CSV
5. ✅ Set up Google Sheets
6. ✅ Import CSV to Sheets
7. ✅ You're ready! 🎉

### Ready for Advanced Features?
1. Set up automated email alerts (Apps Script)
2. Create monthly report template in Sheets
3. Share dashboard link with team
4. Set up revision history review process
5. Create custom pivot tables for analysis

### Need Support?
- Read: [PRACTICAL_USAGE.md](PRACTICAL_USAGE.md) for real scenarios
- Check: [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) for advanced automation
- View: [QUICK_START_VISUAL.md](QUICK_START_VISUAL.md) for diagrams

---

**🎉 You're all set! Start logging and monitoring your data center!**

Remember: **Export daily, monitor hourly, review weekly, report monthly!**
