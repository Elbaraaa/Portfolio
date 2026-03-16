import { useState } from "react";
import { personal } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function HireMeSection({ C }) {
  const { ref, inView } = useInView(0.1);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setErr("Please fill in name, email and message.");
      return;
    }
    setSending(true);
    setErr("");
    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", company: "", message: "" });
      } else {
        setErr("Something went wrong. Try emailing me directly!");
      }
    } catch {
      setErr("Network error. Try emailing me directly!");
    }
    setSending(false);
  };

  const reasons = [
    { icon: "🚀", text: "Shipped real production systems for a university" },
    { icon: "🏆", text: "2x hackathon winner — AI & full-stack" },
    { icon: "📐", text: "3.9 GPA + Dean's List while working two roles" },
    { icon: "🧠", text: "End-to-end ownership: design → deploy → maintain" }
  ];

  return (
    <section
      id="hire"
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%,${C.accent}06,transparent 70%)`,
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          maxWidth: "clamp(1120px, 78vw, 1400px)",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 2
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
            <SectionTag num="08" label="Hire Me" C={C} />
          </div>

          <h2
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 10px"
            }}
          >
            <span style={{ color: C.textPrimary }}>Ready to </span>
            <span
              className="grad-text"
              style={{ background: `linear-gradient(90deg,${C.accent},${C.green})` }}
            >
              make an impact.
            </span>
          </h2>

          <p
            style={{
              color: C.textSecondary,
              fontSize: "clamp(15px, 1vw, 18px)",
              lineHeight: 1.75,
              maxWidth: "clamp(560px, 42vw, 760px)",
              marginBottom: "clamp(34px, 2.6vw, 48px)"
            }}
          >
            Looking for Summer 2026 internships in software engineering, full-stack dev, and
            applied AI.
          </p>
        </div>

        <div
          className="hire-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(22px, 2vw, 32px)",
            opacity: inView ? 1 : 0,
            transition: "all 0.7s 0.2s"
          }}
        >
          <div>
            <div
              className="hire-reasons-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(10px, 0.9vw, 14px)",
                marginBottom: "clamp(16px, 1.2vw, 20px)"
              }}
            >
              {reasons.map((r, i) => (
                <div
                  key={i}
                  style={mkPanel(C, {
                    padding: "clamp(18px, 1.3vw, 24px)",
                    display: "flex",
                    gap: "clamp(10px, 0.8vw, 14px)",
                    alignItems: "flex-start",
                    transition: "border-color 0.3s",
                    borderRadius: "clamp(10px, 0.9vw, 14px)",
                    boxShadow: `0 2px 12px rgba(0,0,0,0.3)`
                  })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.accent + "40";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  <span style={{ fontSize: "clamp(20px, 1.3vw, 24px)", flexShrink: 0 }}>
                    {r.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "clamp(13px, 0.9vw, 15px)",
                      color: C.textSecondary,
                      lineHeight: 1.6
                    }}
                  >
                    {r.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={mkPanel(C, {
                padding: "clamp(22px, 1.6vw, 30px)",
                borderColor: C.green + "30",
                borderRadius: "clamp(10px, 0.9vw, 14px)",
                boxShadow: `0 2px 16px rgba(0,0,0,0.35)`
              })}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div
                  style={{
                    width: "clamp(9px, 0.7vw, 12px)",
                    height: "clamp(9px, 0.7vw, 12px)",
                    borderRadius: "50%",
                    background: C.green,
                    animation: "pulse 1.5s infinite"
                  }}
                />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "clamp(11px, 0.8vw, 13px)",
                    color: C.green,
                    fontWeight: 700
                  }}
                >
                  Available · Summer 2026
                </span>
              </div>

              <p
                style={{
                  fontFamily: "system-ui",
                  fontSize: "clamp(14px, 0.95vw, 16px)",
                  color: C.textSecondary,
                  margin: "0 0 16px",
                  lineHeight: 1.7
                }}
              >
                If you're working on hard problems that need a builder who cares — let&apos;s
                talk.
              </p>

              <div style={{ display: "flex", gap: "clamp(10px, 0.8vw, 14px)", flexWrap: "wrap" }}>
                <a
                  href={`mailto:${personal.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "clamp(10px, 0.8vw, 13px) clamp(18px, 1.2vw, 22px)",
                    background: `linear-gradient(135deg,${C.accent},${C.green})`,
                    color: C.bg,
                    fontWeight: 700,
                    fontSize: "clamp(12px, 0.85vw, 14px)",
                    borderRadius: 7,
                    textDecoration: "none"
                  }}
                >
                  ✉️ Email directly
                </a>

                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "clamp(10px, 0.8vw, 13px) clamp(18px, 1.2vw, 22px)",
                    border: `1px solid ${C.border}`,
                    color: C.textSecondary,
                    fontSize: "clamp(12px, 0.85vw, 14px)",
                    borderRadius: 7,
                    textDecoration: "none",
                    fontFamily: "monospace"
                  }}
                >
                  💼 LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div
            style={mkPanel(C, {
              padding: "clamp(28px, 2vw, 34px)",
              borderColor: C.accent + "30",
              borderRadius: "clamp(10px, 0.9vw, 14px)",
              boxShadow: `0 2px 16px rgba(0,0,0,0.35)`
            })}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(10px, 0.75vw, 12px)",
                color: C.accent,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "clamp(18px, 1.2vw, 22px)"
              }}
            >
              Send a message
            </div>

            {sent ? (
              <div style={{ textAlign: "center", padding: "clamp(36px, 3vw, 48px) 0" }}>
                <div style={{ fontSize: "clamp(52px, 3vw, 64px)", marginBottom: 12 }}>🚀</div>
                <div
                  style={{
                    fontFamily: "system-ui",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 1.4vw, 24px)",
                    color: C.textPrimary,
                    marginBottom: 8
                  }}
                >
                  Message sent!
                </div>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    marginTop: 16,
                    fontFamily: "monospace",
                    fontSize: "clamp(11px, 0.8vw, 13px)",
                    padding: "clamp(8px, 0.7vw, 10px) clamp(16px, 1vw, 20px)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    background: "none",
                    color: C.textDim,
                    cursor: "pointer"
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "clamp(10px, 0.8vw, 14px)",
                    marginBottom: "clamp(10px, 0.8vw, 14px)"
                  }}
                >
                  {[
                    ["name", "Your name *", "text"],
                    ["email", "Email *", "email"],
                    ["company", "Company / Role", "text"]
                  ].map(([k, ph, type]) => (
                    <input
                      key={k}
                      type={type}
                      value={form[k]}
                      onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
                      placeholder={ph}
                      style={{
                        gridColumn: k === "company" ? "1/-1" : "auto",
                        padding: "clamp(11px, 0.85vw, 14px) clamp(14px, 1vw, 18px)",
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 7,
                        color: C.textPrimary,
                        fontFamily: "monospace",
                        fontSize: "clamp(12px, 0.82vw, 14px)",
                        outline: "none",
                        boxSizing: "border-box",
                        width: "100%"
                      }}
                    />
                  ))}
                </div>

                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="What are you working on? *"
                  maxLength={600}
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "clamp(11px, 0.85vw, 14px) clamp(14px, 1vw, 18px)",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    color: C.textPrimary,
                    fontFamily: "monospace",
                    fontSize: "clamp(12px, 0.82vw, 14px)",
                    outline: "none",
                    resize: "none",
                    marginBottom: 12,
                    boxSizing: "border-box"
                  }}
                />

                {err && (
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(11px, 0.8vw, 13px)",
                      color: C.pink,
                      marginBottom: 10
                    }}
                  >
                    {err}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{
                    width: "100%",
                    padding: "clamp(13px, 0.95vw, 16px) 0",
                    background: `linear-gradient(135deg,${C.accent},${C.green})`,
                    color: C.bg,
                    fontWeight: 800,
                    fontSize: "clamp(13px, 0.9vw, 15px)",
                    borderRadius: 7,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "monospace"
                  }}
                >
                  {sending ? "Sending…" : "🚀 Send Message"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}