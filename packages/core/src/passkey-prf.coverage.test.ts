// Coverage-round: the PRF enrollment/derivation flows (navigator + location
// mocked — exercises toBase64Url/fromBase64Url incl. the linear '=' trim).
import { describe, it, expect, vi, afterEach } from "vitest";
import { enrollPasskeyForPrf, deriveKeyFromPasskeyPrf, isWebAuthnSupported } from "./passkey";

const CREATED = (rawId: number[], prf: unknown, transports: string[]) => ({
  rawId: new Uint8Array(rawId).buffer,
  getClientExtensionResults: () => prf,
  response: { getTransports: () => transports }
});

function stubWebAuthn(navigatorObj: Record<string, unknown>) {
  vi.stubGlobal("window", {});
  vi.stubGlobal("PublicKeyCredential", class PublicKeyCredential {});
  vi.stubGlobal("navigator", navigatorObj);
}

describe("passkey PRF flows (navigator mocked)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("enrolls a platform passkey and trims the base64url padding", async () => {
    vi.stubGlobal("location", { hostname: "app.vaultkeepr.xyz" });
    stubWebAuthn({
      credentials: {
        create: vi.fn(async () =>
          CREATED([1], { prf: { enabled: true, results: { first: new Uint8Array(32).buffer } } }, ["internal"])
        )
      }
    });
    expect(isWebAuthnSupported()).toBe(true);
    const res = await enrollPasskeyForPrf("user-1", "User One");
    expect(res).not.toBeNull();
    expect(res!.credentialId).toBe("AQ");
    expect(res!.authenticatorType).toBe("platform");
    expect(res!.prfSalt).toMatch(/^[0-9a-f]{64}$/);
  });

  it("marks non-internal transports as cross-platform", async () => {
    vi.stubGlobal("location", { hostname: "app.vaultkeepr.xyz" });
    stubWebAuthn({
      credentials: {
        create: vi.fn(async () =>
          CREATED([2, 3], { prf: { enabled: true, results: { first: new Uint8Array(4).buffer } } }, ["usb"])
        )
      }
    });
    const res = await enrollPasskeyForPrf("u", "U");
    expect(res!.credentialId).toBe("AgM");
    expect(res!.authenticatorType).toBe("cross-platform");
  });

  it("returns null when the authenticator has no PRF support", async () => {
    vi.stubGlobal("location", { hostname: "app.vaultkeepr.xyz" });
    stubWebAuthn({
      credentials: { create: vi.fn(async () => CREATED([2], {}, [])) }
    });
    expect(await enrollPasskeyForPrf("u", "U")).toBeNull();
  });

  it("derives the PRF key from a stored credential id", async () => {
    stubWebAuthn({
      credentials: {
        get: vi.fn(async () => ({
          getClientExtensionResults: () => ({ prf: { results: { first: new Uint8Array(32).buffer } } })
        }))
      }
    });
    const key = await deriveKeyFromPasskeyPrf("AQ", "00".repeat(32));
    expect(key).toBeInstanceOf(Uint8Array);
    expect(key!.length).toBeGreaterThan(0);
  });

  it("returns null when the assertion carries no PRF result", async () => {
    stubWebAuthn({
      credentials: { get: vi.fn(async () => ({ getClientExtensionResults: () => ({}) })) }
    });
    expect(await deriveKeyFromPasskeyPrf("AQ", "00".repeat(32))).toBeNull();
  });

  it("returns null without WebAuthn support", async () => {
    vi.stubGlobal("navigator", {});
    expect(isWebAuthnSupported()).toBe(false);
    expect(await enrollPasskeyForPrf("u", "U")).toBeNull();
    expect(await deriveKeyFromPasskeyPrf("AQ", "00".repeat(32))).toBeNull();
  });
});
