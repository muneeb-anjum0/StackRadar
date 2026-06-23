import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: "rgba(255,255,255,0.9)",
        line: "rgba(15,23,42,0.08)",
        accent: "#475569"
      },
      boxShadow: {
        glow: "0 18px 45px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
