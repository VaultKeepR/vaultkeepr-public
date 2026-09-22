import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "lcov"],
      // Exclude build artifacts: once package exports point at dist/, vitest
      // counts the bundled dist/index.js in the denominator (measured 2026-09-15:
      // 6026 statements incl. dist vs 3020 src-only), collapsing the ratio.
      // Coverage belongs to the source, which is what the tests execute.
      exclude: ["dist/**"],
      thresholds: {
        statements: 80
      }
    }
  }
});
