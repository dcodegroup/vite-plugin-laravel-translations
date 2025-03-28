import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    rules: {
      semi: 0,
      "max-len": [2, 160, 2],
      "no-console": "warn",
      "no-prototype-builtins": "warn",
      "jsx-a11y/label-has-associated-control": "off",
      "prettier/prettier": ["error"],
      "prefer-promise-reject-errors": "off",
      camelcase: "off",
      "vue/no-v-for-template-key": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-var-requires": "off",
      "prettier.singleAttributePerLine": true,
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },
    ignores: [
      // # Package
      "package.json",

      // # ESLint Config
      "eslint.config.ts",

      // # Git
      ".gitignore",

      // # Node Modules
      "node_modules/*",

      // # Typescript
      "tsconfig.json",
    ],
  },
];
