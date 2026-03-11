import { useState, useEffect, useRef } from "react";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function GuestbookSection({ C }) {
  const {ref,inView}=useInView(0.1);
  const [name,setName]=useState(""),[msg,setMsg]=useState(""),[typedSig,setTypedSig]=useState(""),[tab,setTab]=useState("type"),[sigs,setSigs]=useState([]),[loading,setLoading]=useState(true),[submitting,setSubmitting]=useState(false),[done,setDone]=useState(false);
  const canvasRef=useRef(null),isPainting=useRef(false);const [penColor,setPenColor]=useState(C.accent);
  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.list("guest:");if(r?.keys){const items=await Promise.all(r.keys.map(async k=>{try{const v=await window.storage.get(k,true);return v?JSON.parse(v.value):null;}catch{return null;}}));setSigs(items.filter(Boolean).sort((a,b)=>b.ts-a.ts));}}catch{}
      setLoading(false);
    })();
  },[]);
  const startDraw=e=>{isPainting.current=true;const c=canvasRef.current,r=c.getBoundingClientRect(),ctx=c.getContext("2d");ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top);};
  const paint=e=>{if(!isPainting.current)return;const c=canvasRef.current,r=c.getBoundingClientRect(),ctx=c.getContext("2d");ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle=penColor;ctx.lineTo(e.clientX-r.left,e.clientY-r.top);ctx.stroke();};
  const stopDraw=()=>{isPainting.current=false;};
  const clearCanvas=()=>{const c=canvasRef.current;if(c)c.getContext("2d").clearRect(0,0,c.width,c.height);};
  const submit=async()=>{
    if(!name.trim()||submitting)return;setSubmitting(true);
    const colors=[C.accent,C.green,C.pink,C.orange],drawData=tab==="draw"?canvasRef.current?.toDataURL():null;
    const entry={name:name.trim(),msg:msg.trim(),sig:typedSig.trim(),draw:drawData,ts:Date.now(),color:colors[Math.floor(Math.random()*4)],approved:false};
    try{await window.storage.set("guest:"+entry.ts,JSON.stringify(entry),true);}catch{}
    setSigs(p=>[entry,...p]);setName("");setMsg("");setTypedSig("");clearCanvas();setSubmitting(false);setDone(true);setTimeout(()=>setDone(false),3000);
  };
  return (
    <section id="guestbook" ref={ref} style={{padding:"80px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative"}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="07" label="Guestbook" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 8px",color:C.textPrimary}}>Leave your <span style={{color:C.accent}}>mark.</span></h2>
          <p style={{color:C.textSecondary,fontSize:14,marginBottom:36}}>Sign the wall. Your name shows instantly — messages are reviewed before going live.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:24,opacity:inView?1:0,transition:"all 0.7s 0.2s"}}>
          <div style={mkPanel(C,{padding:24,borderColor:C.accent+"30"})}>
            <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16}}>Sign the wall</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name *" maxLength={32} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,fontFamily:"monospace",fontSize:12,outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Leave a message…" maxLength={200} rows={3} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,fontFamily:"monospace",fontSize:12,outline:"none",resize:"none",marginBottom:12,boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:4,padding:3,background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,marginBottom:12}}>
              {["type","draw"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"monospace",fontSize:11,background:tab===t?C.accent+"20":"transparent",color:tab===t?C.accent:C.textDim,transition:"all 0.2s"}}>{t==="type"?"⌨️ Type":"✏️ Draw"}</button>)}
            </div>
            {tab==="type"
              ?<input value={typedSig} onChange={e=>setTypedSig(e.target.value)} placeholder="Your signature…" maxLength={40} style={{width:"100%",padding:"14px",background:C.bg,border:`1px dashed ${C.border}`,borderRadius:7,color:C.accent,fontFamily:"Georgia, cursive",fontSize:20,fontStyle:"italic",outline:"none",textAlign:"center",boxSizing:"border-box",marginBottom:12}}/>
              :<div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",gap:5}}>{[C.accent,C.green,C.pink,C.orange,"#fff"].map(pc=><div key={pc} onClick={()=>setPenColor(pc)} style={{width:14,height:14,borderRadius:"50%",background:pc,cursor:"pointer",border:penColor===pc?"2px solid #fff":`2px solid ${C.border}`}}/>)}</div>
                  <button onClick={clearCanvas} style={{fontFamily:"monospace",fontSize:9,color:C.textDim,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>clear</button>
                </div>
                <canvas ref={canvasRef} width={330} height={90} onMouseDown={startDraw} onMouseMove={paint} onMouseUp={stopDraw} onMouseLeave={stopDraw} style={{width:"100%",height:90,background:C.bg,borderRadius:7,border:`1px dashed ${C.border}`,cursor:"crosshair",display:"block"}}/>
              </div>
            }
            {done
              ?<div style={{padding:12,background:C.green+"15",border:`1px solid ${C.green}30`,borderRadius:7,fontFamily:"monospace",fontSize:12,color:C.green,textAlign:"center"}}>✓ Signed!</div>
              :<button onClick={submit} disabled={!name.trim()||submitting} style={{width:"100%",padding:12,fontWeight:700,fontSize:13,borderRadius:7,border:"none",cursor:name.trim()?"pointer":"default",fontFamily:"monospace",background:name.trim()?`linear-gradient(90deg,${C.accent},${C.green})`:C.border,color:name.trim()?C.bg:C.textDim}}>{submitting?"Signing…":"✍️ Leave My Mark"}</button>
            }
          </div>
          <div>
            <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>{loading?"Loading…":`${sigs.length} visitor${sigs.length!==1?"s":""} have signed`}</div>
            {!loading&&sigs.length===0&&<div style={mkPanel(C,{padding:32,textAlign:"center",fontFamily:"monospace",fontSize:12,color:C.textDim})}>Be the first to sign! 🚀</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10,maxHeight:420,overflowY:"auto",paddingRight:4}}>
              {sigs.map(s=>(
                <div key={s.ts} style={mkPanel(C,{padding:14,borderColor:s.color+"25",position:"relative",overflow:"hidden"})}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:s.color+"50"}}/>
                  <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:13,color:s.color,marginBottom:4}}>{s.name}</div>
                  {s.sig&&<div style={{fontFamily:"Georgia, cursive",fontSize:15,fontStyle:"italic",color:s.color,opacity:0.7,marginBottom:6}}>{s.sig}</div>}
                  {s.draw&&s.draw!=="data:,"&&<img src={s.draw} style={{width:"100%",height:32,objectFit:"contain",opacity:0.6,marginBottom:6}} alt="sig"/>}
                  <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim}}>{new Date(s.ts).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
