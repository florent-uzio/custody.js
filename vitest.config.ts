import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // Test configuration
    globals: false,
    environment: "node",

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      reportsDirectory: "./coverage",

      // Files to include in coverage
      include: ["src/**/*.ts"],

      // Files to exclude from coverage
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.types.ts",
        "src/**/index.ts",
        "src/main.ts",
        "src/main.helpers.ts",
        "src/models/custody-types.ts", // Auto-generated from OpenAPI
      ],

      // Coverage thresholds (optional - uncomment to enforce)
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80,
      // },
    },
  },
})
