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
  const [hf, setHf] = useState({ temp:"", hum:"", itLoad:"", totalPwr:"" });
  const [df, setDf] = useState({ date:"", cooling:"", it:"", others:"", supsLoss:"", txLoss:"" });
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ const t=setInterval(()=>setClock(new Date()),1000); return()=>clearInterval(t); },[]);
  const msg = (m:string) => { setToast(m); setTimeout(()=>setToast(""),3200); };

  if (showWelcome) return <WelcomePage onEnter={() => setShowWelcome(false)} />;

  // ── DERIVED ────────────────────────────────────────────────────────────────
  const latestHour = [...HOURS].reverse().find(h=>hourly[h]);
  const latest     = latestHour ? hourly[latestHour] : null;
  const hallAvg    = (key:keyof HallEntry, dec=1) => latest
    ? +(HALLS.reduce((s,h)=>s+(latest[h.id]?.[key]??0),0)/HALLS.length).toFixed(dec) : null;
  const avgPUE  = hallAvg("pue",2);
  const avgTemp = hallAvg("temp",1);
  const avgHum  = hallAvg("hum",1);
  const totalIT = latest ? HALLS.reduce((s,h)=>s+(latest[h.id]?.itLoad??0),0) : null;
  const pueStatus = avgPUE ? getPueStatus(avgPUE) : "ok";
  const pueColor  = SC[pueStatus];

  const multiData = HOURS.filter(h=>hourly[h]).map(h=>{
    const row:any = { hour:h };
    HALLS.forEach(hh=>{ row[hh.id]=hourly[h]?.[hh.id]?.[metric]; });
    return row;
  });
  const dayChartData = daily.slice(-5);
  const hPUE = (hf.itLoad && hf.totalPwr) ? +(parseFloat(hf.totalPwr)/parseFloat(hf.itLoad)).toFixed(2) : null;
  const dTotal = [df.it,df.cooling,df.others,df.supsLoss,df.txLoss].reduce((s,v)=>s+(parseFloat(v)||0),0);
  const dPUE   = df.it && dTotal ? +(dTotal/parseFloat(df.it)).toFixed(2) : null;

  // ── SUBMIT ─────────────────────────────────────────────────────────────────
  const submitHourly = () => {
    const t=parseFloat(hf.temp),hu=parseFloat(hf.hum),it=parseFloat(hf.itLoad),tp=parseFloat(hf.totalPwr);
    if([t,hu,it,tp].some(isNaN)){ msg("⚠ Fill all fields"); return; }
    const pue=+(tp/it).toFixed(2);
    setHourly(prev=>({...prev,[selHour]:{...(prev[selHour]||{}),[activeHall]:{temp:t,hum:hu,itLoad:it,totalPwr:tp,pue}}}));
    setHf({temp:"",hum:"",itLoad:"",totalPwr:""});
    setModal(false);
    msg(`✓ Hall ${activeHall} @ ${selHour} saved · PUE: ${pue}`);
  };

  const submitDaily = () => {
    const it=parseFloat(df.it),cool=parseFloat(df.cooling),oth=parseFloat(df.others),
          sups=parseFloat(df.supsLoss),tx=parseFloat(df.txLoss);
    if([it,cool,oth,sups,tx].some(isNaN)||!df.date){ msg("⚠ Fill all fields + date"); return; }
    const total=it+cool+oth+sups+tx, pue=+(total/it).toFixed(2);
    const label=isoToLabel(df.date);
    const entry:DayEntry={date:label,totalUtility:total,cooling:cool,it,others:oth,supsLoss:sups,txLoss:tx,pue};
    setDaily(prev=>{ const idx=prev.findIndex(d=>d.date===label); if(idx>=0){const n=[...prev];n[idx]=entry;return n;} return[...prev,entry]; });
    setDf({date:"",cooling:"",it:"",others:"",supsLoss:"",txLoss:""});
    setModal(false);
    msg(`✓ Daily entry for ${label} saved · PUE: ${pue}`);
  };

  // ── EXPORT ─────────────────────────────────────────────────────────────────
  const exportHourlyCSV = () => {
    const hdr=["Timestamp","Hall","Hour","Temperature_C","Humidity_pct","IT_Load_kW","Total_Power_kW","PUE"];
    const rows:string[]=[];
    HOURS.forEach(h=>{ if(!hourly[h]) return; HALLS.forEach(hh=>{ const d=hourly[h]?.[hh.id]; if(!d) return;
      rows.push([new Date().toISOString(),hh.id,h,d.temp,d.hum,d.itLoad,d.totalPwr,d.pue].join(",")); });});
    const csv=[hdr.join(","),...rows].join("\n");
    dl(csv,"STT_BMS_Hourly.csv","text/csv");
    msg("✓ Hourly CSV exported");
  };

  const exportDailyCSV = () => {
    const hdr=["Date","Total_Utility_kWh","Cooling_kWh","IT_kWh","Others_kWh","SUPS_Loss_kWh","TX_Loss_kWh","PUE"];
    const rows=daily.map(d=>[d.date,d.totalUtility,d.cooling,d.it,d.others,d.supsLoss,d.txLoss,d.pue].join(","));
    dl([hdr.join(","),...rows].join("\n"),"STT_BMS_Daily.csv","text/csv");
    msg("✓ Daily CSV exported");
  };

  const dl = (content:string, name:string, type:string) => {
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([content],{type}));
    a.download=name; a.click();
  };

  // ── IMPORT (auto-detect CSV or PDF text) ───────────────────────────────────
  const handleFile = (file:File) => {
    const reader=new FileReader();
    reader.onload=ev=>{
      const text=ev.target?.result as string;
      if(!text?.trim()){ msg("⚠ File appears empty"); return; }
      try {
        const { hourly:h, daily:d, skipped } = detectAndParseCSV(text);
        const hCount=Object.keys(h).length, dCount=d.length;
        if(hCount>0) setHourly(prev=>({...prev,...h}));
        if(dCount>0) setDaily(prev=>{
          const merged=[...prev];
          d.forEach(entry=>{ const idx=merged.findIndex(x=>x.date===entry.date);
            if(idx>=0) merged[idx]=entry; else merged.push(entry); });
          return merged;
        });
        const parts=[];
        if(hCount>0) parts.push(`${hCount} hourly hour-slots`);
        if(dCount>0) parts.push(`${dCount} daily entries`);
        if(parts.length===0){ msg("⚠ No valid data found — check file format"); return; }
        msg(`✓ Imported: ${parts.join(", ")}${skipped>0?` · ${skipped} rows skipped`:""}`);
      } catch(e){ msg("⚠ Could not parse file — ensure it's a valid CSV"); }
    };
    // PDF: read as text (works for text-layer PDFs exported from Sheets)
    reader.readAsText(file);
  };

  const onFileInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f=e.target.files?.[0]; if(f) handleFile(f); e.target.value="";
  };
  const onDrop = (e:React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f=e.dataTransfer.files[0]; if(f) handleFile(f);
  };

  const aHall=HALLS.find(h=>h.id===activeHall)!;

  const dayAvg=(key:keyof DayEntry,dec=0)=>daily.length
    ? +(daily.reduce((s,d)=>s+((d[key] as number)||0),0)/daily.length).toFixed(dec):null;

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <input ref={fileRef} type="file" accept=".csv,.txt,.pdf" style={{display:"none"}} onChange={onFileInput}/>
      <div className="root">

        {/* HEADER */}
        <header className="hdr">
          <div className="hdr-main">
            <div className="brand"><BMSIcon/><div className="brand-txt"><span className="t1">BMS MONITORING</span><span className="t2">FOR STT MAKATI</span></div></div>
            <div className="vsep"/>
            <div className="kpi-strip">
              {[
                {l:"AVG PUE",  v:avgPUE,  u:"",   c:avgPUE?pueColor:"#4a6280"},
                {l:"AVG TEMP", v:avgTemp, u:"°C", c:avgTemp?SC[getTempStatus(avgTemp)]:"#4a6280"},
                {l:"AVG HUM",  v:avgHum,  u:"%",  c:avgHum?SC[getHumStatus(avgHum)]:"#4a6280"},
                {l:"TOTAL IT", v:totalIT, u:" kW",c:"#a3e635"},
              ].map((k,i)=>(
                <div key={i} className="kpi-item">
                  <span className="kl">{k.l}</span>
                  <span className="kv" style={{color:k.c}}>{k.v??'—'}{k.u}</span>
                </div>
              ))}
            </div>
            <div className="vsep"/>
            <div className="hdr-right">
              {/* Import — drag & drop or click */}
              <div
                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                onDragLeave={()=>setDrag(false)}
                onDrop={onDrop}
                style={{display:"flex"}}>
                <button className={`btn btn-ghost ${drag?"":"" }`}
                  style={{fontSize:10, borderColor: drag?"#00e5ff":undefined, color: drag?"#00e5ff":undefined}}
                  onClick={()=>fileRef.current?.click()}>
                  ⬆ Import
                </button>
              </div>
              <div style={{position:"relative",display:"flex",gap:4}}>
                <button className="btn btn-ghost" style={{fontSize:10}} onClick={exportHourlyCSV}>⬇ Hourly CSV</button>
                <button className="btn btn-ghost" style={{fontSize:10}} onClick={exportDailyCSV}>⬇ Daily CSV</button>
              </div>
              <button className="btn btn-accent" onClick={()=>setModal(true)}>+ Log Reading</button>
              <div className="vsep"/>
              <div className="clk-blk">
                <span className="clk-t">{clock.toLocaleTimeString("en-GB",{hour12:false})}</span>
                <span className="clk-d">{clock.toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"}).toUpperCase()}</span>
              </div>
              <div className="live-pill"><div className="dot"/>LIVE</div>
            </div>
          </div>
          <div className="tabs-bar">
            <div className={`tab ${tab==="monitor"?"on":""}`} onClick={()=>setTab("monitor")}>🏢 Live Monitor</div>
            <div className={`tab ${tab==="summary"?"on":""}`} onClick={()=>setTab("summary")}>📅 5-Day Summary</div>
          </div>
        </header>

        <div className="body">
          {tab==="monitor" && <>
            {/* KPI Row */}
            <div className="krow">
              {[
                {l:"FACILITY PUE",v:avgPUE,  u:"",   c:"#00e5ff",i:"⚡",s:avgPUE?getPueStatus(avgPUE):"ok"},
                {l:"TOTAL IT",   v:totalIT, u:"kW", c:"#a3e635",i:"🖥",s:"ok" as const},
                {l:"TOTAL PWR",  v:latest?HALLS.reduce((s,h)=>s+(latest[h.id]?.totalPwr??0),0):null,u:"kW",c:"#f97316",i:"🔋",s:"ok" as const},
                {l:"AVG TEMP",   v:avgTemp, u:"°C", c:"#f97316",i:"🌡",s:avgTemp?getTempStatus(avgTemp):"ok" as const},
                {l:"AVG HUM",    v:avgHum,  u:"%",  c:"#38bdf8",i:"💧",s:avgHum?getHumStatus(avgHum):"ok" as const},
              ].map((k,i)=>(
                <div key={i} className="kcard" style={{borderTopColor:k.c}}>
                  <div className="kico">{k.i}</div>
                  <div className="klbl">{k.l}</div>
                  <div className="kval" style={{color:k.c}}>{k.v??'—'}<span className="kunit">{k.u}</span></div>
                  <div className="ksub" style={{color:SC[k.s as keyof typeof SC]}}>● {k.s.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Hall Cards */}
            <div className="halls">
              {HALLS.map(hall=>{
                const d=latest?.[hall.id];
                const ts=d?getTempStatus(d.temp):"ok", hs=d?getHumStatus(d.hum):"ok", ps=d?getPueStatus(d.pue):"ok";
                const active=activeHall===hall.id;
                return (
                  <div key={hall.id} className="hcard" onClick={()=>setHall(hall.id)}
                    style={{borderColor:active?hall.color:"#1a2d4a",boxShadow:active?`0 0 20px ${hall.glow}`:undefined}}>
                    <div className="hcard-top" style={{background:`linear-gradient(90deg,${hall.color},transparent)`}}/>
                    <div className="hcard-hdr">
                      <div className="hid" style={{color:hall.color,textShadow:active?`0 0 14px ${hall.glow}`:undefined}}>HALL {hall.id}</div>
                      <div className="hcard-meta">
                        <div className={`dot ${d?"":"off"}`}/>
                        {d && <span className={`pue-badge pill ${ps}`}>PUE {d.pue}</span>}
                      </div>
                    </div>
                    <MiniBar value={d?.temp} min={15} max={40} color={SC[ts]} label="TEMPERATURE" unit="°C"/>
                    <MiniBar value={d?.hum}  min={0}  max={100} color={SC[hs]} label="HUMIDITY"    unit="%"/>
                    <MiniBar value={d?.pue}  min={1}  max={2.5} color={SC[ps]} label="PUE"         unit=""/>
                    <div className="hcard-foot">
                      <span>IT: <span style={{color:hall.color}}>{d?.itLoad??'—'} kW</span></span>
                      <span>PWR: {d?.totalPwr??'—'} kW</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PUE Section */}
            <div className="pue-section" style={{boxShadow:avgPUE?`0 0 50px ${pueColor}18`:undefined,borderColor:avgPUE?`${pueColor}44`:undefined}}>
              <div className="pue-left">
                <span className="pue-sub-lbl">FACILITY AVERAGE</span>
                <div className="pue-val" style={{color:pueColor,textShadow:`0 0 30px ${pueColor},0 0 60px ${pueColor}88`}}>{avgPUE??'—'}</div>
                <span className="pue-name">POWER USAGE EFFECTIVENESS</span>
                <span className="pue-target">Target ≤ 1.83 · Ideal 1.00</span>
                <div className="pue-legend">
                  <span style={{color:"#a3e635"}}>■ ≤1.6 GOOD</span>
                  <span style={{color:"#facc15"}}>■ WARN</span>
                  <span style={{color:"#f43f5e"}}>■ CRIT</span>
                </div>
              </div>
              <div className="pue-divider"/>
              <div className="pue-bars">
                <div className="pue-bars-lbl">PER HALL</div>
                {HALLS.map(hall=>{
                  const d=latest?.[hall.id], ps=d?getPueStatus(d.pue):"ok";
                  const pct=d?Math.min(100,((d.pue-1)/(2.5-1))*100):0;
                  return (
                    <div key={hall.id} className="pr">
                      <div className="pr-id" style={{color:hall.color}}>{hall.id}</div>
                      <div className="pr-bg"><div className="pr-fg" style={{width:`${pct}%`,background:SC[ps],boxShadow:`0 0 6px ${SC[ps]}`}}/></div>
                      <div className="pr-val" style={{color:SC[ps],textShadow:`0 0 7px ${SC[ps]}`}}>{d?.pue??'—'}</div>
                      <span className={`pr-pill pill ${ps}`}>{ps.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trend Chart */}
            <div className="panel trend-panel">
              <div className="ptitle">
                📈 Multi-Hall Trend
                <div className="mtabs" style={{marginLeft:"auto"}}>
                  {(["temp","hum","pue"] as const).map(k=>(
                    <button key={k} className={`mtab ${metric===k?"on":""}`} onClick={()=>setMetric(k)}>
                      {k==="temp"?"🌡 TEMP":k==="hum"?"💧 HUM":"⚡ PUE"}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={multiData} margin={{top:4,right:10,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a"/>
                  <XAxis dataKey="hour" tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                  <YAxis tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                  <Tooltip content={<CTip/>}/>
                  {metric==="temp"&&<ReferenceLine y={26}   stroke="#facc15" strokeDasharray="5 4" strokeWidth={1}/>}
                  {metric==="hum" &&<ReferenceLine y={60}   stroke="#facc15" strokeDasharray="5 4" strokeWidth={1}/>}
                  {metric==="pue" &&<ReferenceLine y={1.83} stroke="#facc15" strokeDasharray="5 4" strokeWidth={1}/>}
                  {HALLS.map(h=>(
                    <Line key={h.id} type="monotone" dataKey={h.id} name={`Hall ${h.id}`}
                      stroke={h.color} strokeWidth={2} dot={false}
                      activeDot={{r:4,fill:h.color,stroke:"#060b14",strokeWidth:1.5}}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {HALLS.map(h=>(<span key={h.id} style={{color:h.color}}>─ HALL {h.id}</span>))}
                <span style={{color:"#facc15"}}>-- THRESHOLD</span>
              </div>
            </div>
          </>}

          {tab==="summary" && <>
            <div className="panel" style={{marginBottom:12}}>
              <div className="ptitle">📋 Energy Summary</div>
              <div className="tbl-wrap">
                <table className="dtbl">
                  <thead><tr>
                    <th style={{textAlign:"left"}}>DATE</th>
                    <th>TOTAL UTILITY kWh</th><th>COOLING kWh</th><th>IT kWh</th>
                    <th>OTHERS kWh</th><th>SUPS LOSS kWh</th><th>TX LOSS kWh</th><th>PUE</th>
                  </tr></thead>
                  <tbody>
                    {daily.map((d,i)=>{ const ps=getPueStatus(d.pue); return (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>{d.totalUtility?.toLocaleString()}</td>
                        <td style={{color:"#38bdf8"}}>{d.cooling?.toLocaleString()}</td>
                        <td style={{color:"#a3e635"}}>{d.it?.toLocaleString()}</td>
                        <td>{d.others?.toLocaleString()}</td>
                        <td style={{color:"#facc15"}}>{d.supsLoss?.toLocaleString()}</td>
                        <td style={{color:"#f43f5e"}}>{d.txLoss?.toLocaleString()}</td>
                        <td><span style={{color:SC[ps],fontWeight:900,fontFamily:"Share Tech Mono",marginRight:6}}>{d.pue}</span>
                          <span className={`pill ${ps}`}>{ps.toUpperCase()}</span></td>
                      </tr>);
                    })}
                    <tr className="avg-row">
                      <td>COLUMN AVG</td>
                      <td>{dayAvg("totalUtility")?.toLocaleString()}</td>
                      <td>{dayAvg("cooling")?.toLocaleString()}</td>
                      <td>{dayAvg("it")?.toLocaleString()}</td>
                      <td>{dayAvg("others")?.toLocaleString()}</td>
                      <td>{dayAvg("supsLoss")?.toLocaleString()}</td>
                      <td>{dayAvg("txLoss")?.toLocaleString()}</td>
                      <td>{dayAvg("pue",2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="day-charts">
              <div className="panel">
                <div className="ptitle">⚡ 5-Day PUE Trend</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dayChartData} margin={{top:8,right:8,left:-20,bottom:0}}>
                    <defs>
                      <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#00e5ff" stopOpacity={.22}/>
                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a"/>
                    <XAxis dataKey="date" tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                    <YAxis tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}} domain={["auto","auto"]}/>
                    <Tooltip content={<CTip/>}/>
                    <ReferenceLine y={1.83} stroke="#facc15" strokeDasharray="5 4" strokeWidth={1}/>
                    <Area type="monotone" dataKey="pue" name="PUE" stroke="#00e5ff" strokeWidth={2} fill="url(#pgrad)"
                      dot={(props:any)=>{ const {cx,cy,payload}=props; const c=SC[getPueStatus(payload.pue)];
                        return <circle key={cx} cx={cx} cy={cy} r={6} fill={c} stroke="#060b14" strokeWidth={2}
                          style={{filter:`drop-shadow(0 0 5px ${c})`}}/>;}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <div className="ptitle">🔋 5-Day Energy Breakdown</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dayChartData} margin={{top:4,right:8,left:-20,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" vertical={false}/>
                    <XAxis dataKey="date" tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                    <YAxis tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                    <Tooltip content={<CTip/>}/>
                    <Bar dataKey="it"       name="IT Load"   stackId="s" fill="#a3e635"/>
                    <Bar dataKey="cooling"  name="Cooling"   stackId="s" fill="#38bdf8"/>
                    <Bar dataKey="others"   name="Others"    stackId="s" fill="#e879f9"/>
                    <Bar dataKey="supsLoss" name="SUPS Loss" stackId="s" fill="#facc15"/>
                    <Bar dataKey="txLoss"   name="TX Loss"   stackId="s" fill="#f43f5e" radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
                <div className="chart-legend" style={{marginTop:8}}>
                  {[["#a3e635","IT"],["#38bdf8","Cooling"],["#e879f9","Others"],["#facc15","SUPS"],["#f43f5e","TX"]].map(([c,l])=>(
                    <span key={l} style={{color:c}}>■ {l}</span>
                  ))}
                </div>
              </div>
            </div>
          </>}
        </div>

        {/* Credit Bar */}
        <div className="credit-bar">
          <span>DC · BMS Monitoring System  ·  STT Makati</span>
          <span>Developed by <span style={{color:"#00e5ff",letterSpacing:1}}>Edison Latag</span>  ·  v1.0.0</span>
        </div>

        {/* MODAL */}
        {modal && (
          <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(false);}}>
            <div className="modal">
              <div className="modal-ttl">+ Log Reading</div>
              <div className="modal-tabs">
                <button className={`modal-tab ${modalTab==="hourly"?"on":""}`} onClick={()=>setModalTab("hourly")}>🏢 Hourly Monitor</button>
                <button className={`modal-tab ${modalTab==="daily"?"on":""}`}  onClick={()=>setModalTab("daily")}>📅 Daily Summary</button>
              </div>

              {/* Import drop zone inside modal */}
              <div className={`import-zone ${drag?"drag":""}`}
                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                onDragLeave={()=>setDrag(false)}
                onDrop={onDrop}
                onClick={()=>fileRef.current?.click()}>
                <div className="import-zone-icon">📂</div>
                <div className="import-zone-lbl">Drop CSV here or click to import</div>
                <div className="import-zone-sub">Auto-detects hourly or daily format · CSV or text PDF</div>
              </div>

              {modalTab==="hourly" && <>
                <div style={{marginBottom:10}}>
                  <div className="flbl">Select Hall</div>
                  <div className="hall-tabs">
                    {HALLS.map(h=>(
                      <button key={h.id} className="htab-btn" onClick={()=>setHall(h.id)}
                        style={{borderWidth:1,borderStyle:"solid",
                          borderColor:activeHall===h.id?h.color:"#1a2d4a",
                          color:activeHall===h.id?h.color:"#4a6280",
                          background:activeHall===h.id?`${h.color}12`:"#060b14"}}>
                        {h.id}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <label className="flbl">Hour Slot</label>
                  <select className="sel" value={selHour} onChange={e=>setSelHour(e.target.value)}>
                    {HOURS.map(h=><option key={h} value={h}>{h} {hourly[h]?.[activeHall]?"✓":""}</option>)}
                  </select>
                </div>
                <div className="fg2">
                  {[
                    {k:"temp"    as const,l:"Temperature",u:"°C",ph:"e.g. 23.5",c:"#f97316"},
                    {k:"hum"     as const,l:"Humidity",   u:"%", ph:"e.g. 55",  c:"#38bdf8"},
                    {k:"itLoad"  as const,l:"IT Load",    u:"kW",ph:"e.g. 120", c:"#a3e635"},
                    {k:"totalPwr"as const,l:"Total Power",u:"kW",ph:"e.g. 190", c:"#e879f9"},
                  ].map(f=>(
                    <div key={f.k}>
                      <label className="flbl" style={{color:f.c}}>{f.l} ({f.u})</label>
                      <input className="inp" type="number" placeholder={f.ph}
                        value={hf[f.k]} onChange={e=>setHf(p=>({...p,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
                <div className="pue-calc">
                  PUE = Total Power ÷ IT Load &nbsp;→&nbsp;
                  <span style={{color:hPUE?SC[getPueStatus(hPUE)]:"#4a6280",fontWeight:900,fontSize:14}}>{hPUE??'—'}</span>
                  {hPUE&&<span className={`pill ${getPueStatus(hPUE)}`} style={{marginLeft:8}}>{getPueStatus(hPUE).toUpperCase()}</span>}
                </div>
                <div className="btn-row">
                  <button className="btn btn-danger" style={{flex:1}} onClick={()=>setModal(false)}>Cancel</button>
                  <button className="btn btn-accent" style={{flex:2}} onClick={submitHourly}>Log Hall {activeHall} @ {selHour}</button>
                </div>
              </>}

              {modalTab==="daily" && <>
                <div style={{marginBottom:10}}>
                  <label className="flbl">Date</label>
                  <input className="inp" type="date" value={df.date}
                    onChange={e=>setDf(p=>({...p,date:e.target.value}))} style={{colorScheme:"dark"}}/>
                </div>
                <div className="fg2">
                  {[
                    {k:"it"      as const,l:"IT Load",   u:"kWh",ph:"e.g. 9800",c:"#a3e635"},
                    {k:"cooling" as const,l:"Cooling",   u:"kWh",ph:"e.g. 5800",c:"#38bdf8"},
                    {k:"others"  as const,l:"Others",    u:"kWh",ph:"e.g. 1400",c:"#e879f9"},
                    {k:"supsLoss"as const,l:"SUPS Loss", u:"kWh",ph:"e.g. 820", c:"#facc15"},
                    {k:"txLoss"  as const,l:"TX Loss",   u:"kWh",ph:"e.g. 580", c:"#f43f5e"},
                  ].map(f=>(
                    <div key={f.k}>
                      <label className="flbl" style={{color:f.c}}>{f.l} ({f.u})</label>
                      <input className="inp" type="number" placeholder={f.ph}
                        value={df[f.k]} onChange={e=>setDf(p=>({...p,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
                <div className="pue-calc">
                  Total Utility = <span style={{color:"#00e5ff",fontWeight:900}}>{dTotal>0?dTotal.toLocaleString():"—"} kWh</span>
                  &nbsp;·&nbsp; PUE = <span style={{color:dPUE?SC[getPueStatus(dPUE)]:"#4a6280",fontWeight:900,fontSize:14}}>{dPUE??'—'}</span>
                  {dPUE&&<span className={`pill ${getPueStatus(dPUE)}`} style={{marginLeft:8}}>{getPueStatus(dPUE).toUpperCase()}</span>}
                </div>
                <div className="btn-row">
                  <button className="btn btn-danger" style={{flex:1}} onClick={()=>setModal(false)}>Cancel</button>
                  <button className="btn btn-accent" style={{flex:2}} onClick={submitDaily}>Save Daily Entry</button>
                </div>
              </>}
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
