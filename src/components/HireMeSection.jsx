import { useState } from "react";
import { personal } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function HireMeSection({ C }) {
  const {ref,inView}=useInView(0.1);
  const [form,setForm]=useState({name:"",email:"",company:"",message:""});const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);const [err,setErr]=useState("");
  const handleSubmit=async()=>{
    if(!form.name||!form.email||!form.message){setErr("Please fill in name, email and message.");return;}
    setSending(true);setErr("");
    try{const res=await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(form)});if(res.ok){setSent(true);setForm({name:"",email:"",company:"",message:""});}else setErr("Something went wrong. Try emailing me directly!");}
    catch{setErr("Network error. Try emailing me directly!");}
    setSending(false);
  };
  const reasons=[{icon:"🚀",text:"Shipped real production systems for a university"},{icon:"🏆",text:"2x hackathon winner — AI & full-stack"},{icon:"📐",text:"3.9 GPA + Dean's List while working two roles"},{icon:"🧠",text:"End-to-end ownership: design → deploy → maintain"}];
  return (
    <section id="hire" ref={ref} className="section-pad" style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 60% at 50% 50%,${C.accent}06,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%",position:"relative",zIndex:2}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="08" label="Hire Me" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 8px"}}>
            <span style={{color:C.textPrimary}}>Ready to </span>
            <span className="grad-text" style={{background:`linear-gradient(90deg,${C.accent},${C.green})`}}>make an impact.</span>
          </h2>
          <p style={{color:C.textSecondary,fontSize:15,lineHeight:1.75,maxWidth:520,marginBottom:40}}>Looking for Summer 2026 internships in software engineering, full-stack dev, and applied AI.</p>
        </div>
        <div className="hire-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,opacity:inView?1:0,transition:"all 0.7s 0.2s"}}>
          <div>
            <div className="hire-reasons-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {reasons.map((r,i)=>(
                <div key={i} style={mkPanel(C,{padding:16,display:"flex",gap:10,alignItems:"flex-start",transition:"border-color 0.3s",boxShadow:`0 2px 12px rgba(0,0,0,0.3)`})}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"40";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
                  <span style={{fontSize:18,flexShrink:0}}>{r.icon}</span>
                  <span style={{fontFamily:"system-ui",fontSize:12,color:C.textSecondary,lineHeight:1.5}}>{r.text}</span>
                </div>
              ))}
            </div>
            <div style={mkPanel(C,{padding:18,borderColor:C.green+"30",boxShadow:`0 2px 16px rgba(0,0,0,0.35)`})}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
                <span style={{fontFamily:"monospace",fontSize:11,color:C.green,fontWeight:700}}>Available · Summer 2026</span>
              </div>
              <p style={{fontFamily:"system-ui",fontSize:13,color:C.textSecondary,margin:"0 0 14px",lineHeight:1.6}}>If you're working on hard problems that need a builder who cares — let's talk.</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href={`mailto:${personal.email}`} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:`linear-gradient(135deg,${C.accent},${C.green})`,color:C.bg,fontWeight:700,fontSize:12,borderRadius:7,textDecoration:"none"}}>✉️ Email directly</a>
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",border:`1px solid ${C.border}`,color:C.textSecondary,fontSize:12,borderRadius:7,textDecoration:"none",fontFamily:"monospace"}}>💼 LinkedIn</a>
              </div>
            </div>
          </div>
          <div style={mkPanel(C,{padding:26,borderColor:C.accent+"30",boxShadow:`0 2px 16px rgba(0,0,0,0.35)`})}>
            <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:18}}>Send a message</div>
            {sent
              ?<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:48,marginBottom:12}}>🚀</div><div style={{fontFamily:"system-ui",fontWeight:700,fontSize:18,color:C.textPrimary,marginBottom:8}}>Message sent!</div><button onClick={()=>setSent(false)} style={{marginTop:16,fontFamily:"monospace",fontSize:11,padding:"7px 16px",border:`1px solid ${C.border}`,borderRadius:6,background:"none",color:C.textDim,cursor:"pointer"}}>Send another</button></div>
              :<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {[["name","Your name *","text"],["email","Email *","email"],["company","Company / Role","text"]].map(([k,ph,type])=>(
                    <input key={k} type={type} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{gridColumn:k==="company"?"1/-1":"auto",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,fontFamily:"monospace",fontSize:12,outline:"none",boxSizing:"border-box",width:"100%"}}/>
                  ))}
                </div>
                <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="What are you working on? *" maxLength={600} rows={5} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,fontFamily:"monospace",fontSize:12,outline:"none",resize:"none",marginBottom:12,boxSizing:"border-box"}}/>
                {err&&<div style={{fontFamily:"monospace",fontSize:11,color:C.pink,marginBottom:10}}>{err}</div>}
                <button onClick={handleSubmit} disabled={sending} style={{width:"100%",padding:"12px 0",background:`linear-gradient(135deg,${C.accent},${C.green})`,color:C.bg,fontWeight:800,fontSize:13,borderRadius:7,border:"none",cursor:"pointer",fontFamily:"monospace"}}>{sending?"Sending…":"🚀 Send Message"}</button>
              </>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
