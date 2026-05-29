// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF9",
          100: "#F5EFEB",
          200: "#EDE3DC",
        },
        forest: {
          DEFAULT: "#0D4429",
          light: "#155E38",
          dark: "#082D1B",
          50: "#E8F4EE",
          100: "#C5E1CE",
          200: "#8DC4A5",
        },
        terracotta: {
          DEFAULT: "#C2410C",
          light: "#EA580C",
          dark: "#9A3412",
        },
        gold: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
          dark: "#B45309",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "zoe-think": "zoeThink 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        zoeThink: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.85" },
        },
      },
      backgroundImage: {
        "cream-gradient": "linear-gradient(135deg, #FFFDF9 0%, #F5EFEB 50%, #EDE3DC 100%)",
        "forest-gradient": "linear-gradient(135deg, #0D4429 0%, #155E38 100%)",
      },
      boxShadow: {
        "card": "0 2px 20px rgba(13, 68, 41, 0.08), 0 1px 4px rgba(13, 68, 41, 0.04)",
        "card-hover": "0 8px 40px rgba(13, 68, 41, 0.16), 0 2px 8px rgba(13, 68, 41, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;