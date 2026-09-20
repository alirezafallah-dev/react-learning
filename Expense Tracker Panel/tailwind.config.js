/** @type {import('tailwindcss').Config} */
export default {
  prefix: "tw-",
  important: "#root",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};
