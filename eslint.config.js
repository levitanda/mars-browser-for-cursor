export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    rules: {
      "no-console": "off"
    }
  }
];
