import { useState, useEffect } from "react";
import { skillCategories } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return null;

  let clean = hex.replace("#", "").trim();

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const convert = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };

  const r = convert(rgb.r);
  const g = convert(rgb.g);
  const b = convert(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function darkenHex(hex, amount = 0.2) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return rgbToHex(
    rgb.r * (1 - amount),
    rgb.g * (1 - amount),
    rgb.b * (1 - amount)
  );
}

function getReadableAccent(accent, darkMode) {
  if (darkMode || !accent || !accent.startsWith("#")) return accent;

  const lum = getLuminance(accent);

  if (lum > 0.6) return darkenHex(accent, 0.42);
  if (lum > 0.45) return darkenHex(accent, 0.28);
  return darkenHex(accent, 0.14);
}

function getSkillLevel(level) {
  if (level >= 90) return { label: "Expert", blocks: 5 };
  if (level >= 75) return { label: "Advanced", blocks: 4 };
  if (level >= 60) return { label: "Proficient", blocks: 3 };
  if (level >= 40) return { label: "Intermediate", blocks: 2 };
  return { label: "Familiar", blocks: 1 };
}

function parseDateValue(dateValue) {
  if (!dateValue) return 0;
  const time = new Date(dateValue).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function sortByDateDesc(arr) {
  return [...arr].sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
}

function SkillBlocks({ blocks, accent, visible, delay, itemIndex, C }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 4
      }}
    >
      {[0, 1, 2, 3, 4].map((block) => {
        const filled = block < blocks;

        return (
          <div
            key={block}
            style={{
              height: "clamp(5px, 0.35vw, 7px)",
              borderRadius: 999,
              background: filled ? accent : C.border,
              boxShadow: filled ? `0 0 8px ${accent}35` : "none",
              opacity: visible ? 1 : 0,
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left center",
              transition: `transform 0.35s ${
                delay + 0.18 + itemIndex * 0.05 + block * 0.03
              }s ease, opacity 0.35s ${
                delay + 0.18 + itemIndex * 0.05 + block * 0.03
              }s ease`
            }}
          />
        );
      })}
    </div>
  );
}

function SkillCard({ cat, visible, delay, C, darkMode }) {
  const accent = getReadableAccent(cat.accent, darkMode);
  const sortedItems = sortByDateDesc(cat.items || []);

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
        borderColor: visible ? accent + "50" : C.border
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "clamp(10px, 0.8vw, 14px)"
        }}
      >
        <div
          style={{
            width: "clamp(8px, 0.6vw, 10px)",
            height: "clamp(8px, 0.6vw, 10px)",
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 7px ${accent}`
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(9.5px, 0.68vw, 11px)",
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 700
          }}
        >
          {cat.category}
        </span>
      </div>

      {sortedItems.map((skill, i) => {
        const levelMeta = getSkillLevel(skill.level);

        return (
          <div
            key={skill.name}
            style={{
              marginBottom: i < sortedItems.length - 1 ? "clamp(8px, 0.6vw, 11px)" : 0
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 5
              }}
            >
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
                  color: accent,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap"
                }}
              >
                {levelMeta.label}
              </span>
            </div>

            <SkillBlocks
              blocks={levelMeta.blocks}
              accent={accent}
              visible={visible}
              delay={delay}
              itemIndex={i}
              C={C}
            />
          </div>
        );
      })}
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

  const sortedCategories = sortByDateDesc(skillCategories || []);

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
          zIndex: 200
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
          {sortedCategories.map((cat, i) => (
            <SkillCard
              key={cat.category}
              cat={cat}
              visible
              delay={i * 0.1}
              C={C}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
}