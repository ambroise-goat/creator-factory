/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eeeffe",
          100: "#d5d7fb",
          200: "#b3b6f7",
          300: "#9095f3",
          400: "#7177ee",
          500: "#5155E8",
          600: "#464ae0",
          700: "#383dc8",
          800: "#2a2fa8",
          900: "#1c2080",
        },
        surface: "#F7F6F2",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
