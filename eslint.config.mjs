import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";

export default defineConfig([
  js.configs.recommended,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.greasemonkey } }
  },
  {
    files: ["**/*.js"],
    plugins: {
      "@stylistic": stylistic
    },
    languageOptions: { globals: globals.greasemonkey },
    rules: {
      "unicorn/empty-brace-spaces": "off",
      "unicorn/no-this-outside-of-class": "off",
      "unicorn/name-replacements": "off",

      "@stylistic/semi": ["warn", "always"],
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/quotes": ["warn", "double", { allowTemplateLiterals: "always" }],
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
