export const DARK = {
  bg: "#070B14", surface: "#0C1120", panel: "#101828", border: "#1E2D4A",
  accent: "#7C6FFF", green: "#4AFFC4", pink: "#F97FFF", orange: "#FFB347",
  textPrimary: "#E8EEFF", textSecondary: "#7A90BB", textDim: "#3A4F6A",
};

export const LIGHT = {
  bg: "#F4F1FF", surface: "#EDE9FF", panel: "#EDE9FF", border: "#C4B8FF",
  accent: "#5B4FD9", green: "#0E9E72", pink: "#B026CC", orange: "#C96C00",
  textPrimary: "#0D0820", textSecondary: "#2D2060", textDim: "#7060AA",
};

export const mkPanel = (C, extra) =>
  Object.assign(
    { background: C.panel, border: "1px solid " + C.border, borderRadius: 10 },
    extra || {}
  );
