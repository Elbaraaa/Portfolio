import { useState, useEffect, useRef } from "react";
import { SECTION_COMMENTS } from "../data/content";

export function AstronautAvatar({ C, isDark }) {
  const astronautRef = useRef(null), bubbleRef = useRef(null);
  const initX = typeof window !== "undefined" && window.innerWidth < 768 ? 20 : 200;
  const initY = typeof window !== "undefined" && window.innerWidth < 768 ? 80 : 200;
  const posRef = useRef({x:initX,y:initY}), targetRef = useRef({x:initX,y:initY}), velRef = useRef({x:0,y:0});
  const bobT = useRef(0), sectionRef = useRef("hero"), commentTimer = useRef(null);
  const [comment, setComment] = useState(SECTION_COMMENTS.hero[0]);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const onMove = e => { targetRef.current = {x:e.clientX-60,y:e.clientY-80}; };
    const onTouch = e => {
      const t = e.touches[0];
      targetRef.current = {x:t.clientX-60, y:t.clientY-80};
    };
    window.addEventListener("mousemove", onMove, {passive:true});
    window.addEventListener("touchmove", onTouch, {passive:true});
    let raf;
    const animate = () => {
      const t=targetRef.current,p=posRef.current,v=velRef.current;
      v.x+=(t.x-p.x)*0.04; v.y+=(t.y-p.y)*0.04; v.x*=0.82; v.y*=0.82; p.x+=v.x; p.y+=v.y;
      bobT.current+=0.03; const bob=Math.sin(bobT.current)*7;
      if(astronautRef.current) astronautRef.current.style.transform=`translate(${p.x}px,${p.y+bob}px)`;
      if(bubbleRef.current) bubbleRef.current.style.transform=`translate(${p.x+62}px,${p.y+bob-40}px)`;
      raf=requestAnimationFrame(animate);
    };
    raf=requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",onMove); window.removeEventListener("touchmove",onTouch); };
  }, []);

  useEffect(() => {
    const onClick = () => {
      setSpin(true); setTimeout(()=>setSpin(false),700);
      const comments = SECTION_COMMENTS[sectionRef.current]||SECTION_COMMENTS.hero;
      setComment(comments[Math.floor(Math.random()*comments.length)]);
      if(bubbleRef.current) bubbleRef.current.style.opacity="1";
      clearTimeout(commentTimer.current);
      commentTimer.current=setTimeout(()=>{ if(bubbleRef.current) bubbleRef.current.style.opacity="0"; },3500);
    };
    window.addEventListener("click",onClick); return ()=>window.removeEventListener("click",onClick);
  }, []);

  useEffect(() => {
    const SECS=["hero","about","projects","experience","skills","achievements","arcade","guestbook","hire","contact"];
    const onScroll = () => {
      let found="hero";
      for(const id of[...SECS].reverse()){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<window.innerHeight*0.5){found=id;break;}}
      if(found!==sectionRef.current){
        sectionRef.current=found;
        const comments=SECTION_COMMENTS[found]||SECTION_COMMENTS.hero;
        setComment(comments[Math.floor(Math.random()*comments.length)]);
        if(bubbleRef.current) bubbleRef.current.style.opacity="1";
        clearTimeout(commentTimer.current);
        commentTimer.current=setTimeout(()=>{ if(bubbleRef.current) bubbleRef.current.style.opacity="0"; },4000);
      }
    };
    setTimeout(()=>{ if(bubbleRef.current){ bubbleRef.current.style.opacity="1"; commentTimer.current=setTimeout(()=>{ if(bubbleRef.current) bubbleRef.current.style.opacity="0"; },4000); } },2000);
    window.addEventListener("scroll",onScroll,{passive:true}); return ()=>window.removeEventListener("scroll",onScroll);
  }, []);

  if (!isDark) return null;

  return (
    <div className="astronaut-root" style={{position:"fixed",left:0,top:0,zIndex:400,pointerEvents:"none"}}>
      <div ref={bubbleRef} style={{position:"absolute",left:0,top:0,maxWidth:190,padding:"9px 13px",background:C.panel,border:`1px solid ${C.accent}40`,borderRadius:"12px 12px 12px 4px",fontFamily:"system-ui",fontSize:12,color:C.textSecondary,lineHeight:1.5,opacity:0,transition:"opacity 0.35s ease",whiteSpace:"nowrap",willChange:"transform"}}>
        {comment}
        <div style={{position:"absolute",left:-6,bottom:10,width:0,height:0,borderTop:"5px solid transparent",borderBottom:"5px solid transparent",borderRight:`6px solid ${C.panel}`}}/>
      </div>
      <div ref={astronautRef} style={{position:"absolute",left:0,top:0,filter:`drop-shadow(0 0 12px ${isDark?C.accent+"60":"rgba(0,0,0,0.15)"})`,willChange:"transform"}}>
        <div style={{transform:spin?"rotate(360deg)":"rotate(0deg)",transition:spin?"transform 0.6s cubic-bezier(0.4,0,0.2,1)":"none"}}>
          {isDark ? (
            <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
              <ellipse cx="27" cy="22" rx="16" ry="17" fill="#1a2540" stroke={C.accent} strokeWidth="1.5"/>
              <ellipse cx="27" cy="22" rx="11" ry="12" fill="#0e1a2e" opacity="0.9"/>
              <ellipse cx="30" cy="20" rx="6" ry="7" fill={C.accent} opacity="0.18"/>
              <circle cx="23" cy="22" r="2" fill={C.green} opacity="0.9"/>
              <circle cx="31" cy="22" r="2" fill={C.green} opacity="0.9"/>
              <path d="M23 27 Q27 30 31 27" stroke={C.green} strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
              <rect x="14" y="36" width="26" height="22" rx="8" fill="#1a2540" stroke={C.border} strokeWidth="1.2"/>
              <rect x="20" y="40" width="14" height="9" rx="4" fill="#0e1a2e" stroke={C.accent} strokeWidth="0.8" opacity="0.7"/>
              <circle cx="27" cy="44" r="2" fill={C.accent} opacity="0.6"/>
              <path d="M14 40 Q5 44 8 52" stroke="#1a2540" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 40 Q49 44 46 52" stroke="#1a2540" strokeWidth="6" strokeLinecap="round"/>
              <ellipse cx="8" cy="53" rx="4" ry="3.5" fill="#131e35" stroke={C.border} strokeWidth="1"/>
              <ellipse cx="46" cy="53" rx="4" ry="3.5" fill="#131e35" stroke={C.border} strokeWidth="1"/>
              <rect x="17" y="56" width="8" height="10" rx="3" fill="#1a2540" stroke={C.border} strokeWidth="1"/>
              <rect x="29" y="56" width="8" height="10" rx="3" fill="#1a2540" stroke={C.border} strokeWidth="1"/>
              <ellipse cx="21" cy="66" rx="5" ry="3" fill="#131e35" stroke={C.border} strokeWidth="1"/>
              <ellipse cx="33" cy="66" rx="5" ry="3" fill="#131e35" stroke={C.border} strokeWidth="1"/>
              <ellipse cx="27" cy="37" rx="13" ry="3.5" fill="#131e35" stroke={C.border} strokeWidth="1"/>
              <line x1="27" y1="5" x2="27" y2="10" stroke={C.accent} strokeWidth="1.5"/>
              <circle cx="27" cy="4" r="2" fill={C.accent} opacity="0.8"/>
            </svg>
          ) : (
          <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
            <ellipse cx="27" cy="22" rx="16" ry="17" fill="#F5F1E8" stroke="#BFAE95" strokeWidth="1.2"/>
            <ellipse cx="27" cy="22" rx="11" ry="12" fill="#21352E" opacity="0.90"/>
            <ellipse cx="30" cy="20" rx="6" ry="7" fill="#F2CF84" opacity="0.16"/>
            <circle cx="23" cy="22" r="2.2" fill="#E9F1EC" opacity="0.95"/>
            <circle cx="31" cy="22" r="2.2" fill="#E9F1EC" opacity="0.95"/>
            <path d="M23 27 Q27 30 31 27" stroke="#DDE8DA" strokeWidth="1.2" strokeLinecap="round" opacity="0.85"/>

            <rect x="14" y="36" width="26" height="22" rx="8" fill="#FBF8F1" stroke="#D1C7B8" strokeWidth="1.2"/>
            <rect x="20" y="40" width="14" height="9" rx="4" fill="#EDF3EE" stroke="#9FB3A6" strokeWidth="0.8"/>
            <circle cx="27" cy="44" r="2" fill="#234D3B" opacity="0.75"/>

            <path d="M14 40 Q5 44 8 52" stroke="#E9E2D6" strokeWidth="6" strokeLinecap="round"/>
            <path d="M40 40 Q49 44 46 52" stroke="#E9E2D6" strokeWidth="6" strokeLinecap="round"/>

            <ellipse cx="8" cy="53" rx="4" ry="3.5" fill="#F7F3EC" stroke="#D1C7B8" strokeWidth="1"/>
            <ellipse cx="46" cy="53" rx="4" ry="3.5" fill="#F7F3EC" stroke="#D1C7B8" strokeWidth="1"/>

            <rect x="17" y="56" width="8" height="10" rx="3" fill="#F1ECE3" stroke="#D1C7B8" strokeWidth="1"/>
            <rect x="29" y="56" width="8" height="10" rx="3" fill="#F1ECE3" stroke="#D1C7B8" strokeWidth="1"/>

            <ellipse cx="21" cy="66" rx="5" ry="3" fill="#F7F3EC" stroke="#D1C7B8" strokeWidth="1"/>
            <ellipse cx="33" cy="66" rx="5" ry="3" fill="#F7F3EC" stroke="#D1C7B8" strokeWidth="1"/>

            <ellipse cx="27" cy="37" rx="13" ry="3.5" fill="#E8E1D4" stroke="#D1C7B8" strokeWidth="1"/>
            <line x1="27" y1="5" x2="27" y2="10" stroke="#B89B72" strokeWidth="1.5"/>
            <circle cx="27" cy="4" r="2" fill="#C89B5D" opacity="0.9"/>
          </svg>
          )}
        </div>
      </div>
    </div>
  );
}