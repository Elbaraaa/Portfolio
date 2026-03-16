import { useState, useEffect } from "react";
import { personal, stats } from "../data/content";
import { mkPanel } from "../styles/theme";
import { Typewriter } from "./ui";
import { useWindowWidth } from "../hooks/useInView";

export function HeroSection({ onMenu, onHire, C }) {
  const [uptime, setUptime] = useState(0);
  const width = useWindowWidth();
  const isMobile = width <= 767;
  const isTightHero = width <= 1100;

  useEffect(() => {
    const s = Date.now();
    const t = setInterval(() => setUptime(Math.floor((Date.now() - s) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "transparent"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            C.bg === "#F6F2E8"
              ? `
              radial-gradient(ellipse 55% 45% at 78% 18%, rgba(242,207,132,0.18) 0%, transparent 62%),
              radial-gradient(ellipse 50% 40% at 28% 42%, rgba(221,232,218,0.24) 0%, transparent 68%),
              linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0))
            `
              : `radial-gradient(ellipse 60% 50% at 35% 50%,rgba(124,111,255,0.06) 0%,transparent 70%)`,
          pointerEvents: "none"
        }}
      />

      <div
        className="hero-system-panel"
        style={{
          position: "absolute",
          top: "50%",
          right: "clamp(28px, 3vw, 64px)",
          transform: "translateY(-50%)",
          zIndex: 5,
          ...mkPanel(C, {
            padding: "clamp(24px, 2vw, 34px) clamp(20px, 1.8vw, 30px)",
            width: "clamp(240px, 18vw, 320px)",
            borderRadius: "clamp(10px, 1vw, 16px)",
            animation: "fadeUp 0.6s 1.4s both"
          })
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(11px, 0.75vw, 13px)",
            color: C.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "clamp(12px, 1vw, 16px)"
          }}
        >
          System
        </div>

        {[["BUILD", "PASSING", C.green], ["DEPLOY", "LIVE", C.accent], ["SESSION", uptime + "s", C.orange]].map(
          (row) => (
            <div
              key={row[0]}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(10px, 0.8vw, 14px)",
                fontFamily: "monospace",
                fontSize: "clamp(12px, 0.9vw, 15px)"
              }}
            >
              <span style={{ color: C.textDim }}>{row[0]}</span>
              <span style={{ color: row[2] }}>{row[1]}</span>
            </div>
          )
        )}

        <div style={{ height: 1, background: C.border, margin: "clamp(14px, 1vw, 18px) 0" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "monospace",
            fontSize: "clamp(11px, 0.8vw, 14px)",
            color: C.green,
            marginBottom: "clamp(14px, 1vw, 18px)"
          }}
        >
          <span
            style={{
              width: "clamp(6px, 0.5vw, 8px)",
              height: "clamp(6px, 0.5vw, 8px)",
              borderRadius: "50%",
              background: C.green,
              display: "inline-block",
              animation: "pulse 1.5s ease-in-out infinite"
            }}
          />
          Summer 2026 open
        </div>

        <button
          style={{
            width: "100%",
            padding: "clamp(11px, 0.9vw, 14px) 0",
            background: `linear-gradient(90deg,${C.accent}20,${C.green}15)`,
            border: `1px solid ${C.accent}40`,
            borderRadius: "clamp(7px, 0.8vw, 10px)",
            color: C.accent,
            fontFamily: "monospace",
            fontSize: "clamp(11px, 0.8vw, 14px)",
            cursor: "pointer",
            fontWeight: 700
          }}
          onClick={() => alert("📄 Resume link coming soon!")}
        >
          📄 Download Resume
        </button>
      </div>

      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 4,
          padding: "0 clamp(28px, 5vw, 88px)",
          maxWidth: "clamp(980px, 58vw, 1220px)",
          paddingTop: "clamp(40px, 4vw, 72px)",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "clamp(5px, 0.4vw, 7px) clamp(14px, 1vw, 18px)",
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            fontFamily: "monospace",
            fontSize: "clamp(11px, 0.8vw, 14px)",
            color: C.textSecondary,
            marginBottom: "clamp(28px, 2vw, 36px)",
            animation: "fadeUp 0.5s 0.2s both"
          }}
        >
          <span style={{ fontSize: "clamp(8px, 0.6vw, 10px)", color: C.accent }}>◆</span>
          {personal.location}
          <span style={{ color: C.border }}>·</span>
          <span style={{ color: C.green }}>●</span>
          Available
        </div>

        <h1
          style={{
            fontFamily: "system-ui,-apple-system",
            fontWeight: 800,
            lineHeight: 0.92,
            margin: "0 0 clamp(20px, 1.4vw, 28px)",
            letterSpacing: "-0.03em",
            animation: "fadeUp 0.7s 0.4s both"
          }}
        >
          <span
            className="grad-text"
            style={{
              display: "block",
              fontSize: "clamp(56px, 7.8vw, 110px)",
              background: `linear-gradient(135deg,${C.textPrimary},${C.accent})`
            }}
          >
            Elbaraa
          </span>
          <span
            className="grad-text"
            style={{
              display: "block",
              fontSize: "clamp(56px, 7.8vw, 110px)",
              background: `linear-gradient(135deg,${C.accent},${C.green})`
            }}
          >
            Abdalla.
          </span>
        </h1>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(15px, 1vw, 18px)",
            color: C.accent,
            marginBottom: "clamp(18px, 1.4vw, 24px)",
            minHeight: "clamp(22px, 2vw, 30px)",
            animation: "fadeUp 0.5s 0.9s both"
          }}
        >
          <Typewriter text={`> ${personal.subTagline}`} delay={1000} />
        </div>

        <p
          style={{
            color: C.textSecondary,
            fontSize: "clamp(16px, 1.05vw, 20px)",
            lineHeight: 1.75,
            maxWidth: "clamp(540px, 36vw, 720px)",
            marginBottom: "clamp(32px, 2.4vw, 42px)",
            animation: "fadeUp 0.6s 1.1s both"
          }}
        >
          I build systems that close the gap between research and real-world impact.
        </p>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(10px, 0.75vw, 13px)",
            color: C.textDim,
            marginBottom: "clamp(24px, 1.8vw, 30px)",
            animation: "fadeUp 0.5s 3s both",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span style={{ color: C.accent, opacity: 0.5 }}>🔮</span>
          <span>
            type <span style={{ color: C.accent, borderBottom: `1px dashed ${C.accent}50` }}>elbaraa</span> anywhere
            to open the secret terminal
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "clamp(12px, 1vw, 18px)",
            marginBottom: "clamp(42px, 3vw, 60px)",
            animation: "fadeUp 0.5s 1.2s both",
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={onMenu}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(13px, 1vw, 17px) clamp(28px, 2vw, 36px)",
              background: `linear-gradient(135deg,${C.accent},${C.green})`,
              color: C.bg,
              fontWeight: 700,
              fontSize: "clamp(13px, 0.9vw, 16px)",
              borderRadius: "clamp(7px, 0.8vw, 10px)",
              border: "none",
              cursor: "pointer"
            }}
          >
            Explore Work ↓
          </button>

          <button
            onClick={onHire}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(13px, 1vw, 17px) clamp(28px, 2vw, 36px)",
              border: `1px solid ${C.border}`,
              color: C.textSecondary,
              fontSize: "clamp(13px, 0.9vw, 16px)",
              borderRadius: "clamp(7px, 0.8vw, 10px)",
              background: "none",
              fontFamily: "monospace",
              cursor: "pointer"
            }}
          >
            ✉️ Hire Me
          </button>

          <button
            className="mobile-resume-btn"
            onClick={() => alert("📄 Resume link coming soon!")}
            style={{
              alignItems: "center",
              gap: 8,
              padding: "clamp(13px, 1vw, 16px) clamp(22px, 1.8vw, 30px)",
              background: `linear-gradient(90deg,${C.accent}20,${C.green}15)`,
              border: `1px solid ${C.accent}40`,
              borderRadius: "clamp(7px, 0.8vw, 10px)",
              color: C.accent,
              fontFamily: "monospace",
              fontSize: "clamp(12px, 0.85vw, 15px)",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            📄 Resume
          </button>
        </div>

        <div
          className="hero-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            border: `1px solid ${C.border}`,
            borderRadius: "clamp(10px, 0.9vw, 14px)",
            overflow: "hidden",
            animation: "fadeUp 0.6s 1.5s both",
            maxWidth: "clamp(580px, 42vw, 760px)"
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(16px, 1.1vw, 22px) clamp(18px, 1.4vw, 24px)",
                background: C.surface,
                borderRight: isMobile ? (i % 2 === 0 ? `1px solid ${C.border}` : "none") : i < 3 ? `1px solid ${C.border}` : "none",
                borderBottom: isMobile && i < 2 ? `1px solid ${C.border}` : "none"
              }}
            >
              <div
                className="grad-text"
                style={{
                  fontFamily: "system-ui",
                  fontSize: "clamp(24px, 1.8vw, 32px)",
                  fontWeight: 800,
                  background: `linear-gradient(135deg,${C.textPrimary},${C.accent})`,
                  marginBottom: 3
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(8px, 0.65vw, 11px)",
                  color: C.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1.3
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {isTightHero && (
          <div
            style={{
              marginTop: "clamp(20px, 1.8vw, 28px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "fadeUp 0.5s 2s both",
              pointerEvents: "none"
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(11px, 0.85vw, 14px)",
                color: C.textDim,
                marginBottom: 6
              }}
            >
              scroll to navigate
            </div>
            <div style={{ color: C.textDim, fontSize: "clamp(16px, 1.2vw, 22px)", animation: "bounce 1.6s ease-in-out infinite" }}>
              ↓
            </div>
          </div>
        )}
      </div>

      {!isTightHero && (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(16px, 1.5vw, 28px)",
            left: 0,
            right: 0,
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "fadeUp 0.5s 2s both",
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(11px, 0.85vw, 14px)",
              color: C.textDim,
              marginBottom: 6
            }}
          >
            scroll to navigate
          </div>
          <div style={{ color: C.textDim, fontSize: "clamp(16px, 1.2vw, 22px)", animation: "bounce 1.6s ease-in-out infinite" }}>
            ↓
          </div>
        </div>
      )}
    </section>
  );
}