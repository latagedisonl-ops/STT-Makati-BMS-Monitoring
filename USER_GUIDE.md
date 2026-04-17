# 📖 STT Makati BMS Dashboard - User Guide

## 🎯 What This Dashboard Does

This BMS (Building Management System) Dashboard helps you monitor and analyze the performance of 5 data center halls (A, B, C, D, E) at STT Makati by tracking:
- **Temperature & Humidity** (hourly readings)
- **Power Usage** (IT Load, Total Power, PUE)
- **Energy Consumption** (daily readings for Cooling, IT, Others, SUPS Loss, TX Loss)

---

## 🚀 Getting Started

### Step 1: Log Your First Reading

1. **Click the "+ Log Reading" button** in the top-right header
2. Choose between two tabs:
   - **Hourly Tab**: For temperature, humidity, and power readings
   - **Daily Tab**: For energy consumption data

#### Logging Hourly Data
1. Select a **Hall** (A, B, C, D, or E)
2. Select the **Hour** (0-23)
3. Enter values:
   - **Temperature (°C)**: e.g., 24.5
   - **Humidity (%)**: e.g., 55
   - **IT Load (kW)**: e.g., 150
   - **Total Power (kW)**: e.g., 200
4. Watch the **PUE preview** calculate automatically (Total Power ÷ IT Load)
5. Click **"Save Hourly Log"**

#### Logging Daily Data
1. Select a **Date**
2. Enter energy values (kWh):
   - **Cooling**: e.g., 5000
   - **IT**: e.g., 4000
   - **Others**: e.g., 500
   - **SUPS Loss**: e.g., 300
   - **TX Loss**: e.g., 200
3. Watch **Total Utility** and **PUE** calculate automatically
4. Click **"Save Daily Log"**

---

## 📊 Understanding the Dashboard

### Live KPI Strip (Top of Page)
- **Avg PUE**: Average Power Usage Effectiveness across all halls (lower is better)
- **Avg Temp**: Average temperature across all halls
- **Avg Humidity**: Average humidity across all halls
- **Total IT Load**: Sum of all IT equipment power consumption

**Color Indicators:**
- 🟢 **Green**: Optimal range
- 🟡 **Amber**: Warning range
- 🔴 **Red**: Critical range

### Hall Cards (A-E)
Each card shows:
- **Temperature Bar**: 
  - Green: 22-26°C (optimal)
  - Amber: 20-22°C or 26-28°C (acceptable)
  - Red: <20°C or >28°C (critical)
- **Humidity Bar**:
  - Green: 45-60% (optimal)
  - Amber: 40-45% or 60-70% (acceptable)
  - Red: <40% or >70% (critical)
- **Status Dot**: 
  - 🟢 Pulsing green = data logged
  - ⚫ Grey = no data yet
- **PUE Badge**: Shows when hourly power data exists

**Click any hall card** to highlight it on the trend chart!

### Facility Average PUE
Large glowing number showing overall facility efficiency:
- **<1.5**: 🟢 Excellent (green glow)
- **1.5-2.0**: 🟡 Good (amber glow)
- **>2.0**: 🔴 Needs improvement (red glow)

The bars on the right show PUE contribution from each hall.

### Multi-Hall Trend Chart
- Toggle between **TEMP** / **HUM** / **PUE** to compare all 5 halls
- **Yellow dashed lines** = industry benchmarks:
  - Temperature: 26°C
  - Humidity: 60%
  - PUE: 1.83
- Each hall has a distinct color (A=cyan, B=blue, C=purple, D=pink, E=orange)

### 5-Day Summary Tab
Switch to this tab to view:
- **Energy Table**: Last 5 days of energy consumption with averages
- **PUE Trend**: Area chart showing daily PUE performance
- **Energy Breakdown**: Stacked bar chart showing energy distribution

---

## 💾 Working with CSV Files

### Exporting Data

1. **Click "⬇ Export CSV"** button
2. A CSV file downloads with all your data
3. The file is formatted for direct import into Google Sheets

**Export includes:**
- All hourly readings (Hall, Date, Hour, Temp, Humidity, IT Load, Total Power, PUE)
- All daily readings (Date, Total Utility, Cooling, IT, Others, SUPS Loss, TX Loss, PUE)

### Importing Data

1. **Click "⬆ Import CSV"** button
2. Select a CSV file from your computer
3. The app automatically detects format (hourly or daily)
4. Data is merged with existing records (duplicates are replaced)

---

## 🎯 Best Practices

### Daily Routine
1. **Morning (9 AM)**: Log yesterday's daily energy data
2. **Every Hour**: Log current temperature, humidity, and power readings
3. **End of Week**: Export to Google Sheets for backup and reporting

### Monitoring Tips
- Keep temperature between 22-26°C for optimal efficiency
- Maintain humidity between 45-60% to prevent static/condensation
- Target PUE below 1.5 for world-class efficiency
- Monitor the trend chart for unusual patterns

### Alert Thresholds
- 🚨 Temperature >28°C: Risk of equipment damage
- 🚨 Humidity <40%: Static electricity risk
- 🚨 Humidity >70%: Condensation risk
- 🚨 PUE >2.0: Poor energy efficiency

---

## 🔧 Troubleshooting

**Q: No data showing on charts?**
- Make sure you've logged readings using "+ Log Reading"
- Check that you're viewing the correct metric (TEMP/HUM/PUE)

**Q: PUE showing as "N/A"?**
- PUE requires both IT Load and Total Power values
- Make sure Total Power > IT Load

**Q: CSV import not working?**
- Verify CSV format matches the export format
- Check for proper headers and comma separation

**Q: Live clock not showing?**
- Refresh the page
- Check browser JavaScript is enabled

---

## 📞 Quick Reference

### Optimal Ranges
| Metric | Optimal | Acceptable | Critical |
|--------|---------|------------|----------|
| Temperature | 22-26°C | 20-28°C | <20°C or >28°C |
| Humidity | 45-60% | 40-70% | <40% or >70% |
| PUE | <1.5 | 1.5-2.0 | >2.0 |

### Data Entry Schedule
- **Hourly**: Temperature, Humidity, IT Load, Total Power
- **Daily**: Total Utility, Cooling, IT, Others, SUPS Loss, TX Loss

### Keyboard Shortcuts
- Click hall cards to highlight them
- Use tab to navigate between input fields in the modal
- Press Escape to close modal
