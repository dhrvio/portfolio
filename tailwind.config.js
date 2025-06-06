/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#ffffff", // pure neon-white
      },
      boxShadow: {
        "neon":
          "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.5), 0 0 32px rgba(255, 255, 255, 0.3)",
      },
      animation: {
        "neon-flicker": "neon-flicker 3s infinite alternate",
        "neon-glow": "neon-glow 4s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
