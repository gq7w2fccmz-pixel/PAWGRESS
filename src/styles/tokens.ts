export const colors = {
  bg:          "#0a0a0a",
  surface:     "#111111",
  card:        "#161616",
  border:      "#2a2a2a",
  orange:      "#f97316",
  orangeDark:  "#c2410c",
  orangeGlow:  "rgba(249,115,22,0.25)",
  red:         "#ef4444",
  blue:        "#3b82f6",
  cyan:        "#06b6d4",
  purple:      "#a855f7",
  green:       "#22c55e",
  yellow:      "#eab308",
  text:        "#ffffff",
  muted:       "#9ca3af",
  dim:         "#4b5563",
} as const;

export const fonts = {
  condensed: "'Barlow Condensed', sans-serif",
  body:      "'Barlow', sans-serif",
} as const;

// Tailwind class helpers
export const tw = {
  card:       "bg-[#161616] border border-[#2a2a2a] rounded-2xl",
  cardHover:  "hover:border-orange-500 transition-colors duration-200",
  heading:    "font-black italic font-condensed",
  label:      "text-[10px] tracking-widest font-bold font-condensed text-gray-500",
  orange:     "text-orange-500",
  muted:      "text-gray-400",
  dim:        "text-gray-600",
} as const;
