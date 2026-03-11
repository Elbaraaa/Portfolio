import { useState, useEffect } from "react";
import { mkPanel } from "../styles/theme";
import { SECTIONS } from "../data/content";

export function SectionDots({ current, goTo, C }) {
  return (
    <div style={{position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",zIndex:300,display:"flex",flexDirection:"column",gap:10}}>
      {SECTIONS.map((id,i)=>(
        <button key={id} onClick={()=>goTo(i)} style={{width:i===current?22:7,height:7,borderRadius:4,border:"none",cursor:"pointer",background:i===current?`linear-gradient(90deg,${C.accent},${C.green})`:C.border,transition:"all 0.3s",padding:0}}/>
      ))}
    </div>
  );
}

export function MenuOverlay({ open, onClose, goTo, C }) {
  const items=[{label:"About",idx:1,icon:"01",desc:"Who I am"},{label:"Projects",idx:2,icon:"02",desc:"Things I've shipped"},{label:"Experience",idx:3,icon:"03",desc:"Where I've worked"},{label:"Skills",idx:4,icon:"04",desc:"My tech stack"},{label:"Achievements",idx:5,icon:"05",desc:"Recognition"},{label:"Arcade",idx:6,icon:"06",desc:"Take a break 🎮"},{label:"Guestbook",idx:7,icon:"07",desc:"Leave your mark"},{label:"Hire Me",idx:8,icon:"08",desc:"Let's work together"},{label:"Contact",idx:9,icon:"09",desc:"Get in touch"}];
  return (
    <div style={{position:"fixed",inset:0,zIndex:600,pointerEvents:open?"all":"none"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(7,11,20,0.97)",backdropFilter:"blur(20px)",opacity:open?1:0,transition:"opacity 0.4s"}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"50%",left:"50%",transform:open?"translate(-50%,-50%) scale(1)":"translate(-50%,-50%) scale(0.96)",opacity:open?1:0,transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)",pointerEvents:open?"all":"none",width:"100%",maxWidth:760,padding:"0 32px"}}>
        <div style={{maxWidth:720,width:"100%",padding:"0 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
            <div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>Navigation</div>
              <div style={{fontFamily:"system-ui",fontWeight:800,fontSize:30,color:C.textPrimary}}>Where to?</div>
            </div>
            <button onClick={onClose} style={{width:44,height:44,borderRadius:"50%",border:`1px solid ${C.border}`,background:C.panel,color:C.textSecondary,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
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
        <button onClick={toggleDark} style={{fontFamily:"monospace",fontSize:13,padding:"5px 10px",border:`1px solid ${C.border}`,borderRadius:6,color:C.textSecondary,background:C.panel,cursor:"pointer"}}>{darkMode ? "☀️" : "🌙"}</button>
        <button onClick={onTerminal} style={{fontFamily:"monospace",fontSize:10,padding:"5px 12px",border:`1px solid ${C.green}30`,borderRadius:6,color:C.green,background:`${C.green}08`,cursor:"pointer"}}>$_ Terminal</button>
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
