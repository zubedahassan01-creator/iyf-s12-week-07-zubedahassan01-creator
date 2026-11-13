import globals from "globals";
import js from "@eslint/js";

export default [
    {
        ignores: ["node_modules/**", "dist/**"]
    },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            eqeqeq: ["error", "always"],
            "prefer-const": "error"
        }
    }
];
