import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.js"],
    // Adicionado o plugin de estilo aqui
    plugins: {
      "@stylistic": stylistic
    },
    languageOptions: { globals: globals.greasemonkey },
    rules: {
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/quotes": ["warn", "double", { allowTemplateLiterals: true }],
      "@stylistic/no-extra-parens": ["warn", "all"],
      "@stylistic/spaced-comment": ["warn", "always"],
      "@stylistic/arrow-spacing": ["warn", { "before": true, "after": true }],

      "no-template-curly-in-string": "warn",
      "prefer-destructuring": ["warn", { object: true, array: false }],
      "prefer-const": ["warn", { destructuring: "all" }],
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],

      // "eqeqeq": ["error", "always"],
      "no-eval": "error",
      "no-alert": "warn",
      "no-shadow": "warn",
      "no-lonely-if": "warn",
      "object-shorthand": ["warn", "always"],
      "no-async-promise-executor": "error",
      "no-return-await": "warn",
      "no-self-compare": "error",
      "no-unmodified-loop-condition": "warn",
      // "no-use-before-define": ["error", { "functions": false }]
    },
  },
]);
