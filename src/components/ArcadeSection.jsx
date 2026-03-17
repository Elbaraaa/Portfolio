import { useState, useEffect, useRef, useCallback } from "react";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

function RubiksCube({ onExplode, onImplodeComplete, sectionRef, active, implode }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const holdTimer = useRef(null);
  const isHolding = useRef(false);

  // Trigger implode animation when prop changes
  useEffect(() => {
    const st = stateRef.current;
    if (implode && st.exploded && !st.imploding) {
      st.imploding = true;
      st.implodeStart = performance.now();
    }
  }, [implode]);

  // Pause/resume slices based on active
  useEffect(() => {
    const st = stateRef.current;
    if (!st.startSlice) return;
    if (active && !st.exploded) {
      clearInterval(st.sliceInterval);
      st.sliceInterval = setInterval(st.startSlice, 650);
    } else {
      clearInterval(st.sliceInterval);
    }
  }, [active]);

  useEffect(() => {
    const st = stateRef.current;
    let THREE, renderer, scene, camera, cubeGroup, cubies = [];
    let sliceAnimating = false,
      animSlice = [],
      animAxis = null,
      animAngle = 0;
    let animDur = 320,
      animT0 = 0,
      animStartPos = [],
      animStartQuat = [];
    let rotY = 0,
      raf;
    const CS = 0.95,
      GAP = 0.02,
      STEP = CS + GAP;
    const FC = {
      px: 0x7c6fff,
      nx: 0x4affc4,
      py: 0xf97fff,
      ny: 0xffb347,
      pz: 0x7c6fff,
      nz: 0x4affc4
    };

    function loadThree() {
      if (window.THREE) {
        THREE = window.THREE;
        setup();
        return;
      }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.onload = () => {
        THREE = window.THREE;
        setup();
      };
      document.head.appendChild(s);
    }

    function roundedBox(size, radius, segs) {
      const g = new THREE.BoxGeometry(size, size, size, segs, segs, segs);
      const pos = g.attributes.position;
      const v = new THREE.Vector3();
      const half = size / 2,
        inner = half - radius;
      for (let i = 0; i < pos.count; i++) {
        v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
        const cl = new THREE.Vector3(
          Math.max(-inner, Math.min(inner, v.x)),
          Math.max(-inner, Math.min(inner, v.y)),
          Math.max(-inner, Math.min(inner, v.z))
        );
        const d = v.clone().sub(cl);
        if (d.length() > 0) d.normalize().multiplyScalar(radius);
        pos.setXYZ(i, cl.x + d.x, cl.y + d.y, cl.z + d.z);
      }
      g.computeVertexNormals();
      return g;
    }

    function resizeRenderer() {
      if (!renderer || !camera) return;
      const rect = sectionRef?.current?.getBoundingClientRect();
      const W = rect?.width || window.innerWidth;
      const H = rect?.height || window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    }

    function setup() {
      const el = mountRef.current;
      if (!el) return;
      const rect = sectionRef?.current?.getBoundingClientRect();
      const W = rect?.width || window.innerWidth;
      const H = rect?.height || window.innerHeight;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
      camera.position.set(0, 0, 14);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dl = new THREE.DirectionalLight(0xffffff, 1.0);
      dl.position.set(5, 8, 6);
      scene.add(dl);
      const dl2 = new THREE.DirectionalLight(0x9999ff, 0.3);
      dl2.position.set(-6, -2, 4);
      scene.add(dl2);
      const innerLight = new THREE.PointLight(0xffffff, 0, 14);
      scene.add(innerLight);
      st.innerLight = innerLight;

      const bloomMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uOpacity: { value: 0.0 },
          uColor: { value: new THREE.Color(0x7c6fff) }
        },
        vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform float uOpacity; uniform vec3 uColor; varying vec3 vN; void main(){ float r=1.0-abs(dot(vN,vec3(0,0,1))); gl_FragColor=vec4(uColor,pow(r,1.2)*uOpacity); }`
      });
      const bloomSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), bloomMat);
      bloomSphere.renderOrder = 10;
      scene.add(bloomSphere);
      st.bloomSphere = bloomSphere;
      st.bloomMat = bloomMat;

      cubeGroup = new THREE.Group();
      scene.add(cubeGroup);
      st.cubeGroup = cubeGroup;
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0 });
      const matCache = {};
      for (const k in FC) {
        matCache[k] = new THREE.MeshStandardMaterial({
          color: FC[k],
          roughness: 0.08,
          metalness: 0.02,
          emissive: new THREE.Color(FC[k]).multiplyScalar(0.06)
        });
      }
      const geo = roundedBox(CS, 0.08, 8);

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const mesh = new THREE.Mesh(geo, [
              x === 1 ? matCache.px : blackMat,
              x === -1 ? matCache.nx : blackMat,
              y === 1 ? matCache.py : blackMat,
              y === -1 ? matCache.ny : blackMat,
              z === 1 ? matCache.pz : blackMat,
              z === -1 ? matCache.nz : blackMat
            ]);
            mesh.position.set(x * STEP, y * STEP, z * STEP);
            mesh.userData.home = new THREE.Vector3(x * STEP, y * STEP, z * STEP);
            mesh.userData.dir =
              x === 0 && y === 0 && z === 0
                ? new THREE.Vector3(0, 0, 1)
                : new THREE.Vector3(x, y, z).normalize();
            mesh.userData.tumble = new THREE.Vector3(
              Math.random() - 0.5,
              Math.random() - 0.5,
              Math.random() - 0.5
            ).normalize();
            cubeGroup.add(mesh);
            cubies.push(mesh);
          }
        }
      }
      cubeGroup.rotation.x = 0.35;
      cubeGroup.scale.setScalar(1);

      function startSlice() {
        if (sliceAnimating || st.exploded) return;
        const axes = ["x", "y", "z"],
          axis = axes[Math.floor(Math.random() * 3)];
        const layer = [-1, 0, 1][Math.floor(Math.random() * 3)],
          dir = Math.random() < 0.5 ? 1 : -1;
        const slice = cubies.filter((c) => Math.abs(c.position[axis] - layer * STEP) < STEP * 0.35);
        if (!slice.length) return;
        sliceAnimating = true;
        animSlice = slice;
        animAxis = axis;
        animAngle = dir * Math.PI / 2;
        animT0 = performance.now();
        animStartPos = slice.map((c) => c.position.clone());
        animStartQuat = slice.map((c) => c.quaternion.clone());
      }

      function updateSlice() {
        if (!sliceAnimating) return;
        const t = Math.min((performance.now() - animT0) / animDur, 1);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const axVec = new THREE.Vector3(
          animAxis === "x" ? 1 : 0,
          animAxis === "y" ? 1 : 0,
          animAxis === "z" ? 1 : 0
        );
        const rotQ = new THREE.Quaternion().setFromAxisAngle(axVec, animAngle * e);
        for (let i = 0; i < animSlice.length; i++) {
          animSlice[i].position.copy(animStartPos[i].clone().applyQuaternion(rotQ));
          animSlice[i].quaternion.copy(rotQ.clone().multiply(animStartQuat[i]));
        }
        if (t >= 1) {
          for (const c of animSlice) {
            c.position.x = Math.round(c.position.x / STEP) * STEP;
            c.position.y = Math.round(c.position.y / STEP) * STEP;
            c.position.z = Math.round(c.position.z / STEP) * STEP;
          }
          sliceAnimating = false;
        }
      }

      st.startSlice = startSlice;
      st.sliceInterval = setInterval(startSlice, 650);
      st.raycaster = new THREE.Raycaster();
      st.camera = camera;
      st.cubies = cubies;

      function loop() {
        raf = requestAnimationFrame(loop);

        // Normal idle rotation + slices
        if (!st.exploded && !st.imploding) {
          updateSlice();
          rotY += 0.005;
          cubeGroup.rotation.y = rotY;
        }

        const cgPos = new THREE.Vector3();
        cubeGroup.getWorldPosition(cgPos);
        innerLight.position.copy(cgPos);

        if (st.shaking) {
          const held = performance.now() - st.shakeStart,
            ramp = Math.min(1, held / 1200),
            jitter = 0.04 + ramp * 0.18;
          cubeGroup.position.x = (Math.random() - 0.5) * jitter * 2;
          cubeGroup.position.y = (Math.random() - 0.5) * jitter * 2;
          cubeGroup.rotation.z = (Math.random() - 0.5) * ramp * 0.12;
          cubeGroup.scale.setScalar(1 + 0.15 * Math.min(1, held / 400));
          if (Math.random() < ramp * 0.35) {
            const tgt = cubies[Math.floor(Math.random() * cubies.length)];
            const mats = Array.isArray(tgt.material) ? tgt.material : [tgt.material];
            mats.forEach((m) => {
              m.emissiveIntensity = 3;
              setTimeout(() => {
                try {
                  m.emissiveIntensity = 0;
                } catch (_) {}
              }, 60);
            });
          }
          innerLight.intensity = ramp * 8;
          innerLight.distance = 3 + ramp * 10;
        } else if (!st.exploded && !st.imploding) {
          cubeGroup.position.x += (0 - cubeGroup.position.x) * 0.2;
          cubeGroup.position.y += (0 - cubeGroup.position.y) * 0.2;
          cubeGroup.scale.setScalar(1);
          innerLight.intensity *= 0.85;
        }

        // ── Explode outward ──
        if (st.exploding) {
          const t = Math.min(1, (performance.now() - st.explodeStart) / 900);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          cubeGroup.position.set(0, 0, 0);
          cubeGroup.rotation.z = 0;
          cubeGroup.scale.setScalar(1);
          innerLight.intensity = t < 0.1 ? 20 : Math.max(0, 20 * (1 - (t - 0.1) / 0.9));
          innerLight.distance = 5 + e * 18;
          bloomSphere.scale.setScalar(0.1 + e * 28);
          bloomMat.uniforms.uOpacity.value = 0;
          for (let i = 0; i < cubies.length; i++) {
            const c = cubies[i];
            c.position.copy(c.userData.home.clone().add(c.userData.dir.clone().multiplyScalar(e * 38)));
            const spin = e * Math.PI * 2;
            c.quaternion.setFromEuler(
              new THREE.Euler(
                spin * c.userData.tumble.x,
                spin * c.userData.tumble.y,
                spin * c.userData.tumble.z
              )
            );
          }
          if (t >= 1) {
            st.exploding = false;
            bloomMat.uniforms.uOpacity.value = 0;
          }
        }

        // ── Implode back together (reverse explode) ──
        if (st.imploding) {
          const t = Math.min(1, (performance.now() - st.implodeStart) / 900);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const spread = (1 - e) * 38;  // 38 → 0
          cubeGroup.position.set(0, 0, 0);
          cubeGroup.rotation.z = 0;
          cubeGroup.scale.setScalar(1);

          // Light pulses as cubies converge
          innerLight.intensity = t > 0.8 ? (1 - t) * 100 : e * 4;
          innerLight.distance = 5 + (1 - e) * 18;
          bloomSphere.scale.setScalar(0.1 + (1 - e) * 28);
          bloomMat.uniforms.uOpacity.value = 0;

          for (let i = 0; i < cubies.length; i++) {
            const c = cubies[i];
            c.position.copy(c.userData.home.clone().add(c.userData.dir.clone().multiplyScalar(spread)));
            const spin = (1 - e) * Math.PI * 2;
            c.quaternion.setFromEuler(
              new THREE.Euler(
                spin * c.userData.tumble.x,
                spin * c.userData.tumble.y,
                spin * c.userData.tumble.z
              )
            );
          }

          // Flash on impact
          if (t >= 0.95) {
            innerLight.intensity = (1 - ((t - 0.95) / 0.05)) * 15;
            innerLight.distance = 14;
          }

          if (t >= 1) {
            st.imploding = false;
            st.exploded = false;
            bloomMat.uniforms.uOpacity.value = 0;
            innerLight.intensity = 0;
            bloomSphere.scale.setScalar(1);
            // Snap cubies exactly to home
            for (const c of cubies) {
              c.position.copy(c.userData.home);
              c.quaternion.identity();
            }
            // Resume rotation and slices
            clearInterval(st.sliceInterval);
            st.sliceInterval = setInterval(st.startSlice, 650);
            // Notify parent
            if (st.onImplodeComplete) st.onImplodeComplete();
          }
        }

        renderer.render(scene, camera);
      }
      loop();

      let ro = null;
      if (typeof ResizeObserver !== "undefined" && sectionRef?.current) {
        ro = new ResizeObserver(() => resizeRenderer());
        ro.observe(sectionRef.current);
      }

      const onResize = () => resizeRenderer();
      window.addEventListener("resize", onResize);

      st.cleanup = () => {
        window.removeEventListener("resize", onResize);
        if (ro) ro.disconnect();
        clearInterval(st.sliceInterval);
        cancelAnimationFrame(raf);
        renderer.dispose();
        const el2 = mountRef.current;
        if (el2 && el2.contains(renderer.domElement)) el2.removeChild(renderer.domElement);
      };
    }

    loadThree();
    return () => {
      st.cleanup?.();
    };
  }, []);

  // Keep onImplodeComplete ref in sync so the animation loop can call it
  useEffect(() => {
    stateRef.current.onImplodeComplete = onImplodeComplete;
  }, [onImplodeComplete]);

  const startHold = useCallback((e) => {
    e.preventDefault();
    const st = stateRef.current;
    if (st.exploded || st.imploding || !st.raycaster || !st.camera || !st.cubies) return;
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mouse = new window.THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    st.raycaster.setFromCamera(mouse, st.camera);
    const hits = st.raycaster.intersectObjects(st.cubies);
    if (!hits.length) return;
    isHolding.current = true;
    st.shaking = true;
    st.shakeStart = st.holdStartTime = performance.now();
    st.charged = false;
    clearInterval(st.sliceInterval);
    holdTimer.current = setTimeout(() => {
      st.charged = true;
    }, 800);
  }, []);

  const endHold = useCallback(() => {
    const st = stateRef.current;
    if (!isHolding.current) return;
    isHolding.current = false;
    clearTimeout(holdTimer.current);
    const heldMs = performance.now() - (st.holdStartTime || 0);
    if (st.charged || heldMs < 300) {
      st.shaking = false;
      st.charged = false;
      st.exploding = true;
      st.explodeStart = performance.now();
      st.exploded = true;
      onExplode();
    } else {
      st.shaking = false;
      st.charged = false;
      st.sliceInterval = setInterval(st.startSlice, 650);
    }
  }, [onExplode]);

  return (
    <div
      ref={mountRef}
      onMouseDown={active ? startHold : undefined}
      onMouseUp={active ? endHold : undefined}
      onMouseLeave={active ? endHold : undefined}
      onTouchStart={active ? startHold : undefined}
      onTouchEnd={active ? endHold : undefined}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        cursor: active ? "none" : "default",
        userSelect: "none",
        WebkitUserSelect: "none",
        pointerEvents: active ? "auto" : "none"
      }}
      data-cube-overlay="true"
    />
  );
}

function Game2048({ C, onClose }) {
  const tileSize = Math.min(76, Math.floor((Math.min(window.innerWidth, 520) - 88) / 4));
  const CELL = Math.max(5, Math.floor(tileSize * 0.08));
  const PAD = Math.max(8, Math.floor(tileSize * 0.1));
  const TILE = tileSize;

  const addTile = (b) => {
    const e = [];
    b.forEach((r, i) =>
      r.forEach((v, j) => {
        if (!v) e.push([i, j]);
      })
    );
    if (!e.length) return b;
    const p = e[Math.floor(Math.random() * e.length)];
    const nb = b.map((r) => r.slice());
    nb[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4;
    return nb;
  };

  const make = () => {
    let b = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    return addTile(addTile(b));
  };

  const idRef = useRef(0);
  const mkId = () => ++idRef.current;

  const boardToTiles = (b) => {
    const t = [];
    b.forEach((r, i) =>
      r.forEach((v, j) => {
        if (v) t.push({ id: mkId(), value: v, row: i, col: j, merged: false, fresh: true });
      })
    );
    return t;
  };

  const [tiles, setTiles] = useState(() => boardToTiles(make()));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const slide = (row) => {
    let f = row.filter((v) => v);
    let s = 0;
    for (let i = 0; i < f.length - 1; i++) {
      if (f[i] === f[i + 1]) {
        f[i] *= 2;
        s += f[i];
        f[i + 1] = 0;
      }
    }
    f = f.filter((v) => v);
    while (f.length < 4) f.push(0);
    return { row: f, score: s };
  };

  const tr = (m) => m[0].map((_, i) => m.map((r) => r[i]));
  const rv = (m) => m.map((r) => r.slice().reverse());

  const move = useCallback(
    (dir) => {
      if (over) return;
      setTiles((tiles) => {
        let grid = Array(4)
          .fill(null)
          .map(() => Array(4).fill(0));
        tiles.forEach((t) => {
          grid[t.row][t.col] = t.value;
        });
        let nb = grid.map((r) => r.slice());
        let sc = 0;
        let mv = false;

        if (dir === "left") {
          nb = nb.map((r) => {
            const res = slide(r);
            if (res.row.join() !== r.join()) mv = true;
            sc += res.score;
            return res.row;
          });
        } else if (dir === "right") {
          nb = rv(nb).map((r) => {
            const res = slide(r);
            if (res.row.join() !== r.join()) mv = true;
            sc += res.score;
            return res.row;
          });
          nb = rv(nb);
        } else if (dir === "up") {
          nb = tr(nb);
          nb = nb.map((r) => {
            const res = slide(r);
            if (res.row.join() !== r.join()) mv = true;
            sc += res.score;
            return res.row;
          });
          nb = tr(nb);
        } else {
          nb = tr(nb);
          nb = rv(nb).map((r) => {
            const res = slide(r);
            if (res.row.join() !== r.join()) mv = true;
            sc += res.score;
            return res.row;
          });
          nb = rv(nb);
          nb = tr(nb);
        }

        if (!mv) return tiles;

        const wt = addTile(nb);
        setScore((p) => p + sc);
        const hm =
          wt.flat().includes(0) ||
          wt.some((r, i) =>
            r.some((v, j) => (j < 3 && v === r[j + 1]) || (i < 3 && v === wt[i + 1][j]))
          );
        if (!hm) setOver(true);

        const newTiles = [];
        wt.forEach((r, i) =>
          r.forEach((v, j) => {
            if (v) {
              newTiles.push({
                id: mkId(),
                value: v,
                row: i,
                col: j,
                merged: nb[i][j] !== grid[i][j] && v > 2,
                fresh: grid[i][j] === 0 && wt[i][j] !== 0
              });
            }
          })
        );
        return newTiles;
      });
    },
    [over]
  );

  useEffect(() => {
    const h = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        move(e.key.replace("Arrow", "").toLowerCase());
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [move, onClose]);

  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 30;
    if (Math.max(absDx, absDy) < threshold) return;
    if (absDx > absDy) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  };

  const tc = (v) =>
    (
      {
        0: "transparent",
        2: "#7C6FFF",
        4: "#6B5FEE",
        8: "#4AFFC4",
        16: "#3EEEBB",
        32: "#F97FFF",
        64: "#E870EE",
        128: "#FFB347",
        256: "#FF9520",
        512: "#FF7B00",
        1024: "#7C6FFF",
        2048: "#4AFFC4"
      }[v] || "#FFD700"
    );

  const boardSize = TILE * 4 + CELL * 3 + PAD * 2;

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ touchAction: "none", userSelect: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(14px, 1vw, 18px)" }}>
        <div style={mkPanel(C, { padding: "clamp(10px, 0.8vw, 14px) clamp(14px, 1vw, 18px)", borderRadius: "clamp(8px, 0.8vw, 10px)" })}>
          <div style={{ fontFamily: "monospace", fontSize: "clamp(9px, 0.7vw, 11px)", color: C.textDim }}>SCORE</div>
          <div style={{ fontFamily: "monospace", fontSize: "clamp(18px, 1.2vw, 22px)", fontWeight: 700, color: C.textPrimary }}>{score}</div>
        </div>
        <div style={{ display: "flex", gap: "clamp(8px, 0.7vw, 10px)" }}>
          <button
            onClick={() => {
              idRef.current = 0;
              setTiles(boardToTiles(make()));
              setScore(0);
              setOver(false);
            }}
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(11px, 0.8vw, 13px)",
              padding: "clamp(8px, 0.7vw, 10px) clamp(14px, 1vw, 18px)",
              background: C.accent,
              color: C.bg,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            New
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(11px, 0.8vw, 13px)",
              padding: "clamp(8px, 0.7vw, 10px) clamp(14px, 1vw, 18px)",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              background: "none",
              color: C.textDim,
              cursor: "pointer"
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {over && (
        <div
          style={mkPanel(C, {
            padding: "clamp(10px, 0.8vw, 12px)",
            marginBottom: 10,
            borderColor: C.pink + "50",
            background: C.pink + "10",
            fontFamily: "monospace",
            fontSize: "clamp(12px, 0.85vw, 14px)",
            color: C.pink,
            textAlign: "center",
            borderRadius: "clamp(8px, 0.8vw, 10px)"
          })}
        >
          Game Over!
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: boardSize,
          height: boardSize,
          background: C.bg,
          borderRadius: "clamp(10px, 0.9vw, 14px)",
          border: `1px solid ${C.border}`,
          padding: PAD,
          margin: "0 auto"
        }}
      >
        {Array(16)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: TILE,
                height: TILE,
                borderRadius: 6,
                background: "#1A2540",
                left: PAD + (i % 4) * (TILE + CELL),
                top: PAD + Math.floor(i / 4) * (TILE + CELL)
              }}
            />
          ))}
        {tiles.map((t) => (
          <div
            key={t.id}
            style={{
              position: "absolute",
              width: TILE,
              height: TILE,
              borderRadius: 6,
              background: tc(t.value),
              boxShadow: t.value >= 8 ? `0 0 10px ${tc(t.value)}70` : "none",
              left: PAD + t.col * (TILE + CELL),
              top: PAD + t.row * (TILE + CELL),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "left 0.12s ease, top 0.12s ease",
              animation: t.merged ? "tilePop 0.18s ease" : t.fresh ? "tileAppear 0.15s ease" : "none",
              zIndex: t.merged ? 2 : 1
            }}
          >
            <span
              style={{
                fontFamily: "system-ui",
                fontWeight: 800,
                fontSize: t.value > 999 ? "12px" : t.value > 99 ? "15px" : "18px",
                color: "#fff",
                userSelect: "none"
              }}
            >
              {t.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "monospace", fontSize: "clamp(10px, 0.72vw, 12px)", color: C.textDim, marginTop: 10, textAlign: "center" }}>
        arrow keys / swipe to play · esc to close
      </div>
    </div>
  );
}

export function ArcadeSection({ C, darkMode }) {
  const { ref, inView } = useInView(0.1);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState("idle");        // "idle" | "grid" | "imploding"
  const [isMobile, setIsMobile] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [bgActive, setBgActive] = useState(false);
  const [headingAnim, setHeadingAnim] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [implodeTrigger, setImplodeTrigger] = useState(false);

  const gridRef = useRef(null);
  const cubeActive = phase === "idle" && !isClosing;

  useEffect(() => {
    document.documentElement.style.overflowY = playing ? "hidden" : "";
    return () => {
      document.documentElement.style.overflowY = "";
    };
  }, [playing]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleExplode = useCallback(() => {
    setHeadingAnim("up");
    setBgActive(true);
    setIsClosing(false);
    setTimeout(() => {
      setPhase("grid");
    }, 600);
    setTimeout(() => setCardsVisible(true), 750);
  }, []);

  const handleCollapse = useCallback(() => {
    // Phase 1: Fade out cards + bg
    setIsClosing(true);
    setCardsVisible(false);
    setBgActive(false);
    setHeadingAnim("down");

    // Phase 2: After cards fade, trigger implode animation
    setTimeout(() => {
      setPhase("imploding");
      setIsClosing(false);
      setImplodeTrigger(true);
      document.documentElement.style.overflowY = "";
    }, 500);
  }, []);

  const handleImplodeComplete = useCallback(() => {
    setPhase("idle");
    setImplodeTrigger(false);
  }, []);

  useEffect(() => {
    if (phase !== "grid" || !cardsVisible) return;
    let scrollStart = window.scrollY;
    let settled = false;

    const settleTimer = setTimeout(() => {
      scrollStart = window.scrollY;
      settled = true;
    }, 1000);

    const onScroll = () => {
      if (!settled) return;
      const delta = Math.abs(window.scrollY - scrollStart);
      if (delta > 60) handleCollapse();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settleTimer);
    };
  }, [phase, cardsVisible, handleCollapse]);

  useEffect(() => {
    if (phase !== "grid" || !cardsVisible) return;

    const onClick = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) handleCollapse();
    };

    const timer = setTimeout(() => {
      window.addEventListener("click", onClick);
    }, 800);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", onClick);
    };
  }, [phase, cardsVisible, handleCollapse]);

  const games = [
    { name: "2048", icon: "🎲", desc: "Merge tiles, chase the 2048 block.", color: C.accent },
    { name: "Snake", icon: "🐍", desc: "Classic snake — grow without dying.", color: C.green },
    { name: "Memory", icon: "🃏", desc: "Flip cards, find the pairs.", color: C.pink }
  ];

  // Show hint text when cube is idle and assembled
  const showHint = !isMobile && phase === "idle";

  return (
    <section
      id="arcade"
      ref={ref}
      className="section-pad"
      style={{
        padding: "clamp(96px, 8vw, 140px) clamp(32px, 5vw, 88px)",
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: "clamp(96px, 8vw, 140px)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: "100vmax",
          height: "100vmax",
          borderRadius: "50%",
          background: darkMode
            ? `radial-gradient(circle, ${C.accent}55 0%, ${C.accent}22 28%, rgba(7,11,20,0.92) 62%, ${C.bg} 100%)`
            : `radial-gradient(circle, ${C.accent}30 0%, ${C.accent}12 28%, rgba(255,255,255,0.78) 62%, ${C.bg} 100%)`,
          transform: `translate(-50%,-50%) scale(${bgActive ? 3.0 : 0})`,
          opacity: bgActive ? 1 : 0,
          transition: bgActive
            ? "transform 1.4s cubic-bezier(0.2,0,0.2,1), opacity 0.15s ease-in"
            : "transform 0.6s cubic-bezier(0.4,0,1,1), opacity 0.5s ease-out",
          willChange: "transform",
          zIndex: 997,
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ fontFamily: "system-ui", fontWeight: 900, fontSize: "20vw", color: C.accent, opacity: 0.02, userSelect: "none" }}>PLAY</span>
      </div>

      {/* Cube stays mounted — controlled via active/implode props */}
      {!isMobile && inView && (
        <RubiksCube
          onExplode={handleExplode}
          onImplodeComplete={handleImplodeComplete}
          sectionRef={ref}
          active={cubeActive}
          implode={implodeTrigger}
        />
      )}

      <div
        style={{
          maxWidth: "clamp(1120px, 78vw, 1400px)",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 1000,
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.6s"
          }}
        >
          <div
            style={{
              transform: "scale(1.18)",
              transformOrigin: "left center",
              width: "fit-content",
              marginBottom: "clamp(10px, 1vw, 14px)"
            }}
          >
            <SectionTag num="06" label="Arcade" C={C} />
          </div>

          <h2
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
              color: C.textPrimary,
              opacity: headingAnim === "up" ? 0.6 : 1,
              transition: "opacity 0.3s ease"
            }}
          >
            Need a{" "}
            <span className="grad-text" style={{ background: `linear-gradient(90deg,${C.pink},${C.orange})` }}>
              break?
            </span>
          </h2>

          <p
            style={{
              color: C.textSecondary,
              fontSize: "clamp(15px, 1vw, 18px)",
              marginBottom: "clamp(32px, 2.4vw, 44px)",
              lineHeight: 1.75,
              maxWidth: "clamp(520px, 38vw, 720px)"
            }}
          >
            Even builders need to play. Pick a game and take five.
          </p>
        </div>

        <div
          style={{
            overflow: "hidden",
            maxHeight: showHint ? "520px" : "0px",
            opacity: showHint ? 1 : 0,
            transition: "max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease"
          }}
        >
          <div style={{ position: "relative", height: "clamp(320px, 34vw, 500px)" }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "clamp(200px, 26vw, 360px)",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "clamp(10px, 0.8vw, 14px)",
                fontFamily: "monospace",
                fontSize: "clamp(15px, 1vw, 18px)",
                color: C.textSecondary,
                justifyContent: "center",
                paddingBottom: 8,
                textShadow: `0 0 20px ${C.bg}, 0 0 40px ${C.bg}`,
                whiteSpace: "nowrap"
              }}
            >
              <span style={{ color: C.accent, animation: "cubePulse 1.8s ease-in-out infinite", fontSize: "clamp(18px, 1.2vw, 22px)" }}>◆</span>
              Hold the cube to charge it up, release to reveal arcade
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="arcade-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(16px, 1.4vw, 22px)", pointerEvents: "auto" }}>
            {games.map((g, i) => (
              <div
                key={g.name}
                onClick={() => g.name === "2048" && setPlaying(true)}
                data-magnetic
                className="arcade-card-inner"
                style={mkPanel(C, {
                  padding: "clamp(28px, 1.8vw, 34px)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "clamp(10px, 0.9vw, 14px)",
                  transition: "all 0.3s",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(20px)",
                  transitionDelay: `${i * 0.1}s`
                })}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = g.color + "50"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 40px ${g.color}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${g.color},${g.color}50)` }} />
                <div className="arcade-card-icon" style={{ fontSize: "clamp(52px, 3.2vw, 64px)", marginBottom: "clamp(14px, 1vw, 18px)" }}>{g.icon}</div>
                <h3 style={{ fontFamily: "system-ui", fontWeight: 800, fontSize: "clamp(20px, 1.5vw, 26px)", color: C.textPrimary, marginBottom: 10 }}>{g.name}</h3>
                <p style={{ fontFamily: "monospace", fontSize: "clamp(13px, 0.88vw, 15px)", color: C.textSecondary, marginBottom: "clamp(20px, 1.5vw, 24px)", lineHeight: 1.7 }}>{g.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "clamp(9px, 0.75vw, 12px) clamp(16px, 1.1vw, 20px)", background: g.color + "18", border: `1px solid ${g.color}40`, borderRadius: 6, fontFamily: "monospace", fontSize: "clamp(11px, 0.8vw, 13px)", color: g.color }}>
                  {g.name === "2048" ? "▶ Play Now" : "Coming soon"}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          ref={gridRef}
          style={{
            overflow: "hidden",
            maxHeight: !isMobile && (phase === "grid" || phase === "imploding" || isClosing) ? "1200px" : "0px",
            opacity: !isMobile && phase === "grid" && !isClosing ? 1 : 0,
            transform: !isMobile && phase === "grid" && !isClosing ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
            transition: "max-height 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: phase === "grid" && !isClosing ? "auto" : "none"
          }}
        >
          <div className="arcade-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(16px, 1.4vw, 22px)" }}>
            {games.map((g, i) => (
              <div
                key={g.name}
                onClick={() => g.name === "2048" && setPlaying(true)}
                data-magnetic
                className="arcade-card-inner"
                style={mkPanel(C, {
                  padding: "clamp(28px, 1.8vw, 34px)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "clamp(10px, 0.9vw, 14px)",
                  transition: "all 0.3s",
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? "none" : "translateY(20px)",
                  transitionDelay: `${i * 0.1}s`
                })}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = g.color + "50"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 40px ${g.color}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${g.color},${g.color}50)` }} />
                <div className="arcade-card-icon" style={{ fontSize: "clamp(52px, 3.2vw, 64px)", marginBottom: "clamp(14px, 1vw, 18px)" }}>{g.icon}</div>
                <h3 style={{ fontFamily: "system-ui", fontWeight: 800, fontSize: "clamp(20px, 1.5vw, 26px)", color: C.textPrimary, marginBottom: 10 }}>{g.name}</h3>
                <p style={{ fontFamily: "monospace", fontSize: "clamp(13px, 0.88vw, 15px)", color: C.textSecondary, marginBottom: "clamp(20px, 1.5vw, 24px)", lineHeight: 1.7 }}>{g.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "clamp(9px, 0.75vw, 12px) clamp(16px, 1.1vw, 20px)", background: g.color + "18", border: `1px solid ${g.color}40`, borderRadius: 6, fontFamily: "monospace", fontSize: "clamp(11px, 0.8vw, 13px)", color: g.color }}>
                  {g.name === "2048" ? "▶ Play Now" : "Coming soon"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(16px, 1.2vw, 20px)" }}>
            <button
              onClick={handleCollapse}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "clamp(12px, 0.9vw, 15px) clamp(24px, 1.8vw, 30px)",
                background: C.panel, border: `1px solid ${C.accent}55`,
                borderRadius: "clamp(10px, 0.8vw, 12px)", color: C.textPrimary,
                fontFamily: "monospace", fontSize: "clamp(12px, 0.8vw, 14px)",
                fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 22px ${C.accent}18`,
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "none" : "translateY(8px)",
                transition: "opacity 0.4s 0.5s, transform 0.4s 0.5s, border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; e.currentTarget.style.background = C.accent + "10"; e.currentTarget.style.boxShadow = `0 10px 26px ${C.accent}28`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.accent + "55"; e.currentTarget.style.color = C.textPrimary; e.currentTarget.style.background = C.panel; e.currentTarget.style.boxShadow = `0 8px 22px ${C.accent}18`; }}
            >
              ← Collapse back to cube
            </button>
          </div>
        </div>
      </div>

      {playing && (
        <div className="game-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPlaying(false); }}>
          <div
            data-arcade-playing="true"
            style={mkPanel(C, {
              padding: "clamp(24px, 1.8vw, 30px)",
              width: "100%", maxWidth: 460, maxHeight: "90vh",
              overflowY: "auto", position: "relative",
              borderRadius: "clamp(12px, 1vw, 16px)"
            })}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(16px, 1.1vw, 20px)" }}>
              <h3 style={{ fontFamily: "system-ui", fontWeight: 700, fontSize: "clamp(18px, 1.2vw, 22px)", color: C.textPrimary, margin: 0 }}>🎲 2048</h3>
              <div style={{ fontFamily: "monospace", fontSize: "clamp(10px, 0.72vw, 12px)", color: C.textDim }}>tap outside to close</div>
            </div>
            <Game2048 C={C} onClose={() => setPlaying(false)} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes cubePulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
      `}</style>
    </section>
  );
}