import type { Config } from "tailwindcss";

// "Road-trip" vibe: sunny, warm, open road. Cream/sand surfaces, clay-brown
// text, sunset-orange accent, dusty-sky teal secondary.
// NOTE: palette names are kept from the earlier dark theme so components need
// no edits — only the values changed.
//   asphalt = LIGHT surfaces (950 lightest → 600 = border)
//   dust    = TEXT scale     (50 darkest → 500 lightest)
//   ember   = sunset accent · route = sky/teal accent
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./messages/**/*.json"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        asphalt: {
          950: "#fbf6ec", // page background (warm cream)
          900: "#ffffff", // cards / header / footer
          800: "#f2e9d6", // image placeholder tiles
          700: "#eaddc4",
          600: "#dccba6", // borders
        },
        dust: {
          50: "#241b10", // brightest headings (now darkest)
          100: "#352817", // body text
          200: "#4c3b26", // nav / strong body
          300: "#6d5a41", // muted
          400: "#8c7659", // labels
          500: "#ab9a7e", // faint / placeholder
        },
        ember: {
          400: "#ff9d52",
          500: "#f2751c",
          600: "#d95f10",
          700: "#b34a0c",
        },
        route: {
          400: "#5cb4c5",
          500: "#2f8ea0",
          600: "#22707e",
        },
        moss: {
          500: "#7a7f4a",
          600: "#63683a",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Rubik", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Oswald", "var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "trail-grit":
          "radial-gradient(120% 90% at 50% -10%, rgba(242,117,28,0.10) 0%, rgba(47,142,160,0.06) 40%, rgba(251,246,236,0) 70%)",
      },
      boxShadow: {
        trail: "0 18px 40px -24px rgba(70,50,25,0.35)",
        ember: "0 0 0 1px rgba(242,117,28,0.30), 0 14px 34px -14px rgba(242,117,28,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
