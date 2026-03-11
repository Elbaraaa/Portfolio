import { useState, useEffect } from "react";
import { personal, stats } from "../data/content";
import { mkPanel } from "../styles/theme";
import { Typewriter } from "./ui";

export function HeroSection({ onMenu, onHire, C }) {
  const [uptime,setUptime]=useState(0);
  useEffect(()=>{ const s=Date.now(); const t=setInterval(()=>setUptime(Math.floor((Date.now()-s)/1000)),1000); return()=>clearInterval(t); },[]);
  return (
    <section id="hero" style={{position:"relative",height:"100vh",display:"flex",alignItems:"center",overflow:"hidden",background:"transparent"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 50% at 35% 50%,rgba(124,111,255,0.06) 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"50%",right:48,transform:"translateY(-50%)",zIndex:5,...mkPanel(C,{padding:18,width:196,animation:"fadeUp 0.6s 1.4s both"})}}>
        <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>System</div>
        {[["BUILD","PASSING",C.green],["DEPLOY","LIVE",C.accent],["SESSION",uptime+"s",C.orange]].map(row=>(
          <div key={row[0]} style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontFamily:"monospace",fontSize:11}}>
            <span style={{color:C.textDim}}>{row[0]}</span><span style={{color:row[2]}}>{row[1]}</span>
          </div>
        ))}
        <div style={{height:1,background:C.border,margin:"10px 0"}}/>
        <div style={{display:"flex",alignItems:"center",gap:6,fontFamily:"monospace",fontSize:10,color:C.green,marginBottom:10}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>Summer 2026 open
        </div>
        <button style={{width:"100%",padding:"8px 0",background:`linear-gradient(90deg,${C.accent}20,${C.green}15)`,border:`1px solid ${C.accent}40`,borderRadius:6,color:C.accent,fontFamily:"monospace",fontSize:10,cursor:"pointer",fontWeight:700}} onClick={()=>alert("📄 Resume link coming soon!")}>📄 Download Resume</button>
      </div>
      <div style={{position:"relative",zIndex:4,padding:"0 60px",maxWidth:900,paddingTop:60}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 14px",border:`1px solid ${C.border}`,borderRadius:20,fontFamily:"monospace",fontSize:11,color:C.textSecondary,marginBottom:28,animation:"fadeUp 0.5s 0.2s both"}}>
          <span style={{fontSize:8,color:C.accent}}>◆</span>{personal.location}<span style={{color:C.border}}>·</span><span style={{color:C.green}}>●</span> Available
        </div>
        <h1 style={{fontFamily:"system-ui,-apple-system",fontWeight:800,lineHeight:0.92,margin:"0 0 20px",letterSpacing:"-0.03em",animation:"fadeUp 0.7s 0.4s both"}}>
          <span style={{display:"block",fontSize:"clamp(48px,7vw,82px)",background:`linear-gradient(135deg,${C.textPrimary},${C.accent})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Elbaraa</span>
          <span style={{display:"block",fontSize:"clamp(48px,7vw,82px)",background:`linear-gradient(135deg,${C.accent},${C.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Abdalla.</span>
        </h1>
        <div style={{fontFamily:"monospace",fontSize:14,color:C.accent,marginBottom:18,minHeight:22,animation:"fadeUp 0.5s 0.9s both"}}><Typewriter text={`> ${personal.subTagline}`} delay={1000}/></div>
        <p style={{color:C.textSecondary,fontSize:15,lineHeight:1.75,maxWidth:500,marginBottom:32,animation:"fadeUp 0.6s 1.1s both"}}>I build systems that close the gap between research and real-world impact.</p>
        <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim,marginBottom:24,animation:"fadeUp 0.5s 3s both",display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:C.accent,opacity:0.5}}>🔮</span>
          <span>type <span style={{color:C.accent,borderBottom:`1px dashed ${C.accent}50`}}>elbaraa</span> anywhere to open the secret terminal</span>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:48,animation:"fadeUp 0.5s 1.2s both",flexWrap:"wrap"}}>
          <button onClick={onMenu} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 26px",background:`linear-gradient(135deg,${C.accent},${C.green})`,color:C.bg,fontWeight:700,fontSize:13,borderRadius:7,border:"none",cursor:"pointer"}}>Explore Work ↓</button>
          <button onClick={onHire} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 26px",border:`1px solid ${C.border}`,color:C.textSecondary,fontSize:13,borderRadius:7,background:"none",fontFamily:"monospace",cursor:"pointer"}}>✉️ Hire Me</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",animation:"fadeUp 0.6s 1.5s both",maxWidth:520}}>
          {stats.map((s,i)=>(
            <div key={i} style={{padding:"14px 18px",background:C.surface,borderRight:i<3?`1px solid ${C.border}`:"none"}}>
              <div style={{fontFamily:"system-ui",fontSize:22,fontWeight:800,background:`linear-gradient(135deg,${C.textPrimary},${C.accent})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:3}}>{s.value}</div>
              <div style={{fontFamily:"monospace",fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",lineHeight:1.3}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",textAlign:"center",animation:"fadeUp 0.5s 2s both"}}>
        <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim,marginBottom:6}}>scroll to navigate</div>
        <div style={{color:C.textDim,animation:"bounce 1.6s ease-in-out infinite"}}>↓</div>
      </div>
    </section>
  );
}
