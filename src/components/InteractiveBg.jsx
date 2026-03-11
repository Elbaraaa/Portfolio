import { useEffect, useRef } from "react";

export function InteractiveBg({ C, isDark }) {
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

    // Theme-aware color values
    const gridAlpha = isDark ? 0.018 : 0.08;
    const connAlpha = isDark ? 0.18 : 0.25;
    const mouseAlpha = isDark ? 0.35 : 0.3;
    const particleAlpha = isDark ? 0.7 : 0.5;
    const rippleBase = isDark ? "124,111,255" : "160,160,160";
    const glowAlpha1 = isDark ? 0.06 : 0.06;
    const glowAlpha2 = isDark ? 0.025 : 0.03;

    const N = 90;
    const cols = isDark
      ? [`rgba(124,111,255,`,`rgba(74,255,196,`,`rgba(249,127,255,`]
      : [`rgba(140,140,140,`,`rgba(180,180,180,`,`rgba(120,120,120,`];
    const pts = Array.from({ length: N }, () => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: 1.2+Math.random()*1.8, col: cols[Math.floor(Math.random()*3)], base: { x: 0, y: 0 } }));
    pts.forEach(p => { p.base.x = p.x; p.base.y = p.y; });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = `rgba(${rippleBase},${gridAlpha})`; ctx.lineWidth = 1;
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
        if (d < 110) { ctx.strokeStyle = `rgba(${rippleBase},${(1-d/110)*connAlpha})`; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
      }
      pts.forEach(p => {
        const dx = p.x-mx, dy = p.y-my, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 160) { ctx.strokeStyle = `rgba(${rippleBase},${(1-d/160)*mouseAlpha})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(p.x,p.y); ctx.stroke(); }
      });
      pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = p.col+`${particleAlpha})`; ctx.fill(); });
      ripples.current = ripples.current.filter(rp => rp.alpha > 0.01);
      ripples.current.forEach(rp => {
        rp.r += 4; rp.alpha *= 0.93;
        for (let k = 0; k < 3; k++) { const rr = rp.r-k*18; if (rr > 0) { ctx.beginPath(); ctx.arc(rp.x,rp.y,rr,0,Math.PI*2); ctx.strokeStyle = `rgba(${rippleBase},${rp.alpha*(1-k*0.3)})`; ctx.lineWidth = 1.5-k*0.4; ctx.stroke(); } }
      });
      const grad = ctx.createRadialGradient(mx,my,0,mx,my,140);
      grad.addColorStop(0,`rgba(${rippleBase},${glowAlpha1})`); grad.addColorStop(0.5,`rgba(${isDark?"74,255,196":"190,190,190"},${glowAlpha2})`); grad.addColorStop(1,"transparent");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(mx,my,140,0,Math.PI*2); ctx.fill();
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onMove); window.removeEventListener("click",onClick); };
  }, [isDark]);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, opacity: isDark ? 0.85 : 0.65 }} />;
}