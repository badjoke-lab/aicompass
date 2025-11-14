/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050509",
        surface: "#0f1015",
        accent: "#3b82f6",
        accentSoft: "#1d283a",
        positive: "#22c55e",
        negative: "#ef4444"
      }
    }
  },
  plugins: []
};
