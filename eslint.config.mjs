import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      next: {
        rootDir: "apps/web/",
      },
    },
  },
  {
    files: ["apps/web/src/app/api/**/*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "BinaryExpression[left.property.name='role']",
          message: "Server role checks must use requireRole() and the canonical permissions policy.",
        },
        {
          selector: "BinaryExpression[right.property.name='role']",
          message: "Server role checks must use requireRole() and the canonical permissions policy.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "**/.next/**",
    "out/**",
    "**/out/**",
    "build/**",
    "**/build/**",
    "next-env.d.ts",
    "**/next-env.d.ts",
    "node_modules/**",
    "**/node_modules/**",
  ]),
]);

export default eslintConfig;
