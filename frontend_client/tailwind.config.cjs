/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.35), 0 10px 30px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};
