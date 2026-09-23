/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F6F3",
        ink: "#1A1D1E",
        pine: "#2B4C3F",
        rust: "#8B3A2B",
        slate: "#5C6570",
        gold: "#C9A24B",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};
