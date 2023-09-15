/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        unesa: "#0B4D70",
        backdrop: "rgba(0, 0, 0, 0.6)",
      },
      boxShadow: {
        "modal-shadow": "0px 4px 14px 9px rgba(0, 0, 0, 0.55)",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
      },
      animation: {
        drop: "drop 0.5s linear",
      },
      keyframes: {
        drop: {
          "0%": { transform: "translateY(-11rem)" },
          "100%": { transform: "translateY(0rem)" },
        },
      },
    },
  },
  plugins: [],
};
