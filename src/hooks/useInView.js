import { useState, useEffect, useRef, useCallback } from "react";
import { SECTIONS } from "../data/content";

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
  const isAnimating = useRef(false);
  const accDelta = useRef(0);
  const THRESHOLD = 80;

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    const el = document.getElementById(SECTIONS[clamped]);
    if (!el) return;
    isAnimating.current = true;
    setCurrent(clamped);
    el.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { isAnimating.current = false; accDelta.current = 0; }, 900);
  }, []);

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

  const isArcadePlaying = () => !!document.querySelector('[data-arcade-playing="true"]');

  useEffect(() => {
    const onWheel = (e) => {
      if (isArcadePlaying()) return;
      e.preventDefault();
      if (isAnimating.current) return;
      accDelta.current += e.deltaY;
      if (Math.abs(accDelta.current) >= THRESHOLD) {
        const dir = accDelta.current > 0 ? 1 : -1;
        accDelta.current = 0;
        setCurrent((c) => {
          const next = Math.max(0, Math.min(SECTIONS.length - 1, c + dir));
          goTo(next);
          return next;
        });
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo]);

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
