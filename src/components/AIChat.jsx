import { useState, useEffect, useRef } from "react";
import { mkPanel } from "../styles/theme";

const SYSTEM_PROMPT = "You are Elbaraa Abdalla, speaking in first person on your personal portfolio website. You are a CS student at the University of Arizona, full-stack engineer, AI researcher, and undergrad TA. Be casual, confident, and genuine. Keep answers concise (2-4 sentences).";

export function AIChat({ C }) {
  const [open,setOpen]=useState(false);const [msgs,setMsgs]=useState([{role:"assistant",content:"Hey! I'm Elbaraa. Ask me anything about my projects, experience, or whether I'd be a fit for your team 👋"}]);const [input,setInput]=useState("");const [loading,setLoading]=useState(false);
  const endRef=useRef(null);useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{
    if(!input.trim()||loading)return;const userMsg={role:"user",content:input.trim()};const newMsgs=[...msgs,userMsg];
    setMsgs(newMsgs);setInput("");setLoading(true);
    try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM_PROMPT,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});const d=await res.json();const text=d.content?.find(b=>b.type==="text")?.text||"Sorry, something went wrong!";setMsgs(p=>[...p,{role:"assistant",content:text}]);}
    catch{setMsgs(p=>[...p,{role:"assistant",content:"Oops — try again!"}]);}
    setLoading(false);
  };
  return (
    <>
      <button onClick={()=>setOpen(p=>!p)} style={{position:"fixed",bottom:24,right:24,zIndex:800,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{open?"✕":"💬"}</button>
      {open&&(
        <div style={{position:"fixed",bottom:86,right:24,zIndex:800,width:320,animation:"scaleIn 0.2s ease-out"}}>
          <div style={mkPanel(C,{padding:0,borderColor:C.accent+"40"})}>
            <div style={{height:2,background:`linear-gradient(90deg,${C.accent},${C.green})`}}/>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.bg,fontWeight:700}}>E</div>
              <div><div style={{fontFamily:"system-ui",fontWeight:700,fontSize:13,color:C.textPrimary}}>Chat with Elbaraa</div><div style={{fontFamily:"monospace",fontSize:9,color:C.green}}>● AI-powered</div></div>
            </div>
            <div style={{height:260,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"82%",padding:"9px 13px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?`linear-gradient(135deg,${C.accent},${C.green})`:C.surface,color:m.role==="user"?C.bg:C.textSecondary,fontSize:12.5,lineHeight:1.6}}>{m.content}</div>
                </div>
              ))}
              {loading&&<div style={{display:"flex",gap:5,padding:"6px 10px"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:`bounce 1.2s ${i*0.2}s ease-in-out infinite`}}/>)}</div>}
              <div ref={endRef}/>
            </div>
            <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}} placeholder="Ask me anything…" maxLength={200} style={{flex:1,padding:"8px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.textPrimary,fontFamily:"system-ui",fontSize:12,outline:"none"}}/>
              <button onClick={send} disabled={!input.trim()||loading} style={{padding:"8px 12px",background:input.trim()?C.accent:C.border,color:input.trim()?C.bg:C.textDim,border:"none",borderRadius:8,cursor:input.trim()?"pointer":"default",fontSize:13,transition:"all 0.2s"}}>↑</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
