import { useState, useEffect, useRef, useCallback } from "react";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

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

export function ArcadeSection({ C }) {
  const { ref, inView } = useInView(0.1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflowY = playing ? "hidden" : "";
    return () => {
      document.documentElement.style.overflowY = "";
    };
  }, [playing]);

  const games = [
    { name: "2048", icon: "🎲", desc: "Merge tiles, chase the 2048 block.", color: C.accent },
    { name: "Snake", icon: "🐍", desc: "Classic snake — grow without dying.", color: C.green },
    { name: "Memory", icon: "🃏", desc: "Flip cards, find the pairs.", color: C.pink }
  ];

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
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ fontFamily: "system-ui", fontWeight: 900, fontSize: "20vw", color: C.accent, opacity: 0.02, userSelect: "none" }}>PLAY</span>
      </div>

      <div
        style={{
          maxWidth: "clamp(1120px, 78vw, 1400px)",
          margin: "0 auto",
          width: "100%"
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
              color: C.textPrimary
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
          className="arcade-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "clamp(16px, 1.4vw, 22px)"
          }}
        >
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = g.color + "50";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 40px ${g.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${g.color},${g.color}50)` }} />
              <div className="arcade-card-icon" style={{ fontSize: "clamp(52px, 3.2vw, 64px)", marginBottom: "clamp(14px, 1vw, 18px)" }}>
                {g.icon}
              </div>
              <h3 style={{ fontFamily: "system-ui", fontWeight: 800, fontSize: "clamp(20px, 1.5vw, 26px)", color: C.textPrimary, marginBottom: 10 }}>
                {g.name}
              </h3>
              <p style={{ fontFamily: "monospace", fontSize: "clamp(13px, 0.88vw, 15px)", color: C.textSecondary, marginBottom: "clamp(20px, 1.5vw, 24px)", lineHeight: 1.7 }}>
                {g.desc}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "clamp(9px, 0.75vw, 12px) clamp(16px, 1.1vw, 20px)",
                  background: g.color + "18",
                  border: `1px solid ${g.color}40`,
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: "clamp(11px, 0.8vw, 13px)",
                  color: g.color
                }}
              >
                {g.name === "2048" ? "▶ Play Now" : "Coming soon"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {playing && (
        <div className="game-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPlaying(false); }}>
          <div
            data-arcade-playing="true"
            style={mkPanel(C, {
              padding: "clamp(24px, 1.8vw, 30px)",
              width: "100%",
              maxWidth: 460,
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              borderRadius: "clamp(12px, 1vw, 16px)"
            })}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(16px, 1.1vw, 20px)" }}>
              <h3 style={{ fontFamily: "system-ui", fontWeight: 700, fontSize: "clamp(18px, 1.2vw, 22px)", color: C.textPrimary, margin: 0 }}>
                🎲 2048
              </h3>
              <div style={{ fontFamily: "monospace", fontSize: "clamp(10px, 0.72vw, 12px)", color: C.textDim }}>
                tap outside to close
              </div>
            </div>
            <Game2048 C={C} onClose={() => setPlaying(false)} />
          </div>
        </div>
      )}
    </section>
  );
}