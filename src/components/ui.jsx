import { useState, useEffect } from "react";

export function SectionTag({ num, label, C }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,${C.accent},${C.green})` }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: "0.15em" }}>
        {num} / {label}
      </span>
    </div>
  );
}

export function Typewriter({ text, delay = 600 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setDone(true); }
      }, 36);
      return () => clearInterval(t);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  return (
    <span>
      {displayed}
      {!done && (
        <span style={{ display: "inline-block", width: 2, height: "1em", background: "#7C6FFF", marginLeft: 2, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
      )}
    </span>
  );
}
