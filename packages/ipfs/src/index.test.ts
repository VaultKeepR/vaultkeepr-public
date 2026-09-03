import { describe, it, expect } from "vitest";
import {
  isIpfsCid,
  normalizeVaultLocation,
  normalizeCid,
  setIpfsGateways } from
"./index";

describe("IPFS — isIpfsCid", () => {
  it("returns true for Qm-prefixed CIDs (CIDv0)", () => {
    expect(isIpfsCid("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")).toBe(true);
  });

  it("returns true for bafy-prefixed CIDs (CIDv1)", () => {
    expect(isIpfsCid("bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi")).toBe(true);
  });

  it("returns true for ba-prefixed CIDs", () => {
    expect(isIpfsCid("baexample123")).toBe(true);
  });

  it("returns false for non-CID IDs", () => {
    expect(isIpfsCid("abc123def456")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isIpfsCid("")).toBe(false);
  });
});

describe("IPFS — normalizeVaultLocation", () => {
  it("trims whitespace", () => {
    expect(normalizeVaultLocation("  abc  ")).toBe("abc");
  });

  it("throws on empty string", () => {
    expect(() => normalizeVaultLocation("")).toThrow();
  });

  it("throws on whitespace-only string", () => {
    expect(() => normalizeVaultLocation("   ")).toThrow();
  });

  it("passes through valid IDs", () => {
    expect(normalizeVaultLocation("QmTest123")).toBe("QmTest123");
  });
});

describe("IPFS — normalizeCid", () => {
  it("delegates to normalizeVaultLocation", () => {
    expect(normalizeCid("  test  ")).toBe("test");
  });
});

describe("IPFS — setIpfsGateways", () => {
  it("does not throw with empty array", () => {
    expect(() => setIpfsGateways([])).not.toThrow();
  });

  it("does not throw with valid gateways", () => {
    expect(() => setIpfsGateways(["https://my-gateway.com/ipfs"])).not.toThrow();
  });
});