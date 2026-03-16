import { useEffect, useRef } from "react";

export function InteractiveBg({ C, isDark }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const ripples = useRef([]);
  const pineLayersRef = useRef({ far: [], mid: [], front: [] });
  const leavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let raf;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    function makePineLayer(baseY, heightScale, spacingPx, jitterPx, trunkHeight, widthRange) {
      const trees = [];
      let x = -120;

      while (x < W + 160) {
        const tw = spacingPx * (widthRange[0] + Math.random() * (widthRange[1] - widthRange[0]));
        const th = heightScale * (0.8 + Math.random() * 0.2);
        const trunkW = Math.max(2, tw * 0.055);

        trees.push({
          leftX: x,
          rightX: x + tw,
          peakX: x + tw / 2 + (Math.random() - 0.5) * jitterPx,
          peakY: baseY - th,
          baseY,
          trunkW,
          trunkH: trunkHeight,
        });

        x += spacingPx * (0.72 + Math.random() * 0.12);
      }

      return trees;
    }

    function initPineLayers() {
      pineLayersRef.current = {
        far: makePineLayer(H * 0.9, H * 0.16, 108, 10, 8, [0.82, 1.02]),
        mid: makePineLayer(H * 0.935, H * 0.22, 128, 12, 10, [0.86, 1.08]),
        front: makePineLayer(H * 0.985, H * 0.29, 154, 14, 12, [0.9, 1.14]),
      };
    }

    function initLeaves() {
      const count = 18;
      leavesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H - H,
        w: 14 + Math.random() * 10,
        h: 8 + Math.random() * 6,
        alpha: 0.36 + Math.random() * 0.24,
        vx: 0.55 + Math.random() * 0.6,
        vy: 1.2 + Math.random() * 1.3,
        sway: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.45,
        rot: -28 + Math.random() * 56,
        shape: Math.floor(Math.random() * 4),
        skew: -12 + Math.random() * 24,
      }));
    }

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initLightParticles();
      initDarkParticles();
      initPineLayers();
      initLeaves();
    };

    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e) => {
      if (isDark) {
        ripples.current.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.6 });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);

    let darkPts = [];
    function initDarkParticles() {
      const N = 90;
      const cols = [
        `rgba(124,111,255,`,
        `rgba(74,255,196,`,
        `rgba(249,127,255,`,
      ];
      darkPts = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.2 + Math.random() * 1.8,
        col: cols[Math.floor(Math.random() * 3)],
        base: { x: 0, y: 0 },
      }));
      darkPts.forEach((p) => {
        p.base.x = p.x;
        p.base.y = p.y;
      });
    }

    let lightParticles = [];
    function initLightParticles() {
      const N = 10;
      lightParticles = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: H * 0.1 + Math.random() * H * 0.5,
        vx: 0.04 + Math.random() * 0.08,
        vy: (Math.random() - 0.5) * 0.03,
        w: 2 + Math.random() * 2,
        h: 1 + Math.random() * 1.5,
        alpha: 0.08 + Math.random() * 0.08,
      }));
    }

    initDarkParticles();
    initLightParticles();
    initPineLayers();
    initLeaves();

    function drawPineLayer(trees, color, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      trees.forEach((t) => {
        ctx.beginPath();
        ctx.moveTo(t.leftX, t.baseY);
        ctx.lineTo(t.peakX, t.peakY);
        ctx.lineTo(t.rightX, t.baseY);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(
          t.peakX - t.trunkW / 2,
          t.baseY - t.trunkH,
          t.trunkW,
          t.trunkH
        );
      });

      ctx.restore();
    }

    function drawLeaf(leaf) {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate((leaf.rot * Math.PI) / 180);
      ctx.transform(1, 0, Math.tan((leaf.skew * Math.PI) / 180), 1, 0, 0);

      const fill =
        leaf.shape === 0
          ? `rgba(135,160,142,${leaf.alpha})`
          : leaf.shape === 1
          ? `rgba(120,147,128,${leaf.alpha * 0.92})`
          : leaf.shape === 2
          ? `rgba(150,171,138,${leaf.alpha * 0.88})`
          : `rgba(110,140,118,${leaf.alpha * 0.9})`;

      ctx.fillStyle = fill;
      ctx.beginPath();

      if (leaf.shape === 0) {
        ctx.ellipse(0, 0, leaf.w * 0.5, leaf.h * 0.5, 0, 0, Math.PI * 2);
      } else if (leaf.shape === 1) {
        ctx.moveTo(-leaf.w * 0.45, 0);
        ctx.quadraticCurveTo(0, -leaf.h * 0.65, leaf.w * 0.45, 0);
        ctx.quadraticCurveTo(0, leaf.h * 0.65, -leaf.w * 0.45, 0);
      } else if (leaf.shape === 2) {
        ctx.moveTo(-leaf.w * 0.5, 0);
        ctx.bezierCurveTo(
          -leaf.w * 0.15,
          -leaf.h * 0.7,
          leaf.w * 0.2,
          -leaf.h * 0.45,
          leaf.w * 0.5,
          0
        );
        ctx.bezierCurveTo(
          leaf.w * 0.15,
          leaf.h * 0.65,
          -leaf.w * 0.2,
          leaf.h * 0.45,
          -leaf.w * 0.5,
          0
        );
      } else {
        ctx.moveTo(-leaf.w * 0.48, 0);
        ctx.quadraticCurveTo(0, -leaf.h * 0.5, leaf.w * 0.48, 0);
        ctx.quadraticCurveTo(0, leaf.h * 0.78, -leaf.w * 0.48, 0);
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function updateAndDrawLeaves() {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      leavesRef.current.forEach((leaf) => {
        leaf.sway += 0.02;
        leaf.x += leaf.vx + Math.sin(leaf.sway) * 0.18;
        leaf.y += leaf.vy;
        leaf.rot += leaf.spin;

        const dx = leaf.x - mx;
        const dy = leaf.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const range = 170;

        if (dist < range && dist > 0.001) {
          const force = (1 - dist / range) * 2.4;
          leaf.x += (dx / dist) * force * 2.2;
          leaf.y += (dy / dist) * force * 1.2;
          leaf.rot += (dx / dist) * 2.4;
        }

        if (leaf.y > H + 30 || leaf.x > W + 50) {
          leaf.x = Math.random() * (W * 0.75);
          leaf.y = -20 - Math.random() * 140;
          leaf.vx = 0.55 + Math.random() * 0.6;
          leaf.vy = 1.2 + Math.random() * 1.3;
          leaf.sway = Math.random() * Math.PI * 2;
          leaf.rot = -28 + Math.random() * 56;
          leaf.shape = Math.floor(Math.random() * 4);
          leaf.skew = -12 + Math.random() * 24;
          leaf.w = 14 + Math.random() * 10;
          leaf.h = 8 + Math.random() * 6;
          leaf.alpha = 0.36 + Math.random() * 0.24;
        }

        drawLeaf(leaf);
      });
    }

    function drawLightMode() {
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#F8F4EC");
      bg.addColorStop(0.45, "#F6F2E8");
      bg.addColorStop(1, "#EEE8DB");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const sunX = W * 0.78;
      const sunY = H * 0.16;
      const sun = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        Math.min(W, H) * 0.28
      );
      sun.addColorStop(0, "rgba(242,207,132,0.28)");
      sun.addColorStop(0.35, "rgba(242,207,132,0.12)");
      sun.addColorStop(1, "rgba(242,207,132,0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, W, H);

      const leftGlow = ctx.createRadialGradient(
        W * 0.24,
        H * 0.36,
        0,
        W * 0.24,
        H * 0.36,
        Math.min(W, H) * 0.35
      );
      leftGlow.addColorStop(0, "rgba(221,232,218,0.32)");
      leftGlow.addColorStop(1, "rgba(221,232,218,0)");
      ctx.fillStyle = leftGlow;
      ctx.fillRect(0, 0, W, H);

      const fog = ctx.createLinearGradient(0, H * 0.22, 0, H * 0.72);
      fog.addColorStop(0, "rgba(255,255,255,0)");
      fog.addColorStop(0.25, "rgba(255,255,255,0.22)");
      fog.addColorStop(0.5, "rgba(255,255,255,0.34)");
      fog.addColorStop(0.75, "rgba(255,255,255,0.14)");
      fog.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, H * 0.12, W, H * 0.7);

      const farGround = ctx.createLinearGradient(0, H * 0.62, 0, H);
      farGround.addColorStop(0, "rgba(223,230,216,0.0)");
      farGround.addColorStop(1, "rgba(223,230,216,0.9)");
      ctx.fillStyle = farGround;
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      drawPineLayer(pineLayersRef.current.far, "#A7B8A9", 0.13);
      drawPineLayer(pineLayersRef.current.mid, "#6B8E78", 0.18);
      drawPineLayer(pineLayersRef.current.front, "#345C49", 0.24);

      const treeBlend = ctx.createLinearGradient(0, H * 0.8, 0, H);
      treeBlend.addColorStop(0, "rgba(240,235,225,0)");
      treeBlend.addColorStop(0.22, "rgba(241,236,226,0.28)");
      treeBlend.addColorStop(0.5, "rgba(241,236,226,0.62)");
      treeBlend.addColorStop(0.78, "rgba(238,232,220,0.88)");
      treeBlend.addColorStop(1, "rgba(236,230,218,0.98)");
      ctx.fillStyle = treeBlend;
      ctx.fillRect(0, H * 0.76, W, H * 0.24);

      const groundMist = ctx.createLinearGradient(0, H * 0.74, 0, H);
      groundMist.addColorStop(0, "rgba(246,242,232,0)");
      groundMist.addColorStop(0.22, "rgba(246,242,232,0.12)");
      groundMist.addColorStop(0.48, "rgba(246,242,232,0.28)");
      groundMist.addColorStop(1, "rgba(246,242,232,0.74)");
      ctx.fillStyle = groundMist;
      ctx.fillRect(0, H * 0.68, W, H * 0.32);

      lightParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > W + 20) {
          p.x = -20;
          p.y = H * 0.12 + Math.random() * H * 0.58;
        }

        if (p.y < H * 0.08 || p.y > H * 0.8) {
          p.vy *= -1;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.x * 0.01) * 0.5);
        ctx.fillStyle = `rgba(135,160,142,${p.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      updateAndDrawLeaves();

      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx > -500 && my > -500) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 150);
        grad.addColorStop(0, "rgba(35,77,59,0.06)");
        grad.addColorStop(0.55, "rgba(242,207,132,0.04)");
        grad.addColorStop(1, "rgba(35,77,59,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 150, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawDarkMode() {
      const gridAlpha = 0.018;
      const connAlpha = 0.18;
      const mouseAlpha = 0.35;
      const particleAlpha = 0.7;
      const rippleBase = "124,111,255";
      const glowAlpha1 = 0.06;
      const glowAlpha2 = 0.025;

      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = `rgba(${rippleBase},${gridAlpha})`;
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const mx = mouse.current.x;
      const my = mouse.current.y;

      darkPts.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const FLEE = 120;

        if (dist < FLEE) {
          const f = (FLEE - dist) / FLEE;
          p.vx += (dx / dist) * f * 0.8;
          p.vy += (dy / dist) * f * 0.8;
        }

        p.vx += (p.base.x - p.x) * 0.003;
        p.vy += (p.base.y - p.y) * 0.003;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      for (let i = 0; i < darkPts.length; i++) {
        for (let j = i + 1; j < darkPts.length; j++) {
          const dx = darkPts[i].x - darkPts[j].x;
          const dy = darkPts[i].y - darkPts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(${rippleBase},${(1 - d / 110) * connAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(darkPts[i].x, darkPts[i].y);
            ctx.lineTo(darkPts[j].x, darkPts[j].y);
            ctx.stroke();
          }
        }
      }

      darkPts.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.strokeStyle = `rgba(${rippleBase},${(1 - d / 160) * mouseAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });

      darkPts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + `${particleAlpha})`;
        ctx.fill();
      });

      ripples.current = ripples.current.filter((rp) => rp.alpha > 0.01);
      ripples.current.forEach((rp) => {
        rp.r += 4;
        rp.alpha *= 0.93;
        for (let k = 0; k < 3; k++) {
          const rr = rp.r - k * 18;
          if (rr > 0) {
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rippleBase},${rp.alpha * (1 - k * 0.3)})`;
            ctx.lineWidth = 1.5 - k * 0.4;
            ctx.stroke();
          }
        }
      });

      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 140);
      grad.addColorStop(0, `rgba(${rippleBase},${glowAlpha1})`);
      grad.addColorStop(0.5, `rgba(74,255,196,${glowAlpha2})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mx, my, 140, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      if (isDark) drawDarkMode();
      else drawLightMode();
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: isDark ? 0.85 : 1,
      }}
    />
  );
}