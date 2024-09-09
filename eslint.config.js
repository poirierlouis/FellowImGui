// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // It must be error forever
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "fig",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "fig",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/consistent-generic-constructors": [
        "error",
        "type-annotation"
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["overrideMethods"]
        }
      ],

      // It should be migrated to error
      "@angular-eslint/no-input-rename": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // It might be off forever
      "@angular-eslint/no-output-rename": "off",
      "@typescript-eslint/no-inferrable-types": "off"
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // It should be migrated to error
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/click-events-have-key-events": "warn",
    },
  }
);
