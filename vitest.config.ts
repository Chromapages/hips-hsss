import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        functions: 70,
        branches: 70,
        lines: 80,
        statements: 80,
      },
    },
  },
})