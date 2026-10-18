import { describe, it, expect } from "vitest";
import { getDeviceLimitForTier } from "./index";

describe("getDeviceLimitForTier", () => {
  it("applique 3 / 5 / 10 par palier, Ultimate compris", () => {
    expect(getDeviceLimitForTier("premium")).toBe(3);
    expect(getDeviceLimitForTier("cloud_pro")).toBe(5);
    expect(getDeviceLimitForTier("pro")).toBe(5);
    expect(getDeviceLimitForTier("ultimate")).toBe(10);
  });

  it("retombe sur Premium si le palier est inconnu", () => {
    expect(getDeviceLimitForTier(undefined)).toBe(3);
  });
});
