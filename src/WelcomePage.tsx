import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SAMPLE_HOURLY, SAMPLE_DAILY } from "./sampleData";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&display=swap');
*{box-sizing:border-box;}
.wp-root{
  font-family:'Barlow Condensed',sans-serif;
  background:#060b14;
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  position:relative;overflow:hidden;color:#c8dff0;padding:24px 16px;
}
.wp-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
  background-size:40px 40px;pointer-events:none;
  animation:wp-grid-pan 28s linear infinite;
}
@keyframes wp-grid-pan{from{background-position:0 0;}to{background-position:40px 40px;}}
.wp-glow{
  position:absolute;width:720px;height:720px;border-radius:50%;
  background:radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%);
  top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;
  animation:wp-pulse 6s ease-in-out infinite;
}
@keyframes wp-pulse{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.05);}}
.wp-stage{
  position:relative;z-index:1;
  display:grid;grid-template-columns:minmax(320px,560px) minmax(360px,660px);
  gap:24px;align-items:stretch;width:100%;max-width:1260px;
}
@media (max-width:1024px){.wp-stage{grid-template-columns:1fr;}}
.wp-card{
  background:rgba(10,22,40,0.95);border:1px solid #1a2d4a;border-radius:8px;
  padding:44px 44px 36px;text-align:center;position:relative;
  box-shadow:0 0 80px rgba(0,229,255,0.08), 0 24px 60px rgba(0,0,0,0.8);
  animation:wp-fade .6s ease .05s both;
}
.wp-card::before{
  content:'';position:absolute;top:0;left:10%;right:10%;height:2px;
  background:linear-gradient(90deg,transparent,#00e5ff,transparent);border-radius:2px;
}
.wp-icon{margin:0 auto 18px;width:64px;height:64px;}
.wp-subtitle{font-size:11px;letter-spacing:5px;color:#4a6280;text-transform:uppercase;margin-bottom:10px;}
.wp-title{
  font-size:42px;font-weight:900;letter-spacing:2px;color:#00e5ff;
  text-shadow:0 0 30px rgba(0,229,255,0.4);line-height:1;margin-bottom:6px;
}
.wp-org{font-size:16px;font-weight:300;letter-spacing:4px;color:#c8dff0;margin-bottom:24px;}
.wp-divider{height:1px;background:linear-gradient(90deg,transparent,#1a2d4a,transparent);margin:0 auto 20px;width:80%;}
.wp-desc{font-size:15px;color:#4a6280;line-height:1.65;margin-bottom:24px;font-weight:300;}
.wp-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:28px;}
.wp-pill{
  background:rgba(0,229,255,0.07);border:1px solid rgba(0,229,255,0.2);
  border-radius:3px;padding:4px 14px;font-size:10px;letter-spacing:2px;color:#00e5ff;
  transition:transform .2s, background .2s, border-color .2s;
}
.wp-pill:hover{transform:translateY(-2px);background:rgba(0,229,255,0.14);border-color:#00e5ff;}
.wp-btn{
  background:#00e5ff;color:#060b14;border:none;border-radius:4px;
  padding:14px 48px;font-family:'Barlow Condensed',sans-serif;
  font-size:16px;font-weight:900;letter-spacing:4px;text-transform:uppercase;
  cursor:pointer;transition:all .2s;box-shadow:0 0 24px rgba(0,229,255,0.3);
}
.wp-btn:hover{background:#33ecff;box-shadow:0 0 40px rgba(0,229,255,0.5);transform:translateY(-1px);}
.wp-btn:active{transform:translateY(0);}
.wp-btn-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.wp-btn-ghost{
  background:transparent;border:1px solid #1a2d4a;color:#4a6280;
  padding:13px 22px;font-family:'Barlow Condensed',sans-serif;
  font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
  border-radius:4px;cursor:pointer;transition:all .2s;
}
.wp-btn-ghost:hover{border-color:#00e5ff;color:#00e5ff;}
.wp-credit{margin-top:22px;font-size:11px;letter-spacing:1px;color:#2a4060;}
.wp-credit span{color:#4a6280;}
.wp-version{
  position:absolute;bottom:14px;right:16px;
  font-family:'Share Tech Mono',monospace;font-size:10px;color:#2a4060;letter-spacing:1px;
}
.wp-corner{position:absolute;width:14px;height:14px;border-color:#1a2d4a;border-style:solid;}
.wp-corner-tl{top:10px;left:10px;border-width:1px 0 0 1px;}
.wp-corner-tr{top:10px;right:10px;border-width:1px 1px 0 0;}
.wp-corner-bl{bottom:10px;left:10px;border-width:0 0 1px 1px;}
.wp-corner-br{bottom:10px;right:10px;border-width:0 1px 1px 0;}
@keyframes wp-fade{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

/* ---- Preview panel ---- */
.wp-preview{
  background:rgba(10,22,40,0.92);border:1px solid #1a2d4a;border-radius:8px;
  padding:20px 20px 16px;display:flex;flex-direction:column;gap:12px;
  box-shadow:0 24px 60px rgba(0,0,0,0.7);
  animation:wp-fade .6s ease .15s both;position:relative;
}
.wp-preview::before{
  content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
  background:linear-gradient(90deg,transparent,#e879f9,transparent);
}
.wp-p-head{display:flex;align-items:center;gap:10px;}
.wp-p-title{
  font-size:10px;font-weight:700;letter-spacing:3px;color:#4a6280;text-transform:uppercase;
}
.wp-p-badge{
  margin-left:auto;font-family:'Share Tech Mono',monospace;font-size:9px;
  letter-spacing:1px;color:#e879f9;padding:2px 8px;border:1px solid rgba(232,121,249,.35);
  border-radius:2px;background:rgba(232,121,249,.07);
}
.wp-p-dot{width:6px;height:6px;border-radius:50%;background:#a3e635;
  box-shadow:0 0 7px #a3e635;animation:wp-blink 1.4s ease-in-out infinite;}
@keyframes wp-blink{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.2;transform:scale(.5);}}
.wp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.wp-kpi{
  background:#060b14;border:1px solid #1a2d4a;border-top:2px solid;
  border-radius:4px;padding:8px 10px;position:relative;overflow:hidden;
  transition:transform .25s, border-color .25s;
}
.wp-kpi:hover{transform:translateY(-2px);}
.wp-kpi .l{font-size:8px;letter-spacing:2px;color:#4a6280;text-transform:uppercase;}
.wp-kpi .v{font-size:20px;font-weight:900;font-family:'Share Tech Mono',monospace;line-height:1.1;}
.wp-kpi .u{font-size:10px;color:#4a6280;margin-left:2px;font-weight:400;}
.wp-halls{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.wp-hall{
  background:#060b14;border:1px solid #1a2d4a;border-radius:4px;
  padding:8px 6px;text-align:center;cursor:pointer;
  transition:border-color .2s, box-shadow .2s, transform .2s;user-select:none;
}
.wp-hall:hover{transform:translateY(-2px);}
.wp-hall.on{border-color:var(--hc);box-shadow:0 0 14px var(--hg);}
.wp-hall .id{font-size:13px;font-weight:900;letter-spacing:1px;color:var(--hc);}
.wp-hall .pue{font-size:10px;font-family:'Share Tech Mono',monospace;margin-top:2px;}
.wp-hall .bar{height:3px;background:#1a2d4a;border-radius:2px;margin-top:5px;overflow:hidden;}
.wp-hall .bar i{display:block;height:100%;background:var(--hc);box-shadow:0 0 6px var(--hc);transition:width .6s ease;}
.wp-chart{
  background:#060b14;border:1px solid #1a2d4a;border-radius:4px;padding:8px 8px 4px;
}
.wp-mini-tabs{display:flex;gap:4px;margin-bottom:6px;}
.wp-mini-tab{
  background:transparent;border:1px solid #1a2d4a;border-radius:2px;
  padding:2px 8px;font-size:9px;letter-spacing:1px;color:#4a6280;cursor:pointer;
  font-family:'Barlow Condensed',sans-serif;transition:all .15s;
}
.wp-mini-tab.on{border-color:#00e5ff;color:#00e5ff;background:rgba(0,229,255,.08);}
.wp-foot{display:flex;justify-content:space-between;align-items:center;}
.wp-hint{font-size:10px;letter-spacing:1px;color:#2a4060;}
`;

const BMSIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00e5ff"/>
        <stop offset="100%" stopColor="#e879f9"/>
      </linearGradient>
    </defs>
    <rect x="6" y="8"  width="52" height="12" rx="2" fill="url(#wg)" opacity=".9"/>
    <rect x="6" y="26" width="52" height="12" rx="2" fill="url(#wg)" opacity=".65"/>
    <rect x="6" y="44" width="52" height="12" rx="2" fill="url(#wg)" opacity=".4"/>
    <circle cx="50" cy="14" r="3" fill="#060b14"/>
    <circle cx="50" cy="32" r="3" fill="#060b14"/>
    <circle cx="50" cy="50" r="3" fill="#060b14"/>
    <rect x="10" y="11" width="28" height="6" rx="1" fill="rgba(6,11,20,.3)"/>
    <rect x="10" y="29" width="22" height="6" rx="1" fill="rgba(6,11,20,.3)"/>
    <rect x="10" y="47" width="18" height="6" rx="1" fill="rgba(6,11,20,.3)"/>
  </svg>
);

const HALL_COLORS: Record<string,{c:string;g:string}> = {
  A:{c:"#00e5ff",g:"rgba(0,229,255,0.35)"},
  B:{c:"#a3e635",g:"rgba(163,230,53,0.35)"},
  C:{c:"#f97316",g:"rgba(249,115,22,0.35)"},
  D:{c:"#e879f9",g:"rgba(232,121,249,0.35)"},
  E:{c:"#facc15",g:"rgba(250,204,21,0.35)"},
};
const HALL_IDS = ["A","B","C","D","E"] as const;

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#0a1628",border:"1px solid #1a2d4a",padding:"6px 10px",
      borderRadius:3,fontFamily:"'Share Tech Mono',monospace",fontSize:10,
      boxShadow:"0 4px 24px rgba(0,0,0,.7)"}}>
      <div style={{color:"#4a6280",fontSize:9,marginBottom:3}}>{label}</div>
      {payload.map((p:any,i:number)=>(
        <div key={i} style={{color:p.color}}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

type Props = { onEnter: () => void; onEnterWithSample?: () => void };

export default function WelcomePage({ onEnter, onEnterWithSample }: Props) {
  const [clock, setClock] = useState(new Date());
  const [hall, setHall] = useState<typeof HALL_IDS[number]>("A");
  const [metric, setMetric] = useState<"temp"|"hum"|"pue">("temp");

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = useMemo(() => Object.keys(SAMPLE_HOURLY).sort(), []);

  const latest = SAMPLE_HOURLY[hours[hours.length - 1]];
  const avgPUE = useMemo(() => {
    const vals = HALL_IDS.map(h => latest[h]?.pue).filter(Boolean) as number[];
    return +(vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(2);
  }, [latest]);
  const avgTemp = useMemo(() => {
    const vals = HALL_IDS.map(h => latest[h]?.temp).filter(Boolean) as number[];
    return +(vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1);
  }, [latest]);
  const totalIT = useMemo(
    () => HALL_IDS.reduce((s,h)=>s+(latest[h]?.itLoad??0),0),
    [latest]
  );

  const hallSeries = useMemo(() => hours.map(h => ({
    hour: h.slice(0,2),
    A: SAMPLE_HOURLY[h].A?.[metric],
    B: SAMPLE_HOURLY[h].B?.[metric],
    C: SAMPLE_HOURLY[h].C?.[metric],
    D: SAMPLE_HOURLY[h].D?.[metric],
    E: SAMPLE_HOURLY[h].E?.[metric],
  })), [hours, metric]);

  const dailySeries = useMemo(() => SAMPLE_DAILY.map(d => ({
    date: d.date.slice(0,6),
    pue: d.pue,
  })), []);

  const hc = HALL_COLORS[hall];

  return (
    <>
      <style>{CSS}</style>
      <div className="wp-root">
        <div className="wp-grid"/>
        <div className="wp-glow"/>

        <div className="wp-stage">
          {/* Hero card */}
          <div className="wp-card">
            <div className="wp-corner wp-corner-tl"/>
            <div className="wp-corner wp-corner-tr"/>
            <div className="wp-corner wp-corner-bl"/>
            <div className="wp-corner wp-corner-br"/>

            <BMSIcon/>
            <div className="wp-subtitle">STT Makati Data Center</div>
            <div className="wp-title">DC · BMS</div>
            <div className="wp-org">Building Management System</div>
            <div className="wp-divider"/>
            <div className="wp-desc">
              Real-time monitoring for Data Halls A–E. Track Temperature,
              Humidity, IT Load, and Power Usage Effectiveness across your
              entire facility from a single dashboard.
            </div>
            <div className="wp-pills">
              {["5 Data Halls","PUE Monitoring","Hourly Logging",
                "5-Day Summary","CSV / PDF Import"].map(p => (
                <span key={p} className="wp-pill">{p}</span>
              ))}
            </div>
            <div className="wp-btn-row">
              <button className="wp-btn" onClick={onEnter}>Enter Dashboard</button>
              {onEnterWithSample && (
                <button className="wp-btn-ghost" onClick={onEnterWithSample}>
                  Try with sample data
                </button>
              )}
            </div>
            <div className="wp-credit">
              Developed by <span>Edison Latag</span>
            </div>
            <div className="wp-version">
              {clock.toLocaleTimeString("en-GB", { hour12: false })} &nbsp;·&nbsp; v1.1.0
            </div>
          </div>

          {/* Live sample preview */}
          <div className="wp-preview">
            <div className="wp-p-head">
              <div className="wp-p-dot"/>
              <div className="wp-p-title">Live Preview · Sample Data</div>
              <div className="wp-p-badge">DEMO</div>
            </div>

            <div className="wp-kpis">
              <div className="wp-kpi" style={{borderTopColor:"#00e5ff"}}>
                <div className="l">PUE</div>
                <div className="v" style={{color:"#00e5ff"}}>{avgPUE}</div>
              </div>
              <div className="wp-kpi" style={{borderTopColor:"#f97316"}}>
                <div className="l">AVG TEMP</div>
                <div className="v" style={{color:"#f97316"}}>{avgTemp}<span className="u">°C</span></div>
              </div>
              <div className="wp-kpi" style={{borderTopColor:"#a3e635"}}>
                <div className="l">TOTAL IT</div>
                <div className="v" style={{color:"#a3e635"}}>{totalIT}<span className="u">kW</span></div>
              </div>
              <div className="wp-kpi" style={{borderTopColor:"#e879f9"}}>
                <div className="l">HOURS</div>
                <div className="v" style={{color:"#e879f9"}}>{hours.length}</div>
              </div>
            </div>

            <div className="wp-halls">
              {HALL_IDS.map(id => {
                const d = latest[id];
                const pct = d ? Math.min(100, ((d.pue-1)/1.5)*100) : 0;
                const colors = HALL_COLORS[id];
                return (
                  <div key={id}
                    className={`wp-hall ${hall===id?"on":""}`}
                    onClick={()=>setHall(id)}
                    style={{ ["--hc" as any]: colors.c, ["--hg" as any]: colors.g }}>
                    <div className="id">{id}</div>
                    <div className="pue" style={{color:colors.c}}>{d?.pue}</div>
                    <div className="bar"><i style={{width:`${pct}%`}}/></div>
                  </div>
                );
              })}
            </div>

            <div className="wp-chart">
              <div className="wp-mini-tabs">
                {(["temp","hum","pue"] as const).map(k => (
                  <button key={k} className={`wp-mini-tab ${metric===k?"on":""}`}
                    onClick={()=>setMetric(k)}>
                    {k==="temp"?"TEMP":k==="hum"?"HUM":"PUE"}
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={hallSeries} margin={{top:4,right:8,left:-28,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a"/>
                  <XAxis dataKey="hour" tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                  <YAxis tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                  <Tooltip content={<Tip/>}/>
                  {metric==="pue" && <ReferenceLine y={1.83} stroke="#facc15" strokeDasharray="4 3"/>}
                  <Line type="monotone" dataKey={hall} name={`Hall ${hall}`}
                    stroke={hc.c} strokeWidth={2.2} dot={false}
                    isAnimationActive animationDuration={600}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="wp-chart">
              <div className="wp-p-title" style={{marginBottom:4}}>5-Day PUE Trend</div>
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={dailySeries} margin={{top:4,right:8,left:-28,bottom:0}}>
                  <defs>
                    <linearGradient id="wp-pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={.3}/>
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                  <YAxis domain={["auto","auto"]} tick={{fill:"#4a6280",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="pue" stroke="#00e5ff" strokeWidth={2}
                    fill="url(#wp-pg)" isAnimationActive animationDuration={700}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="wp-foot">
              <span className="wp-hint">↻ Click halls & metric tabs to preview</span>
              <span className="wp-hint">{hours[0]}–{hours[hours.length-1]} · sample</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
