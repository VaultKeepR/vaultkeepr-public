import { describe, it, expect, vi, afterEach } from "vitest";
import { checkEmailBreaches } from "./emailBreach";

const HIBP_BREACHES = [
  {
    Name: "ExampleLeak",
    Description: "A leak of example.com",
    LogoPath: "https://logos.example.com/example.png",
    DataClasses: ["Email addresses", "Passwords"]
  },
  {
    Name: "OtherLeak",
    Description: "Another breach",
    LogoPath: "",
    DataClasses: ["Email addresses"]
  }
];

function leakCheckResponse(body: object, ok = true) {
  return { ok, status: ok ? 200 : 500, json: async () => body };
}

function mockFetch(
  leakCheckByEmail: (email: string) => object | Promise<object> | { ok: false; status: number },
  hibp: () => object | Promise<object> = () => leakCheckResponse(HIBP_BREACHES)
) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const u = new URL(String(input));
    if (u.host === "haveibeenpwned.com") {
      return hibp();
    }
    if (u.host === "leakcheck.io") {
      const body = await leakCheckByEmail(u.searchParams.get("check") ?? "");
      return "ok" in body && body.ok === false
        ? leakCheckResponse({}, false)
        : leakCheckResponse(body);
    }
    return leakCheckResponse({ success: false, error: "Not found" });
  });
}

describe("checkEmailBreaches", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns unenriched breaches when breach metadata is unavailable", async () => {
    globalThis.fetch = mockFetch(
      () => ({ success: true, sources: [{ name: "exampleleak", date: "2024-01-01" }] }),
      () => ({ ok: false, status: 503, json: async () => [] })
    ) as typeof fetch;

    const report = await checkEmailBreaches(["no-metadata@example.com"]);
    expect(report.results[0]).toMatchObject({ found: true, breachCount: 1, checked: true });
    expect(report.results[0].breaches[0]).toEqual({
      name: "exampleleak",
      date: "2024-01-01",
      description: undefined,
      logoPath: undefined,
      dataClasses: undefined
    });
  });

  it("returns unenriched breaches when the metadata endpoint fails", async () => {
    globalThis.fetch = mockFetch(
      () => ({ success: true, sources: [{ name: "exampleleak", date: "2024-01-01" }] }),
      () => {
        throw new Error("metadata offline");
      }
    ) as typeof fetch;

    const report = await checkEmailBreaches(["metadata-error@example.com"]);
    expect(report.results[0].checked).toBe(true);
    expect(report.results[0].breaches[0].description).toBeUndefined();
  });

  it("aggregates found breaches with enriched metadata", async () => {
    globalThis.fetch = mockFetch((email) => {
      if (email === "pwned@example.com") {
        return {
          success: true,
          found: 1,
          sources: [{ name: "exampleleak", date: "2024-01-01" }]
        };
      }
      return { success: false, error: "Not found" };
    }) as typeof fetch;

    const report = await checkEmailBreaches(["pwned@example.com", "clean@example.com"]);

    expect(report.totalCount).toBe(2);
    expect(report.breachedCount).toBe(1);
    expect(report.checkedCount).toBe(2);
    expect(report.results[0]).toMatchObject({
      email: "pwned@example.com",
      found: true,
      breachCount: 1,
      checked: true
    });
    expect(report.results[0].breaches[0]).toMatchObject({
      name: "exampleleak",
      date: "2024-01-01",
      description: "A leak of example.com",
      logoPath: "https://logos.example.com/example.png",
      dataClasses: ["Email addresses", "Passwords"]
    });
    expect(report.results[1]).toMatchObject({ found: false, breachCount: 0, checked: true });
  });

  it("maps leakcheck found count from sources length when found is absent", async () => {
    globalThis.fetch = mockFetch(() => ({
      success: true,
      sources: [{ name: "A", date: "" }, { name: "B", date: "" }, { name: "C", date: "" }]
    })) as typeof fetch;

    const report = await checkEmailBreaches(["multi@example.com"]);
    expect(report.results[0].breachCount).toBe(3);
  });

  it("records an error when leakcheck returns non-ok", async () => {
    globalThis.fetch = mockFetch(() => ({ ok: false, status: 500 })) as typeof fetch;

    const report = await checkEmailBreaches(["down@example.com"]);
    expect(report.results[0]).toMatchObject({
      checked: false,
      error: "LeakCheck API: 500"
    });
    expect(report.checkedCount).toBe(0);
  });

  it("records an error when fetch rejects", async () => {
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const u = new URL(String(input));
      if (u.host === "haveibeenpwned.com") {
        return leakCheckResponse(HIBP_BREACHES);
      }
      throw new Error("offline");
    }) as typeof fetch;

    const report = await checkEmailBreaches(["offline@example.com"]);
    expect(report.results[0]).toMatchObject({ checked: false, error: "offline" });
  });

  it("stops before processing further emails when aborted", async () => {
    globalThis.fetch = mockFetch(() => ({ success: false, error: "Not found" })) as typeof fetch;

    const controller = new AbortController();
    const report = await checkEmailBreaches(["a@example.com", "b@example.com"], {
      signal: controller.signal,
      onProgress: () => controller.abort()
    });

    expect(report.results).toHaveLength(1);
    expect(report.totalCount).toBe(2);
  });
});
