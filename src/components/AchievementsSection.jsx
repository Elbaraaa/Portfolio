import { achievements } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function AchievementsSection({ C }) {
  const { ref, inView } = useInView(0.1);
  const isLight = C.bg === "#F6F2E8";

  return (
    <section
      id="achievements"
      ref={ref}
      className="section-pad"
      style={{
        padding: "clamp(96px, 8vw, 140px) clamp(32px, 5vw, 88px)",
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        zIndex: 2
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
            <SectionTag num="05" label="Recognition" C={C} />
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
            Awards & <span style={{ color: C.textDim }}>milestones.</span>
          </h2>
        </div>

        <div
          className="achieve-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "clamp(16px, 1.4vw, 22px)"
          }}
        >
          {achievements.map((a, i) => (
            <div
              key={a.title}
              style={{
                ...mkPanel(C, {
                  padding: "clamp(24px, 1.6vw, 30px)",
                  borderRadius: "clamp(10px, 0.9vw, 14px)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(20px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                  transitionDelay: `${i * 0.1}s`
                }),
                background: isLight ? "rgba(255,255,255,0.78)" : C.panel,
                border: `1px solid ${isLight ? "rgba(31,41,55,0.10)" : C.border}`,
                boxShadow: isLight
                  ? "0 8px 24px rgba(31,41,55,0.08)"
                  : "0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                backdropFilter: isLight ? "blur(10px)" : "none",
                WebkitBackdropFilter: isLight ? "blur(10px)" : "none"
              }}
            >
              <div
                style={{
                  fontSize: "clamp(28px, 1.9vw, 36px)",
                  marginBottom: "clamp(12px, 1vw, 16px)"
                }}
              >
                {a.icon}
              </div>

              <div
                style={{
                  fontFamily: "system-ui",
                  fontWeight: 700,
                  fontSize: "clamp(16px, 1.05vw, 20px)",
                  color: C.textPrimary,
                  marginBottom: "clamp(4px, 0.5vw, 8px)",
                  lineHeight: 1.3
                }}
              >
                {a.title}
              </div>

              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(10px, 0.75vw, 12px)",
                  color: C.accent,
                  marginBottom: "clamp(10px, 0.8vw, 14px)"
                }}
              >
                {a.event}
              </div>

              <p
                style={{
                  fontSize: "clamp(13px, 0.9vw, 15px)",
                  color: C.textDim,
                  lineHeight: 1.7,
                  margin: 0
                }}
              >
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}