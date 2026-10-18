import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";

const duplicateDomainRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      duplicate: "The domain '{{domain}}' has already been used in domains.execute().",
    },
  },

  create(context) {
    const domainsInFile = new Set();

    return {
      CallExpression(node) {
        const callee = node.callee;

        if (
          callee.type !== "MemberExpression" ||
          callee.object.name !== "domains" ||
          callee.property.name !== "execute"
        ) {
          return;
        }

        const firstArgument = node.arguments[0];

        if (
          !firstArgument ||
          firstArgument.type !== "Literal" ||
          typeof firstArgument.value !== "string"
        ) {
          return;
        }

        const domain = firstArgument.value;

        if (domainsInFile.has(domain)) {
          context.report({
            node: firstArgument,
            messageId: "duplicate",
            data: { domain },
          });
        } else {
          domainsInFile.add(domain);
        }
      },
    };
  },
};

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
      "@stylistic": stylistic,
      local: {
        rules: {
          "duplicate-domain": duplicateDomainRule,
        },
      },
    },
    languageOptions: { globals: globals.greasemonkey },
    rules: {
      "unicorn/empty-brace-spaces": "off",
      "unicorn/no-this-outside-of-class": "off",
      "unicorn/name-replacements": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/prefer-await": "off",
      "unicorn/prefer-add-event-listener": "off",
      'unicorn/prefer-at': "off",

      "sonarjs/pseudo-random": "off",
      "sonarjs/super-linear-regex": "off",

      "local/duplicate-domain": "warn",

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
