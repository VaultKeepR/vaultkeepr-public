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

  it("falls back across the proxy env chain", () => {
    const saved = {
      p: process.env.PIMLICO_PROXY_URL,
      n: process.env.NEXT_PUBLIC_PIMLICO_PROXY_URL,
      e: process.env.EXPO_PUBLIC_PIMLICO_PROXY_URL
    };
    try {
      delete process.env.PIMLICO_PROXY_URL;
      process.env.NEXT_PUBLIC_PIMLICO_PROXY_URL = "https://np.test";
      delete process.env.EXPO_PUBLIC_PIMLICO_PROXY_URL;
      expect(getPimlicoUrl()).toBe("https://np.test");
      expect(isSmartAccountConfigured()).toBe(true);

      delete process.env.NEXT_PUBLIC_PIMLICO_PROXY_URL;
      process.env.EXPO_PUBLIC_PIMLICO_PROXY_URL = "https://expo.test";
      expect(getPimlicoUrl()).toBe("https://expo.test");

      delete process.env.EXPO_PUBLIC_PIMLICO_PROXY_URL;
      expect(isSmartAccountConfigured()).toBe(false);
      expect(() => getPimlicoUrl()).toThrow(/Aucun proxy/i);
    } finally {
      const restore = (k: string, v: string | undefined) => {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      };
      restore("PIMLICO_PROXY_URL", saved.p);
      restore("NEXT_PUBLIC_PIMLICO_PROXY_URL", saved.n);
      restore("EXPO_PUBLIC_PIMLICO_PROXY_URL", saved.e);
    }
  });

  it("falls back across the API key env chain", () => {
    const saved = {
      p: process.env.PIMLICO_API_KEY,
      n: process.env.NEXT_PUBLIC_PIMLICO_API_KEY
    };
    try {
      delete process.env.PIMLICO_API_KEY;
      process.env.NEXT_PUBLIC_PIMLICO_API_KEY = "np-key";
      expect(getPimlicoApiKey()).toBe("np-key");
      process.env.PIMLICO_API_KEY = "main-key";
      expect(getPimlicoApiKey()).toBe("main-key");
      delete process.env.PIMLICO_API_KEY;
      delete process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
      expect(getPimlicoApiKey()).toBe("");
    } finally {
      const restore = (k: string, v: string | undefined) => {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      };
      restore("PIMLICO_API_KEY", saved.p);
      restore("NEXT_PUBLIC_PIMLICO_API_KEY", saved.n);
    }
  });
});
