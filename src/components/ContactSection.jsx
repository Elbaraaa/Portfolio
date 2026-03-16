import { personal } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function ContactSection({ C }) {
  const { ref, inView } = useInView(0.1);

  const links = [
    {
      icon: "✉️",
      label: "Email",
      value: personal.email,
      href: `mailto:${personal.email}`,
      accent: C.accent
    },
    {
      icon: "🐙",
      label: "GitHub",
      value: "github.com/baraaabdalla",
      href: personal.github,
      accent: C.pink
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "linkedin.com/in/baraaabdalla",
      href: personal.linkedin,
      accent: C.green
    }
  ];

  return (
    <section
      id="contact"
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            fontFamily: "system-ui",
            fontWeight: 800,
            fontSize: "18vw",
            color: C.textPrimary,
            opacity: 0.012,
            userSelect: "none"
          }}
        >
          HELLO
        </span>
      </div>

      <div
        style={{
          maxWidth: "clamp(760px, 62vw, 980px)",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
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
            <SectionTag num="09" label="Contact" C={C} />
          </div>
        </div>

        <h2
          style={{
            fontFamily: "system-ui",
            fontSize: "clamp(36px, 5vw, 62px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 clamp(16px, 1.2vw, 20px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.6s 0.1s"
          }}
        >
          Let&apos;s build
          <br />
          <span
            className="grad-text"
            style={{ background: `linear-gradient(90deg,${C.accent},${C.green})` }}
          >
            something real.
          </span>
        </h2>

        <p
          style={{
            color: C.textSecondary,
            fontSize: "clamp(16px, 1.05vw, 20px)",
            lineHeight: 1.75,
            maxWidth: "clamp(520px, 42vw, 720px)",
            marginBottom: "clamp(34px, 2.4vw, 44px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.6s 0.2s"
          }}
        >
          Seeking Summer 2026 internships in software engineering, full-stack dev, and applied AI.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(12px, 1vw, 16px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.6s 0.3s"
          }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                ...mkPanel(C, {
                  padding: "clamp(16px, 1.2vw, 22px) clamp(20px, 1.6vw, 28px)",
                  borderRadius: "clamp(10px, 0.9vw, 14px)"
                }),
                textDecoration: "none",
                transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${link.accent}40`;
                e.currentTarget.style.boxShadow = `0 0 20px ${link.accent}12`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px, 1.1vw, 18px)" }}>
                <div
                  style={{
                    width: "clamp(40px, 2.5vw, 48px)",
                    height: "clamp(40px, 2.5vw, 48px)",
                    borderRadius: "clamp(8px, 0.8vw, 10px)",
                    border: `1px solid ${link.accent}30`,
                    background: `${link.accent}08`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(15px, 1vw, 18px)"
                  }}
                >
                  {link.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(9px, 0.72vw, 11px)",
                      color: C.textDim,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 3
                    }}
                  >
                    {link.label}
                  </div>

                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(13px, 0.9vw, 15px)",
                      color: C.textSecondary
                    }}
                  >
                    {link.value}
                  </div>
                </div>
              </div>

              <span style={{ color: C.textDim, fontSize: "clamp(15px, 1vw, 18px)" }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}