import { useState, useEffect } from "react";
import { skillCategories } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";

function SkillCard({ cat, visible, delay, C }) {
  return (
    <div
      style={{
        ...mkPanel(C, {
          padding: "clamp(16px, 1.05vw, 22px)",
          borderRadius: "clamp(10px, 0.9vw, 14px)"
        }),
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(30px)",
        transition: `opacity 0.5s ${delay}s, transform 0.5s ${delay}s cubic-bezier(0.34,1.56,0.64,1)`,
        borderColor: visible ? cat.accent + "50" : C.border
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "clamp(10px, 0.8vw, 14px)" }}>
        <div
          style={{
            width: "clamp(8px, 0.6vw, 10px)",
            height: "clamp(8px, 0.6vw, 10px)",
            borderRadius: "50%",
            background: cat.accent,
            boxShadow: `0 0 7px ${cat.accent}`
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(9.5px, 0.68vw, 11px)",
            color: cat.accent,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 700
          }}
        >
          {cat.category}
        </span>
      </div>

      {cat.items.map((skill, i) => (
        <div key={skill.name} style={{ marginBottom: i < cat.items.length - 1 ? "clamp(6px, 0.45vw, 8px)" : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "system-ui",
                fontSize: "clamp(11.5px, 0.8vw, 13px)",
                fontWeight: 600,
                color: C.textPrimary
              }}
            >
              {skill.name}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(9.5px, 0.68vw, 11px)",
                color: cat.accent,
                fontWeight: 700
              }}
            >
              {skill.level}%
            </span>
          </div>
          <div style={{ height: "clamp(3px, 0.28vw, 4px)", background: C.border, borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: visible ? skill.level + "%" : "0%",
                background: `linear-gradient(90deg,${cat.accent},${cat.accent}80)`,
                borderRadius: 2,
                boxShadow: `0 0 6px ${cat.accent}50`,
                transition: `width 0.9s ${delay + 0.2 + i * 0.05}s cubic-bezier(0.4,0,0.2,1)`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkillsSection({ C, darkMode }) {
  const { ref } = useInView(0.1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      className="section-pad"
      style={{
        padding: "clamp(96px, 8vw, 140px) clamp(32px, 5vw, 88px)",
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        style={{
          maxWidth: "clamp(1120px, 78vw, 1400px)",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 1000
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px, 0.8vw, 14px)",
            marginBottom: "clamp(26px, 2.2vw, 38px)",
            transform: "scale(clamp(1, 1.1vw, 1.18))",
            transformOrigin: "left center",
            width: "fit-content"
          }}
        >
          <div
            style={{
              width: "clamp(28px, 2vw, 38px)",
              height: 1,
              background: `linear-gradient(90deg,${C.accent},${C.green})`
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(10px, 0.75vw, 12px)",
              color: C.accent,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 700
            }}
          >
            04 / Skills
          </span>
        </div>

        <h2
          style={{
            fontFamily: "system-ui",
            fontSize: "clamp(32px, 4.2vw, 54px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 clamp(20px, 1.5vw, 26px)",
            color: C.textPrimary
          }}
        >
          Technical <span style={{ color: C.textDim }}>universe.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "clamp(12px, 1vw, 16px)",
            marginBottom: "clamp(16px, 1.2vw, 20px)"
          }}
        >
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.category} cat={cat} visible delay={i * 0.1} C={C} />
          ))}
        </div>
      </div>
    </section>
  );
}