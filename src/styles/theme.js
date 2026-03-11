export const DARK = {
  bg: "#070B14", surface: "#0C1120", panel: "#101828", border: "#1E2D4A",
  accent: "#7C6FFF", green: "#4AFFC4", pink: "#F97FFF", orange: "#FFB347",
  textPrimary: "#E8EEFF", textSecondary: "#7A90BB", textDim: "#3A4F6A",
};

export const LIGHT = {
  bg: "#F2F2F2", surface: "#FFFFFF", panel: "#FAFAFA", border: "#D4D4D4",
  accent: "#404040", green: "#525252", pink: "#737373", orange: "#595959",
  textPrimary: "#171717", textSecondary: "#525252", textDim: "#A3A3A3",
};

export const mkPanel = (C, extra) =>
  Object.assign(
    { background: C.panel, border: "1px solid " + C.border, borderRadius: 10 },
    extra || {}
  );