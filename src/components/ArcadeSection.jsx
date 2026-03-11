import { useState, useEffect, useRef, useCallback } from "react";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

function Game2048({ C }) {
  const CELL=6,PAD=8,TILE=68;
  const addTile=b=>{const e=[];b.forEach((r,i)=>r.forEach((v,j)=>{if(!v)e.push([i,j]);}));if(!e.length)return b;const p=e[Math.floor(Math.random()*e.length)];const nb=b.map(r=>r.slice());nb[p[0]][p[1]]=Math.random()<0.9?2:4;return nb;};
  const make=()=>{let b=Array(4).fill(null).map(()=>Array(4).fill(0));return addTile(addTile(b));};
  const idRef=useRef(0);const mkId=()=>++idRef.current;
  const boardToTiles=b=>{const t=[];b.forEach((r,i)=>r.forEach((v,j)=>{if(v)t.push({id:mkId(),value:v,row:i,col:j,merged:false,fresh:true});}));return t;};
  const [tiles,setTiles]=useState(()=>boardToTiles(make()));const [score,setScore]=useState(0);const [over,setOver]=useState(false);
  const slide=row=>{let f=row.filter(v=>v);let s=0;for(let i=0;i<f.length-1;i++){if(f[i]===f[i+1]){f[i]*=2;s+=f[i];f[i+1]=0;}}f=f.filter(v=>v);while(f.length<4)f.push(0);return{row:f,score:s};};
  const tr=m=>m[0].map((_,i)=>m.map(r=>r[i]));const rv=m=>m.map(r=>r.slice().reverse());
  const move=useCallback(dir=>{
    if(over)return;
    setTiles(tiles=>{
      let grid=Array(4).fill(null).map(()=>Array(4).fill(0));tiles.forEach(t=>{grid[t.row][t.col]=t.value;});
      let nb=grid.map(r=>r.slice());let sc=0;let mv=false;
      if(dir==="left"){nb=nb.map(r=>{const res=slide(r);if(res.row.join()!==r.join())mv=true;sc+=res.score;return res.row;});}
      else if(dir==="right"){nb=rv(nb).map(r=>{const o=r.slice().reverse();const res=slide(r);if(res.row.join()!==o.join())mv=true;sc+=res.score;return res.row;});nb=rv(nb);}
      else if(dir==="up"){nb=tr(nb);nb=nb.map(r=>{const res=slide(r);if(res.row.join()!==r.join())mv=true;sc+=res.score;return res.row;});nb=tr(nb);}
      else{nb=tr(nb);nb=rv(nb).map(r=>{const o=r.slice().reverse();const res=slide(r);if(res.row.join()!==o.join())mv=true;sc+=res.score;return res.row;});nb=rv(nb);nb=tr(nb);}
      if(!mv)return tiles;const wt=addTile(nb);setScore(p=>p+sc);
      const hm=wt.flat().includes(0)||wt.some((r,i)=>r.some((v,j)=>(j<3&&v===r[j+1])||(i<3&&v===wt[i+1][j])));
      if(!hm)setOver(true);
      const newTiles=[];wt.forEach((r,i)=>r.forEach((v,j)=>{if(v)newTiles.push({id:mkId(),value:v,row:i,col:j,merged:nb[i][j]!==grid[i][j]&&v>2,fresh:grid[i][j]===0&&wt[i][j]!==0});}));return newTiles;
    });
  },[over]);
  useEffect(()=>{ const h=e=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();move(e.key.replace("Arrow","").toLowerCase());}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h); },[move]);
  const tc=v=>({0:"transparent",2:"#7C6FFF",4:"#6B5FEE",8:"#4AFFC4",16:"#3EEEBB",32:"#F97FFF",64:"#E870EE",128:"#FFB347",256:"#FF9520",512:"#FF7B00",1024:"#7C6FFF",2048:"#4AFFC4"}[v]||"#FFD700");
  const boardSize=TILE*4+CELL*3+PAD*2;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={mkPanel(C,{padding:"8px 14px"})}><div style={{fontFamily:"monospace",fontSize:9,color:C.textDim}}>SCORE</div><div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:C.textPrimary}}>{score}</div></div>
        <button onClick={()=>{idRef.current=0;setTiles(boardToTiles(make()));setScore(0);setOver(false);}} style={{fontFamily:"monospace",fontSize:11,padding:"7px 14px",background:C.accent,color:C.bg,border:"none",borderRadius:6,cursor:"pointer",fontWeight:700}}>New</button>
      </div>
      {over&&<div style={mkPanel(C,{padding:8,marginBottom:8,borderColor:C.pink+"50",background:C.pink+"10",fontFamily:"monospace",fontSize:12,color:C.pink,textAlign:"center"})}>Game Over!</div>}
      <div style={{position:"relative",width:boardSize,height:boardSize,background:C.bg,borderRadius:10,border:`1px solid ${C.border}`,padding:PAD,margin:"0 auto"}}>
        {Array(16).fill(0).map((_,i)=><div key={i} style={{position:"absolute",width:TILE,height:TILE,borderRadius:6,background:"#1A2540",left:PAD+(i%4)*(TILE+CELL),top:PAD+Math.floor(i/4)*(TILE+CELL)}}/>)}
        {tiles.map(t=>(
          <div key={t.id} style={{position:"absolute",width:TILE,height:TILE,borderRadius:6,background:tc(t.value),boxShadow:t.value>=8?`0 0 10px ${tc(t.value)}70`:"none",left:PAD+t.col*(TILE+CELL),top:PAD+t.row*(TILE+CELL),display:"flex",alignItems:"center",justifyContent:"center",transition:"left 0.12s ease, top 0.12s ease",animation:t.merged?"tilePop 0.18s ease":t.fresh?"tileAppear 0.15s ease":"none",zIndex:t.merged?2:1}}>
            <span style={{fontFamily:"system-ui",fontWeight:800,fontSize:t.value>999?"10px":t.value>99?"13px":"16px",color:"#fff",userSelect:"none"}}>{t.value}</span>
          </div>
        ))}
      </div>
      <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,marginTop:8,textAlign:"center"}}>arrow keys to play</div>
    </div>
  );
}

export function ArcadeSection({ C }) {
  const {ref,inView}=useInView(0.1); const [playing,setPlaying]=useState(false);
  const games=[{name:"2048",icon:"🎲",desc:"Merge tiles, chase the 2048 block.",color:C.accent},{name:"Snake",icon:"🐍",desc:"Classic snake — grow without dying.",color:C.green},{name:"Memory",icon:"🃏",desc:"Flip cards, find the pairs.",color:C.pink}];
  return (
    <section id="arcade" ref={ref} style={{padding:"80px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <span style={{fontFamily:"system-ui",fontWeight:900,fontSize:"20vw",color:C.accent,opacity:0.02,userSelect:"none"}}>PLAY</span>
      </div>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="06" label="Arcade" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 8px",color:C.textPrimary}}>Need a <span className="grad-text" style={{background:`linear-gradient(90deg,${C.pink},${C.orange})`}}>break?</span></h2>
          <p style={{color:C.textSecondary,fontSize:14,marginBottom:36}}>Even builders need to play. Pick a game and take five.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:playing?"1fr 1fr":"1fr 1fr 1fr",gap:16,transition:"all 0.4s"}}>
          {!playing&&games.map((g,i)=>(
            <div key={g.name} onClick={()=>g.name==="2048"&&setPlaying(true)}
              data-magnetic
              style={mkPanel(C,{padding:28,cursor:"pointer",position:"relative",overflow:"hidden",transition:"all 0.3s",opacity:inView?1:0,transitionDelay:`${i*0.1}s`})}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=g.color+"50";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 8px 40px ${g.color}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${g.color},${g.color}50)`}}/>
              <div style={{fontSize:48,marginBottom:16}}>{g.icon}</div>
              <h3 style={{fontFamily:"system-ui",fontWeight:800,fontSize:22,color:C.textPrimary,marginBottom:8}}>{g.name}</h3>
              <p style={{fontFamily:"monospace",fontSize:12,color:C.textSecondary,marginBottom:20}}>{g.desc}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",background:g.color+"18",border:`1px solid ${g.color}40`,borderRadius:6,fontFamily:"monospace",fontSize:11,color:g.color}}>
                {g.name==="2048"?"▶ Play Now":"Coming soon"}
              </div>
            </div>
          ))}
          {playing&&(
            <>
              <div data-arcade-playing="true" style={mkPanel(C,{padding:20})}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 style={{fontFamily:"system-ui",fontWeight:700,fontSize:16,color:C.textPrimary,margin:0}}>🎲 2048</h3>
                  <button onClick={()=>setPlaying(false)} style={{fontFamily:"monospace",fontSize:10,padding:"4px 10px",border:`1px solid ${C.border}`,borderRadius:5,background:"none",color:C.textDim,cursor:"pointer"}}>← Back</button>
                </div>
                <Game2048 C={C}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[{name:"Snake 🐍",color:C.green},{name:"Memory 🃏",color:C.pink}].map(g=>(
                  <div key={g.name} style={mkPanel(C,{padding:24,display:"flex",alignItems:"center",justifyContent:"space-between"})}>
                    <span style={{fontFamily:"system-ui",fontWeight:700,fontSize:16,color:C.textPrimary}}>{g.name}</span>
                    <span style={{fontFamily:"monospace",fontSize:10,color:g.color,padding:"4px 10px",border:`1px solid ${g.color}30`,borderRadius:5}}>Coming soon</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}