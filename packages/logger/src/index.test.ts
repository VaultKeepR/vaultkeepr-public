import { describe, it, expect } from "vitest";
import { redactCid, redactAddress, redact, redactString, isDev, logger } from "./index";

describe("redactCid", () => {
  it("returns <none> for null/undefined", () => {
    expect(redactCid(null)).toBe("<none>");
    expect(redactCid(undefined)).toBe("<none>");
  });
  it("redacts long CIDs", () => {
    const cid = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    expect(redactCid(cid)).toBe("QmYwAP…PbdG");
  });
  it("fully redacts short CIDs", () => {
    expect(redactCid("short")).toBe("<cid:redacted>");
  });
});

describe("redactAddress", () => {
  it("returns <none> for null/undefined", () => {
    expect(redactAddress(null)).toBe("<none>");
    expect(redactAddress(undefined)).toBe("<none>");
  });
  it("redacts Ethereum addresses", () => {
    expect(redactAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "***5678"
    );
  });
});

describe("redactString", () => {
  it("redacts Ethereum addresses in text", () => {
    expect(redactString("from 0x1234567890abcdef1234567890abcdef12345678 to 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")).toContain("***5678");
  });
  it("redacts tx hashes", () => {
    expect(redactString("tx 0x" + "a".repeat(64))).toContain("0x…aaaaaa");
  });
  it("redacts long base64 blobs", () => {
    const blob = "A".repeat(300);
    expect(redactString(`payload=${blob}`)).toContain("<base64:redacted>");
  });
  it("does not crash on empty string", () => {
    expect(redactString("")).toBe("");
  });
});

describe("redact", () => {
  it("redacts addresses in nested objects", () => {
    const input = { wallet: { address: "0x1234567890abcdef1234567890abcdef12345678" } };
    const out = redact(input) as {wallet: {address: string;};};
    expect(out.wallet.address).toBe("***5678");
  });
  it("respects maxDepth", () => {
    const input = { a: { b: { c: { d: "0x1234567890abcdef1234567890abcdef12345678" } } } };
    const out = redact(input, 1) as {a: {b: {c: {d: string;};};};};
    expect(out.a.b.c.d).toBe("0x1234567890abcdef1234567890abcdef12345678");
  });
});

describe("logger API", () => {
  it("exposes debug/info/warn/error", () => {
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });
  it("isDev is a boolean", () => {
    expect(typeof isDev).toBe("boolean");
  });
});