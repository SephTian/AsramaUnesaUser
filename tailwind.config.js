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
        "loading-screen": "spin 2s ease-in-out infinite",
        "loading-btn": "spin 1.5s ease-in-out infinite",
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
