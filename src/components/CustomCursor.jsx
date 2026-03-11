import { useEffect, useRef } from "react";

export function CustomCursor({ C }) {
  const dotRef=useRef(null), ringRef=useRef(null), trailsRef=useRef([]);
  const clickLabelRef=useRef(null), grabLabelRef=useRef(null);
  const pos=useRef({x:-200,y:-200}), ring=useRef({x:-200,y:-200});
  const hovering=useRef(false), clicking=useRef(false), grabbing=useRef(false), isDown=useRef(false);

  useEffect(() => {
    const TRAIL_COUNT=8, trails=trailsRef.current;
    const move=e=>{ pos.current={x:e.clientX,y:e.clientY}; };
    const down=()=>{ clicking.current=true; isDown.current=true; };
    const up=()=>{ clicking.current=false; isDown.current=false; };

    const onOver=e=>{
      const onCube = !!e.target.closest('[data-cube-overlay]');
      const onClickable = !!e.target.closest("a,button,[data-magnetic],input,textarea,select");
      grabbing.current = onCube;
      hovering.current = onClickable && !onCube;
    };

    window.addEventListener("mousemove",move,{passive:true});
    window.addEventListener("mousedown",down);
    window.addEventListener("mouseup",up);
    document.addEventListener("mouseover",onOver);

    const trailPos=Array(TRAIL_COUNT).fill(null).map(()=>({x:-200,y:-200}));
    let raf;
    const animate=()=>{
      const dot=dotRef.current, ringEl=ringRef.current;
      const clickLbl=clickLabelRef.current, grabLbl=grabLabelRef.current;
      if(dot&&ringEl){
        const x=pos.current.x, y=pos.current.y;

        const dotScale = clicking.current ? 2.2 : hovering.current ? 1.6 : 1;
        dot.style.transform=`translate(${x-4}px,${y-4}px) scale(${dotScale})`;
        dot.style.opacity = "1";

        ring.current.x+=(x-ring.current.x)*0.12;
        ring.current.y+=(y-ring.current.y)*0.12;
        let size, color, opacity;
        if(hovering.current)      { size=44; color=C.green;  opacity="0.8"; }
        else if(clicking.current) { size=20; color=C.pink;   opacity="0.9"; }
        else                      { size=32; color=C.accent; opacity="0.5"; }
        ringEl.style.transform=`translate(${ring.current.x-size/2}px,${ring.current.y-size/2}px)`;
        ringEl.style.width=size+"px"; ringEl.style.height=size+"px";
        ringEl.style.borderColor=color;
        ringEl.style.opacity=opacity;

        if(clickLbl){
          const show = hovering.current && !clicking.current;
          clickLbl.style.transform=`translate(${x+14}px,${y-22}px) scale(${show?1:0.7})`;
          clickLbl.style.opacity=show?"1":"0";
        }

        trailPos[0]={...pos.current};
        for(let i=1;i<TRAIL_COUNT;i++){
          trailPos[i]={x:trailPos[i].x+(trailPos[i-1].x-trailPos[i].x)*0.35, y:trailPos[i].y+(trailPos[i-1].y-trailPos[i].y)*0.35};
        }
        trails.forEach((el,i)=>{ if(!el)return; const sz=3-i*0.25; el.style.transform=`translate(${trailPos[i].x-sz/2}px,${trailPos[i].y-sz/2}px)`; el.style.opacity=((1-i/TRAIL_COUNT)*0.35).toString(); el.style.width=sz+"px"; el.style.height=sz+"px"; });
      }
      raf=requestAnimationFrame(animate);
    };
    raf=requestAnimationFrame(animate);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("mousemove",move); window.removeEventListener("mousedown",down); window.removeEventListener("mouseup",up); document.removeEventListener("mouseover",onOver); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{position:"fixed",top:0,left:0,width:8,height:8,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.green})`,pointerEvents:"none",zIndex:9999,willChange:"transform",mixBlendMode:"screen"}}/>
      <div ref={ringRef} style={{position:"fixed",top:0,left:0,width:32,height:32,borderRadius:"50%",border:`1.5px solid ${C.accent}`,pointerEvents:"none",zIndex:9998,transition:"width 0.18s,height 0.18s,border-color 0.18s,opacity 0.18s",willChange:"transform",mixBlendMode:"screen"}}/>
      {Array(8).fill(null).map((_,i)=><div key={i} ref={el=>trailsRef.current[i]=el} style={{position:"fixed",top:0,left:0,width:3,height:3,borderRadius:"50%",background:C.accent,pointerEvents:"none",zIndex:9997,willChange:"transform",mixBlendMode:"screen"}}/>)}
      <div ref={clickLabelRef} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:10000,willChange:"transform",opacity:0,transition:"opacity 0.15s, transform 0.15s"}}>
        <div style={{background:`linear-gradient(135deg,${C.accent}CC,${C.green}CC)`,backdropFilter:"blur(6px)",border:`1px solid ${C.accent}60`,borderRadius:6,padding:"3px 8px",fontFamily:"monospace",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:"0.08em",whiteSpace:"nowrap",boxShadow:`0 0 12px ${C.accent}40`}}>
          CLICK
        </div>
      </div>
      <div ref={grabLabelRef} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:10000,willChange:"transform",opacity:0,transition:"opacity 0.15s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke={C.orange} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
          <line x1="20" y1="4"  x2="20" y2="11" stroke={C.orange} strokeWidth="2" strokeLinecap="round"/>
          <line x1="20" y1="29" x2="20" y2="36" stroke={C.orange} strokeWidth="2" strokeLinecap="round"/>
          <line x1="4"  y1="20" x2="11" y2="20" stroke={C.orange} strokeWidth="2" strokeLinecap="round"/>
          <line x1="29" y1="20" x2="36" y2="20" stroke={C.orange} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="3" fill={C.orange} opacity="0.9"/>
          <circle cx="20" cy="20" r="7" stroke={C.orange} strokeWidth="1" opacity="0.4"/>
        </svg>
      </div>
    </>
  );
}
