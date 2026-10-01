import { describe, it, expect } from "vitest";
import { encryptBeneficiaryMeta, decryptBeneficiaryMeta } from "./beneficiaryMeta";

describe("beneficiary meta encryption", () => {
  const entries = [
    { label: "Alice", email: "alice@example.com", status: "confirmed" as const },
    { label: "Bob", address: "0x1234567890abcdef", status: "pending" as const }
  ];

  it("roundtrips through encrypt/decrypt", () => {
    const enc = encryptBeneficiaryMeta("correct horse battery staple", entries);
    expect(enc.v).toBe(1);
    expect(enc.ciphertext.length).toBeGreaterThan(0);
    expect(enc.nonce.length).toBeGreaterThan(0);
    const dec = decryptBeneficiaryMeta("correct horse battery staple", enc);
    expect(dec).toEqual(entries);
  });

  it("fails to decrypt with a wrong password", () => {
    const enc = encryptBeneficiaryMeta("right-password", entries);
    expect(() => decryptBeneficiaryMeta("wrong-password", enc)).toThrow();
  });

  it("uses a fresh nonce and ciphertext per call", () => {
    const a = encryptBeneficiaryMeta("pw", entries);
    const b = encryptBeneficiaryMeta("pw", entries);
    expect(a.nonce).not.toBe(b.nonce);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });
});

describe("syncBeneficiariesToIpfs (fetch mocked, no network)", () => {
  const entries = [{ label: "Alice", email: "a@x.tld", status: "confirmed" as const }];

  async function runSync(authOptions?: Record<string, unknown>) {
    const { vi } = await import("vitest");
    const fn = vi.fn(async () => ({
      ok: true,
      json: async () => ({ cid: "bafy-test-cid" })
    }));
    vi.stubGlobal("fetch", fn);
    try {
      const { syncBeneficiariesToIpfs } = await import("./beneficiaryMeta");
      const cid = await syncBeneficiariesToIpfs("0xOwner", "pw", entries, authOptions as never);
      return { cid, calls: fn.mock.calls as unknown[][] };
    } finally {
      vi.unstubAllGlobals();
    }
  }

  it("stores the CID with delegation auth fields", async () => {
    const { cid, calls } = await runSync({
      delegationSignature: "sig1",
      sessionId: "s1",
      expiryTimestamp: 42
    });
    expect(cid).toBe("bafy-test-cid");
    const body = JSON.parse(String((calls[1] as [{ body: string }])[1].body));
    expect(body).toMatchObject({ delegationSignature: "sig1", sessionId: "s1", expiryTimestamp: 42 });
  });

  it("falls back to signature/message auth fields", async () => {
    const { cid, calls } = await runSync({ signature: "sig2", message: "msg" });
    expect(cid).toBe("bafy-test-cid");
    const body = JSON.parse(String((calls[1] as [{ body: string }])[1].body));
    expect(body).toMatchObject({ signature: "sig2", message: "msg" });
  });

  it("refuses to upload without auth options (returns null)", async () => {
    const { cid } = await runSync();
    expect(cid).toBeNull();
  });

  it("returns null when the CID store fails", async () => {
    const { vi } = await import("vitest");
    let call = 0;
    const fn = vi.fn(async () => {
      call += 1;
      return call === 1
        ? { ok: true, json: async () => ({ cid: "bafy-test-cid" }) }
        : { ok: false, json: async () => ({}) };
    });
    vi.stubGlobal("fetch", fn);
    try {
      const { syncBeneficiariesToIpfs } = await import("./beneficiaryMeta");
      const cid = await syncBeneficiariesToIpfs("0xOwner", "pw", entries, {
        signature: "sig3",
        message: "msg"
      } as never);
      expect(cid).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("returns null when the upload fails", async () => {
    const { vi } = await import("vitest");
    const fn = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    vi.stubGlobal("fetch", fn);
    try {
      const { syncBeneficiariesToIpfs } = await import("./beneficiaryMeta");
      const cid = await syncBeneficiariesToIpfs("0xOwner", "pw", entries);
      expect(cid).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
