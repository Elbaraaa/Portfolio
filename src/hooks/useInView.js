import { useState, useEffect, useRef, useCallback } from "react";
import { SECTIONS } from "../data/content";

export function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return width;
}

export function useInView(t = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { setInView(entries[0].isIntersecting); },
      { threshold: t }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return { ref, inView };
}

export function useSectionSnap() {
  const [current, setCurrent] = useState(0);
  const snapTimer = useRef(null);
  const isSnapping = useRef(false);

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    const el = document.getElementById(SECTIONS[clamped]);
    if (!el) return;
    isSnapping.current = true;
    setCurrent(clamped);
    el.scrollIntoView({ behavior: "smooth" });
    // Lock out auto-snap while programmatic scroll is happening
    setTimeout(() => { isSnapping.current = false; }, 1000);
  }, []);

  // Track which section is most visible
  useEffect(() => {
    const observers = SECTIONS.map((id, i) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) setCurrent(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  // Debounced snap: after user stops scrolling for 800ms,
  // find the nearest section and gently scroll to it —
  // but only if they're within 30% of viewport from a section top
  useEffect(() => {
    const onScroll = () => {
      if (isSnapping.current) return;
      clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        if (isSnapping.current) return;
        const vh = window.innerHeight;
        const scrollY = window.scrollY;

        // Find the section whose top is closest to the current scroll position
        let closest = null;
        let closestDist = Infinity;
        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.offsetTop;
          const dist = Math.abs(scrollY - top);
          if (dist < closestDist) {
            closestDist = dist;
            closest = el;
          }
        }

        // Only snap if we're within 30% of viewport height from a section edge
        // This means if you're mid-section reading content, it leaves you alone
        if (closest && closestDist < vh * 0.3 && closestDist > 10) {
          isSnapping.current = true;
          closest.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => { isSnapping.current = false; }, 1000);
        }
      }, 800);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(snapTimer.current);
    };
  }, []);

  const isArcadePlaying = () => !!document.querySelector('[data-arcade-playing="true"]');

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (isArcadePlaying()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); goTo(current - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  return { current, goTo };
}