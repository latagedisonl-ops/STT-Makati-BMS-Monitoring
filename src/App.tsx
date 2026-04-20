import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import WelcomePage from "./WelcomePage";
import { SAMPLE_HOURLY, SAMPLE_DAILY } from "./sampleData";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const HALLS = [
  { id:"A", color:"#00e5ff", glow:"rgba(0,229,255,0.35)" },
  { id:"B", color:"#a3e635", glow:"rgba(163,230,53,0.35)" },
  { id:"C", color:"#f97316", glow:"rgba(249,115,22,0.35)" },
  { id:"D", color:"#e879f9", glow:"rgba(232,121,249,0.35)" },
  { id:"E", color:"#facc15", glow:"rgba(250,204,21,0.35)" },
];
const HOURS   = Array.from({length:24},(_,i)=>`${String(i).padStart(2,"0")}:00`);
const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SC      = { ok:"#a3e635", warn:"#facc15", crit:"#f43f5e" };

// ── STATUS ────────────────────────────────────────────────────────────────────
const getTempStatus = (v:number) => v>30?"crit":v>26?"warn":"ok";
const getHumStatus  = (v:number) => (v>70||v<30)?"warn":"ok";
const getPueStatus  = (v:number) => v>1.83?"crit":v>1.6?"warn":"ok";

function fmtDate(dt:Date){ return `${String(dt.getDate()).padStart(2,"0")} ${MONTHS[dt.getMonth()]} '${String(dt.getFullYear()).slice(2)}`; }
function isoToLabel(iso:string){ const [y,m,d]=iso.split("-"); return `${d} ${MONTHS[parseInt(m)-1]} '${y.slice(2)}`; }

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface HallEntry { temp:number; hum:number; itLoad:number; totalPwr:number; pue:number; }
interface DayEntry  { date:string; totalUtility:number; cooling:number; it:number; others:number; supsLoss:number; txLoss:number; pue:number; }

// ── MINI BAR ──────────────────────────────────────────────────────────────────
const MiniBar = ({ value, min, max, color, label, unit }:
  { value?:number; min:number; max:number; color:string; label:string; unit:string }) => {
  const pct = value!=null ? Math.min(100,Math.max(0,((value-min)/(max-min))*100)) : 0;
  return (
    <div style={{ marginBottom:5 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9,
        fontFamily:"'Share Tech Mono',monospace", marginBottom:2 }}>
        <span style={{ color:"#4a6280" }}>{label}</span>
        <span style={{ color, fontWeight:700 }}>{value??'—'}{unit}</span>
      </div>
      <div style={{ height:5, background:"#1a2d4a", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:3,
          boxShadow:`0 0 6px ${color}`, transition:"width .5s ease" }}/>
      </div>
    </div>
  );
};

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
const CTip = ({ active, payload, label }:any) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{ background:"#0a1628", border:"1px solid #1a2d4a", padding:"8px 12px",
      borderRadius:3, fontFamily:"'Share Tech Mono',monospace", fontSize:11,
      boxShadow:"0 4px 24px rgba(0,0,0,.7)" }}>
      <div style={{ color:"#4a6280", fontSize:10, marginBottom:4 }}>{label}</div>
      {payload.map((p:any,i:number)=>(
        <div key={i} style={{ color:p.color }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#060b14;overflow-x:hidden;}
:root{--bg:#060b14;--panel:#0a1628;--panel2:#0d1e35;--border:#1a2d4a;--accent:#00e5ff;--dim:#2a4060;--text:#c8dff0;--muted:#4a6280;}
.root{font-family:'Barlow Condensed',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.hdr{background:rgba(10,22,40,0.97);border-bottom:1px solid var(--border);backdrop-filter:blur(12px);position:sticky;top:0;z-index:200;box-shadow:0 2px 30px rgba(0,0,0,.9);}
.hdr-main{display:flex;align-items:center;padding:0 20px;height:56px;gap:14px;}
.brand{display:flex;align-items:center;gap:10px;min-width:190px;}
.brand-txt .t1{font-size:14px;font-weight:900;letter-spacing:4px;color:var(--accent);text-shadow:0 0 14px rgba(0,229,255,.4);display:block;line-height:1.1;}
.brand-txt .t2{font-size:8px;letter-spacing:3px;color:var(--muted);display:block;}
.vsep{width:1px;height:30px;background:var(--border);flex-shrink:0;}
.kpi-strip{display:flex;flex:1;justify-content:center;}
.kpi-item{padding:3px 16px;border-right:1px solid var(--border);text-align:center;}
.kpi-item:last-child{border-right:none;}
.kl{font-size:8px;letter-spacing:2px;color:var(--muted);display:block;}
.kv{font-size:18px;font-weight:900;font-family:'Share Tech Mono',monospace;display:block;line-height:1.15;}
.hdr-right{display:flex;align-items:center;gap:7px;min-width:200px;justify-content:flex-end;}
.clk-blk{text-align:right;}
.clk-t{font-family:'Share Tech Mono',monospace;font-size:19px;color:var(--accent);text-shadow:0 0 10px rgba(0,229,255,.4);display:block;line-height:1;}
.clk-d{font-size:8px;letter-spacing:1.5px;color:var(--muted);display:block;margin-top:1px;}
.live-pill{display:flex;align-items:center;gap:5px;font-size:8px;letter-spacing:2px;color:var(--muted);padding:3px 8px;border:1px solid var(--border);border-radius:2px;}
.dot{width:6px;height:6px;border-radius:50%;background:#a3e635;box-shadow:0 0 7px #a3e635;animation:blink 1.4s ease-in-out infinite;}
.dot.off{background:#2a4060;box-shadow:none;animation:none;}
@keyframes blink{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.2;transform:scale(.5);}}
.tabs-bar{display:flex;padding:0 20px;background:rgba(10,22,40,.95);border-bottom:1px solid var(--border);}
.tab{padding:9px 20px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;color:var(--muted);transition:all .15s;user-select:none;}
.tab.on{color:var(--accent);border-bottom-color:var(--accent);}
.tab:hover:not(.on){color:var(--text);}
.body{padding:14px 20px 50px;}
.panel{background:var(--panel);border:1px solid var(--border);border-radius:4px;padding:15px 17px;}
.ptitle{font-size:10px;font-weight:700;letter-spacing:3px;color:var(--muted);text-transform:uppercase;margin-bottom:11px;display:flex;align-items:center;gap:8px;}
.ptitle::after{content:'';flex:1;height:1px;background:var(--border);}
.halls{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:12px;}
.hcard{background:var(--panel);border:1px solid var(--border);border-radius:5px;padding:14px 13px 11px;cursor:pointer;transition:border-color .2s,box-shadow .2s;position:relative;overflow:hidden;user-select:none;}
.hcard-top{position:absolute;top:0;left:0;right:0;height:3px;}
.hcard-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;}
.hid{font-size:22px;font-weight:900;letter-spacing:2px;line-height:1;}
.hcard-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
.pue-badge{font-size:9px;font-family:'Share Tech Mono',monospace;padding:2px 7px;border-radius:2px;letter-spacing:.5px;font-weight:700;}
.hcard-foot{display:flex;justify-content:space-between;margin-top:8px;font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--muted);}
.pue-section{margin-bottom:12px;background:linear-gradient(135deg,#0a1628 60%,#0d1e35);border:1px solid var(--border);border-radius:5px;padding:20px 24px;display:flex;align-items:center;gap:28px;}
.pue-left{flex:0 0 auto;min-width:180px;}
.pue-sub-lbl{font-size:8px;letter-spacing:3px;color:var(--muted);margin-bottom:6px;display:block;}
.pue-val{font-size:80px;font-weight:900;font-family:'Share Tech Mono',monospace;line-height:.9;}
.pue-name{font-size:9px;letter-spacing:2px;color:var(--muted);margin-top:5px;display:block;}
.pue-target{font-size:9px;color:var(--muted);margin-top:6px;letter-spacing:.8px;display:block;}
.pue-legend{display:flex;gap:12px;margin-top:10px;}
.pue-legend span{font-size:8.5px;letter-spacing:.3px;}
.pue-divider{width:1px;align-self:stretch;background:var(--border);flex-shrink:0;}
.pue-bars{flex:1;}
.pue-bars-lbl{font-size:8px;letter-spacing:3px;color:var(--muted);margin-bottom:8px;}
.pr{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(26,45,74,.5);}
.pr-id{width:24px;font-size:12px;font-weight:900;letter-spacing:2px;}
.pr-bg{flex:1;height:8px;background:#1a2d4a;border-radius:4px;overflow:hidden;}
.pr-fg{height:100%;border-radius:4px;transition:width .6s ease;}
.pr-val{width:36px;text-align:right;font-family:'Share Tech Mono',monospace;font-size:13px;font-weight:900;}
.pr-pill{padding:1px 6px;border-radius:2px;font-size:8px;letter-spacing:1px;font-weight:700;min-width:32px;text-align:center;}
.trend-panel{margin-bottom:12px;}
.mtabs{display:flex;gap:4px;}
.mtab{background:#060b14;border:1px solid #1a2d4a;border-radius:2px;padding:3px 10px;cursor:pointer;font-size:9px;font-weight:700;letter-spacing:1px;font-family:'Barlow Condensed',sans-serif;transition:all .15s;color:#4a6280;}
.mtab.on{border-color:#00e5ff;color:#00e5ff;background:rgba(0,229,255,.08);}
.chart-legend{display:flex;gap:14px;margin-top:7px;justify-content:center;flex-wrap:wrap;}
.chart-legend span{font-size:9px;font-family:'Share Tech Mono',monospace;letter-spacing:.5px;}
.tbl-wrap{overflow-x:auto;margin-bottom:14px;}
.dtbl{width:100%;border-collapse:collapse;font-family:'Share Tech Mono',monospace;font-size:11px;white-space:nowrap;}
.dtbl th{padding:7px 11px;color:var(--muted);font-size:8px;letter-spacing:2px;border-bottom:1px solid var(--border);text-align:right;background:var(--panel);}
.dtbl th:first-child{text-align:left;}
.dtbl td{padding:5px 11px;border-bottom:1px solid rgba(26,45,74,.4);text-align:right;}
.dtbl td:first-child{text-align:left;color:var(--accent);}
.dtbl tr:hover td{background:rgba(0,229,255,.025);}
.avg-row td{background:rgba(0,229,255,.06)!important;border-top:1px solid var(--border);color:var(--accent);font-weight:900;}
.avg-row td:first-child{color:var(--muted);font-weight:400;}
.day-charts{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.btn{padding:7px 13px;border:none;border-radius:3px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .15s;display:inline-flex;align-items:center;gap:5px;}
.btn-accent{background:var(--accent);color:#060b14;}
.btn-accent:hover{background:#33ecff;box-shadow:0 0 14px rgba(0,229,255,.4);}
.btn-ghost{background:transparent;border:1px solid var(--dim);color:var(--muted);}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent);}
.btn-danger{background:transparent;border:1px solid var(--border);color:var(--muted);}
.btn-danger:hover{border-color:#f43f5e;color:#f43f5e;}
.overlay{position:fixed;inset:0;background:rgba(6,11,20,.88);backdrop-filter:blur(6px);z-index:500;display:flex;align-items:center;justify-content:center;}
.modal{background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:24px;width:500px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,.9);}
.modal-ttl{font-size:12px;font-weight:900;letter-spacing:3px;color:var(--accent);text-transform:uppercase;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border);}
.modal-tabs{display:flex;border:1px solid var(--border);border-radius:3px;overflow:hidden;margin-bottom:14px;}
.modal-tab{flex:1;padding:7px;font-size:10px;font-weight:700;letter-spacing:2px;text-align:center;cursor:pointer;background:#060b14;color:var(--muted);transition:all .15s;border:none;font-family:'Barlow Condensed',sans-serif;}
.modal-tab.on{background:rgba(0,229,255,.1);color:var(--accent);}
.fg2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
.flbl{display:block;font-size:8px;letter-spacing:2px;color:var(--muted);margin-bottom:3px;text-transform:uppercase;}
.inp,.sel{background:#060b14;border:1px solid var(--dim);color:var(--text);padding:7px 9px;border-radius:3px;font-family:'Share Tech Mono',monospace;font-size:12px;outline:none;width:100%;}
.inp:focus,.sel:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(0,229,255,.1);}
.pue-calc{background:#060b14;border:1px solid var(--border);border-radius:3px;padding:8px 12px;font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--muted);margin-bottom:12px;line-height:1.6;}
.hall-tabs{display:flex;gap:4px;margin-bottom:10px;}
.htab-btn{background:#060b14;border-radius:3px;padding:4px 13px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:2px;font-family:'Barlow Condensed',sans-serif;transition:all .15s;color:#4a6280;}
.btn-row{display:flex;gap:8px;margin-top:4px;}
.pill{display:inline-block;padding:1px 7px;border-radius:2px;font-size:8px;letter-spacing:1px;font-weight:700;}
.ok{background:rgba(163,230,53,.12);color:#a3e635;}
.warn{background:rgba(250,204,21,.12);color:#facc15;}
.crit{background:rgba(244,63,94,.12);color:#f43f5e;}
.scroll{max-height:280px;overflow-y:auto;}
.toast{position:fixed;bottom:18px;right:18px;background:var(--panel);border:1px solid #a3e635;color:#a3e635;padding:10px 18px;border-radius:3px;font-size:11px;letter-spacing:1px;box-shadow:0 0 20px rgba(163,230,53,.25);animation:slideup .25s ease;z-index:9999;}
@keyframes slideup{from{transform:translateY(14px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.import-zone{border:2px dashed var(--dim);border-radius:4px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:10px;}
.import-zone:hover,.import-zone.drag{border-color:var(--accent);background:rgba(0,229,255,.04);}
.import-zone-icon{font-size:28px;margin-bottom:8px;}
.import-zone-lbl{font-size:12px;color:var(--muted);letter-spacing:1px;}
.import-zone-sub{font-size:10px;color:#2a4060;margin-top:4px;letter-spacing:.5px;}
.krow{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:12px;}
.kcard{background:var(--panel);border:1px solid var(--border);border-top:2px solid;border-radius:4px;padding:11px 14px;position:relative;overflow:hidden;}
.klbl{font-size:9px;letter-spacing:3px;color:var(--muted);text-transform:uppercase;margin-bottom:3px;}
.kval{font-size:28px;font-weight:900;line-height:1;}
.kunit{font-size:11px;font-weight:400;color:var(--muted);margin-left:2px;}
.ksub{font-size:9px;letter-spacing:2px;margin-top:3px;}
.kico{position:absolute;top:10px;right:10px;font-size:18px;opacity:.1;}
.credit-bar{background:var(--panel);border-top:1px solid var(--border);padding:8px 20px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:var(--muted);letter-spacing:1px;}
.credit-bar span{color:#4a6280;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:#060b14;}
::-webkit-scrollbar-thumb{background:#2a4060;border-radius:2px;}
`;

// ── ICON ──────────────────────────────────────────────────────────────────────
const BMSIcon = () => (
  <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
    <defs>
      <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00e5ff"/><stop offset="100%" stopColor="#e879f9"/>
      </linearGradient>
    </defs>
    <rect x="3" y="4"  width="32" height="8"  rx="1.5" fill="url(#ig)" opacity=".95"/>
    <rect x="3" y="15" width="32" height="8"  rx="1.5" fill="url(#ig)" opacity=".7"/>
    <rect x="3" y="26" width="32" height="8"  rx="1.5" fill="url(#ig)" opacity=".45"/>
    <circle cx="30" cy="8"  r="2.2" fill="#060b14"/>
    <circle cx="30" cy="19" r="2.2" fill="#060b14"/>
    <circle cx="30" cy="30" r="2.2" fill="#060b14"/>
    <rect x="6" y="6.5"  width="18" height="3" rx=".8" fill="rgba(6,11,20,.35)"/>
    <rect x="6" y="17.5" width="15" height="3" rx=".8" fill="rgba(6,11,20,.35)"/>
    <rect x="6" y="28.5" width="12" height="3" rx=".8" fill="rgba(6,11,20,.35)"/>
  </svg>
);

// ── SMART CSV/PDF PARSER ──────────────────────────────────────────────────────
function detectAndParseCSV(text: string): { hourly: typeof SAMPLE_HOURLY; daily: DayEntry[]; skipped: number } {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  const hourly: typeof SAMPLE_HOURLY = {};
  const daily: DayEntry[] = [];
  let skipped = 0;

  // Auto-detect format by scanning headers
  let mode: "hourly"|"daily"|"unknown" = "unknown";

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;

    // Detect section headers (flexible matching)
    const lower = raw.toLowerCase();
    if (lower.includes("hourly") && (lower.includes("log") || lower.includes("reading"))) { mode="hourly"; continue; }
    if (lower.includes("daily") && (lower.includes("log") || lower.includes("energy") || lower.includes("summary"))) { mode="daily"; continue; }

    const cols = raw.split(",").map(c => c.trim().replace(/^"|"$/g,""));

    // Skip header rows (non-numeric first cell that isn't a time or date)
    if (isNaN(Date.parse(cols[0])) && !/^\d{2}:\d{2}$/.test(cols[0]) && !/^\d{2}\s/.test(cols[0])) {
      // Auto-detect mode from header columns
      if (cols.some(c => /^hall$/i.test(c))) { mode="hourly"; continue; }
      if (cols.some(c => /utility|cooling/i.test(c))) { mode="daily"; continue; }
      // Unknown header — try to infer from column count
      if (cols.length >= 8) { mode = "hourly"; }
      else if (cols.length >= 6) { mode = "daily"; }
      continue;
    }

    try {
      if (mode === "hourly" || (mode === "unknown" && cols.length >= 8)) {
        // Expected: Timestamp, Hall, Hour, Temp, Hum, IT, TotalPwr, PUE
        const hall  = cols[1]?.toUpperCase();
        const hour  = cols[2];
        const temp  = parseFloat(cols[3]);
        const hum   = parseFloat(cols[4]);
        const it    = parseFloat(cols[5]);
        const tp    = parseFloat(cols[6]);
        const pue   = parseFloat(cols[7]) || +(tp/it).toFixed(2);
        if (!HALLS.some(h=>h.id===hall) || !/^\d{2}:\d{2}$/.test(hour) || [temp,hum,it,tp].some(isNaN)) {
          skipped++; continue;
        }
        if (!hourly[hour]) hourly[hour] = {} as any;
        hourly[hour][hall] = { temp, hum, itLoad:it, totalPwr:tp, pue };
      } else if (mode === "daily" || (mode === "unknown" && cols.length >= 7)) {
        // Expected: Date, TotalUtility, Cooling, IT, Others, SUPSLoss, TXLoss, PUE
        const date  = cols[0];
        const total = parseFloat(cols[1]);
        const cool  = parseFloat(cols[2]);
        const it    = parseFloat(cols[3]);
        const oth   = parseFloat(cols[4]);
        const sups  = parseFloat(cols[5]);
        const tx    = parseFloat(cols[6]);
        const pue   = parseFloat(cols[7]) || +((total||it+cool+oth+sups+tx)/it).toFixed(2);
        if ([total,cool,it,oth,sups,tx].some(isNaN)) { skipped++; continue; }
        daily.push({ date, totalUtility:total, cooling:cool, it, others:oth, supsLoss:sups, txLoss:tx, pue });
      } else {
        skipped++;
      }
    } catch { skipped++; }
  }
  return { hourly, daily, skipped };
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hourly,  setHourly]    = useState<typeof SAMPLE_HOURLY>(SAMPLE_HOURLY);
  const [daily,   setDaily]     = useState<DayEntry[]>(SAMPLE_DAILY);
  const [tab,     setTab]       = useState<"monitor"|"summary">("monitor");
  const [activeHall, setHall]   = useState("A");
  const [metric,  setMetric]    = useState<"temp"|"hum"|"pue">("temp");
  const [clock,   setClock]     = useState(new Date());
  const [toast,   setToast]     = useState("");
  const [modal,   setModal]     = useState(false);
  const [modalTab,setModalTab]  = useState<"hourly"|"daily">("hourly");
  const [selHour, setSelHour]   = useState(HOURS[Math.min(new Date().getHours(),23)]);
  const [hf, s
