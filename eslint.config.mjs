import { FlatCompat } from "@eslint/eslintrc";
import path from "path";

// Initialize FlatCompat with your base directory
const compat = new FlatCompat({
  baseDirectory: path.resolve(),
});

// Use compat.config to set up ESLint configuration
const eslintConfig = [
  ...compat.config({
    extends: [
      "next", // Use the Next.js ESLint configuration
      "next/core-web-vitals", // Consider using this if you need Web Vitals too
    ],
    parserOptions: {
      // Ensure no function values are used for parsing
      // This will prevent the "parse" issue
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
    },
  }),
];

export default eslintConfig;
