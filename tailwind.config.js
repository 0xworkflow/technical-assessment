/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fbf6f1",
          100: "#f3e6da",
          200: "#e4c7ae",
          300: "#d2a483",
          400: "#c48960",
          500: "#c4784a",
          600: "#a86238",
          700: "#8d4e2a",
          800: "#6d3c22",
          900: "#4a2918",
        },
        surface: {
          50: "#f7f5f2",
          100: "#efeae4",
          900: "#171614",
          950: "#0c0c0b",
        },
      },
      fontFamily: {
        body: ["Manrope", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        accent: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem",
        pill: "999px",
        hero: "2rem",
      },
      boxShadow: {
        card: "0 24px 50px rgba(28, 25, 23, 0.12)",
        soft: "0 10px 30px rgba(28, 25, 23, 0.06)",
      },
      spacing: {
        nav: "5.5rem",
        pagex: "1.25rem",
        pagexl: "2.5rem",
      },
      keyframes: {
        "route-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "route-in": "route-in 480ms cubic-bezier(0.22, 1, 0.36, 1)",
        rise: "rise 560ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
