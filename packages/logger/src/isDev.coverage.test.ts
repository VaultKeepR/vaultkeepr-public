// Coverage-round: the module-level environment detection runs at import.
import { describe, it, expect } from "vitest";
import { isDev } from "./index";

describe("logger environment detection", () => {
  it("exposes a boolean isDev flag", () => {
    expect(typeof isDev).toBe("boolean");
  });
});
