import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10141a",
        parchment: "#f7f3ea",
        cream: "#fffdf8",
        ember: "#e4572e",
        moss: "#3b7d5b",
        gold: "#d59b39",
        slate: "#64748b"
      },
      boxShadow: {
        card: "0 2px 0 rgba(16,20,26,.07), 0 8px 28px rgba(16,20,26,.06)",
        lift: "0 8px 0 rgba(16,20,26,.06), 0 15px 35px rgba(16,20,26,.11)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-space)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
