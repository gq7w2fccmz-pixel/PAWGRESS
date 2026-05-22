/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        condensed: ["'Barlow Condensed'", "sans-serif"],
        body:      ["'Barlow'", "sans-serif"],
      },
      colors: {
        brand: {
          orange:     "#f97316",
          orangeDark: "#c2410c",
          bg:         "#0a0a0a",
          surface:    "#111111",
          card:       "#161616",
          border:     "#2a2a2a",
        },
      },
    },
  },
  plugins: [],
};
