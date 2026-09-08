import { describe, it, expect } from "vitest";
import { suggestBip39Words } from "./bip39";

describe("suggestBip39Words", () => {
  it("returns empty for empty prefix", () => {
    expect(suggestBip39Words("")).toEqual([]);
  });

  it("returns empty for whitespace-only prefix", () => {
    expect(suggestBip39Words("   ")).toEqual([]);
  });

  it("matches prefixes case-insensitively with trimming", () => {
    expect(suggestBip39Words("  ZE ")).toEqual(["zebra", "zero"]);
    expect(suggestBip39Words("Ze")).toEqual(["zebra", "zero"]);
    expect(suggestBip39Words("zo")).toEqual(["zone", "zoo"]);
  });

  it("respects the limit", () => {
    expect(suggestBip39Words("ab", 2)).toEqual(["abandon", "ability"]);
    expect(suggestBip39Words("ab")).toEqual([
      "abandon",
      "ability",
      "able",
      "about",
      "above"
    ]);
  });

  it("returns fewer results when the prefix is nearly exhaustive", () => {
    expect(suggestBip39Words("zebr")).toEqual(["zebra"]);
    expect(suggestBip39Words("zone")).toEqual(["zone"]);
  });

  it("returns empty for prefixes no word starts with", () => {
    expect(suggestBip39Words("zzz")).toEqual([]);
  });
});
