// Coverage-round: the env-probing catch fallbacks of config.ts (never hit on
// normal runtimes where process.env exists) and the configured path.
import { describe, it, expect } from "vitest";
import { getPimlicoApiKey, getPimlicoUrl, isSmartAccountConfigured } from "./config";

describe("smart-account config env fallbacks", () => {
  it("degrades gracefully when process.env is unavailable", () => {
    const desc = Object.getOwnPropertyDescriptor(process, "env");
    Object.defineProperty(process, "env", {
      configurable: true,
      get() {
        throw new Error("env unavailable");
      }
    });
    try {
      expect(getPimlicoApiKey()).toBe("");
      expect(() => getPimlicoUrl()).toThrow(/Aucun proxy/i);
      expect(isSmartAccountConfigured()).toBe(false);
    } finally {
      Object.defineProperty(process, "env", desc!);
    }
  });

  it("sees a configured proxy URL from the environment", () => {
    const prev = process.env.PIMLICO_PROXY_URL;
    process.env.PIMLICO_PROXY_URL = "https://proxy.test";
    try {
      expect(isSmartAccountConfigured()).toBe(true);
      expect(getPimlicoUrl()).toBe("https://proxy.test");
    } finally {
      if (prev === undefined) delete process.env.PIMLICO_PROXY_URL;
      else process.env.PIMLICO_PROXY_URL = prev;
    }
  });
});
