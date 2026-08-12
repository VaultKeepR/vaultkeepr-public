import { describe, it, expect } from "vitest";
import { generateRandomAlias, ALIAS_CHARS } from "./generate";

describe("alias — generateRandomAlias", () => {
  it("generates alias of default length 8", () => {
    const alias = generateRandomAlias();
    expect(alias).toHaveLength(8);
  });

  it("generates alias of custom length", () => {
    expect(generateRandomAlias(12)).toHaveLength(12);
    expect(generateRandomAlias(4)).toHaveLength(4);
    expect(generateRandomAlias(16)).toHaveLength(16);
  });

  it("only uses lowercase alphanumeric characters", () => {
    for (let i = 0; i < 20; i++) {
      const alias = generateRandomAlias(32);
      for (const ch of alias) {
        expect(ALIAS_CHARS).toContain(ch);
      }
    }
  });

  it("generates unique aliases", () => {
    const aliases = new Set<string>();
    for (let i = 0; i < 50; i++) {
      aliases.add(generateRandomAlias(16));
    }

    expect(aliases.size).toBe(50);
  });
});