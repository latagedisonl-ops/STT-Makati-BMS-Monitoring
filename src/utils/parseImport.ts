// Robust CSV / PDF text parser with auto-detection for the BMS dashboard.
// Handles:
//   - delimiter auto-detection (comma, semicolon, tab, pipe, two-or-more spaces)
//   - flexible column ordering via fuzzy header matching
//   - multiple date formats (ISO, DD/MM/YYYY, DD-MM-YYYY, "17 Apr '26" …)
//   - section headers ("Hourly Logs", "Daily Summary" …) to switch mode
//   - PDF text-layer exports (spaces-as-delimiter fallback)
//   - graceful row-level errors with skipped/warnings counts

export interface HallEntry {
  temp: number; hum: number; itLoad: number; totalPwr: number; pue: number;
}
export interface DayEntry {
  date: string; totalUtility: number; cooling: number; it: number;
  others: number; supsLoss: number; txLoss: number; pue: number;
}
export type HourlyMap = Record<string, Record<string, HallEntry>>;

export interface ParseResult {
  hourly: HourlyMap;
  daily: DayEntry[];
  skipped: number;
  warnings: string[];
  format: "csv" | "pdf-text" | "mixed" | "unknown";
  detectedSections: ("hourly" | "daily")[];
}

const HALL_IDS = new Set(["A","B","C","D","E"]);
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Helpers ─────────────────────────────────────────────────────────────────
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function detectDelimiter(sample: string): string {
  const candidates = [",", ";", "\t", "|"];
  const lines = sample.split(/\r?\n/).filter(l => l.trim()).slice(0, 10);
  let best = ",", bestScore = 0;
  for (const d of candidates) {
    const counts = lines.map(l => (l.match(new RegExp(`\\${d}`, "g")) || []).length);
    if (counts.length === 0) continue;
    const avg = counts.reduce((a,b)=>a+b,0) / counts.length;
    const variance = counts.reduce((a,c)=>a+Math.abs(c-avg),0) / counts.length;
    // prefer: high count, low variance
    const score = avg - variance * 0.8;
    if (score > bestScore) { bestScore = score; best = d; }
  }
  // Fallback: PDF text layer often has multiple spaces between columns
  if (bestScore < 1) {
    const spaced = lines.some(l => /\s{2,}/.test(l));
    if (spaced) return "__SPACES__";
  }
  return best;
}

function splitRow(line: string, delim: string): string[] {
  if (delim === "__SPACES__") return line.trim().split(/\s{2,}/).map(c => c.trim());
  // naive quoted-field aware split
  const out: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === delim && !inQ) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(c => c.trim().replace(/^"|"$/g, ""));
}

// Try to parse into a consistent date label like "17 Apr '26" (matches App fmtDate)
function parseDateLabel(raw: string): string | null {
  if (!raw) return null;
  const s = raw.trim();

  // Already formatted e.g. "17 Apr '26"
  if (/^\d{1,2}\s+[A-Za-z]{3}\s+'?\d{2,4}$/.test(s)) return s;

  // ISO yyyy-mm-dd
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) {
    const y = +m[1], mo = +m[2], d = +m[3];
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
      return `${String(d).padStart(2,"0")} ${MONTHS[mo-1]} '${String(y).slice(2)}`;
    }
  }

  // dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (m) {
    const d = +m[1], mo = +m[2], y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
      return `${String(d).padStart(2,"0")} ${MONTHS[mo-1]} '${String(y).slice(2)}`;
    }
  }

  // "17 April 2026" or "April 17, 2026"
  const t = Date.parse(s);
  if (!isNaN(t)) {
    const dt = new Date(t);
    return `${String(dt.getDate()).padStart(2,"0")} ${MONTHS[dt.getMonth()]} '${String(dt.getFullYear()).slice(2)}`;
  }

  return null;
}

function parseHour(raw: string): string | null {
  if (!raw) return null;
  const s = raw.trim();
  // "08:00"
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h] = s.split(":"); return `${h.padStart(2,"0")}:00`;
  }
  // "8" or "08"
  if (/^\d{1,2}$/.test(s)) {
    const h = +s;
    if (h >= 0 && h <= 23) return `${String(h).padStart(2,"0")}:00`;
  }
  // "8am" / "8pm"
  const ap = s.match(/^(\d{1,2})\s*(am|pm)$/i);
  if (ap) {
    let h = +ap[1]; if (ap[2].toLowerCase() === "pm" && h < 12) h += 12;
    if (ap[2].toLowerCase() === "am" && h === 12) h = 0;
    return `${String(h).padStart(2,"0")}:00`;
  }
  return null;
}

// Map a header row → canonical field name indices
const HEADER_ALIASES: Record<string, string[]> = {
  hall:         ["hall", "datahall", "room"],
  hour:         ["hour", "time", "hr", "timeslot"],
  date:         ["date", "day", "reportdate"],
  temp:         ["temp", "temperature", "tempc", "temperaturec"],
  hum:          ["hum", "humidity", "rh", "humiditypct"],
  itload:       ["it", "itload", "itkw", "itloadkw", "itpower", "itkwh"],
  totalpwr:     ["totalpower", "totalpwr", "pwr", "totalkw"],
  totalutility: ["totalutility", "utility", "gridkwh", "totalkwh", "totalutilitykwh", "utilitykwh"],
  cooling:      ["cooling", "coolingkwh", "hvac"],
  others:       ["others", "miscellaneous", "misc", "otherskwh"],
  supsloss:     ["supsloss", "sups", "upsloss", "ups", "supslosskwh"],
  txloss:       ["txloss", "transformerloss", "tx", "txlosskwh"],
  pue:          ["pue"],
};

function mapHeader(cols: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  cols.forEach((c, i) => {
    const n = norm(c);
    for (const [canon, aliases] of Object.entries(HEADER_ALIASES)) {
      if (map[canon] !== undefined) continue;
      if (aliases.some(a => n === a || n.includes(a))) {
        map[canon] = i;
        break;
      }
    }
  });
  return map;
}

function isHourlyHeader(map: Record<string, number>): boolean {
  return map.hall !== undefined && (map.temp !== undefined || map.itload !== undefined || map.totalpwr !== undefined);
}
function isDailyHeader(map: Record<string, number>): boolean {
  return map.date !== undefined && (map.cooling !== undefined || map.totalutility !== undefined || map.supsloss !== undefined);
}

// ── Main API ────────────────────────────────────────────────────────────────
export function parseImport(text: string): ParseResult {
  const result: ParseResult = {
    hourly: {}, daily: [], skipped: 0, warnings: [],
    format: "unknown", detectedSections: [],
  };
  if (!text?.trim()) { result.warnings.push("File appears empty."); return result; }

  const lines = text.split(/\r?\n/).map(l => l.replace(/﻿/g, "")).filter(l => l.trim());
  if (!lines.length) { result.warnings.push("No content to parse."); return result; }

  const delim = detectDelimiter(text);
  result.format = delim === "__SPACES__" ? "pdf-text" : "csv";

  type Mode = "hourly" | "daily" | "unknown";
  let mode: Mode = "unknown";
  let header: Record<string, number> = {};

  const setMode = (m: Mode) => {
    if (mode !== m && m !== "unknown") {
      if (!result.detectedSections.includes(m)) result.detectedSections.push(m);
    }
    mode = m;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;

    // Section divider lines like "Hourly Logs", "=== Daily Summary ==="
    const lower = raw.toLowerCase();
    if (!/\d/.test(raw) && raw.length < 60) {
      if (/(hourly|hour|per-?hour)/.test(lower)) { setMode("hourly"); header = {}; continue; }
      if (/(daily|day|24h|energy|summary|utility)/.test(lower) && !lower.includes("hall")) {
        setMode("daily"); header = {}; continue;
      }
    }

    const cols = splitRow(raw, delim);

    // Header row (no numbers in cells that look like values)
    const looksLikeHeader = cols.every(c => c === "" || /^[A-Za-z][A-Za-z0-9()°%\/_\-\s]*$/.test(c));
    if (looksLikeHeader && cols.length >= 3) {
      const m = mapHeader(cols);
      if (isHourlyHeader(m)) { setMode("hourly"); header = m; continue; }
      if (isDailyHeader(m))  { setMode("daily");  header = m; continue; }
      // unknown header — skip
      continue;
    }

    try {
      let rowMode: "hourly" | "daily";
      if (mode === "unknown") {
        // infer by shape
        if (cols.length >= 7 && /[A-E]/i.test(cols[0]) && cols.some(c => /:/.test(c))) {
          rowMode = "hourly"; setMode("hourly");
        } else if (cols.length >= 6 && parseDateLabel(cols[0])) {
          rowMode = "daily"; setMode("daily");
        } else {
          result.skipped++; continue;
        }
      } else {
        rowMode = mode;
      }

      if (rowMode === "hourly") {
        const hallRaw = header.hall !== undefined ? cols[header.hall]
                      : cols.find(c => HALL_IDS.has(c.trim().toUpperCase()))
                        ?? cols[1];
        const hall = (hallRaw || "").trim().toUpperCase();
        if (!HALL_IDS.has(hall)) { result.skipped++; continue; }

        const hour = header.hour !== undefined
          ? parseHour(cols[header.hour])
          : parseHour(cols.find(c => /^\d{1,2}(:\d{2})?$/.test(c) || /am|pm/i.test(c)) || "");
        if (!hour) { result.skipped++; continue; }

        const num = (idx: number | undefined, fb?: number) =>
          idx !== undefined ? parseFloat(cols[idx]) : (fb !== undefined ? parseFloat(cols[fb]) : NaN);

        const temp = num(header.temp);
        const hum  = num(header.hum);
        const it   = num(header.itload);
        const tp   = num(header.totalpwr);
        const pueC = header.pue !== undefined ? parseFloat(cols[header.pue]) : NaN;

        if ([temp, hum, it, tp].some(v => isNaN(v))) { result.skipped++; continue; }
        const pue = !isNaN(pueC) ? pueC : +(tp / it).toFixed(2);

        if (!result.hourly[hour]) result.hourly[hour] = {};
        result.hourly[hour][hall] = { temp, hum, itLoad: it, totalPwr: tp, pue };

      } else if (rowMode === "daily") {
        const dateRaw = header.date !== undefined ? cols[header.date] : cols[0];
        const label = parseDateLabel(dateRaw);
        if (!label) { result.skipped++; continue; }

        const g = (idx: number | undefined) => idx !== undefined ? parseFloat(cols[idx]) : NaN;
        const total = g(header.totalutility);
        const cool  = g(header.cooling);
        const it    = g(header.itload);
        const oth   = g(header.others);
        const sups  = g(header.supsloss);
        const tx    = g(header.txloss);
        const pueC  = g(header.pue);

        if ([cool, it, oth, sups, tx].some(v => isNaN(v))) { result.skipped++; continue; }
        const totalUtility = !isNaN(total) ? total : cool + it + oth + sups + tx;
        const pue = !isNaN(pueC) ? pueC : +(totalUtility / it).toFixed(2);

        result.daily.push({
          date: label, totalUtility, cooling: cool, it,
          others: oth, supsLoss: sups, txLoss: tx, pue,
        });
      }
    } catch (err) {
      result.skipped++;
      if (result.warnings.length < 5) result.warnings.push(`Row ${i + 1}: ${(err as Error).message}`);
    }
  }

  if (result.detectedSections.length > 1) result.format = "mixed";
  return result;
}
