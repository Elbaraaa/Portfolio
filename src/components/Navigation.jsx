import { useState, useEffect, useRef } from "react";
import { mkPanel } from "../styles/theme";
import { SECTIONS } from "../data/content";

function getIsDarkFromColor(color) {
  if (!color || typeof color !== "string") return true;

  const c = color.trim().toLowerCase();

  let r, g, b;

  if (c.startsWith("#")) {
    let hex = c.slice(1);

    if (hex.length === 3) {
      hex = hex.split("").map((ch) => ch + ch).join("");
    }

    if (hex.length !== 6) return true;

    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (c.startsWith("rgb")) {
    const nums = c.match(/\d+(\.\d+)?/g);
    if (!nums || nums.length < 3) return true;
    r = Number(nums[0]);
    g = Number(nums[1]);
    b = Number(nums[2]);
  } else {
    return true;
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function SectionDots({ current, goTo, C }) {
  return (
    <div style={{position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",zIndex:300,display: window.innerWidth <= 767 ? "none" : "flex",flexDirection:"column",gap:10}}>
      {SECTIONS.map((id,i)=>(
        <button key={id} onClick={()=>goTo(i)} style={{width:i===current?22:7,height:7,borderRadius:4,border:"none",cursor:"pointer",background:i===current?`linear-gradient(90deg,${C.accent},${C.green})`:C.border,transition:"all 0.3s",padding:0}}/>
      ))}
    </div>
  );
}

export function MenuOverlay({ open, onClose, goTo, C }) {
  const items=[{label:"About",idx:1,icon:"01",desc:"Who I am"},{label:"Projects",idx:2,icon:"02",desc:"Things I've shipped"},{label:"Experience",idx:3,icon:"03",desc:"Where I've worked"},{label:"Skills",idx:4,icon:"04",desc:"My tech stack"},{label:"Achievements",idx:5,icon:"05",desc:"Recognition"},{label:"Arcade",idx:6,icon:"06",desc:"Take a break 🎮"},{label:"Guestbook",idx:7,icon:"07",desc:"Leave your mark"},{label:"Hire Me",idx:8,icon:"08",desc:"Let's work together"},{label:"Contact",idx:9,icon:"09",desc:"Get in touch"}];
  const touchStartY = useRef(null);

  const isDarkTheme = getIsDarkFromColor(C.bg);
  const titleColor = isDarkTheme ? "#FFFFFF" : "#0F172A";
  const labelColor = isDarkTheme ? C.accent : C.textDim;
  const overlayBg = isDarkTheme
    ? "rgba(7,11,20,0.97)"
    : "rgba(245,248,255,0.96)";

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [open]);

  const handleWheel = (e) => {
    if (!open) return;
    e.preventDefault();
    if (e.deltaY > 6) onClose();
  };

  const handleTouchStart = (e) => {
    if (!open) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!open || touchStartY.current == null) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 24) {
      e.preventDefault();
      onClose();
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <div
      style={{position:"fixed",inset:0,zIndex:600,pointerEvents:open?"all":"none",overscrollBehavior:"contain"}}
      onClick={onClose}
      onWheelCapture={handleWheel}
      onTouchStartCapture={handleTouchStart}
      onTouchMoveCapture={handleTouchMove}
      onTouchEndCapture={handleTouchEnd}
    >
      <div
        style={{
          position:"absolute",
          inset:0,
          background: overlayBg,
          backdropFilter:"blur(20px)",
          opacity:open?1:0,
          transition:"opacity 0.4s"
        }}
      />
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"50%",left:"50%",transform:open?"translate(-50%,-50%) scale(1)":"translate(-50%,-50%) scale(0.96)",opacity:open?1:0,transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)",pointerEvents:open?"all":"none",width:"100%",maxWidth:760,padding:"0 32px"}}>
        <div style={{maxWidth:720,width:"100%",padding:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
            <div>
              <div style={{fontFamily:"monospace",fontSize:10,color:labelColor,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>Navigation</div>
              <div style={{fontFamily:"system-ui",fontWeight:800,fontSize:30,color:titleColor}}>Where to?</div>
            </div>
            <button onClick={onClose} style={{width:44,height:44,borderRadius:"50%",border:`1px solid ${C.border}`,background:C.panel,color:C.textSecondary,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns: window.innerWidth <= 600 ? "1fr 1fr" : "1fr 1fr 1fr",gap:10}}>
            {items.map((item,i)=>(
              <button key={item.label} onClick={()=>{goTo(item.idx);onClose();}}
                style={{...mkPanel(C,{padding:"18px 20px",cursor:"pointer",textAlign:"left",transition:"all 0.25s"}),animation:open?`fadeUp 0.4s ${i*0.04}s both`:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"50";e.currentTarget.style.background=C.accent+"08";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.panel;}}>
                <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,marginBottom:6}}>{item.icon}</div>
                <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:15,color:C.textPrimary,marginBottom:3}}>{item.label}</div>
                <div style={{fontFamily:"monospace",fontSize:10,color:C.textSecondary}}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NavBar({ onMenu, onTerminal, C, darkMode, toggleDark }) {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",h,{passive:true}); return()=>window.removeEventListener("scroll",h); },[]);
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",background:scrolled?`${C.bg}E6`:"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"1px solid transparent",transition:"all 0.3s"}}>
      <button onClick={()=>document.getElementById("hero").scrollIntoView({behavior:"smooth"})} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer"}}>
        <div style={{width:26,height:26,border:`1px solid ${C.accent}50`,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",background:`${C.accent}08`}}>
          <div style={{width:8,height:8,background:`linear-gradient(135deg,${C.accent},${C.green})`,borderRadius:2}}/>
        </div>
        <span style={{fontFamily:"monospace",fontSize:12,color:C.textDim}}>elbaraa.dev</span>
      </button>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          style={{
            position:"relative",
            width:82,
            height:34,
            borderRadius:999,
            border:`1px solid ${darkMode ? "rgba(255,255,255,0.08)" : `${C.green}30`}`,
            background: darkMode
              ? "linear-gradient(90deg, #0f172a, #1e293b)"
              : `linear-gradient(90deg, ${C.green}10, ${C.green}08)`,
            cursor:"pointer",
            padding:0,
            transition:"background 0.3s ease, border-color 0.3s ease",
            overflow:"hidden"
          }}
        >
          <span
            style={{
              position:"absolute",
              inset:0,
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              padding:"0 10px",
              fontSize:12,
              pointerEvents:"none"
            }}
          >
            <span>☀️</span>
            <span>🌙</span>
          </span>
          <span
            style={{
              position:"absolute",
              top:3,
              left:3,
              width:36,
              height:28,
              borderRadius:999,
              background: darkMode ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
              boxShadow:"0 6px 14px rgba(0,0,0,0.12)",
              transform: darkMode ? "translateX(40px)" : "translateX(0)",
              transition:"transform 0.32s cubic-bezier(.2,.8,.2,1), background 0.3s ease"
            }}
          />
        </button>

        <button
          onClick={onTerminal}
          style={{
            fontFamily:"monospace",
            fontSize:11,
            padding:"7px 14px",
            border:`1px solid ${C.green}30`,
            borderRadius:6,
            color:C.green,
            background:`${C.green}08`,
            cursor:"pointer"
          }}
        >
          $_ Terminal
        </button>

        <button onClick={onMenu} style={{display:"flex",flexDirection:"column",gap:4,padding:"10px 12px",border:`1px solid ${C.border}`,borderRadius:7,background:C.panel,cursor:"pointer"}}>
          {[0,1,2].map(i=><div key={i} style={{width:18,height:1.5,background:i===1?C.accent:C.textDim,borderRadius:1}}/>)}
        </button>
      </div>
    </nav>
  );
}

export function BackToTop({ goTo, C }) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{ const h=()=>setVisible(window.scrollY>200); window.addEventListener("scroll",h,{passive:true}); return()=>window.removeEventListener("scroll",h); },[]);
  return (
    <button onClick={()=>goTo(0)} style={{position:"fixed",bottom:88,left:24,zIndex:800,width:40,height:40,borderRadius:"50%",background:C.panel,border:`1px solid ${C.border}`,color:C.textSecondary,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(12px)",transition:"opacity 0.3s, transform 0.3s",pointerEvents:visible?"all":"none"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSecondary;}}>↑</button>
  );
}

export function Footer({ C }) {
  return (
    <footer style={{padding:"22px 60px",background:C.bg,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim}}>elbaraa.dev</span>
      <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim}}>© 2025 Elbaraa Abdalla</span>
      <div style={{display:"flex",alignItems:"center",gap:7,fontFamily:"monospace",fontSize:11,color:C.textDim}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>All systems operational
      </div>
    </footer>
  );
}