import { useState, useEffect, useRef } from "react";
import { SECTION_COMMENTS } from "../data/content";

export function AstronautAvatar({ C, isDark }) {
  const astronautRef = useRef(null), bubbleRef = useRef(null);
  const posRef = useRef({x:200,y:200}), targetRef = useRef({x:200,y:200}), velRef = useRef({x:0,y:0});
  const bobT = useRef(0), sectionRef = useRef("hero"), commentTimer = useRef(null);
  const [comment, setComment] = useState(SECTION_COMMENTS.hero[0]);
  const [spin, setSpin] = useState(false);
  useEffect(() => {
    const onMove = e => { targetRef.current = {x:e.clientX-60,y:e.clientY-80}; };
    window.addEventListener("mousemove", onMove, {passive:true});
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",onMove); };
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
  return (
    <div style={{position:"fixed",left:0,top:0,zIndex:400,pointerEvents:"none"}}>
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
              {/* Light mode astronaut — white suit, dark visor, warm accents */}
              <ellipse cx="27" cy="22" rx="16" ry="17" fill="#EAECF0" stroke="#9CA3AF" strokeWidth="1.2"/>
              <ellipse cx="27" cy="22" rx="11" ry="12" fill="#1F2937" opacity="0.85"/>
              <ellipse cx="30" cy="20" rx="6" ry="7" fill="#A3A3A3" opacity="0.15"/>
              <circle cx="23" cy="22" r="2.2" fill="#111827" opacity="0.9"/>
              <circle cx="31" cy="22" r="2.2" fill="#111827" opacity="0.9"/>
              <path d="M23 27 Q27 30 31 27" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <rect x="14" y="36" width="26" height="22" rx="8" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.2"/>
              <rect x="20" y="40" width="14" height="9" rx="4" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="0.8"/>
              <circle cx="27" cy="44" r="2" fill={C.accent} opacity="0.7"/>
              <path d="M14 40 Q5 44 8 52" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 40 Q49 44 46 52" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round"/>
              <ellipse cx="8" cy="53" rx="4" ry="3.5" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1"/>
              <ellipse cx="46" cy="53" rx="4" ry="3.5" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1"/>
              <rect x="17" y="56" width="8" height="10" rx="3" fill="#EAECF0" stroke="#D1D5DB" strokeWidth="1"/>
              <rect x="29" y="56" width="8" height="10" rx="3" fill="#EAECF0" stroke="#D1D5DB" strokeWidth="1"/>
              <ellipse cx="21" cy="66" rx="5" ry="3" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1"/>
              <ellipse cx="33" cy="66" rx="5" ry="3" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1"/>
              <ellipse cx="27" cy="37" rx="13" ry="3.5" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
              <line x1="27" y1="5" x2="27" y2="10" stroke="#9CA3AF" strokeWidth="1.5"/>
              <circle cx="27" cy="4" r="2" fill="#6B7280" opacity="0.8"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}