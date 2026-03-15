import "./storage-polyfill";
import { useState, useEffect } from "react";

// Data
import { SECTIONS } from "./data/content";

// Styles
import { DARK, LIGHT } from "./styles/theme";
import { globalCSS } from "./styles/globalCSS";

// Hooks
import { useSectionSnap } from "./hooks/useInView";

// Global chrome
import { InteractiveBg } from "./components/InteractiveBg";
import { CustomCursor } from "./components/CustomCursor";
import { AstronautAvatar } from "./components/AstronautAvatar";
import { NavBar, MenuOverlay, SectionDots, BackToTop, Footer } from "./components/Navigation";
import { Terminal } from "./components/Terminal";
import { AIChat } from "./components/AIChat";

// Sections
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { SkillsSection } from "./components/SkillsSection";
import { AchievementsSection } from "./components/AchievementsSection";
import { ArcadeSection } from "./components/ArcadeSection";
import { GuestbookSection } from "./components/GuestbookSection";
import { HireMeSection } from "./components/HireMeSection";
import { ContactSection } from "./components/ContactSection";

export default function Portfolio() {
  const [terminal, setTerminal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { current, goTo } = useSectionSnap();
  const [darkMode, setDarkMode] = useState(true);
  const [touchActive, setTouchActive] = useState(false);
  const C = darkMode ? DARK : LIGHT;

  useEffect(() => {
    let buf = "";
    const h = (e) => {
      buf += e.key.toLowerCase();
      if (buf.length > 7) buf = buf.slice(-7);
      if (buf === "elbaraa") setTerminal(true);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    const onTouchStart = () => setTouchActive(true);

    const onMouseMove = (e) => {
      if ("sourceCapabilities" in e && e.sourceCapabilities?.firesTouchEvents) return;
      if (e.movementX === 0 && e.movementY === 0) return;
      setTouchActive(false);
    };

    const onMouseDown = (e) => {
      if ("sourceCapabilities" in e && e.sourceCapabilities?.firesTouchEvents) return;
      setTouchActive(false);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div
      style={{
        background: C.bg,
        color: C.textPrimary,
        fontFamily: "system-ui,-apple-system,sans-serif",
        cursor: touchActive ? "auto" : "none",
        transition: "background 0.4s, color 0.4s"
      }}
    >
      <style>{globalCSS}</style>
      <style>{`
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input,textarea{color-scheme:${darkMode ? "dark" : "light"}}
      `}</style>

      <InteractiveBg C={C} isDark={darkMode} />
      {!touchActive && <CustomCursor C={C} isDark={darkMode} />}
      {!touchActive && <AstronautAvatar C={C} isDark={darkMode} />}
      <SectionDots current={current} goTo={goTo} C={C} />
      <NavBar
        onMenu={() => setMenuOpen(true)}
        onTerminal={() => setTerminal(true)}
        C={C}
        darkMode={darkMode}
        toggleDark={() => setDarkMode((d) => !d)}
      />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} goTo={goTo} C={C} />

      <HeroSection onMenu={() => setMenuOpen(true)} onHire={() => goTo(SECTIONS.indexOf("hire"))} C={C} />
      <AboutSection C={C} />
      <ProjectsSection C={C} />
      <ExperienceSection C={C} />
      <SkillsSection C={C} />
      <AchievementsSection C={C} />
      <ArcadeSection C={C} />
      <GuestbookSection C={C} />
      <HireMeSection C={C} />
      <ContactSection C={C} />
      <Footer C={C} />

      <BackToTop goTo={goTo} C={C} />
      <AIChat C={C} />
      {terminal && <Terminal onClose={() => setTerminal(false)} C={C} />}
    </div>
  );
}