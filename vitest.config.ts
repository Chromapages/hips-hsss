import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.spec.ts", "src/**/*.spec.ts", "apps/**/*.spec.ts", "services/**/*.spec.ts"],
    exclude: [
      "tests/**/*.blueprint.ts",
      "**/node_modules/**/*.spec.ts",
      "**/._*",
      "**/*._*",
    ],
    globals: false,
    environment: "node",
    passWithNoTests: false,
  },
});
