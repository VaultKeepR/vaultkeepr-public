import { describe, it, expect } from "vitest";
import { scrubEventValue, createBeforeSend } from "./index";

describe("scrubEventValue", () => {
  it("passes through null/undefined and primitives", () => {
    expect(scrubEventValue(null)).toBeNull();
    expect(scrubEventValue(undefined)).toBeUndefined();
    expect(scrubEventValue(42)).toBe(42);
    expect(scrubEventValue(true)).toBe(true);
  });

  it("passes through safe strings", () => {
    expect(scrubEventValue("network timeout")).toBe("network timeout");
    expect(scrubEventValue("swap failed: slippage")).toBe(
      "swap failed: slippage"
    );
  });

  it("redacts tx hashes", () => {
    const tx = "0x" + "a".repeat(64);
    expect(scrubEventValue(tx)).toBe("[REDACTED]");
  });

  it("redacts Ethereum addresses", () => {
    expect(
      scrubEventValue("0x1234567890abcdef1234567890abcdef12345678")
    ).toBe("[REDACTED]");
  });

  it("redacts Bitcoin base58 addresses", () => {
    expect(scrubEventValue("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")).toBe(
      "[REDACTED]"
    );
  });

  it("redacts IPFS CIDv0", () => {
    expect(
      scrubEventValue("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")
    ).toBe("[REDACTED]");
  });

  it("redacts base32 CIDv1", () => {
    expect(
      scrubEventValue("b" + "a".repeat(58))
    ).toBe("[REDACTED]");
  });

  it("redacts long base64 blobs", () => {
    expect(scrubEventValue("a".repeat(40))).toBe("[REDACTED]");
    expect(scrubEventValue("a".repeat(39))).toBe("a".repeat(39));
  });

  it("redacts sensitive keys case-insensitively", () => {
    expect(scrubEventValue({ Mnemonic: "word word word" })).toEqual({
      Mnemonic: "[REDACTED]"
    });
    expect(scrubEventValue({ privateKey: "0xabc" })).toEqual({
      privateKey: "[REDACTED]"
    });
    expect(scrubEventValue({ PRIVATEKEY: "0xabc" })).toEqual({
      PRIVATEKEY: "[REDACTED]"
    });
  });

  it("scrubs nested objects and arrays", () => {
    const input = {
      meta: {
        password: "hunter2",
        tags: ["safe", "0x" + "b".repeat(64)]
      }
    };
    expect(scrubEventValue(input)).toEqual({
      meta: { password: "[REDACTED]", tags: ["safe", "[REDACTED]"] }
    });
  });
});

describe("createBeforeSend", () => {
  const beforeSend = createBeforeSend();

  it("redacts sensitive extra keys", () => {
    const event = { extra: { mnemonic: "a b c", safe: "value" } };
    const result = beforeSend(event);
    expect(result.extra.mnemonic).toBe("[REDACTED]");
    expect(result.extra.safe).toBe("value");
  });

  it("honors extraStripKeys option", () => {
    const custom = createBeforeSend({ extraStripKeys: ["CustomSecret"] });
    const result = custom({ extra: { customsecret: "leak" } });
    expect(result.extra.customsecret).toBe("[REDACTED]");
  });

  it("scrubs sensitive tag values", () => {
    const result = beforeSend({
      tags: { token: "abc", addr: "0x1234567890abcdef1234567890abcdef12345678" }
    });
    expect(result.tags.token).toBe("[REDACTED]");
    expect(result.tags.addr).toBe("[REDACTED]");
  });

  it("redacts request data, query string, and cookies", () => {
    const result = beforeSend({
      request: {
        data: { foo: "bar" },
        query_string: "key=secret",
        cookies: "sid=123"
      }
    });
    expect(result.request.data).toBe("[REDACTED]");
    expect(result.request.query_string).toBe("[REDACTED]");
    expect(result.request.cookies).toBe("[REDACTED]");
  });

  it("redacts sensitive headers, keeps safe ones", () => {
    const result = beforeSend({
      request: {
        headers: {
          Authorization: "Bearer x",
          Cookie: "sid=1",
          "X-API-Key": "k",
          "Content-Type": "application/json"
        }
      }
    });
    expect(result.request.headers.Authorization).toBe("[REDACTED]");
    expect(result.request.headers.Cookie).toBe("[REDACTED]");
    expect(result.request.headers["X-API-Key"]).toBe("[REDACTED]");
    expect(result.request.headers["Content-Type"]).toBe("application/json");
  });

  it("strips user id and ip_address", () => {
    const result = beforeSend({
      user: { id: "u1", ip_address: "1.2.3.4", username: "bob" }
    });
    expect(result.user.id).toBeUndefined();
    expect(result.user.ip_address).toBeUndefined();
  });

  it("returns the event when fields are absent", () => {
    const event = { message: "boom" };
    expect(beforeSend(event)).toBe(event);
  });
});
