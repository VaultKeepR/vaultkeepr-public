import { afterEach, describe, expect, it, vi } from "vitest";
import { getPremiumStatus, identityProofFromDelegation } from "./index";

const ADDRESS = "0x" + "3b".repeat(20);
const FUTURE_SECONDS = Math.floor(Date.now() / 1000) + 3600;

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetchJson(body: unknown) {
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify(body), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("identity proof for the premium status route", () => {
  it("sends the autosave delegation with the identity and returns the licence key", async () => {
    const fetchMock = stubFetchJson({ premiumUntil: "2099-12-31T23:59:59Z", tier: "ultimate", licenseKey: "KEY-1" });
    const proof = identityProofFromDelegation({
      signature: "0xsig",
      sessionId: "sess-1",
      expiryTimestamp: FUTURE_SECONDS
    });

    const res = await getPremiumStatus("https://app.example.test", ADDRESS, proof);

    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("userId")).toBe(ADDRESS);
    expect(url.searchParams.get("delegationSignature")).toBe("0xsig");
    expect(url.searchParams.get("sessionId")).toBe("sess-1");
    expect(url.searchParams.get("expiryTimestamp")).toBe(String(FUTURE_SECONDS));
    expect(res.licenseKey).toBe("KEY-1");
  });

  it("keeps the unauthenticated request when there is no proof", async () => {
    const fetchMock = stubFetchJson({ premiumUntil: null });

    await getPremiumStatus("https://app.example.test", ADDRESS);

    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("userId")).toBe(ADDRESS);
    expect(url.searchParams.has("delegationSignature")).toBe(false);
  });

  it("refuses an expired, incomplete or missing delegation", () => {
    expect(identityProofFromDelegation({ signature: "0xsig", sessionId: "s", expiryTimestamp: 1 })).toBeUndefined();
    expect(identityProofFromDelegation({ signature: "0xsig", sessionId: "s" })).toBeUndefined();
    expect(identityProofFromDelegation(null)).toBeUndefined();
  });
});
