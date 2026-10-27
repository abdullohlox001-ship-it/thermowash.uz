import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: { sm: "480px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" },
    extend: {
      colors: {
        ink: {
          950: "#08101C",
          900: "#0E1726",
          800: "#16223A",
          700: "#22314D",
          600: "#3A4A66",
          400: "#8593AA",
          300: "#B3BDCC",
        },
        paper: "#F3F5F8",
        line: "#DDE3EB",
        flame: {
          50: "#FFF2EA",
          100: "#FFE0CC",
          400: "#FF8A45",
          500: "#FF6A13",
          600: "#E5570A",
          700: "#B8430A",
        },
        ok: "#1F9D6B",
      },
      fontFamily: {
        sans: ["'Onest Variable'", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      maxWidth: { site: "1240px" },
      borderRadius: { DEFAULT: "6px", md: "8px", lg: "10px" },
    },
  },
  plugins: [],
};
export default config;
