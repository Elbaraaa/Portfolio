import { experience } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function ExperienceSection({ C }) {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      id="experience"
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
          maxWidth: "clamp(920px, 72vw, 1200px)",
          margin: "0 auto",
          position: "relative",
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
            <SectionTag num="03" label="Experience" C={C} />
          </div>

          <h2
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 clamp(34px, 2.6vw, 48px)",
              color: C.textPrimary
            }}
          >
            Career <span style={{ color: C.textDim }}>trajectory.</span>
          </h2>
        </div>

        {experience.map((exp, i) => (
          <div
            key={exp.id}
            style={{
              display: "flex",
              gap: "clamp(24px, 1.8vw, 32px)",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateX(24px)",
              transition: `all 0.6s ${0.15 + i * 0.12}s`
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "clamp(42px, 2.6vw, 52px)",
                  height: "clamp(42px, 2.6vw, 52px)",
                  borderRadius: "50%",
                  border: `2px solid ${exp.status === "active" ? C.accent + "80" : C.border}`,
                  background: exp.status === "active" ? `${C.accent}12` : C.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative"
                }}
              >
                <span style={{ fontSize: "clamp(14px, 0.95vw, 17px)" }}>
                  {exp.status === "active" ? "💼" : "✓"}
                </span>

                {exp.status === "active" && (
                  <div
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: "clamp(9px, 0.7vw, 12px)",
                      height: "clamp(9px, 0.7vw, 12px)",
                      borderRadius: "50%",
                      background: C.green,
                      border: `2px solid ${C.bg}`
                    }}
                  />
                )}
              </div>

              {i < experience.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    background: `linear-gradient(to bottom,${C.border},transparent)`,
                    marginTop: "clamp(8px, 0.8vw, 12px)",
                    minHeight: "clamp(42px, 4vw, 64px)"
                  }}
                />
              )}
            </div>

            <div
              style={{
                paddingBottom: "clamp(32px, 2.4vw, 44px)",
                flex: 1,
                minWidth: 0
              }}
            >
              <div
                style={mkPanel(C, {
                  padding: "clamp(22px, 1.6vw, 30px)",
                  borderRadius: "clamp(10px, 0.9vw, 14px)",
                  boxShadow: `0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`
                })}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "clamp(8px, 0.8vw, 12px)",
                    marginBottom: "clamp(10px, 0.8vw, 14px)"
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "system-ui",
                        fontWeight: 700,
                        fontSize: "clamp(17px, 1.2vw, 21px)",
                        color: C.textPrimary,
                        margin: "0 0 4px"
                      }}
                    >
                      {exp.role}
                    </h3>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(11px, 0.8vw, 13px)",
                        color: C.accent
                      }}
                    >
                      {exp.orgShort}
                    </span>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(10px, 0.75vw, 12px)",
                        color: C.textDim
                      }}
                    >
                      {exp.period}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "flex-end",
                        marginTop: 4
                      }}
                    >
                      <div
                        style={{
                          width: "clamp(5px, 0.45vw, 7px)",
                          height: "clamp(5px, 0.45vw, 7px)",
                          borderRadius: "50%",
                          background: exp.status === "active" ? C.green : C.textDim
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "clamp(9px, 0.68vw, 11px)",
                          color: exp.status === "active" ? C.green : C.textDim,
                          textTransform: "uppercase"
                        }}
                      >
                        {exp.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    color: C.textSecondary,
                    fontSize: "clamp(14px, 0.95vw, 16px)",
                    lineHeight: 1.8,
                    margin: "0 0 clamp(12px, 1vw, 16px)"
                  }}
                >
                  {exp.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(5px, 0.5vw, 8px)" }}>
                  {exp.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(10px, 0.72vw, 12px)",
                        padding: "clamp(3px, 0.25vw, 5px) clamp(7px, 0.6vw, 10px)",
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 4,
                        color: C.textDim
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}