import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  ...nextVitals,
  {
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["src/components/games/**/*.jsx"],
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
