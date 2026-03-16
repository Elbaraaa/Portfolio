import { useState, useEffect } from "react";
import { projects } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

function ProjectCard({ project, onClick, C }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-magnetic
      style={mkPanel(C, {
        padding: "clamp(24px, 1.6vw, 30px)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        borderRadius: "clamp(10px, 0.9vw, 14px)",
        borderColor: hov ? project.accent + "50" : C.border,
        boxShadow: hov ? `0 0 30px ${project.accent}15` : "none",
        transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        transform: hov ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)"
      })}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,${project.accent},${project.accent}40)`,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.3s"
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "clamp(12px, 1vw, 16px)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div
              style={{
                width: "clamp(5px, 0.4vw, 7px)",
                height: "clamp(5px, 0.4vw, 7px)",
                borderRadius: "50%",
                background: project.status === "shipped" ? C.green : C.orange
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(10px, 0.7vw, 12px)",
                color: project.status === "shipped" ? C.green : C.orange,
                textTransform: "uppercase"
              }}
            >
              {project.status}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(18px, 1.25vw, 22px)",
              fontWeight: 700,
              color: C.textPrimary,
              margin: 0
            }}
          >
            {project.title}
          </h3>

          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(11px, 0.78vw, 13px)",
              color: C.textDim,
              marginTop: 3
            }}
          >
            {project.subtitle}
          </div>
        </div>

        <span
          style={{
            color: C.textDim,
            fontSize: "clamp(16px, 1vw, 20px)",
            opacity: hov ? 1 : 0,
            transition: "opacity 0.2s"
          }}
        >
          ↗
        </span>
      </div>

      <div
        style={{
          display: "inline-block",
          fontFamily: "monospace",
          fontSize: "clamp(10px, 0.7vw, 12px)",
          padding: "clamp(3px, 0.3vw, 5px) clamp(8px, 0.8vw, 10px)",
          border: `1px solid ${project.accent}30`,
          color: project.accent,
          borderRadius: 4,
          marginBottom: "clamp(12px, 1vw, 16px)"
        }}
      >
        {project.category}
      </div>

      <p
        style={{
          color: C.textSecondary,
          fontSize: "clamp(13.5px, 0.95vw, 16px)",
          lineHeight: 1.75,
          margin: "0 0 clamp(14px, 1vw, 18px)"
        }}
      >
        {project.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(5px, 0.5vw, 7px)" }}>
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(10px, 0.7vw, 12px)",
              padding: "clamp(3px, 0.25vw, 4px) clamp(7px, 0.6vw, 9px)",
              background: C.bg,
              border: `1px solid ${C.border}50`,
              borderRadius: 4,
              color: C.textDim
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectOverlay({ project, onClose, C }) {
  useEffect(() => {
    if (!project) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 2vw, 28px)"
      }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(7,11,20,0.93)", backdropFilter: "blur(10px)" }} />

      <div
        onClick={(e) => e.stopPropagation()}
        style={mkPanel(C, {
          position: "relative",
          maxWidth: "clamp(760px, 62vw, 980px)",
          width: "100%",
          padding: "clamp(28px, 2vw, 40px)",
          borderRadius: "clamp(12px, 1vw, 16px)",
          borderColor: project.accent + "50",
          animation: "scaleIn 0.25s ease-out"
        })}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg,${project.accent},${project.accent}40)`,
            borderRadius: "10px 10px 0 0"
          }}
        />

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "6px 11px",
            color: C.textSecondary,
            cursor: "pointer",
            fontSize: "clamp(12px, 0.8vw, 14px)"
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: "inline-block",
            fontFamily: "monospace",
            fontSize: "clamp(10px, 0.7vw, 12px)",
            padding: "clamp(3px, 0.25vw, 5px) clamp(8px, 0.8vw, 10px)",
            border: `1px solid ${project.accent}30`,
            color: project.accent,
            borderRadius: 4,
            marginBottom: 12
          }}
        >
          {project.category}
        </div>

        <h2
          style={{
            fontFamily: "system-ui",
            fontSize: "clamp(28px, 2.2vw, 38px)",
            fontWeight: 800,
            color: C.textPrimary,
            margin: "0 0 4px"
          }}
        >
          {project.title}
        </h2>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(12px, 0.9vw, 14px)",
            color: C.textDim,
            marginBottom: "clamp(20px, 1.5vw, 28px)"
          }}
        >
          {project.subtitle}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "clamp(20px, 1.6vw, 28px)"
          }}
        >
          <div>
            <p
              style={{
                color: C.textSecondary,
                lineHeight: 1.8,
                fontSize: "clamp(15px, 1vw, 18px)",
                margin: "0 0 20px"
              }}
            >
              {project.longDescription}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "clamp(12px, 0.85vw, 14px)",
                    padding: "clamp(4px, 0.35vw, 6px) clamp(10px, 0.8vw, 12px)",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 5,
                    color: C.textSecondary
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            style={mkPanel(C, {
              padding: "clamp(16px, 1.2vw, 22px)",
              borderRadius: "clamp(10px, 0.9vw, 14px)"
            })}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(10px, 0.7vw, 12px)",
                color: C.textDim,
                textTransform: "uppercase",
                marginBottom: "clamp(10px, 0.8vw, 14px)"
              }}
            >
              Metrics
            </div>

            {project.metrics.map((m) => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: "clamp(5px, 0.4vw, 7px)",
                    height: "clamp(5px, 0.4vw, 7px)",
                    borderRadius: "50%",
                    background: project.accent
                  }}
                />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "clamp(12px, 0.85vw, 14px)",
                    color: C.textSecondary,
                    lineHeight: 1.5
                  }}
                >
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ C }) {
  const { ref, inView } = useInView(0.05);
  const [sel, setSel] = useState(null);

  return (
    <section
      id="projects"
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
            <SectionTag num="02" label="Projects" C={C} />
          </div>

          <h2
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 clamp(32px, 2.4vw, 44px)",
              color: C.textPrimary
            }}
          >
            Things I&apos;ve <span style={{ color: C.textDim }}>shipped.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(16px, 1.4vw, 22px)"
          }}
          className="projects-grid"
        >
          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(20px)",
                transition: `all 0.6s ${0.12 + i * 0.08}s`
              }}
            >
              <ProjectCard project={p} onClick={() => setSel(p)} C={C} />
            </div>
          ))}
        </div>
      </div>

      <ProjectOverlay project={sel} onClose={() => setSel(null)} C={C} />
    </section>
  );
}