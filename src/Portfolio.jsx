import "./storage-polyfill";
import { useState, useEffect, useRef, useCallback } from "react";

const personal = {
  name: "Elbaraa Abdalla",
  subTagline: "CS @ University of Arizona · Full-Stack · AI · Research",
  bio: "I build systems that matter. Whether it's a RAG-powered academic assistant, an automated site auditing pipeline, or a web experience that teaches 500 students at once — I care about the craft and the impact.\n\nCurrently a Web Developer at UA's Research, Innovation & Impact office and an undergrad TA mentoring CS students through their hardest classes.",
  email: "baraa@email.arizona.edu",
  github: "https://github.com/baraaabdalla",
  linkedin: "https://linkedin.com/in/baraaabdalla",
  location: "Tucson, AZ",
};

const stats = [
  { label: "Projects Shipped", value: "12+" },
  { label: "Students Mentored", value: "500+" },
  { label: "Hackathons", value: "4" },
  { label: "Research Papers", value: "2" },
];

const experience = [
  { id: "e1", role: "Web Developer", orgShort: "UA RII", period: "Jan 2024 — Present", status: "active", description: "Architecting and maintaining public-facing web systems for UA's research office. Built an automated link-audit pipeline that reduced broken-link incidents by 80%. Developed interactive SVG-based data visualizations for faculty research dashboards.", tags: ["Next.js", "TypeScript", "Python", "Web Automation"] },
  { id: "e2", role: "Undergraduate Teaching Assistant", orgShort: "UA CS Dept", period: "Aug 2023 — Present", status: "active", description: "CS Mentor for foundational programming and data structures courses. Designed supplemental problem sets, held weekly office hours for 100+ students, and improved pass rates by 15% through structured review sessions.", tags: ["Python", "C++", "Data Structures", "Pedagogy"] },
  { id: "e3", role: "Hackathon Lead Engineer", orgShort: "HackArizona / WildHacks", period: "2022 — 2024", status: "complete", description: "Led cross-functional teams of 3–4 engineers, shipping full-stack prototypes in 24–48 hours. Won Best Use of AI (HackArizona '23) and Most Innovative Hack (WildHacks '24).", tags: ["Full-stack", "AI/ML", "Team Leadership", "Rapid Prototyping"] },
];

const projects = [
  { id: "p1", title: "Wildcat Helper", subtitle: "UA DegreePlan Copilot", category: "AI · Full-Stack", status: "shipped", description: "A RAG-powered academic assistant that ingests UA degree requirements, course catalogs, and advisor FAQs to answer student questions with source-grounded accuracy.", longDescription: "Built on a vector-search backend (FAISS + LangChain), the system processes 300+ pages of UA academic documentation into a queryable knowledge graph. The front end provides a conversational interface with citation cards linking back to official sources.", tech: ["Next.js", "Python", "LangChain", "FAISS", "OpenAI API", "FastAPI"], metrics: ["300+ docs indexed", "< 2s response", "92% accuracy"], accent: "#7C6FFF" },
  { id: "p2", title: "UA LinkAuditBot", subtitle: "Automated Site Integrity System", category: "DevOps · Automation", status: "shipped", description: "An intelligent web crawler that audits UA's research office websites for broken links, missing metadata, and accessibility violations — then generates structured reports.", longDescription: "Engineered a concurrent Python crawler using asyncio and aiohttp scanning 10,000+ pages/hour. Outputs actionable JSON reports consumed by a React dashboard, with GitHub Actions integration for weekly automated audits.", tech: ["Python", "asyncio", "Playwright", "React", "GitHub Actions", "PostgreSQL"], metrics: ["10K pages/hr", "80% error reduction", "Weekly auto-runs"], accent: "#4AFFC4" },
  { id: "p3", title: "SVG Campus Map", subtitle: "UA Research Visualization", category: "Data Viz · Frontend", status: "shipped", description: "A dynamic, filterable SVG map of UA's research facilities visualizing department relationships, active grants, and interdisciplinary connections.", longDescription: "Built with D3.js and React, the map supports real-time filtering by department, funding source, and research area. Animated force-directed graph overlays show collaboration networks. Used in 20+ donor presentations.", tech: ["React", "D3.js", "SVG", "TypeScript", "REST API"], metrics: ["20+ presentations", "5 depts onboarded", "Real-time data"], accent: "#F97FFF" },
  { id: "p4", title: "DocuMind RAG", subtitle: "Enterprise Document Intelligence", category: "AI · Backend", status: "in-progress", description: "A production-grade retrieval-augmented generation system for large document corpora. Multi-tenant deployments, document versioning, hybrid BM25 + semantic search.", longDescription: "Handles enterprise-scale document ingestion (PDFs, DOCX, HTML) with automatic chunking strategies based on document type. Implements re-ranking via cross-encoders for precision retrieval.", tech: ["Python", "FastAPI", "Weaviate", "LangChain", "Docker", "Redis"], metrics: ["Multi-tenant", "Hybrid search", "< 500ms p95"], accent: "#FFB347" },
];

const skillCategories = [
  { category: "Languages", accent: "#7C6FFF", items: [{ name: "Python", level: 92 }, { name: "TypeScript", level: 90 }, { name: "SQL", level: 80 }, { name: "C++", level: 75 }, { name: "Bash", level: 70 }] },
  { category: "Frontend", accent: "#F97FFF", items: [{ name: "React / Next.js", level: 92 }, { name: "Tailwind CSS", level: 90 }, { name: "Framer Motion", level: 80 }, { name: "D3.js / SVG", level: 78 }, { name: "WebGL", level: 55 }] },
  { category: "Backend & Infra", accent: "#4AFFC4", items: [{ name: "FastAPI / Flask", level: 85 }, { name: "PostgreSQL", level: 78 }, { name: "GitHub Actions", level: 80 }, { name: "Docker", level: 72 }, { name: "Redis", level: 65 }] },
  { category: "AI & ML", accent: "#FFB347", items: [{ name: "OpenAI API", level: 90 }, { name: "LangChain / RAG", level: 85 }, { name: "Prompt Engineering", level: 88 }, { name: "FAISS / Weaviate", level: 75 }, { name: "Hugging Face", level: 68 }] },
];

const achievements = [
  { icon: "🏆", title: "Best Use of AI", event: "HackArizona 2023", desc: "Real-time accessibility scanner with AI-powered remediation suggestions." },
  { icon: "⚡", title: "Most Innovative Hack", event: "WildHacks 2024", desc: "Multi-agent research assistant deployed within 36 hours." },
  { icon: "📐", title: "Dean's List", event: "UA 2023–2024", desc: "3.9 GPA while working 20hrs/week across two campus roles." },
  { icon: "📄", title: "Research Contributor", event: "UA RII, 2024", desc: "Co-authored technical report on web accessibility automation." },
];

const SECTION_COMMENTS = {
  hero: ["Welcome to my space station 🚀", "Scroll down — adventure awaits!", "Type 'elbaraa' for a secret terminal..."],
  about: ["That's me in a nutshell!", "3.9 GPA and still human, I promise.", "I really do love teaching."],
  projects: ["This is where the fun stuff lives!", "Hover cards for more details.", "Wildcat Helper is my baby 🤖"],
  experience: ["Real work, real impact.", "80% fewer broken links? You're welcome UA.", "I love mentoring students."],
  skills: ["Python is my go-to, always.", "Still learning WebGL... we all have gaps.", "Hold the cube to reveal skills!"],
  achievements: ["Hackathon wins hit different at 3am.", "Dean's List while working two jobs!", "I thrive under pressure ⚡"],
  arcade: ["Try to beat my 2048 score!", "Snake is harder than it looks 🐍", "Take a break — you deserve it!"],
  guestbook: ["Leave your mark before you go!", "I read every single one.", "Be creative with your signature ✍️"],
  hire: ["Let's build something amazing!", "Summer 2026 — I'm ready.", "My inbox is always open 📬"],
  contact: ["Don't be a stranger!", "Ping me anytime.", "Let's make something real together."],
};

const DARK = {
  bg: "#070B14", surface: "#0C1120", panel: "#101828", border: "#1E2D4A",
  accent: "#7C6FFF", green: "#4AFFC4", pink: "#F97FFF", orange: "#FFB347",
  textPrimary: "#E8EEFF", textSecondary: "#7A90BB", textDim: "#3A4F6A",
};
const LIGHT = {
  bg: "#F4F1FF", surface: "#EDE9FF", panel: "#EDE9FF", border: "#C4B8FF",
  accent: "#5B4FD9", green: "#0E9E72", pink: "#B026CC", orange: "#C96C00",
  textPrimary: "#0D0820", textSecondary: "#2D2060", textDim: "#7060AA",
};

const mkPanel = (C, extra) => Object.assign({ background: C.panel, border: "1px solid " + C.border, borderRadius: 10 }, extra || {});

function InteractiveBg({ C }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const ripples = useRef([]);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onClick = e => { ripples.current.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.6 }); };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    const N = 90;
    const pts = Array.from({ length: N }, () => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: 1.2+Math.random()*1.8, col: [`rgba(124,111,255,`,`rgba(74,255,196,`,`rgba(249,127,255,`][Math.floor(Math.random()*3)], base: { x: 0, y: 0 } }));
    pts.forEach(p => { p.base.x = p.x; p.base.y = p.y; });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(124,111,255,0.018)"; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      const mx = mouse.current.x, my = mouse.current.y;
      pts.forEach(p => {
        const dx = p.x-mx, dy = p.y-my, dist = Math.sqrt(dx*dx+dy*dy), FLEE = 120;
        if (dist < FLEE) { const f = (FLEE-dist)/FLEE; p.vx += (dx/dist)*f*0.8; p.vy += (dy/dist)*f*0.8; }
        p.vx += (p.base.x-p.x)*0.003; p.vy += (p.base.y-p.y)*0.003;
        p.vx *= 0.92; p.vy *= 0.92; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });
      for (let i = 0; i < N; i++) for (let j = i+1; j < N; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 110) { ctx.strokeStyle = `rgba(124,111,255,${(1-d/110)*0.18})`; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
      }
      pts.forEach(p => {
        const dx = p.x-mx, dy = p.y-my, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 160) { ctx.strokeStyle = `rgba(124,111,255,${(1-d/160)*0.35})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(p.x,p.y); ctx.stroke(); }
      });
      pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = p.col+"0.7)"; ctx.fill(); });
      ripples.current = ripples.current.filter(rp => rp.alpha > 0.01);
      ripples.current.forEach(rp => {
        rp.r += 4; rp.alpha *= 0.93;
        for (let k = 0; k < 3; k++) { const rr = rp.r-k*18; if (rr > 0) { ctx.beginPath(); ctx.arc(rp.x,rp.y,rr,0,Math.PI*2); ctx.strokeStyle = `rgba(124,111,255,${rp.alpha*(1-k*0.3)})`; ctx.lineWidth = 1.5-k*0.4; ctx.stroke(); } }
      });
      const grad = ctx.createRadialGradient(mx,my,0,mx,my,140);
      grad.addColorStop(0,"rgba(124,111,255,0.06)"); grad.addColorStop(0.5,"rgba(74,255,196,0.025)"); grad.addColorStop(1,"transparent");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(mx,my,140,0,Math.PI*2); ctx.fill();
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onMove); window.removeEventListener("click",onClick); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, opacity:0.85 }} />;
}

function AstronautAvatar({ C }) {
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
      <div ref={astronautRef} style={{position:"absolute",left:0,top:0,filter:`drop-shadow(0 0 12px ${C.accent}60)`,willChange:"transform"}}>
        <div style={{transform:spin?"rotate(360deg)":"rotate(0deg)",transition:spin?"transform 0.6s cubic-bezier(0.4,0,0.2,1)":"none"}}>
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
        </div>
      </div>
    </div>
  );
}

function CustomCursor({ C }) {
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

const SECTIONS=["hero","about","projects","experience","skills","achievements","arcade","guestbook","hire","contact"];

function SectionDots({ current, goTo, C }) {
  return (
    <div style={{position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",zIndex:300,display:"flex",flexDirection:"column",gap:10}}>
      {SECTIONS.map((id,i)=>(
        <button key={id} onClick={()=>goTo(i)} style={{width:i===current?22:7,height:7,borderRadius:4,border:"none",cursor:"pointer",background:i===current?`linear-gradient(90deg,${C.accent},${C.green})`:C.border,transition:"all 0.3s",padding:0}}/>
      ))}
    </div>
  );
}

function useSectionSnap() {
  const [current,setCurrent]=useState(0); const isAnimating=useRef(false); const accDelta=useRef(0); const THRESHOLD=80;
  const goTo=useCallback((idx)=>{
    const clamped=Math.max(0,Math.min(SECTIONS.length-1,idx));
    const el=document.getElementById(SECTIONS[clamped]); if(!el) return;
    isAnimating.current=true; setCurrent(clamped); el.scrollIntoView({behavior:"smooth"});
    setTimeout(()=>{ isAnimating.current=false; accDelta.current=0; },900);
  },[]);
  useEffect(()=>{
    const observers=SECTIONS.map((id,i)=>{ const el=document.getElementById(id); if(!el) return null; const obs=new IntersectionObserver(entries=>{ if(entries[0].isIntersecting) setCurrent(i); },{threshold:0.5}); obs.observe(el); return obs; });
    return()=>observers.forEach(o=>o&&o.disconnect());
  },[]);
  const isArcadePlaying=()=>!!document.querySelector('[data-arcade-playing="true"]');
  useEffect(()=>{
    const onWheel=e=>{ if(isArcadePlaying()) return; e.preventDefault(); if(isAnimating.current) return; accDelta.current+=e.deltaY; if(Math.abs(accDelta.current)>=THRESHOLD){ const dir=accDelta.current>0?1:-1; accDelta.current=0; setCurrent(c=>{ const next=Math.max(0,Math.min(SECTIONS.length-1,c+dir)); goTo(next); return next; }); } };
    window.addEventListener("wheel",onWheel,{passive:false}); return()=>window.removeEventListener("wheel",onWheel);
  },[goTo]);
  useEffect(()=>{
    const onKey=e=>{ if(isArcadePlaying()) return; if(e.key==="ArrowDown"||e.key==="PageDown"){e.preventDefault();goTo(current+1);} if(e.key==="ArrowUp"||e.key==="PageUp"){e.preventDefault();goTo(current-1);} };
    window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);
  },[current,goTo]);
  return {current,goTo};
}

function MenuOverlay({ open, onClose, goTo, C }) {
  const items=[{label:"About",idx:1,icon:"01",desc:"Who I am"},{label:"Projects",idx:2,icon:"02",desc:"Things I've shipped"},{label:"Experience",idx:3,icon:"03",desc:"Where I've worked"},{label:"Skills",idx:4,icon:"04",desc:"My tech stack"},{label:"Achievements",idx:5,icon:"05",desc:"Recognition"},{label:"Arcade",idx:6,icon:"06",desc:"Take a break 🎮"},{label:"Guestbook",idx:7,icon:"07",desc:"Leave your mark"},{label:"Hire Me",idx:8,icon:"08",desc:"Let's work together"},{label:"Contact",idx:9,icon:"09",desc:"Get in touch"}];
  return (
    <div style={{position:"fixed",inset:0,zIndex:600,pointerEvents:open?"all":"none"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(7,11,20,0.97)",backdropFilter:"blur(20px)",opacity:open?1:0,transition:"opacity 0.4s"}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"50%",left:"50%",transform:open?"translate(-50%,-50%) scale(1)":"translate(-50%,-50%) scale(0.96)",opacity:open?1:0,transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)",pointerEvents:open?"all":"none",width:"100%",maxWidth:760,padding:"0 32px"}}>
        <div style={{maxWidth:720,width:"100%",padding:"0 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
            <div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>Navigation</div>
              <div style={{fontFamily:"system-ui",fontWeight:800,fontSize:30,color:C.textPrimary}}>Where to?</div>
            </div>
            <button onClick={onClose} style={{width:44,height:44,borderRadius:"50%",border:`1px solid ${C.border}`,background:C.panel,color:C.textSecondary,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {items.map((item,i)=>(
              <button key={item.label} onClick={()=>{goTo(item.idx);onClose();}}
                style={{...mkPanel(C,{padding:"18px 20px",cursor:"pointer",textAlign:"left",transition:"all 0.25s"}),animation:open?`fadeUp 0.4s ${i*0.04}s both`:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"50";e.currentTarget.style.background=C.accent+"08";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.panel;}}>
                <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,marginBottom:6}}>{item.icon}</div>
                <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:15,color:C.textPrimary,marginBottom:3}}>{item.label}</div>
                <div style={{fontFamily:"monospace",fontSize:10,color:C.textSecondary}}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBar({ onMenu, onTerminal, C, darkMode, toggleDark }) {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",h,{passive:true}); return()=>window.removeEventListener("scroll",h); },[]);
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",background:scrolled?`${C.bg}E6`:"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"1px solid transparent",transition:"all 0.3s"}}>
      <button onClick={()=>document.getElementById("hero").scrollIntoView({behavior:"smooth"})} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer"}}>
        <div style={{width:26,height:26,border:`1px solid ${C.accent}50`,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",background:`${C.accent}08`}}>
          <div style={{width:8,height:8,background:`linear-gradient(135deg,${C.accent},${C.green})`,borderRadius:2}}/>
        </div>
        <span style={{fontFamily:"monospace",fontSize:12,color:C.textDim}}>elbaraa.dev</span>
      </button>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <button onClick={toggleDark} style={{fontFamily:"monospace",fontSize:13,padding:"5px 10px",border:`1px solid ${C.border}`,borderRadius:6,color:C.textSecondary,background:C.panel,cursor:"pointer"}}>{darkMode ? "☀️" : "🌙"}</button>
        <button onClick={onTerminal} style={{fontFamily:"monospace",fontSize:10,padding:"5px 12px",border:`1px solid ${C.green}30`,borderRadius:6,color:C.green,background:`${C.green}08`,cursor:"pointer"}}>$_ Terminal</button>
        <button onClick={onMenu} style={{display:"flex",flexDirection:"column",gap:4,padding:"10px 12px",border:`1px solid ${C.border}`,borderRadius:7,background:C.panel,cursor:"pointer"}}>
          {[0,1,2].map(i=><div key={i} style={{width:18,height:1.5,background:i===1?C.accent:C.textDim,borderRadius:1}}/>)}
        </button>
      </div>
    </nav>
  );
}

function useInView(t=0.12) {
  const ref=useRef(null); const [inView,setInView]=useState(false);
  useEffect(()=>{ const el=ref.current; if(!el) return; const obs=new IntersectionObserver(entries=>{ setInView(entries[0].isIntersecting); },{threshold:t}); obs.observe(el); return()=>obs.disconnect(); },[t]);
  return {ref,inView};
}

function SectionTag({ num, label, C }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{width:28,height:1,background:`linear-gradient(90deg,${C.accent},${C.green})`}}/>
      <span style={{fontFamily:"monospace",fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.15em"}}>{num} / {label}</span>
    </div>
  );
}

function Typewriter({ text, delay=600 }) {
  const [displayed,setDisplayed]=useState(""); const [done,setDone]=useState(false);
  useEffect(()=>{ const start=setTimeout(()=>{ let i=0; const t=setInterval(()=>{ i++; setDisplayed(text.slice(0,i)); if(i>=text.length){clearInterval(t);setDone(true);} },36); return()=>clearInterval(t); },delay); return()=>clearTimeout(start); },[text,delay]);
  return <span>{displayed}{!done&&<span style={{display:"inline-block",width:2,height:"1em",background:"#7C6FFF",marginLeft:2,verticalAlign:"middle",animation:"blink 1s step-end infinite"}}/>}</span>;
}

function HeroSection({ onMenu, onHire, C }) {
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

function AboutSection({ C }) {
  const {ref,inView}=useInView(0.1);
  const anim=(d=0)=>({opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:`all 0.6s ${d}s`});
  return (
    <section id="about" ref={ref} style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative"}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={anim(0)}><SectionTag num="01" label="About" C={C}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"start"}}>
          <div style={anim(0.1)}>
            <h2 style={{fontFamily:"system-ui",fontSize:"clamp(26px,3.5vw,42px)",fontWeight:800,lineHeight:1.2,margin:"0 0 24px",letterSpacing:"-0.02em"}}>
              <span style={{color:C.textPrimary}}>I don't just write code.</span><br/>
              <span style={{color:C.textDim}}>I build infrastructure</span><br/>
              <span style={{background:`linear-gradient(90deg,${C.accent},${C.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>for real problems.</span>
            </h2>
            {personal.bio.split("\n\n").map((p,i)=><p key={i} style={{color:C.textSecondary,lineHeight:1.8,marginBottom:14,fontSize:14}}>{p}</p>)}
            <div style={mkPanel(C,{padding:18,marginTop:20})}>
              <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Currently</div>
              {[["🎓","Studying","B.S. CS, University of Arizona"],["💼","Working","Web Dev @ UA RII"],["📚","Teaching","Undergrad TA / CS Mentor"],["🔭","Building","DocuMind RAG System"]].map(row=>(
                <div key={row[1]} style={{display:"flex",gap:10,marginBottom:8}}>
                  <span style={{width:16}}>{row[0]}</span>
                  <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim,width:70,flexShrink:0}}>{row[1]}</span>
                  <span style={{fontFamily:"monospace",fontSize:11,color:C.textSecondary}}>{row[2]}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,...anim(0.2)}}>
            {[{icon:"⌨️",label:"Engineer",desc:"Full-stack systems from DB to UI."},{icon:"🧠",label:"Researcher",desc:"Applied AI, RAG pipelines & knowledge systems."},{icon:"👥",label:"Educator",desc:"Helped 500+ students level up."},{icon:"🚀",label:"Builder",desc:"Real tools used by real people."}].map(p=>(
              <div key={p.label} style={mkPanel(C,{padding:18,cursor:"default",transition:"border-color 0.3s,box-shadow 0.3s"})}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"40";e.currentTarget.style.boxShadow=`0 0 20px ${C.accent}10`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
                <div style={{fontSize:20,marginBottom:10}}>{p.icon}</div>
                <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:14,color:C.textPrimary,marginBottom:6}}>{p.label}</div>
                <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{p.desc}</div>
              </div>
            ))}
            <div style={mkPanel(C,{padding:18,gridColumn:"1/-1",borderColor:C.accent+"20"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim,textTransform:"uppercase",marginBottom:4}}>University of Arizona</div>
                  <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:15,color:C.textPrimary}}>B.S. Computer Science</div>
                  <div style={{fontSize:12,color:C.textSecondary,marginTop:3}}>Expected May 2026 · Dean's List</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"system-ui",fontSize:32,fontWeight:800,background:`linear-gradient(135deg,${C.accent},${C.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>3.9</div>
                  <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim}}>GPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

function ProjectsSection({ C }) {
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

function ExperienceSection({ C }) {
  const {ref,inView}=useInView(0.1);
  return (
    <section id="experience" ref={ref} style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative"}}>
      <div style={{maxWidth:800,margin:"0 auto",position:"relative",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="03" label="Experience" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 40px",color:C.textPrimary}}>Career <span style={{color:C.textDim}}>trajectory.</span></h2>
        </div>
        {experience.map((exp,i)=>(
          <div key={exp.id} style={{display:"flex",gap:22,opacity:inView?1:0,transform:inView?"none":"translateX(24px)",transition:`all 0.6s ${0.15+i*0.12}s`}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:38,height:38,borderRadius:"50%",border:`2px solid ${exp.status==="active"?C.accent+"80":C.border}`,background:exp.status==="active"?`${C.accent}12`:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                <span style={{fontSize:13}}>{exp.status==="active"?"💼":"✓"}</span>
                {exp.status==="active"&&<div style={{position:"absolute",top:-2,right:-2,width:9,height:9,borderRadius:"50%",background:C.green,border:`2px solid ${C.bg}`}}/>}
              </div>
              {i<experience.length-1&&<div style={{width:1,flex:1,background:`linear-gradient(to bottom,${C.border},transparent)`,marginTop:8,minHeight:36}}/>}
            </div>
            <div style={{paddingBottom:32,flex:1}}>
              <div style={mkPanel(C,{padding:20,transition:"border-color 0.3s"})}
                onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.accent}30`}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
                  <div>
                    <h3 style={{fontFamily:"system-ui",fontWeight:700,fontSize:15,color:C.textPrimary,margin:"0 0 3px"}}>{exp.role}</h3>
                    <span style={{fontFamily:"monospace",fontSize:11,color:C.accent}}>{exp.orgShort}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim}}>{exp.period}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginTop:3}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:exp.status==="active"?C.green:C.textDim}}/>
                      <span style={{fontFamily:"monospace",fontSize:9,color:exp.status==="active"?C.green:C.textDim,textTransform:"uppercase"}}>{exp.status}</span>
                    </div>
                  </div>
                </div>
                <p style={{color:C.textSecondary,fontSize:13,lineHeight:1.75,margin:"0 0 12px"}}>{exp.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {exp.tags.map(t=><span key={t} style={{fontFamily:"monospace",fontSize:10,padding:"3px 7px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,color:C.textDim}}>{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RubiksCube({ onExplode }) {
  const mountRef  = useRef(null);
  const stateRef  = useRef({});
  const holdTimer = useRef(null);
  const isHolding = useRef(false);

  useEffect(() => {
    const st = stateRef.current;
    let THREE, renderer, scene, camera, cubeGroup, cubies = [];
    let sliceAnimating = false, animSlice = [], animAxis = null, animAngle = 0;
    let animDur = 320, animT0 = 0, animStartPos = [], animStartQuat = [];
    let rotY = 0, raf;
    const CS = 0.95, GAP = 0.02, STEP = CS + GAP;
    const FC = { px:0x7C6FFF, nx:0x4AFFC4, py:0xF97FFF, ny:0xFFB347, pz:0x7C6FFF, nz:0x4AFFC4 };

    function loadThree() {
      if (window.THREE) { THREE = window.THREE; setup(); return; }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.onload = () => { THREE = window.THREE; setup(); };
      document.head.appendChild(s);
    }

    function roundedBox(size, radius, segs) {
      const g = new THREE.BoxGeometry(size, size, size, segs, segs, segs);
      const pos = g.attributes.position;
      const v = new THREE.Vector3();
      const half = size / 2, inner = half - radius;
      for (let i = 0; i < pos.count; i++) {
        v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
        const cl = new THREE.Vector3(Math.max(-inner, Math.min(inner, v.x)), Math.max(-inner, Math.min(inner, v.y)), Math.max(-inner, Math.min(inner, v.z)));
        const d = v.clone().sub(cl);
        if (d.length() > 0) d.normalize().multiplyScalar(radius);
        pos.setXYZ(i, cl.x + d.x, cl.y + d.y, cl.z + d.z);
      }
      g.computeVertexNormals();
      return g;
    }

    function setup() {
      const el = mountRef.current; if (!el) return;
      const W = window.innerWidth, H = window.innerHeight;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
      camera.position.set(0, 0, 22);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dl  = new THREE.DirectionalLight(0xffffff, 1.0); dl.position.set(5, 8, 6);   scene.add(dl);
      const dl2 = new THREE.DirectionalLight(0x9999ff, 0.3); dl2.position.set(-6, -2, 4); scene.add(dl2);
      const innerLight = new THREE.PointLight(0xffffff, 0, 14); scene.add(innerLight);
      st.innerLight = innerLight;

      const bloomMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uOpacity: { value: 0.0 }, uColor: { value: new THREE.Color(0x7C6FFF) } },
        vertexShader:   `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform float uOpacity; uniform vec3 uColor; varying vec3 vN; void main(){ float r=1.0-abs(dot(vN,vec3(0,0,1))); gl_FragColor=vec4(uColor,pow(r,1.2)*uOpacity); }`,
      });
      const bloomSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), bloomMat);
      bloomSphere.renderOrder = 10;
      scene.add(bloomSphere);
      st.bloomSphere = bloomSphere; st.bloomMat = bloomMat;

      cubeGroup = new THREE.Group(); scene.add(cubeGroup);
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0 });
      const matCache = {};
      for (const k in FC) matCache[k] = new THREE.MeshStandardMaterial({ color: FC[k], roughness: 0.08, metalness: 0.02, emissive: new THREE.Color(FC[k]).multiplyScalar(0.06) });
      const geo = roundedBox(CS, 0.08, 8);

      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
        const mesh = new THREE.Mesh(geo, [
          x===1?matCache.px:blackMat, x===-1?matCache.nx:blackMat,
          y===1?matCache.py:blackMat, y===-1?matCache.ny:blackMat,
          z===1?matCache.pz:blackMat, z===-1?matCache.nz:blackMat,
        ]);
        mesh.position.set(x*STEP, y*STEP, z*STEP);
        mesh.userData.home   = new THREE.Vector3(x*STEP, y*STEP, z*STEP);
        mesh.userData.dir    = (x===0&&y===0&&z===0) ? new THREE.Vector3(0,0,1) : new THREE.Vector3(x,y,z).normalize();
        mesh.userData.tumble = new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5).normalize();
        cubeGroup.add(mesh); cubies.push(mesh);
      }
      cubeGroup.rotation.x = 0.35;

      function startSlice() {
        if (sliceAnimating || st.exploded) return;
        const axes = ["x","y","z"], axis = axes[Math.floor(Math.random()*3)];
        const layer = [-1,0,1][Math.floor(Math.random()*3)], dir = Math.random()<.5?1:-1;
        const slice = cubies.filter(c => Math.abs(c.position[axis]-layer*STEP) < STEP*.35);
        if (!slice.length) return;
        sliceAnimating=true; animSlice=slice; animAxis=axis; animAngle=dir*Math.PI/2; animT0=performance.now();
        animStartPos=slice.map(c=>c.position.clone()); animStartQuat=slice.map(c=>c.quaternion.clone());
      }
      function updateSlice() {
        if (!sliceAnimating) return;
        const t = Math.min((performance.now()-animT0)/animDur, 1);
        const e = t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
        const axVec = new THREE.Vector3(animAxis==="x"?1:0, animAxis==="y"?1:0, animAxis==="z"?1:0);
        const rotQ  = new THREE.Quaternion().setFromAxisAngle(axVec, animAngle*e);
        for (let i = 0; i < animSlice.length; i++) {
          animSlice[i].position.copy(animStartPos[i].clone().applyQuaternion(rotQ));
          animSlice[i].quaternion.copy(rotQ.clone().multiply(animStartQuat[i]));
        }
        if (t >= 1) {
          for (const c of animSlice) {
            c.position.x=Math.round(c.position.x/STEP)*STEP;
            c.position.y=Math.round(c.position.y/STEP)*STEP;
            c.position.z=Math.round(c.position.z/STEP)*STEP;
          }
          sliceAnimating = false;
        }
      }
      st.startSlice    = startSlice;
      st.sliceInterval = setInterval(startSlice, 650);
      st.raycaster     = new THREE.Raycaster();
      st.camera        = camera;
      st.cubies        = cubies;

      function loop() {
        raf = requestAnimationFrame(loop);
        if (!st.exploded) { updateSlice(); rotY += 0.005; cubeGroup.rotation.y = rotY; }
        const cgPos = new THREE.Vector3(); cubeGroup.getWorldPosition(cgPos); innerLight.position.copy(cgPos);

        if (st.shaking) {
          const held = performance.now()-st.shakeStart, ramp = Math.min(1, held/1200), jitter = 0.04+ramp*0.18;
          cubeGroup.position.x = (Math.random()-.5)*jitter*2;
          cubeGroup.position.y = (Math.random()-.5)*jitter*2;
          cubeGroup.rotation.z = (Math.random()-.5)*ramp*0.12;
          cubeGroup.scale.setScalar(1+0.15*Math.min(1,held/400));
          if (Math.random() < ramp*0.35) {
            const tgt = cubies[Math.floor(Math.random()*cubies.length)];
            const mats = Array.isArray(tgt.material)?tgt.material:[tgt.material];
            mats.forEach(m=>{ m.emissiveIntensity=3; setTimeout(()=>{ try{m.emissiveIntensity=0;}catch(_){} },60); });
          }
          innerLight.intensity = ramp*8; innerLight.distance = 3+ramp*10;
        } else if (!st.exploded) {
          cubeGroup.position.x += (0-cubeGroup.position.x)*0.2;
          cubeGroup.position.y += (0-cubeGroup.position.y)*0.2;
          cubeGroup.scale.setScalar(1); innerLight.intensity *= 0.85;
        }

        if (st.exploding) {
          const t = Math.min(1,(performance.now()-st.explodeStart)/900);
          const e = t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
          cubeGroup.position.set(0,0,0); cubeGroup.rotation.z=0; cubeGroup.scale.setScalar(1);
          innerLight.intensity = t<0.1 ? 20 : Math.max(0, 20*(1-(t-0.1)/0.9));
          innerLight.distance  = 5+e*18;
          bloomSphere.scale.setScalar(0.1+e*28);
          bloomMat.uniforms.uOpacity.value = 0;
          for (let i = 0; i < cubies.length; i++) {
            const c = cubies[i];
            c.position.copy(c.userData.home.clone().add(c.userData.dir.clone().multiplyScalar(e*38)));
            const spin = e*Math.PI*2;
            c.quaternion.setFromEuler(new THREE.Euler(spin*c.userData.tumble.x, spin*c.userData.tumble.y, spin*c.userData.tumble.z));
          }
          if (t >= 1) { st.exploding=false; bloomMat.uniforms.uOpacity.value=0; }
        }
        renderer.render(scene, camera);
      }
      loop();

      const onResize = () => {
        const W2=window.innerWidth, H2=window.innerHeight;
        camera.aspect=W2/H2; camera.updateProjectionMatrix(); renderer.setSize(W2,H2);
      };
      window.addEventListener("resize", onResize);
      st.cleanup = () => {
        window.removeEventListener("resize", onResize);
        clearInterval(st.sliceInterval); cancelAnimationFrame(raf); renderer.dispose();
        const el2 = mountRef.current;
        if (el2 && el2.contains(renderer.domElement)) el2.removeChild(renderer.domElement);
      };
    }
    loadThree();
    return () => { st.cleanup?.(); };
  }, []);

  const startHold = useCallback((e) => {
    e.preventDefault();
    const st = stateRef.current;
    if (st.exploded || !st.raycaster || !st.camera || !st.cubies) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mouse = new window.THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    st.raycaster.setFromCamera(mouse, st.camera);
    const hits = st.raycaster.intersectObjects(st.cubies);
    if (!hits.length) return;
    isHolding.current = true;
    st.shaking=true; st.shakeStart=st.holdStartTime=performance.now(); st.charged=false;
    clearInterval(st.sliceInterval);
    holdTimer.current = setTimeout(() => { st.charged = true; }, 800);
  }, []);

  const endHold = useCallback(() => {
    const st = stateRef.current; if (!isHolding.current) return;
    isHolding.current = false; clearTimeout(holdTimer.current);
    const heldMs = performance.now()-(st.holdStartTime||0);
    if (st.charged || heldMs < 300) {
      st.shaking=false; st.charged=false;
      st.exploding=true; st.explodeStart=performance.now(); st.exploded=true;
      onExplode();
    } else {
      st.shaking=false; st.charged=false;
      st.sliceInterval = setInterval(st.startSlice, 650);
    }
  }, [onExplode]);

  return (
    <div ref={mountRef} onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
      onTouchStart={startHold} onTouchEnd={endHold}
      style={{ position:"fixed", inset:0, zIndex:998, cursor:"none", userSelect:"none", WebkitUserSelect:"none" }}
      data-cube-overlay="true"
    />
  );
}

function SkillCard({ cat, visible, delay, C }) {
  return (
    <div style={{ ...mkPanel(C, { padding: 20 }), opacity: visible ? 1 : 0, transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(30px)", transition: `opacity 0.5s ${delay}s, transform 0.5s ${delay}s cubic-bezier(0.34,1.56,0.64,1)`, borderColor: visible ? cat.accent + "50" : C.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.accent, boxShadow: `0 0 8px ${cat.accent}` }} />
        <span style={{ fontFamily: "monospace", fontSize: 11, color: cat.accent, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{cat.category}</span>
      </div>
      {cat.items.map((skill, i) => (
        <div key={skill.name} style={{ marginBottom: i < cat.items.length - 1 ? 10 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontFamily: "system-ui", fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{skill.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: cat.accent, fontWeight: 700 }}>{skill.level}%</span>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: visible ? skill.level + "%" : "0%", background: `linear-gradient(90deg,${cat.accent},${cat.accent}80)`, borderRadius: 2, boxShadow: `0 0 6px ${cat.accent}50`, transition: `width 0.9s ${delay + 0.2 + i * 0.05}s cubic-bezier(0.4,0,0.2,1)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ C }) {
  const { ref, inView } = useInView(0.1);
  const [phase, setPhase]               = useState("idle");
  const [isMobile, setIsMobile]         = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [showCube, setShowCube]         = useState(true);
  const [bgActive, setBgActive]         = useState(false);
  const [headingAnim, setHeadingAnim]   = useState("");

  useEffect(() => { const check = () => setIsMobile(window.innerWidth < 700); check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check); }, []);

  const handleExplode = useCallback(() => {
    setHeadingAnim("up");
    setBgActive(true);
    setTimeout(() => { setPhase("grid"); setShowCube(false); }, 600);
    setTimeout(() => setCardsVisible(true), 750);
  }, []);

  const handleCollapse = useCallback(() => {
    setCardsVisible(false);
    setHeadingAnim("down");
    setBgActive(false);
    setTimeout(() => { setPhase("idle"); setShowCube(true); }, 600);
  }, []);

  return (
    <section id="skills" ref={ref} style={{ padding: "96px 60px", background: "transparent", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "fixed", left: "50%", top: "50%",
        width: "100vmax", height: "100vmax", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent}F0 0%, ${C.accent}CC 35%, #070B14 75%, ${C.bg} 100%)`,
        transform: `translate(-50%,-50%) scale(${bgActive ? 3.0 : 0})`,
        opacity: bgActive ? 1 : 0,
        transition: bgActive
          ? "transform 1.4s cubic-bezier(0.2,0,0.2,1), opacity 0.15s ease-in"
          : "transform 0.6s cubic-bezier(0.4,0,1,1), opacity 0.5s ease-out",
        willChange: "transform", zIndex: 997, pointerEvents: "none",
      }}/>
      {!isMobile && showCube && inView && phase === "idle" && <RubiksCube onExplode={handleExplode}/>}
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", position: "relative", zIndex: 1000, pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,${C.accent},${C.green})` }}/>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: "0.15em" }}>04 / Skills</span>
        </div>
        <h2 style={{
          fontFamily: "system-ui", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800,
          letterSpacing: "-0.02em", margin: "0 0 36px", color: C.textPrimary,
          animation: headingAnim === "up"   ? "headingUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
                   : headingAnim === "down" ? "headingDown 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
                   : "none",
        }}>
          Technical <span style={{ color: C.textDim }}>universe.</span>
        </h2>
        <div style={{
          overflow: "hidden",
          maxHeight: (!isMobile && showCube && phase === "idle") ? "400px" : "0px",
          opacity:   (!isMobile && showCube && phase === "idle") ? 1 : 0,
          transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 320, fontFamily: "monospace", fontSize: 12, color: C.textDim, justifyContent: "center", paddingBottom: 8 }}>
            <span style={{ color: C.accent, animation: "cubePulse 1.8s ease-in-out infinite" }}>◆</span>
            Hold the cube to charge it up, release to reveal skills
          </div>
        </div>
        {isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            {skillCategories.map((cat, i) => <SkillCard key={cat.category} cat={cat} visible delay={i * 0.1} C={C}/>)}
          </div>
        )}
        <div style={{
          overflow: "hidden",
          maxHeight: (!isMobile && phase === "grid") ? "1000px" : "0px",
          opacity:   (!isMobile && phase === "grid") ? 1 : 0,
          transform: (!isMobile && phase === "grid") ? "translateY(0)" : "translateY(40px)",
          transition: "max-height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: phase === "grid" ? "auto" : "none",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            {skillCategories.map((cat, i) => <SkillCard key={cat.category} cat={cat} visible={cardsVisible} delay={i * 0.1} C={C}/>)}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handleCollapse} style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px",
              background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
              color: C.textSecondary, fontFamily: "monospace", fontSize: 12, cursor: "pointer",
              opacity: cardsVisible ? 1 : 0, transform: cardsVisible ? "none" : "translateY(8px)",
              transition: "opacity 0.4s 0.5s, transform 0.4s 0.5s, border-color 0.2s, color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent + "60"; e.currentTarget.style.color = C.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}>
              ← Collapse back to cube
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cubePulse  { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes headingUp  { 0%{transform:translateY(0)} 60%{transform:translateY(-14px)} 100%{transform:translateY(0)} }
        @keyframes headingDown{ 0%{transform:translateY(0)} 60%{transform:translateY(18px)}  100%{transform:translateY(0)} }
      `}</style>
    </section>
  );
}

function AchievementsSection({ C }) {
  const {ref,inView}=useInView(0.1);
  return (
    <section id="achievements" ref={ref} style={{padding:"80px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center"}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="05" label="Recognition" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 36px",color:C.textPrimary}}>Awards & <span style={{color:C.textDim}}>milestones.</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {achievements.map((a,i)=>(
            <div key={a.title} style={mkPanel(C,{padding:22,transition:"border-color 0.3s,box-shadow 0.3s,transform 0.2s",opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transitionDelay:`${i*0.1}s`})}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${C.accent}40`;e.currentTarget.style.boxShadow=`0 0 24px ${C.accent}15`;e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:26,marginBottom:12}}>{a.icon}</div>
              <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:14,color:C.textPrimary,marginBottom:4}}>{a.title}</div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,marginBottom:10}}>{a.event}</div>
              <p style={{fontSize:12,color:C.textDim,lineHeight:1.6,margin:0}}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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

function ArcadeSection({ C }) {
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
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 8px",color:C.textPrimary}}>Need a <span style={{background:`linear-gradient(90deg,${C.pink},${C.orange})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>break?</span></h2>
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

function GuestbookSection({ C }) {
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

function HireMeSection({ C }) {
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
    <section id="hire" ref={ref} style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 60% at 50% 50%,${C.accent}06,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%",position:"relative",zIndex:2}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="08" label="Hire Me" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 8px"}}>
            <span style={{color:C.textPrimary}}>Ready to </span>
            <span style={{background:`linear-gradient(90deg,${C.accent},${C.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>make an impact.</span>
          </h2>
          <p style={{color:C.textSecondary,fontSize:15,lineHeight:1.75,maxWidth:520,marginBottom:40}}>Looking for Summer 2026 internships in software engineering, full-stack dev, and applied AI.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,opacity:inView?1:0,transition:"all 0.7s 0.2s"}}>
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {reasons.map((r,i)=>(
                <div key={i} style={mkPanel(C,{padding:16,display:"flex",gap:10,alignItems:"flex-start",transition:"border-color 0.3s"})}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"40";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
                  <span style={{fontSize:18,flexShrink:0}}>{r.icon}</span>
                  <span style={{fontFamily:"system-ui",fontSize:12,color:C.textSecondary,lineHeight:1.5}}>{r.text}</span>
                </div>
              ))}
            </div>
            <div style={mkPanel(C,{padding:18,borderColor:C.green+"30"})}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
                <span style={{fontFamily:"monospace",fontSize:11,color:C.green,fontWeight:700}}>Available · Summer 2026</span>
              </div>
              <p style={{fontFamily:"system-ui",fontSize:13,color:C.textSecondary,margin:"0 0 14px",lineHeight:1.6}}>If you're working on hard problems that need a builder who cares — let's talk.</p>
              <div style={{display:"flex",gap:10}}>
                <a href={`mailto:${personal.email}`} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:`linear-gradient(135deg,${C.accent},${C.green})`,color:C.bg,fontWeight:700,fontSize:12,borderRadius:7,textDecoration:"none"}}>✉️ Email directly</a>
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",border:`1px solid ${C.border}`,color:C.textSecondary,fontSize:12,borderRadius:7,textDecoration:"none",fontFamily:"monospace"}}>💼 LinkedIn</a>
              </div>
            </div>
          </div>
          <div style={mkPanel(C,{padding:26,borderColor:C.accent+"30"})}>
            <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:18}}>Send a message</div>
            {sent
              ?<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:48,marginBottom:12}}>🚀</div><div style={{fontFamily:"system-ui",fontWeight:700,fontSize:18,color:C.textPrimary,marginBottom:8}}>Message sent!</div><button onClick={()=>setSent(false)} style={{marginTop:16,fontFamily:"monospace",fontSize:11,padding:"7px 16px",border:`1px solid ${C.border}`,borderRadius:6,background:"none",color:C.textDim,cursor:"pointer"}}>Send another</button></div>
              :<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {[["name","Your name *","text"],["email","Email *","email"],["company","Company / Role","text"]].map(([k,ph,type])=>(
                    <input key={k} type={type} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{gridColumn:k==="company"?"1/-1":"auto",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,fontFamily:"monospace",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
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

function ContactSection({ C }) {
  const {ref,inView}=useInView(0.1);
  const links=[{icon:"✉️",label:"Email",value:personal.email,href:`mailto:${personal.email}`,accent:C.accent},{icon:"🐙",label:"GitHub",value:"github.com/baraaabdalla",href:personal.github,accent:C.pink},{icon:"💼",label:"LinkedIn",value:"linkedin.com/in/baraaabdalla",href:personal.linkedin,accent:C.green}];
  return (
    <section id="contact" ref={ref} style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <span style={{fontFamily:"system-ui",fontWeight:800,fontSize:"18vw",color:C.textPrimary,opacity:0.012,userSelect:"none"}}>HELLO</span>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",position:"relative",zIndex:1,width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}><SectionTag num="09" label="Contact" C={C}/></div>
        <h2 style={{fontFamily:"system-ui",fontSize:"clamp(32px,5vw,56px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 16px",opacity:inView?1:0,transition:"all 0.6s 0.1s"}}>
          Let's build<br/><span style={{background:`linear-gradient(90deg,${C.accent},${C.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>something real.</span>
        </h2>
        <p style={{color:C.textSecondary,fontSize:16,lineHeight:1.75,maxWidth:480,marginBottom:36,opacity:inView?1:0,transition:"all 0.6s 0.2s"}}>Seeking Summer 2026 internships in software engineering, full-stack dev, and applied AI.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,opacity:inView?1:0,transition:"all 0.6s 0.3s"}}>
          {links.map(link=>(
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",...mkPanel(C,{padding:"14px 20px"}),textDecoration:"none",transition:"border-color 0.3s,box-shadow 0.3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${link.accent}40`;e.currentTarget.style.boxShadow=`0 0 20px ${link.accent}12`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:36,height:36,borderRadius:7,border:`1px solid ${link.accent}30`,background:`${link.accent}08`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{link.icon}</div>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>{link.label}</div>
                  <div style={{fontFamily:"monospace",fontSize:13,color:C.textSecondary}}>{link.value}</div>
                </div>
              </div>
              <span style={{color:C.textDim,fontSize:14}}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

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

function Terminal({ onClose, C }) {
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

const SYSTEM_PROMPT="You are Elbaraa Abdalla, speaking in first person on your personal portfolio website. You are a CS student at the University of Arizona, full-stack engineer, AI researcher, and undergrad TA. Be casual, confident, and genuine. Keep answers concise (2-4 sentences).";

function AIChat({ C }) {
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

function BackToTop({ goTo, C }) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{ const h=()=>setVisible(window.scrollY>200); window.addEventListener("scroll",h,{passive:true}); return()=>window.removeEventListener("scroll",h); },[]);
  return (
    <button onClick={()=>goTo(0)} style={{position:"fixed",bottom:88,left:24,zIndex:800,width:40,height:40,borderRadius:"50%",background:C.panel,border:`1px solid ${C.border}`,color:C.textSecondary,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(12px)",transition:"opacity 0.3s, transform 0.3s",pointerEvents:visible?"all":"none"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSecondary;}}>↑</button>
  );
}

function Footer({ C }) {
  return (
    <footer style={{padding:"22px 60px",background:C.bg,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim}}>elbaraa.dev</span>
      <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim}}>© 2025 Elbaraa Abdalla</span>
      <div style={{display:"flex",alignItems:"center",gap:7,fontFamily:"monospace",fontSize:11,color:C.textDim}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>All systems operational
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const [terminal,setTerminal]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const {current,goTo}=useSectionSnap();
  const [darkMode,setDarkMode]=useState(true);
  const C=darkMode?DARK:LIGHT;

  useEffect(()=>{ let buf=""; const h=e=>{buf+=e.key.toLowerCase();if(buf.length>7)buf=buf.slice(-7);if(buf==="elbaraa")setTerminal(true);}; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[]);

  return (
    <div style={{background:C.bg,color:C.textPrimary,fontFamily:"system-ui,-apple-system,sans-serif",cursor:"none",transition:"background 0.4s, color 0.4s"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:none}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
        @keyframes tilePop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes tileAppear{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0;cursor:none !important}
        html{scroll-snap-type:y mandatory;overflow-y:scroll}
        section{scroll-snap-align:start}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#070B14}::-webkit-scrollbar-thumb{background:#1E2D4A;border-radius:2px}
        ::selection{background:rgba(124,111,255,0.25)}
        input,textarea{color-scheme:dark}
      `}</style>

      <InteractiveBg C={C}/>
      <CustomCursor C={C}/>
      <AstronautAvatar C={C}/>
      <SectionDots current={current} goTo={goTo} C={C}/>
      <NavBar onMenu={()=>setMenuOpen(true)} onTerminal={()=>setTerminal(true)} C={C} darkMode={darkMode} toggleDark={()=>setDarkMode(d=>!d)}/>
      <MenuOverlay open={menuOpen} onClose={()=>setMenuOpen(false)} goTo={goTo} C={C}/>

      <HeroSection onMenu={()=>setMenuOpen(true)} onHire={()=>goTo(SECTIONS.indexOf("hire"))} C={C}/>
      <AboutSection C={C}/>
      <ProjectsSection C={C}/>
      <ExperienceSection C={C}/>
      <SkillsSection C={C}/>
      <AchievementsSection C={C}/>
      <ArcadeSection C={C}/>
      <GuestbookSection C={C}/>
      <HireMeSection C={C}/>
      <ContactSection C={C}/>
      <Footer C={C}/>

      <BackToTop goTo={goTo} C={C}/>
      <AIChat C={C}/>
      {terminal && <Terminal onClose={()=>setTerminal(false)} C={C}/>}
    </div>
  );
}
