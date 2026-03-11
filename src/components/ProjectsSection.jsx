import { useState, useEffect } from "react";
import { projects } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

function ProjectCard({ project, onClick, C }) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      data-magnetic
      style={mkPanel(C,{padding:22,cursor:"pointer",position:"relative",overflow:"hidden",borderColor:hov?project.accent+"50":C.border,boxShadow:hov?`0 0 30px ${project.accent}15`:"none",transition:"all 0.3s",transform:hov?"translateY(-2px)":"none"})}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${project.accent},${project.accent}40)`,opacity:hov?1:0,transition:"opacity 0.3s"}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:project.status==="shipped"?C.green:C.orange}}/>
            <span style={{fontFamily:"monospace",fontSize:9,color:project.status==="shipped"?C.green:C.orange,textTransform:"uppercase"}}>{project.status}</span>
          </div>
          <h3 style={{fontFamily:"system-ui",fontSize:16,fontWeight:700,color:C.textPrimary,margin:0}}>{project.title}</h3>
          <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim,marginTop:2}}>{project.subtitle}</div>
        </div>
        <span style={{color:C.textDim,fontSize:14,opacity:hov?1:0,transition:"opacity 0.2s"}}>↗</span>
      </div>
      <div style={{display:"inline-block",fontFamily:"monospace",fontSize:10,padding:"2px 8px",border:`1px solid ${project.accent}30`,color:project.accent,borderRadius:4,marginBottom:10}}>{project.category}</div>
      <p style={{color:C.textSecondary,fontSize:12.5,lineHeight:1.7,margin:"0 0 12px"}}>{project.description}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {project.tech.slice(0,4).map(t=><span key={t} style={{fontFamily:"monospace",fontSize:10,padding:"2px 6px",background:C.bg,border:`1px solid ${C.border}50`,borderRadius:3,color:C.textDim}}>{t}</span>)}
      </div>
    </div>
  );
}

function ProjectOverlay({ project, onClose, C }) {
  useEffect(()=>{ if(!project) return; const h=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[project,onClose]);
  if(!project) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(7,11,20,0.93)",backdropFilter:"blur(10px)"}}/>
      <div onClick={e=>e.stopPropagation()} style={mkPanel(C,{position:"relative",maxWidth:680,width:"100%",padding:36,borderColor:project.accent+"50",animation:"scaleIn 0.25s ease-out"})}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${project.accent},${project.accent}40)`,borderRadius:"10px 10px 0 0"}}/>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.textSecondary,cursor:"pointer"}}>✕</button>
        <div style={{display:"inline-block",fontFamily:"monospace",fontSize:10,padding:"2px 8px",border:`1px solid ${project.accent}30`,color:project.accent,borderRadius:4,marginBottom:12}}>{project.category}</div>
        <h2 style={{fontFamily:"system-ui",fontSize:26,fontWeight:800,color:C.textPrimary,margin:"0 0 4px"}}>{project.title}</h2>
        <div style={{fontFamily:"monospace",fontSize:12,color:C.textDim,marginBottom:20}}>{project.subtitle}</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
          <div>
            <p style={{color:C.textSecondary,lineHeight:1.8,fontSize:14,margin:"0 0 20px"}}>{project.longDescription}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {project.tech.map(t=><span key={t} style={{fontFamily:"monospace",fontSize:12,padding:"4px 10px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:5,color:C.textSecondary}}>{t}</span>)}
            </div>
          </div>
          <div style={mkPanel(C,{padding:14})}>
            <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,textTransform:"uppercase",marginBottom:10}}>Metrics</div>
            {project.metrics.map(m=>(
              <div key={m} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:project.accent}}/>
                <span style={{fontFamily:"monospace",fontSize:12,color:C.textSecondary}}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ C }) {
  const {ref,inView}=useInView(0.05); const [sel,setSel]=useState(null);
  return (
    <section id="projects" ref={ref} style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative"}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="02" label="Projects" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 36px",color:C.textPrimary}}>Things I've <span style={{color:C.textDim}}>shipped.</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {projects.map(p=><ProjectCard key={p.id} project={p} onClick={()=>setSel(p)} C={C}/>)}
        </div>
      </div>
      <ProjectOverlay project={sel} onClose={()=>setSel(null)} C={C}/>
    </section>
  );
}
