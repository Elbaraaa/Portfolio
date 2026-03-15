export const DARK = {
  bg: "#070B14", surface: "#0C1120", panel: "#101828", border: "#1E2D4A",
  accent: "#7C6FFF", green: "#4AFFC4", pink: "#F97FFF", orange: "#FFB347",
  textPrimary: "#E8EEFF", textSecondary: "#7A90BB", textDim: "#3A4F6A",
};

export const LIGHT = {
  bg: "#F6F2E8",
  surface: "#FBF8F1",
  panel: "rgba(251,248,241,0.84)",
  border: "#D1C7B8",
  accent: "#234D3B",
  green: "#58714F",
  pink: "#8A9A82",
  orange: "#C89B5D",
  textPrimary: "#18241F",
  textSecondary: "#667167",
  textDim: "#A89F91",
};


export const mkPanel = (C, extra) =>
  Object.assign(
    { background: C.panel, border: "1px solid " + C.border, borderRadius: 10 },
    extra || {}
  );