// ── Pawgress Design Tokens ────────────────────────────────────────────────────
// Single source of truth for all colors, fonts and shared values.
// Import from here — never redeclare locally in screen files.

export const F       = "'Barlow Condensed', sans-serif";
export const ORANGE  = "#f97316";
export const COPPER  = "#cd7f32";
export const COPPER_L = "#e8a050";
export const COPPER_G = "rgba(180,100,20,0.22)";
export const BLUE    = "#3b82f6";

export const BG      = "#0a0a0a";
export const SURF    = "#131008";
export const SURF2   = "#1a1610";
export const BORDER  = "rgba(205,127,50,0.18)";
export const CARD    = "#141414";
export const CARD2   = "#1a1a1a";
export const BORDER2 = "#2a2a2a";

export const GREEN   = "#22c55e";
export const RED     = "#ef4444";

// Legacy aliases kept for backwards compat
export const colors = {
  bg:          BG,
  surface:     "#111111",
  card:        CARD,
  border:      BORDER2,
  orange:      ORANGE,
  orangeDark:  "#c2410c",
  orangeGlow:  COPPER_G,
  red:         RED,
  blue:        BLUE,
  cyan:        "#06b6d4",
  purple:      "#a855f7",
  green:       GREEN,
  yellow:      "#eab308",
  text:        "#ffffff",
  muted:       "#9ca3af",
  dim:         "#4b5563",
} as const;

export const fonts = {
  condensed: F,
  body:      "'Barlow', sans-serif",
} as const;
