import { useState, useEffect, useRef, useCallback } from "react";
import { skillCategories } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";

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
      camera.position.set(0, 0, 16);
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
      style={{ position:"absolute", inset:0, zIndex:998, cursor:"none", userSelect:"none", WebkitUserSelect:"none" }}
      data-cube-overlay="true"
    />
  );
}

function SkillCard({ cat, visible, delay, C }) {
  return (
    <div style={{ ...mkPanel(C, { padding: 16 }), opacity: visible ? 1 : 0, transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(30px)", transition: `opacity 0.5s ${delay}s, transform 0.5s ${delay}s cubic-bezier(0.34,1.56,0.64,1)`, borderColor: visible ? cat.accent + "50" : C.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: cat.accent, boxShadow: `0 0 7px ${cat.accent}` }} />
        <span style={{ fontFamily: "monospace", fontSize: 10, color: cat.accent, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{cat.category}</span>
      </div>
      {cat.items.map((skill, i) => (
        <div key={skill.name} style={{ marginBottom: i < cat.items.length - 1 ? 6 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontFamily: "system-ui", fontSize: 11, fontWeight: 600, color: C.textPrimary }}>{skill.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: cat.accent, fontWeight: 700 }}>{skill.level}%</span>
          </div>
          <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: visible ? skill.level + "%" : "0%", background: `linear-gradient(90deg,${cat.accent},${cat.accent}80)`, borderRadius: 2, boxShadow: `0 0 6px ${cat.accent}50`, transition: `width 0.9s ${delay + 0.2 + i * 0.05}s cubic-bezier(0.4,0,0.2,1)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkillsSection({ C }) {
  const { ref, inView } = useInView(0.1);
  const [phase, setPhase]               = useState("idle");
  const [isMobile, setIsMobile]         = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [showCube, setShowCube]         = useState(true);
  const [bgActive, setBgActive]         = useState(false);
  const [headingAnim, setHeadingAnim]   = useState("");

  const gridRef = useRef(null);

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

  // Collapse on scroll when grid is showing
  useEffect(() => {
    if (phase !== "grid" || !cardsVisible) return;
    let scrollStart = window.scrollY;
    let settled = false;

    // Wait a moment for the explode animation to settle before listening
    const settleTimer = setTimeout(() => { scrollStart = window.scrollY; settled = true; }, 1000);

    const onScroll = () => {
      if (!settled) return;
      const delta = Math.abs(window.scrollY - scrollStart);
      if (delta > 60) {
        handleCollapse();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(settleTimer); };
  }, [phase, cardsVisible, handleCollapse]);

  // Collapse on click outside the skill cards
  useEffect(() => {
    if (phase !== "grid" || !cardsVisible) return;

    const onClick = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        handleCollapse();
      }
    };

    // Delay adding listener so the explode click doesn't immediately trigger it
    const timer = setTimeout(() => {
      window.addEventListener("click", onClick);
    }, 800);

    return () => { clearTimeout(timer); window.removeEventListener("click", onClick); };
  }, [phase, cardsVisible, handleCollapse]);

  return (
    <section id="skills" ref={ref} style={{ padding: "96px 60px", background: "transparent", minHeight: "100vh", display: "flex", alignItems: phase === "grid" ? "flex-start" : "center", paddingTop: phase === "grid" ? 96 : undefined, position: "relative" }}>
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
          letterSpacing: "-0.02em", margin: "0 0 20px", color: C.textPrimary,
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 320, fontFamily: "monospace", fontSize: 15, color: C.textSecondary, justifyContent: "center", paddingBottom: 8, textShadow: `0 0 20px ${C.bg}, 0 0 40px ${C.bg}` }}>
            <span style={{ color: C.accent, animation: "cubePulse 1.8s ease-in-out infinite", fontSize: 18 }}>◆</span>
            Hold the cube to charge it up, release to reveal skills
          </div>
        </div>
        {isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            {skillCategories.map((cat, i) => <SkillCard key={cat.category} cat={cat} visible delay={i * 0.1} C={C}/>)}
          </div>
        )}
        <div ref={gridRef} style={{
          overflow: "hidden",
          maxHeight: (!isMobile && phase === "grid") ? "none" : "0px",
          opacity:   (!isMobile && phase === "grid") ? 1 : 0,
          transform: (!isMobile && phase === "grid") ? "translateY(0)" : "translateY(40px)",
          transition: "max-height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: phase === "grid" ? "auto" : "none",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
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