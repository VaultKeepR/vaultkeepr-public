import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 60000,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "lcov"],
      // Exclude build artifacts: once package exports point at dist/, vitest
      // counts the bundled dist/index.js in the denominator, collapsing the
      // ratio. Coverage belongs to the source the tests execute.
      exclude: ["dist/**"],
    },
  },
});
