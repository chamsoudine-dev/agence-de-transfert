/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ricardo: {
          blue: "#0F2C6B",
          blueLight: "#1E4FD1",
          red: "#E1332C",
          redDark: "#B9241F",
          cream: "#F7F8FC",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(15,44,107,0.25)",
      },
    },
  },
  plugins: [],
};
