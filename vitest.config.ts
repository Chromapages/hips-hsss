import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.spec.ts"],
    exclude: ["tests/**/*.blueprint.ts"],
    globals: false,
    environment: "node",
    passWithNoTests: false,
  },
});
