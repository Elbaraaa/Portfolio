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
        padding: "80px 60px",
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        zIndex: 2
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.6s"
          }}
        >
          <SectionTag num="05" label="Recognition" C={C} />
          <h2
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(28px,4vw,46px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 36px",
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
            gap: 14
          }}
        >
          {achievements.map((a, i) => (
            <div
              key={a.title}
              style={{
                ...mkPanel(C, {
                  padding: 22,
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
              <div style={{ fontSize: 26, marginBottom: 12 }}>{a.icon}</div>
              <div
                style={{
                  fontFamily: "system-ui",
                  fontWeight: 700,
                  fontSize: 14,
                  color: C.textPrimary,
                  marginBottom: 4
                }}
              >
                {a.title}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: C.accent,
                  marginBottom: 10
                }}
              >
                {a.event}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: C.textDim,
                  lineHeight: 1.6,
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