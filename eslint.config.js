
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "off", // Turn off react-refresh warnings
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off", // Turn off the any errors
      "@typescript-eslint/no-empty-interface": "off", // Turn off empty interface errors
      "@typescript-eslint/no-empty-object-type": "off", // Turn off empty object type errors
      "no-case-declarations": "off", // Allow lexical declarations in case blocks
      "react-hooks/exhaustive-deps": "warn", // Change to warning instead of error
      "@typescript-eslint/no-duplicate-enum-values": "off", // Turn off duplicate enum values errors
      "@typescript-eslint/no-require-imports": "off", // Turn off require imports errors
      "prefer-const": "warn", // Change to warning instead of error
    },
  }
);
