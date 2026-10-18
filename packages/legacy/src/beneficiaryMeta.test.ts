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

  it("asks for a proof per request: the upload and the store each get their own", async () => {
    const { vi } = await import("vitest");
    const proofFor = vi.fn(async (action: string) => ({ signature: `sig-${action}`, message: `msg-${action}` }));
    const { cid, calls } = await runSync({ proofFor });
    expect(cid).toBe("bafy-test-cid");
    expect(proofFor.mock.calls.map((c) => c[0])).toEqual(["upload", "legacy-beneficiaries"]);
    const uploadBody = JSON.parse(String((calls[0] as [string, { body: string }])[1].body));
    const storeBody = JSON.parse(String((calls[1] as [string, { body: string }])[1].body));
    expect(uploadBody).toMatchObject({ signature: "sig-upload", message: "msg-upload" });
    expect(storeBody).toMatchObject({
      walletAddress: "0xowner",
      signature: "sig-legacy-beneficiaries",
      message: "msg-legacy-beneficiaries"
    });
  });

  it("returns null when no proof is given for the store", async () => {
    const { vi } = await import("vitest");
    const proofFor = vi.fn(async (action: string) => (action === "upload" ? { signature: "sig2", message: "msg" } : null));
    const { cid } = await runSync({ proofFor });
    expect(cid).toBeNull();
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
        proofFor: async () => ({ signature: "sig3", message: "msg" })
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
