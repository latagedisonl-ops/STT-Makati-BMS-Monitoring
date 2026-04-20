import { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&display=swap');
.wp-root{
  font-family:'Barlow Condensed',sans-serif;
  background:#060b14;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  position:relative;
  overflow:hidden;
  color:#c8dff0;
}
.wp-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
  background-size:40px 40px;
  pointer-events:none;
}
.wp-glow{
  position:absolute;
  width:600px;height:600px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%);
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;
}
.wp-card{
  background:rgba(10,22,40,0.95);
  border:1px solid #1a2d4a;
  border-radius:8px;
  padding:52px 60px;
  max-width:640px;
  width:90%;
  text-align:center;
  position:relative;
  box-shadow:0 0 80px rgba(0,229,255,0.08), 0 24px 60px rgba(0,0,0,0.8);
}
.wp-card::before{
  content:'';position:absolute;top:0;left:10%;right:10%;height:2px;
  background:linear-gradient(90deg,transparent,#00e5ff,transparent);
  border-radius:2px;
}
.wp-icon{
  margin:0 auto 20px;
  width:64px;height:64px;
}
.wp-subtitle{
  font-size:11px;letter-spacing:5px;color:#4a6280;
  text-transform:uppercase;margin-bottom:12px;
}
.wp-title{
  font-size:42px;font-weight:900;letter-spacing:2px;
  color:#00e5ff;
  text-shadow:0 0 30px rgba(0,229,255,0.4);
  line-height:1;margin-bottom:6px;
}
.wp-org{
  font-size:16px;font-weight:300;letter-spacing:4px;
  color:#c8dff0;margin-bottom:28px;
}
.wp-divider{
  height:1px;background:linear-gradient(90deg,transparent,#1a2d4a,transparent);
  margin:0 auto 24px;width:80%;
}
.wp-desc{
  font-size:15px;color:#4a6280;line-height:1.7;
  margin-bottom:32px;font-weight:300;
}
.wp-pills{
  display:flex;flex-wrap:wrap;gap:8px;
  justify-content:center;margin-bottom:36px;
}
.wp-pill{
  background:rgba(0,229,255,0.07);
  border:1px solid rgba(0,229,255,0.2);
  border-radius:3px;padding:4px 14px;
  font-size:10px;letter-spacing:2px;color:#00e5ff;
}
.wp-btn{
  background:#00e5ff;color:#060b14;
  border:none;border-radius:4px;
  padding:14px 48px;
  font-family:'Barlow Condensed',sans-serif;
  font-size:16px;font-weight:900;
  letter-spacing:4px;text-transform:uppercase;
  cursor:pointer;
  transition:all .2s;
  box-shadow:0 0 24px rgba(0,229,255,0.3);
}
.wp-btn:hover{
  background:#33ecff;
  box-shadow:0 0 40px rgba(0,229,255,0.5);
  transform:translateY(-1px);
}
.wp-credit{
  margin-top:28px;
  font-size:11px;letter-spacing:1px;color:#2a4060;
}
.wp-credit span{color:#4a6280;}
.wp-version{
  position:absolute;bottom:20px;right:24px;
  font-family:'Share Tech Mono',monospace;
  font-size:10px;color:#2a4060;letter-spacing:1px;
}
.wp-corner{
  position:absolute;
  width:16px;height:16px;
  border-color:#1a2d4a;border-style:solid;
}
.wp-corner-tl{top:12px;left:12px;border-width:1px 0 0 1px;}
.wp-corner-tr{top:12px;right:12px;border-width:1px 1px 0 0;}
.wp-corner-bl{bottom:12px;left:12px;border-width:0 0 1px 1px;}
.wp-corner-br{bottom:12px;right:12px;border-width:0 1px 1px 0;}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.wp-card{animation:fadeIn .6s ease forwards;}
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

export default function WelcomePage({ onEnter }: { onEnter: () => void }) {
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="wp-root">
        <div className="wp-grid"/>
        <div className="wp-glow"/>
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
              "5-Day Summary","CSV Import/Export"].map(p => (
              <span key={p} className="wp-pill">{p}</span>
            ))}
          </div>
          <button className="wp-btn" onClick={onEnter}>
            Enter Dashboard
          </button>
          <div className="wp-credit">
            Developed by <span>Edison Latag</span>
          </div>
          <div className="wp-version">
            {clock.toLocaleTimeString("en-GB", { hour12: false })} &nbsp;·&nbsp; v1.0.0
          </div>
        </div>
      </div>
    </>
  );
}
