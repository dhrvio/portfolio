/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#4f4a7f",
        secondary: "#7b75b3",
        accent: "#ff6b6b",
        highlight: "#ffd166",
        background: "#131521",
        screen: "#a7c957",
        screenDark: "#2f4f2f",
        cartridge: "#ece1a8",
        ink: "#171923",
        textPrimary: "#f8f4df",
        textLight: "#c8d6a4",
        linkHover: "#8bd450",
      },
      fontFamily: {
        body: [
          "Trebuchet MS",
          "Verdana",
          "system-ui",
          "sans-serif",
        ],
        pixel: [
          "Lucida Console",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        pixel: "0 0 0 2px #171923, 6px 6px 0 #171923",
        screen: "inset 0 0 0 3px #171923, inset 0 0 22px rgba(47,79,47,0.55)",
        raised: "4px 4px 0 #171923",
      },
      borderRadius: {
        gba: "8px",
        pixel: "4px",
      },
    },
  },
};
