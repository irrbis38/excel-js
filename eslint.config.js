import googleConfig from "eslint-config-google";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
      },
    },
    rules: {
      ...googleConfig.rules,
      "valid-jsdoc": "off", // Полностью выключаем
      "require-jsdoc": "off",
      "quotes": ["error", "double"],
    },
  },
];
