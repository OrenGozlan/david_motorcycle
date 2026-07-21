import type { Config } from "tailwindcss";

// Adventure-riding vibe: warm charcoal base, dust/sand neutrals, bold KTM-orange
// accent. One display face (condensed) + Rubik body (covers he / en / ru).
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
        // warm near-black surfaces
        asphalt: {
          950: "#0d0b0a",
          900: "#151210",
          800: "#1f1a17",
          700: "#2a231e",
          600: "#3a312a",
        },
        // dust / sand neutrals
        dust: {
          50: "#f7f3ec",
          100: "#efe8db",
          200: "#ddd0ba",
          300: "#c7b492",
          400: "#b09a72",
          500: "#94805c",
        },
        // trail orange accent
        ember: {
          400: "#ff8a3d",
          500: "#f2681c",
          600: "#d9530f",
          700: "#b3420c",
        },
        // support: olive/khaki for tags
        moss: {
          500: "#6b7040",
          600: "#565a33",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Rubik", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Oswald", "var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "trail-grit":
          "radial-gradient(120% 120% at 50% 0%, rgba(242,104,28,0.10) 0%, rgba(13,11,10,0) 55%)",
      },
      boxShadow: {
        trail: "0 20px 45px -20px rgba(0,0,0,0.75)",
        ember: "0 0 0 1px rgba(242,104,28,0.35), 0 12px 30px -12px rgba(242,104,28,0.45)",
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
