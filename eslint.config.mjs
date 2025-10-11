/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import js from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginTailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      ".next",
      "out",
      "build",
      "public/**/*.svg",
      "**/*.generated.*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{ts,tsx,js,jsx}", "*.cjs", "*.mjs"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      "@next/next": pluginNext,
      tailwindcss: pluginTailwind,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginTailwind.configs.recommended.rules,
      ...pluginNext.configs.recommended.rules,
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/enforces-shorthand": ["warn", { severity: "warning" }],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "react-refresh/only-export-components": "off",
    },
  },
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);

