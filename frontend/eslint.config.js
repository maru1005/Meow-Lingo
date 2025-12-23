import next from "eslint-config-next";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {},
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
  ...next,
];
