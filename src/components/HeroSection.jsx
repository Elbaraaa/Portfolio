import { useState, useEffect, useRef } from "react";
import { personal, stats } from "../data/content";
import { mkPanel } from "../styles/theme";
import { Typewriter } from "./ui";
import { useWindowWidth } from "../hooks/useInView";

function EmailIcon({ color = "currentColor", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6.75C3 5.784 3.784 5 4.75 5h14.5C20.216 5 21 5.784 21 6.75v10.5c0 .966-.784 1.75-1.75 1.75H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon({ color = "currentColor", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ color = "currentColor", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1.01 1.84-2.08 3.79-2.08C21.72 8.56 23 11.03 23 14.28V21h-4v-5.96c0-1.42-.03-3.24-1.98-3.24-1.98 0-2.28 1.55-2.28 3.14V21h-4V9Z" />
    </svg>
  );
}

function PreviewIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ─── Resume data ─── */
const resume = {
  name: "ELBARAA ABDALLA",
  contact: "+1 (520) 440-6905 · elbaraaa@arizona.edu · Tucson, AZ",
  links: ["linkedin.com/in/elbaraa-abdalla", "github.com/elbaraaa", "elbaraa.me"],
  education: {
    school: "University of Arizona",
    date: "August 2022 – May 2026",
    degree: "Bachelor of Science in Computer Science",
    gpa: "GPA: 3.7",
  },
  skills: [
    { cat: "Languages", items: "Java, Python, C/C++, JavaScript, SQL, C#, MIPS" },
    { cat: "Web/Backend", items: "HTML, CSS, React.js, Node.js, REST APIs, Drupal, WordPress, JDBC, PHP" },
    { cat: "Databases/Tools", items: "Oracle SQL, PostgreSQL, SQL Server, Git, Linux/Unix, Vim, Emacs" },
    { cat: "AI Workflow", items: "GitHub Copilot, ChatGPT, Gemini, Claude" },
  ],
  experience: [
    {
      title: "IT Web Analyst",
      org: "University Information Technology Services (UITS), University of Arizona",
      date: "July 2025 – Present",
      bullets: [
        "Reviewed and remediated 1000+ university web pages migrated from Drupal and WordPress, ensuring accessibility compliance.",
        "Resolved content defects, formatting issues, and inconsistencies across migrated pages.",
      ],
    },
    {
      title: "Web Developer",
      org: "Office of Research and Partnerships (ORP), University of Arizona",
      date: "May 2024 – Present",
      bullets: [
        "Cut deployment time by 85% by creating a Bash automation script replacing manual maintenance steps.",
        "Developed interactive UI features, backend modules, and API integrations with JavaScript, HTML, CSS, and Drupal.",
        "Built a crawler that scanned 4,000+ pages to address broken-link issues across the ORP website.",
      ],
    },
    {
      title: "Undergraduate Teaching Assistant",
      org: "Department of Computer Science, University of Arizona",
      date: "Aug 2024 – Dec 2024, Jan 2026 – Present",
      bullets: [
        "Supported 100+ students in CSC 210 and CSC 335 through office hours and technical guidance in Java, OOP, and data structures.",
        "Graded programming assignments, applying rubrics and delivering feedback on correctness, code quality, and design.",
      ],
    },
    {
      title: "Undergraduate Research Assistant",
      org: "Vertically Integrated Projects (VIP), University of Arizona",
      date: "Jan 2024 – May 2024",
      bullets: [
        "Developed SafeDrive-AI, a CNN-based real-time distracted driving detection system classifying driver behavior into five categories.",
        "Presented the project's design and real-world safety value to 150+ attendees at IShowcase.",
      ],
    },
  ],
  projects: [
    {
      name: "MajorLyte (UA DegreePlan Copilot)",
      tag: "Hackathon Winner",
      bullets: [
        "Built an AI-powered academic planning platform using the Gemini API to help students navigate degree requirements.",
        "Won First Place and Best Use of Gemini API at Hack Arizona.",
        "Continuing development beyond the hackathon toward launch.",
      ],
    },
    {
      name: "Full-Stack Online Bookstore Web Application",
      tag: null,
      bullets: [
        "Built a full-stack online bookstore using JavaScript, HTML, CSS, and RESTful server routes with dynamic rendering and auth.",
        "Developed client-side session workflows with localStorage, cart synchronization, and login-gated actions.",
      ],
    },
  ],
};

/* ─── SVG icons for the viewer ─── */
function CloseIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function DownloadIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

/* ─── Resume Viewer Modal (theme-aware) ─── */
function ResumeViewer({ onClose, C }) {
  const mobileTopGap = 72;
  const overlayRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const isLight = C.bg === "#F6F2E8";
  const isMobile = window.innerWidth <= 767;

  const modalTextSecondary = isLight ? "#5f584f" : C.textSecondary;
  const modalTextDim = isLight ? "#746c62" : C.textDim;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const mono = "'SF Mono', 'Fira Code', 'Cascadia Code', monospace";

  const SectionTitle = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 12px" }}>
      <span
        style={{
          fontFamily: mono,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: C.accent,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.accent}40, transparent)` }} />
    </div>
  );

  return (
      <div
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && handleClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1800,
          background: visible
            ? isLight
              ? "rgba(255,255,255,0.6)"
              : "rgba(0,0,0,0.78)"
            : "rgba(0,0,0,0)",
          backdropFilter: visible ? "blur(16px)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(16px)" : "blur(0px)",
          display: "flex",
          justifyContent: "center",
          transition: "all 0.3s ease",
          alignItems: isMobile ? "flex-start" : "center",
          padding: isMobile ? `${mobileTopGap}px 8px 8px` : "16px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      > 
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          height: window.innerWidth <= 767 ? "calc(100dvh - 16px)" : "auto",
          maxHeight: window.innerWidth <= 767 ? "calc(100dvh - 16px)" : "92vh",
          marginTop: window.innerWidth <= 767 ? "0" : undefined,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: window.innerWidth <= 767 ? 10 : 14,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
          opacity: visible ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: isLight
            ? `0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)`
            : `0 0 100px ${C.accent}08, 0 32px 64px rgba(0,0,0,0.6)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            background: isLight ? `${C.bg}` : C.bg,
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div
                onClick={handleClose}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "#ff5f57",
                  cursor: "pointer",
                }}
              />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <span style={{ fontFamily: mono, fontSize: 12, color: modalTextDim, marginLeft: 4 }}>
              Elbaraa_Abdalla_resume.pdf
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href="/Elbaraa_Abdalla_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 6,
                background: `${C.green}12`,
                border: `1px solid ${C.green}25`,
                color: C.green,
                fontFamily: mono,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${C.green}22`;
                e.currentTarget.style.borderColor = `${C.green}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${C.green}12`;
                e.currentTarget.style.borderColor = `${C.green}25`;
              }}
            >
              <PreviewIcon size={12} color={C.green} />
              Preview PDF
            </a>

            <a
              href="/Elbaraa_Abdalla_resume.pdf"
              download="Elbaraa_Abdalla_resume.pdf"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 6,
                background: `${C.accent}12`,
                border: `1px solid ${C.accent}25`,
                color: C.accent,
                fontFamily: mono,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${C.accent}22`;
                e.currentTarget.style.borderColor = `${C.accent}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${C.accent}12`;
                e.currentTarget.style.borderColor = `${C.accent}25`;
              }}
            >
              <DownloadIcon size={12} color={C.accent} />
              Download PDF
            </a>

            <button
              onClick={handleClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 7,
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: modalTextDim,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ff5f57";
                e.currentTarget.style.color = "#ff5f57";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = modalTextDim;
              }}
            >
              <CloseIcon size={15} />
            </button>
          </div>
        </div>

        <div
          style={{
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
            padding: window.innerWidth <= 767 ? "18px 16px 24px" : "24px 28px 30px",
            color: C.textPrimary,
            background: C.surface,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <h2
              style={{
                margin: 0,
                display: "inline-block",
                width: "fit-content",
                maxWidth: "100%",
                lineHeight: 1.08,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: C.accent,
              }}
            >
              {resume.name}
            </h2>

            <p
              style={{
                fontFamily: mono,
                fontSize: 11,
                color: modalTextSecondary,
                margin: "6px 0 4px",
                lineHeight: 1.7,
              }}
            >
              {resume.contact}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              {resume.links.map((l) => (
                <span key={l} style={{ fontFamily: mono, fontSize: 11, color: C.accent, opacity: 0.85 }}>
                  {l}
                </span>
              ))}
            </div>
          </div>

          <SectionTitle>Education</SectionTitle>
          <div
            style={{
              padding: "10px 14px",
              background: isLight ? `${C.accent}06` : `${C.accent}04`,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
                {resume.education.school}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: modalTextDim }}>
                {resume.education.date}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 4,
                marginTop: 3,
              }}
            >
              <span style={{ fontSize: 13, color: modalTextSecondary }}>
                {resume.education.degree}
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "1px 8px",
                  borderRadius: 4,
                  background: `${C.green}15`,
                  color: C.green,
                  border: `1px solid ${C.green}25`,
                }}
              >
                {resume.education.gpa}
              </span>
            </div>
          </div>

          <SectionTitle>Technical Skills</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {resume.skills.map((s) => (
              <div key={s.cat} style={{ fontSize: 13, lineHeight: 1.65 }}>
                <span style={{ color: C.accent, fontWeight: 700, fontFamily: mono, fontSize: 11 }}>
                  {s.cat}:{" "}
                </span>
                <span style={{ color: modalTextSecondary }}>{s.items}</span>
              </div>
            ))}
          </div>

          <SectionTitle>Professional Experience</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {resume.experience.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  paddingLeft: 16,
                  borderLeft: `2px solid ${C.accent}20`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -5,
                    top: 4,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.surface,
                    border: `2px solid ${C.accent}60`,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
                    {exp.title}
                  </span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: modalTextDim }}>
                    {exp.date}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: modalTextSecondary,
                    fontStyle: "italic",
                    marginBottom: 6,
                    opacity: 0.9,
                  }}
                >
                  {exp.org}
                </div>

                <ul style={{ margin: 0, paddingLeft: 2, listStyle: "none" }}>
                  {exp.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 13,
                        color: modalTextSecondary,
                        lineHeight: 1.65,
                        marginBottom: 4,
                        position: "relative",
                        paddingLeft: 14,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 9,
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: C.accent + "50",
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <SectionTitle>Projects</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {resume.projects.map((proj, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 14px",
                  background: isLight ? `${C.accent}06` : `${C.accent}04`,
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
                    {proj.name}
                  </span>

                  {proj.tag && (
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: `${C.green}15`,
                        color: C.green,
                        border: `1px solid ${C.green}25`,
                      }}
                    >
                      {proj.tag}
                    </span>
                  )}
                </div>

                <ul style={{ margin: 0, paddingLeft: 2, listStyle: "none" }}>
                  {proj.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 13,
                        color: modalTextSecondary,
                        lineHeight: 1.65,
                        marginBottom: 3,
                        position: "relative",
                        paddingLeft: 14,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 9,
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: C.accent + "50",
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */
export function HeroSection({ onMenu, onHire, C }) {
  const [uptime, setUptime] = useState(0);
  const [showResume, setShowResume] = useState(false);
  const width = useWindowWidth();
  const isMobile = window.innerWidth <= 767;


  const isTablet = width <= 1024;
  const isLaptop = width <= 1280;
  const isTightHero = width <= 1280;
  const isWide = width >= 1600;
  const isUltraWide = width >= 1920;
  const isLight = C.bg === "#F6F2E8";

  const heroTextSecondary = isLight ? "#5f584f" : C.textSecondary;
  const heroTextDim = isLight ? "#746c62" : C.textDim;

  const heroTopPadding = isMobile
    ? "clamp(118px, 18vw, 150px)"
    : isTablet
    ? "clamp(98px, 10vw, 126px)"
    : "clamp(82px, 7vw, 112px)";

  useEffect(() => {
    const s = Date.now();
    const t = setInterval(() => setUptime(Math.floor((Date.now() - s) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const socialLinks = [
    {
      label: "Email",
      href: "mailto:elbaraaa@arizona.edu",
      icon: EmailIcon,
    },
    {
      label: "GitHub",
      href: "https://github.com/Elbaraaa",
      icon: GitHubIcon,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/elbaraa-abdalla-a0746728a/",
      icon: LinkedInIcon,
    },
  ];

  const heroContentWidth = isMobile
    ? "100%"
    : isTablet
    ? "min(90vw, 760px)"
    : isLaptop
    ? "min(74vw, 920px)"
    : isWide
    ? "min(58vw, 1120px)"
    : "min(64vw, 1000px)";

  const heroPaddingX = isMobile
    ? "0 20px"
    : isTablet
    ? "0 28px"
    : "0 clamp(28px, 3vw, 56px)";

  const heroNameSize = isMobile
    ? "clamp(44px, 12vw, 64px)"
    : isTablet
    ? "clamp(58px, 8vw, 82px)"
    : isLaptop
    ? "clamp(68px, 6.5vw, 92px)"
    : isUltraWide
    ? "clamp(82px, 5vw, 118px)"
    : "clamp(72px, 5.8vw, 104px)";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "transparent",
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
          pointerEvents: "none",
        }}
      />

      {!isTightHero && (
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
              animation: "fadeUp 0.6s 1.4s both",
            }),
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(11px, 0.75vw, 13px)",
              color: heroTextDim,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "clamp(12px, 1vw, 16px)",
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
                  fontSize: "clamp(12px, 0.9vw, 15px)",
                }}
              >
                <span style={{ color: heroTextDim }}>{row[0]}</span>
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
              marginBottom: "clamp(14px, 1vw, 18px)",
            }}
          >
            <span
              style={{
                width: "clamp(6px, 0.5vw, 8px)",
                height: "clamp(6px, 0.5vw, 8px)",
                borderRadius: "50%",
                background: C.green,
                display: "inline-block",
                animation: "pulse 1.5s ease-in-out infinite",
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
              fontWeight: 700,
            }}
            onClick={() => setShowResume(true)}
          >
            📄 View Resume
          </button>
        </div>
      )}

      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 4,
          width: heroContentWidth,
          padding: heroPaddingX,
          paddingTop: heroTopPadding,
          boxSizing: "border-box",
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
            color: heroTextSecondary,
            marginBottom: "clamp(28px, 2vw, 36px)",
            animation: "fadeUp 0.5s 0.2s both",
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
            animation: "fadeUp 0.7s 0.4s both",
          }}
        >
          <span
            className="grad-text"
            style={{
              display: "block",
              fontSize: heroNameSize,
              background: `linear-gradient(135deg,${C.textPrimary},${C.accent})`,
            }}
          >
            Elbaraa
          </span>
          <span
            className="grad-text"
            style={{
              display: "block",
              fontSize: heroNameSize,
              background: `linear-gradient(135deg,${C.accent},${C.green})`,
            }}
          >
            Abdalla.
          </span>
        </h1>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: isMobile ? "clamp(13px, 3.6vw, 16px)" : "clamp(15px, 1vw, 18px)",
            color: C.accent,
            marginBottom: "clamp(18px, 1.4vw, 24px)",
            minHeight: "clamp(22px, 2vw, 30px)",
            animation: "fadeUp 0.5s 0.9s both",
          }}
        >
          <Typewriter text={`> ${personal.subTagline}`} delay={1000} />
        </div>

        <p
          style={{
            color: heroTextSecondary,
            fontSize: isMobile ? "clamp(15px, 4vw, 18px)" : "clamp(16px, 1.05vw, 20px)",
            lineHeight: 1.75,
            maxWidth: isMobile ? "100%" : "clamp(540px, 36vw, 720px)",
            marginBottom: "clamp(20px, 1.6vw, 28px)",
            animation: "fadeUp 0.6s 1.1s both",
          }}
        >
          I build systems that close the gap between research and real-world impact.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px, 0.9vw, 14px)",
            flexWrap: "wrap",
            marginBottom: "clamp(24px, 1.8vw, 30px)",
            animation: "fadeUp 0.6s 1.15s both",
          }}
        >
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                aria-label={item.label}
                title={item.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "clamp(10px, 0.85vw, 13px) clamp(14px, 1vw, 18px)",
                  borderRadius: 999,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  color: heroTextSecondary,
                  textDecoration: "none",
                  fontFamily: "monospace",
                  fontSize: "clamp(12px, 0.85vw, 14px)",
                  transition: "transform 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.color = C.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = heroTextSecondary;
                }}
              >
                <Icon size={16} color="currentColor" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(10px, 0.75vw, 13px)",
            color: heroTextDim,
            marginBottom: "clamp(24px, 1.8vw, 30px)",
            animation: "fadeUp 0.5s 3s both",
            display: "flex",
            alignItems: "center",
            gap: 8,
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
            flexWrap: "wrap",
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
              cursor: "pointer",
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
              color: heroTextSecondary,
              fontSize: "clamp(13px, 0.9vw, 16px)",
              borderRadius: "clamp(7px, 0.8vw, 10px)",
              background: "none",
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            ✉️ Hire Me
          </button>

          <button
            onClick={() => setShowResume(true)}
            style={{
              display: isTightHero ? "inline-flex" : "none",
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
              fontWeight: 700,
            }}
          >
            📄 View Resume
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
            maxWidth: isMobile ? "100%" : "clamp(580px, 42vw, 760px)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(16px, 1.1vw, 22px) clamp(18px, 1.4vw, 24px)",
                background: C.surface,
                borderRight: isMobile
                  ? i % 2 === 0
                    ? `1px solid ${C.border}`
                    : "none"
                  : i < 3
                  ? `1px solid ${C.border}`
                  : "none",
                borderBottom: isMobile && i < 2 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div
                className="grad-text"
                style={{
                  fontFamily: "system-ui",
                  fontSize: "clamp(24px, 1.8vw, 32px)",
                  fontWeight: 800,
                  background: `linear-gradient(135deg,${C.textPrimary},${C.accent})`,
                  marginBottom: 3,
                }}
              >
                {s.value}
              </div>

              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(8px, 0.65vw, 11px)",
                  color: heroTextDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1.3,
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
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(11px, 0.85vw, 14px)",
                color: heroTextDim,
                marginBottom: 6,
              }}
            >
              scroll to navigate
            </div>
            <div
              style={{
                color: heroTextDim,
                fontSize: "clamp(16px, 1.2vw, 22px)",
                animation: "bounce 1.6s ease-in-out infinite",
              }}
            >
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
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(11px, 0.85vw, 14px)",
              color: heroTextDim,
              marginBottom: 6,
            }}
          >
            scroll to navigate
          </div>
          <div
            style={{
              color: heroTextDim,
              fontSize: "clamp(16px, 1.2vw, 22px)",
              animation: "bounce 1.6s ease-in-out infinite",
            }}
          >
            ↓
          </div>
        </div>
      )}

      {showResume && <ResumeViewer onClose={() => setShowResume(false)} C={C} />}
    </section>
  );
}