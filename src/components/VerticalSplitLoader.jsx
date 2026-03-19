import { useState, useEffect, useRef } from "react";

/**
 * VerticalSplitLoader
 *
 * Same prop pattern as your other components:
 *   C          – theme object (DARK / LIGHT)
 *   isDark     – boolean
 *   duration   – ms before curtains open (default 3400)
 *   onComplete – called after loader fully exits the DOM
 */

// ── Particle canvas ──
function Particles({ isDark }) {
  const ref = useRef(null);
  const pts = useRef([]);
  const anim = useRef(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dw = canvas.offsetWidth;
      const dh = canvas.offsetHeight;
      canvas.width = dw * 2;
      canvas.height = dh * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    resize();

    pts.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4,
      ci: Math.floor(Math.random() * 5),
      a: Math.random() * 0.45 + 0.15,
    }));

    const darkCols = ["rgba(139,92,246,","rgba(99,102,241,","rgba(56,189,248,","rgba(52,211,153,","rgba(236,72,153,"];
    const lightCols = ["rgba(45,90,39,","rgba(60,110,55,","rgba(80,130,70,","rgba(100,150,90,","rgba(35,75,30,"];

    const draw = () => {
      const dark = isDarkRef.current;
      const dw = canvas.offsetWidth;
      const dh = canvas.offsetHeight;
      ctx.clearRect(0, 0, dw, dh);
      const p = pts.current;
      const cols = dark ? darkCols : lightCols;
      const lineBase = dark ? "rgba(99,102,241," : "rgba(45,90,39,";

      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const dx = p[i].x - p[j].x, dy = p[i].y - p[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(p[i].x, p[i].y); ctx.lineTo(p[j].x, p[j].y);
            ctx.strokeStyle = lineBase + (0.06 * (1 - d / 100)) + ")";
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }

      p.forEach((pt) => {
        const col = cols[pt.ci];
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = col + pt.a + ")"; ctx.fill();
        if (pt.r > 1.2) {
          const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r * 3);
          g.addColorStop(0, col + "0.1)"); g.addColorStop(1, col + "0)");
          ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        }
        pt.x += pt.vx; pt.y += pt.vy;
        if (pt.x < -10) pt.x = dw + 10; if (pt.x > dw + 10) pt.x = -10;
        if (pt.y < -10) pt.y = dh + 10; if (pt.y > dh + 10) pt.y = -10;
      });

      anim.current = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(anim.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// ── Scramble text hook ──
function useScramble(target, active, duration = 1200) {
  const [text, setText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

  useEffect(() => {
    if (!active) { setText(""); return; }
    let frame, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const rev = Math.floor(p * target.length);
      let r = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") { r += " "; continue; }
        if (i < rev) r += target[i];
        else if (i < rev + 3) r += chars[Math.floor(Math.random() * chars.length)];
        else r += " ";
      }
      setText(r);
      if (p < 1) frame = requestAnimationFrame(step); else setText(target);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return text;
}

// ── Main component ──
export function VerticalSplitLoader({ C, isDark, duration = 3400, onComplete }) {
  const [phase, setPhase] = useState(0);
  const [gone, setGone] = useState(false);
  const nameText = useScramble("Elbaraa Abdalla", phase >= 1, 1200);

  // Derive visual tokens from isDark
  const accentDim = isDark ? "rgba(139,92,246,0.2)" : "rgba(45,90,39,0.15)";
  const glowColor = isDark ? "rgba(139,92,246,0.08)" : "rgba(45,90,39,0.06)";
  const scanGrad = isDark
    ? "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(56,189,248,0.3), transparent)"
    : "linear-gradient(90deg, transparent, rgba(45,90,39,0.4), rgba(60,110,55,0.25), transparent)";
  const scanShadow = isDark ? "0 0 20px rgba(139,92,246,0.3)" : "0 0 20px rgba(45,90,39,0.15)";
  const nameGrad = isDark
    ? "linear-gradient(135deg, #c4b5fd, #818cf8, #8b5cf6, #6366f1, #38bdf8)"
    : "linear-gradient(135deg, #1a3a1a, #2d5a27, #3a6b35, #4a7a45, #1a4a1a)";
  const curtainTop = isDark
    ? "linear-gradient(180deg, #0a0f1c, #0d1225)"
    : "linear-gradient(180deg, #E8E2D4, #DDD7C8)";
  const curtainBot = isDark
    ? "linear-gradient(0deg, #0a0f1c, #0d1225)"
    : "linear-gradient(0deg, #E8E2D4, #DDD7C8)";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), Math.max(duration - 1000, 1800));
    const t3 = setTimeout(() => { setGone(true); onComplete?.(); }, duration + 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [duration, onComplete]);

  if (gone) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: C.bg, overflow: "hidden",
      transition: "background 0.4s",
    }}>
      <Particles isDark={isDark} />

      {/* Ambient glows */}
      <div style={{
        position: "absolute", top: "25%", left: "30%", width: "450px", height: "450px",
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        filter: "blur(60px)", animation: "elbLoader-breathe 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "25%", width: "350px", height: "350px",
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        filter: "blur(50px)", animation: "elbLoader-breathe 8s ease-in-out infinite reverse",
      }} />

      {/* Top curtain */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: phase >= 2 ? "0%" : "50%",
        background: curtainTop,
        transition: "height 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
        zIndex: 10, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: "10%", right: "10%",
          height: "1px", background: accentDim,
        }} />
      </div>

      {/* Bottom curtain */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: phase >= 2 ? "0%" : "50%",
        background: curtainBot,
        transition: "height 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
        zIndex: 10, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%",
          height: "1px", background: accentDim,
        }} />
      </div>

      {/* Scan line on the seam */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0,
        height: "1px", zIndex: 16,
        background: phase >= 2 ? "transparent" : scanGrad,
        boxShadow: phase >= 2 ? "none" : scanShadow,
        transition: "all 0.4s ease",
      }} />

      {/* Scramble name */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 15,
        display: "flex", justifyContent: "center", alignItems: "center",
        opacity: phase >= 2 ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "clamp(36px, 7vw, 64px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}>
          <span style={{
            background: nameGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {nameText}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes elbLoader-breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}