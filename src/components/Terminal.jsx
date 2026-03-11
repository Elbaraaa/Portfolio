import { useState, useEffect, useRef } from "react";
import { mkPanel } from "../styles/theme";

const CMDS = {
  help:()=>"Available commands:\n  projects · skills · hire · about · contact · clear\n  sudo hire elbaraa",
  projects:()=>"Projects:\n  Wildcat Helper — RAG (92% acc)\n  UA LinkAuditBot — 10K pages/hr\n  SVG Campus Map — D3.js viz\n  DocuMind RAG — enterprise docs",
  skills:()=>"Stack:\n  Python TypeScript C++ SQL\n  React Next.js D3.js Tailwind\n  FastAPI PostgreSQL Docker Redis\n  LangChain FAISS OpenAI HuggingFace",
  about:()=>"Elbaraa — CS @ UA, full-stack + AI.\n3.9 GPA · 500+ students mentored.\nWeb Dev @ UA RII · Summer 2026 open.",
  contact:()=>`baraa@email.arizona.edu\ngithub.com/baraaabdalla\nlinkedin.com/in/baraaabdalla`,
  hire:()=>"Why hire Elbaraa?\n  Shipped real systems for UA\n  Won 2 hackathons · 3.9 GPA\n  Full-stack + AI · end-to-end ownership",
  "sudo hire elbaraa":()=>"[sudo] password: ••••••••\nAccess granted.\nHiring Elbaraa Abdalla...\n▓▓▓▓▓▓▓▓▓▓ 100%\nBest decision you'll make this year. 🚀",
  clear:"__clear__",
};

export function Terminal({ onClose, C }) {
  const [lines,setLines]=useState([{t:"sys",v:"elbaraa@portfolio — type 'help' to begin"}]);const [inp,setInp]=useState("");const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[lines]);
  useEffect(()=>{ const h=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[onClose]);
  const run=()=>{
    const cmd=inp.trim().toLowerCase();setLines(p=>[...p,{t:"in",v:inp.trim()}]);setInp("");
    if(!cmd)return;const fn=CMDS[cmd];
    if(!fn){setLines(p=>[...p,{t:"err",v:"Not found: "+cmd+". Try 'help'."}]);return;}
    if(fn==="__clear__"){setLines([{t:"sys",v:"Cleared."}]);return;}
    fn().split("\n").forEach((line,i)=>setTimeout(()=>setLines(p=>[...p,{t:"out",v:line}]),i*35));
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:950,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(7,11,20,0.95)",backdropFilter:"blur(10px)"}}/>
      <div onClick={e=>e.stopPropagation()} style={mkPanel(C,{position:"relative",width:"100%",maxWidth:560,padding:0,borderColor:C.green+"40",animation:"scaleIn 0.22s ease-out"})}>
        <div style={{height:2,background:`linear-gradient(90deg,${C.green},${C.accent})`}}/>
        <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:7}}>{["#FF5F57","#FFBD2E","#28C840"].map((c,i)=><div key={i} onClick={i===0?onClose:undefined} style={{width:11,height:11,borderRadius:"50%",background:c,cursor:i===0?"pointer":"default"}}/>)}</div>
          <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim}}>elbaraa@portfolio ~ zsh</span>
          <span/>
        </div>
        <div style={{height:300,overflowY:"auto",padding:"14px 18px",fontFamily:"monospace",fontSize:12.5,lineHeight:1.85}}>
          {lines.map((line,i)=><div key={i} style={{color:line.t==="in"?C.accent:line.t==="sys"?C.textDim:line.t==="err"?C.pink:C.green,whiteSpace:"pre-wrap"}}>{line.t==="in"&&<span style={{color:C.textDim}}>❯ </span>}{line.v||" "}</div>)}
          <div ref={endRef}/>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:"monospace",fontSize:13,color:C.green}}>❯</span>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")run();}} autoFocus style={{flex:1,background:"none",border:"none",outline:"none",fontFamily:"monospace",fontSize:12.5,color:C.textPrimary}} placeholder="type a command…"/>
        </div>
      </div>
    </div>
  );
}
