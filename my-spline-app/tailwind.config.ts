import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) skewX(-18deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) skewX(-18deg)",
          },
        },
      },
    },
  },
  plugins: [],
}

export default config