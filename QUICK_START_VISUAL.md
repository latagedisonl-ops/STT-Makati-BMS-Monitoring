# 🎯 STT Makati BMS Dashboard - Visual Quick Start

## 🖥️ Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔝 STICKY HEADER                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  [🖥️ Server Icon]  BMS MONITORING                                   │
│                    FOR STT MAKATI                                   │
│                                                                     │
│  ┌────────────────────────────────────────────────────┐            │
│  │ 📊 KPI STRIP (Updates Live!)                       │            │
│  │ Avg PUE: 1.42  │  Avg Temp: 24.5°C  │  Avg Hum: 55%│            │
│  │                │  Total IT Load: 860 kW            │            │
│  └────────────────────────────────────────────────────┘            │
│                                                                     │
│  [💜 Help] [⬆ Import CSV] [⬇ Export CSV] [➕ Log Reading]         │
│                                              🕐 14:23:45            │
│                                              FRI, 17 APR 2026       │
├─────────────────────────────────────────────────────────────────────┤
│  🏢 HALL CARDS (Click to activate!)                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                      │
│  │ 🟢 A│  │ 🟢 B│  │ 🟢 C│  │ 🟢 D│  │ 🟢 E│                      │
│  │ 24°C│  │ 25°C│  │ 24°C│  │ 23°C│  │ 25°C│                      │
│  │ 55% │  │ 58% │  │ 52% │  │ 56% │  │ 54% │                      │
│  │█████│  │█████│  │█████│  │█████│  │█████│ ← Temp gauge         │
│  │█████│  │█████│  │█████│  │█████│  │█████│ ← Humidity gauge    │
│  │ PUE │  │ PUE │  │ PUE │  │ PUE │  │ PUE │                      │
│  │ 1.33│  │ 1.35│  │ 1.45│  │ 1.38│  │ 1.42│                      │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘                      │
├─────────────────────────────────────────────────────────────────────┤
│  ⚡ FACILITY AVERAGE PUE          📈 MULTI-HALL TREND CHART        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐    ┌────────────────────────────┐   │
│  │        1.42              │    │ [TEMP] [HUM] [PUE] ←Toggle │   │
│  │    ╔═══════════╗         │    │                             │   │
│  │    ║  ✨ PUE   ║         │    │  28°C ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄     │   │
│  │    ╚═══════════╝         │    │  26°C ━━━━━━━━━━━━━━━━     │   │
│  │   🟢 Glowing green       │    │  24°C      A ╱╲             │   │
│  │      (excellent!)        │    │  22°C     ╱  ╲  B          │   │
│  │                          │    │  20°C  ━━━━━━━━━━━━━       │   │
│  │ Per-Hall Breakdown:      │    │        0  4  8  12 16       │   │
│  │ A ████████░░ 1.33        │    │        Hour of Day          │   │
│  │ B █████████░ 1.35        │    │                             │   │
│  │ C ██████████ 1.45        │    │ Yellow dashed = Benchmark   │   │
│  │ D █████████░ 1.38        │    │ Click hall cards to focus!  │   │
│  │ E █████████░ 1.42        │    └────────────────────────────┘   │
│  └──────────────────────────┘                                      │
├─────────────────────────────────────────────────────────────────────┤
│  📅 5-DAY SUMMARY TAB (Click to switch)                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Date       │Total Utility│Cooling│IT  │Others│SUPS│TX │PUE│   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ 2026-04-13 │ 10000       │ 5000  │4000│ 500  │300 │200│1.43│   │
│  │ 2026-04-14 │  9800       │ 4900  │3950│ 480  │290 │180│1.42│   │
│  │ 2026-04-15 │ 10200       │ 5100  │4050│ 510  │310 │230│1.44│   │
│  │ 2026-04-16 │  9900       │ 4950  │4000│ 490  │280 │180│1.42│   │
│  │ 2026-04-17 │ 10100       │ 5050  │4020│ 500  │300 │230│1.43│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📊 5-Day PUE Area Chart         📊 Energy Breakdown Bars         │
│  (Color-coded dots: green/amber/red)                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📥 Log Reading Modal

### When you click "+ Log Reading":

```
┌─────────────────────────────────────────────────────────┐
│  ➕ Log New Reading                              [✖]    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┬─────────────┐                         │
│  │ 🕐 HOURLY   │ 📅 DAILY    │  ← Two Tabs             │
│  └─────────────┴─────────────┘                         │
│                                                         │
│  🕐 HOURLY TAB (Temperature, Humidity, Power):         │
│  ┌────────────────────────────────────────────────┐    │
│  │ Select Hall:  [▼ A ▼]                         │    │
│  │ Select Hour:  [▼ 14 ▼]                        │    │
│  │                                                │    │
│  │ Temperature (°C):  [ 24.5  ]                  │    │
│  │ Humidity (%):      [ 55    ]                  │    │
│  │ IT Load (kW):      [ 150   ]                  │    │
│  │ Total Power (kW):  [ 200   ]                  │    │
│  │                                                │    │
│  │ ┌──────────────────────────────────────┐      │    │
│  │ │ 📊 LIVE PREVIEW                      │      │    │
│  │ │                                      │      │    │
│  │ │ Calculated PUE: 1.33                 │      │    │
│  │ │ Status: 🟢 Excellent                 │      │    │
│  │ └──────────────────────────────────────┘      │    │
│  │                                                │    │
│  │         [💾 Save Hourly Log]                  │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  📅 DAILY TAB (Energy Consumption):                    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Select Date:  [📅 2026-04-17]                 │    │
│  │                                                │    │
│  │ Cooling (kWh):    [ 5000  ]                   │    │
│  │ IT (kWh):         [ 4000  ]                   │    │
│  │ Others (kWh):     [ 500   ]                   │    │
│  │ SUPS Loss (kWh):  [ 300   ]                   │    │
│  │ TX Loss (kWh):    [ 200   ]                   │    │
│  │                                                │    │
│  │ ┌──────────────────────────────────────┐      │    │
│  │ │ 📊 LIVE PREVIEW                      │      │    │
│  │ │                                      │      │    │
│  │ │ Total Utility: 10000 kWh            │      │    │
│  │ │ Calculated PUE: 1.43                 │      │    │
│  │ │ Status: 🟢 Good                      │      │    │
│  │ └──────────────────────────────────────┘      │    │
│  │                                                │    │
│  │         [💾 Save Daily Log]                   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Google Sheets Integration Flow

### Workflow 1: Dashboard → Sheets (Backup)

```
┌─────────────────┐
│  BMS Dashboard  │  You log data here all day
└────────┬────────┘
         │ End of day
         ▼
┌─────────────────┐
│ ⬇ Export CSV   │  Click button
└────────┬────────┘
         │ File downloads: bms-data-export.csv
         ▼
┌─────────────────┐
│ Google Sheets   │  File → Import → Upload
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ Data Backed  │  Safe in the cloud!
│    Up & Stored  │
└─────────────────┘
```

### Workflow 2: Sheets → Dashboard (Visualization)

```
┌─────────────────┐
│ Google Sheets   │  Team logs data collaboratively
└────────┬────────┘
         │ Need to visualize?
         ▼
┌─────────────────┐
│ File → Download │  CSV format
│     → CSV       │
└────────┬────────┘
         │ File downloads
         ▼
┌─────────────────┐
│  BMS Dashboard  │  ⬆ Import CSV
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✨ Beautiful    │  Charts, gauges, trend analysis!
│    Visuals!     │
└─────────────────┘
```

---

## 🎨 Color Coding System

### Temperature Gauge
```
🟢 GREEN   (22-26°C)   ████████████████  Optimal
🟡 AMBER   (20-28°C)   ████████░░░░░░░░  Acceptable
🔴 RED     (<20/>28°C) ████░░░░░░░░░░░░  Critical
```

### Humidity Gauge
```
🟢 GREEN   (45-60%)    ████████████████  Optimal
🟡 AMBER   (40-70%)    ████████░░░░░░░░  Acceptable
🔴 RED     (<40/>70%)  ████░░░░░░░░░░░░  Critical
```

### PUE Badge
```
🟢 GREEN   (<1.5)      ████████████████  Excellent
🟡 AMBER   (1.5-2.0)   ████████░░░░░░░░  Good
🔴 RED     (>2.0)      ████░░░░░░░░░░░░  Needs Improvement
```

### Status Dot
```
🟢 PULSING GREEN       Data logged today
⚫ GREY                No data yet
```

---

## 📝 Step-by-Step: Your First Hour

### Minute 0-5: Open Dashboard
1. Open the BMS Dashboard in your browser
2. Bookmark it for easy access
3. Click the 💜 **Help** button to see this guide

### Minute 5-10: Log First Reading
1. Walk to Hall A with your tablet
2. Note: Temp = 24.5°C, Humidity = 55%
3. Check power meter: IT Load = 150kW, Total = 200kW
4. Back at computer, click **+ Log Reading**
5. Select **Hourly** tab
6. Fill in: Hall A, Hour 14, all values
7. See PUE preview: 1.33 🟢 Excellent!
8. Click **Save Hourly Log**

### Minute 10-30: Repeat for All Halls
- Hall B: Same process
- Hall C: Same process
- Hall D: Same process
- Hall E: Same process

### Minute 30-35: Review Dashboard
1. Look at hall cards - all should have 🟢 pulsing dots
2. Check Live KPIs - they updated!
3. View Facility Average PUE - glowing green number
4. Toggle trend chart: TEMP → HUM → PUE
5. Click different hall cards to highlight them

### Minute 35-40: Export Backup
1. Click **⬇ Export CSV**
2. File downloads
3. Open Google Sheets
4. File → Import → Upload your CSV
5. Done! Data backed up ✅

### Minute 40-45: Set Reminder
- Set phone reminder: "Log BMS readings" at every hour
- Set daily reminder: "Export BMS to Sheets" at 6 PM

---

## 🔄 Daily Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  MORNING (9:00 AM)                                          │
├─────────────────────────────────────────────────────────────┤
│  1. Open Dashboard                                          │
│  2. Import yesterday's backup from Google Sheets           │
│  3. Review overnight trends                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  HOURLY (Every Hour 9:00-18:00)                             │
├─────────────────────────────────────────────────────────────┤
│  1. Walk through halls                                      │
│  2. Note: Temp, Humidity, IT Load, Total Power              │
│  3. Click + Log Reading → Hourly Tab                        │
│  4. Log for each hall                                       │
│  5. Check dashboard KPIs updated                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  EVENING (18:00)                                            │
├─────────────────────────────────────────────────────────────┤
│  1. Review trend charts for anomalies                       │
│  2. Click ⬇ Export CSV                                     │
│  3. Import to Google Sheets for backup                      │
│  4. Done for the day! ✅                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  WEEKLY (Monday)                                            │
├─────────────────────────────────────────────────────────────┤
│  1. Gather last week's energy meter readings               │
│  2. Click + Log Reading → Daily Tab                         │
│  3. Log energy data for each day                            │
│  4. Switch to 5-Day Summary tab                             │
│  5. Take screenshot for management report                   │
│  6. Export to Google Sheets                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Pro Tips Illustrated

### Tip 1: Click Hall Cards to Highlight
```
Before:                      After clicking Hall C:
┌─────┐ ┌─────┐ ┌─────┐    ┌─────┐ ┌─────┐ ┌─────┐
│ 🟢 A│ │ 🟢 B│ │ 🟢 C│    │  ⚫ A│ │  ⚫ B│ │ ✨ C│
└─────┘ └─────┘ └─────┘    └─────┘ └─────┘ └─────┘

Chart shows all 5:          Chart highlights C:
 ╱ A                         ╱╱╱ (dimmed)
╱ B                         ╱ (dimmed)
╱ C                         ╱ C ← BOLD HIGHLIGHTED
╱ D                         ╱ (dimmed)
╱ E                         ╱╱╱ (dimmed)
```

### Tip 2: Toggle Chart Metrics
```
[TEMP] [HUM] [PUE]     Click HUM →    [TEMP] [HUM] [PUE]
  ↑                                            ↑
Active (blue)                              Active (blue)

Chart shows                Chart shows
temperatures               humidity
```

### Tip 3: Watch Live Updates
```
Before logging:            After logging Hall A:

KPIs:                      KPIs:
Avg PUE: 0.00             Avg PUE: 1.33 ← Updated!
Avg Temp: 0.0°C           Avg Temp: 24.5°C ← Updated!

Hall A:                    Hall A:
⚫ NO DATA                🟢 LIVE DATA
                          24.5°C
                          55%
                          PUE 1.33
```

---

## 🎯 Common Tasks Quick Reference

| Task | Steps |
|------|-------|
| **Log hourly reading** | + Log Reading → Hourly → Fill form → Save |
| **Log daily energy** | + Log Reading → Daily → Fill form → Save |
| **Export to Sheets** | ⬇ Export CSV → Sheets: File → Import |
| **Import from Sheets** | Sheets: File → Download CSV → Dashboard: ⬆ Import |
| **Check hall status** | Look at hall card dot: 🟢 = data, ⚫ = no data |
| **View trends** | Toggle TEMP/HUM/PUE buttons on chart |
| **Highlight a hall** | Click the hall card |
| **View 5-day summary** | Click "5-Day Summary" tab |
| **Get help** | Click purple "Help" button |
| **Download samples** | Help modal → Download sample CSVs |

---

## 🚨 Alert Indicators

Watch for these warning signs:

```
❌ RED TEMPERATURE BAR          🔥 Temperature >28°C - CHECK COOLING!
❌ RED HUMIDITY BAR            💧 Humidity <40% or >70% - ADJUST HVAC!
❌ RED PUE BADGE               ⚡ PUE >2.0 - INVESTIGATE EFFICIENCY!
⚫ GREY STATUS DOT             📋 No data logged - LOG READINGS!
```

---

**Need more details?** Check the full documentation files:
- [USER_GUIDE.md](USER_GUIDE.md) - Complete manual
- [GOOGLE_SHEETS_INTEGRATION.md](GOOGLE_SHEETS_INTEGRATION.md) - Sheets guide
- [PRACTICAL_USAGE.md](PRACTICAL_USAGE.md) - Real workflows

**Or click the 💜 Help button in the dashboard!**
