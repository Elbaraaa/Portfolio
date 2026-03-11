export const DARK = {
  bg: "#070B14", surface: "#0C1120", panel: "#101828", border: "#1E2D4A",
  accent: "#7C6FFF", green: "#4AFFC4", pink: "#F97FFF", orange: "#FFB347",
  textPrimary: "#E8EEFF", textSecondary: "#7A90BB", textDim: "#3A4F6A",
};

export const LIGHT = {
  bg: "#F5F5F7", surface: "#FFFFFF", panel: "#FFFFFF", border: "#D1D5DB",
  accent: "#4338CA", green: "#059669", pink: "#C026D3", orange: "#D97706",
  textPrimary: "#111827", textSecondary: "#4B5563", textDim: "#9CA3AF",
};

export const mkPanel = (C, extra) =>
  Object.assign(
    { background: C.panel, border: "1px solid " + C.border, borderRadius: 10 },
    extra || {}
  );