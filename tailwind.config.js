/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**"],
  theme: {
    extend: {
      borderRadius: {
        custom1: "16px 16px 2px 16px",
        custom2: "16px 16px 16px 2px",
      },
    },
  },
  plugins: [],
};
