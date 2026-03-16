import { personal } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function AboutSection({ C }) {
  const { ref, inView } = useInView(0.1);
  const anim = (d = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(20px)",
    transition: `all 0.6s ${d}s`
  });

  const cardStyle = mkPanel(C, {
    padding: "clamp(20px, 1.4vw, 28px)",
    cursor: "default",
    borderRadius: "clamp(10px, 0.9vw, 14px)",
    boxShadow: `0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`
  });

  return (
    <section
      id="about"
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
        <div style={anim(0)}>
          <div
            style={{
              transform: "scale(1.18)",
              transformOrigin: "left center",
              width: "fit-content",
              marginBottom: "clamp(10px, 1vw, 14px)"
            }}
          >
            <SectionTag num="01" label="About" C={C} />
          </div>
        </div>

        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(36px, 4vw, 72px)",
            alignItems: "start"
          }}
        >
          <div style={anim(0.1)}>
            <h2
              style={{
                fontFamily: "system-ui",
                fontSize: "clamp(30px, 3.8vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.16,
                margin: "0 0 clamp(24px, 1.8vw, 32px)",
                letterSpacing: "-0.02em"
              }}
            >
              <span style={{ color: C.textPrimary }}>I don't just write code.</span>
              <br />
              <span style={{ color: C.textDim }}>I build infrastructure</span>
              <br />
              <span
                className="grad-text"
                style={{ background: `linear-gradient(90deg,${C.accent},${C.green})` }}
              >
                for real problems.
              </span>
            </h2>

            {personal.bio.split("\n\n").map((p, i) => (
              <p
                key={i}
                style={{
                  color: C.textSecondary,
                  lineHeight: 1.85,
                  marginBottom: "clamp(14px, 1vw, 18px)",
                  fontSize: "clamp(15px, 1vw, 18px)",
                  maxWidth: "clamp(500px, 36vw, 700px)"
                }}
              >
                {p}
              </p>
            ))}

            <div
              style={mkPanel(C, {
                padding: "clamp(20px, 1.4vw, 28px)",
                marginTop: "clamp(20px, 1.6vw, 28px)",
                borderRadius: "clamp(10px, 0.9vw, 14px)",
                boxShadow: `0 2px 16px rgba(0,0,0,0.35)`
              })}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(10px, 0.7vw, 12px)",
                  color: C.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "clamp(12px, 1vw, 16px)"
                }}
              >
                Currently
              </div>

              {[
                ["🎓", "Studying", "B.S. CS, University of Arizona"],
                ["💼", "Working", "Web Dev @ UA RII"],
                ["📚", "Teaching", "Undergrad TA / CS Mentor"],
                ["🔭", "Building", "DocuMind RAG System"]
              ].map((row) => (
                <div
                  key={row[1]}
                  style={{
                    display: "flex",
                    gap: "clamp(10px, 0.8vw, 14px)",
                    marginBottom: "clamp(8px, 0.8vw, 12px)",
                    alignItems: "flex-start"
                  }}
                >
                  <span style={{ width: "clamp(16px, 1vw, 20px)" }}>{row[0]}</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(11px, 0.8vw, 13px)",
                      color: C.textDim,
                      width: "clamp(70px, 5.5vw, 90px)",
                      flexShrink: 0
                    }}
                  >
                    {row[1]}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(11px, 0.85vw, 13px)",
                      color: C.textSecondary,
                      lineHeight: 1.5
                    }}
                  >
                    {row[2]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="about-skills-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(14px, 1.2vw, 18px)",
              ...anim(0.2)
            }}
          >
            {[
              { icon: "⌨️", label: "Engineer", desc: "Full-stack systems from DB to UI." },
              { icon: "🧠", label: "Researcher", desc: "Applied AI, RAG pipelines & knowledge systems." },
              { icon: "👥", label: "Educator", desc: "Helped 500+ students level up." },
              { icon: "🚀", label: "Builder", desc: "Real tools used by real people." }
            ].map((p) => (
              <div key={p.label} style={cardStyle}>
                <div style={{ fontSize: "clamp(24px, 1.6vw, 30px)", marginBottom: "clamp(10px, 0.8vw, 14px)" }}>
                  {p.icon}
                </div>
                <div
                  style={{
                    fontFamily: "system-ui",
                    fontWeight: 700,
                    fontSize: "clamp(15px, 1vw, 18px)",
                    color: C.textPrimary,
                    marginBottom: "clamp(6px, 0.6vw, 10px)"
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: "clamp(13px, 0.9vw, 15px)",
                    color: C.textDim,
                    lineHeight: 1.7
                  }}
                >
                  {p.desc}
                </div>
              </div>
            ))}

            <div
              style={mkPanel(C, {
                padding: "clamp(20px, 1.4vw, 28px)",
                gridColumn: "1/-1",
                borderColor: C.accent + "20",
                borderRadius: "clamp(10px, 0.9vw, 14px)",
                boxShadow: `0 2px 16px rgba(0,0,0,0.35)`
              })}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(10px, 0.7vw, 12px)",
                      color: C.textDim,
                      textTransform: "uppercase",
                      marginBottom: 4
                    }}
                  >
                    University of Arizona
                  </div>
                  <div
                    style={{
                      fontFamily: "system-ui",
                      fontWeight: 700,
                      fontSize: "clamp(16px, 1.1vw, 20px)",
                      color: C.textPrimary
                    }}
                  >
                    B.S. Computer Science
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(13px, 0.9vw, 15px)",
                      color: C.textSecondary,
                      marginTop: 3
                    }}
                  >
                    Expected May 2026 · Dean&apos;s List
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    className="grad-text"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "clamp(34px, 2.4vw, 46px)",
                      fontWeight: 800,
                      background: `linear-gradient(135deg,${C.accent},${C.green})`
                    }}
                  >
                    3.9
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(10px, 0.7vw, 12px)",
                      color: C.textDim
                    }}
                  >
                    GPA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}