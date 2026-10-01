import { describe, it, expect, vi, afterEach } from "vitest";
import { getPwnedPasswordCount, getPwnedCountForHash } from "./pwnedPassword";

describe("getPwnedPasswordCount", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns 0 for empty password", async () => {
    expect(await getPwnedPasswordCount("", { fetchFn: vi.fn() })).toBe(0);
  });

  it("parses count from range response", async () => {

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
      "1E4C9B93F3F0682250B6CF8331B7EE68FD8:2\n" + "003D68A8C0B7177B5A2:1\n"
    });
    const n = await getPwnedPasswordCount("password", { fetchFn: mockFetch as typeof fetch });
    expect(n).toBe(2);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/api\.pwnedpasswords\.com\/range\/5BAA6$/),
      expect.objectContaining({
        headers: expect.objectContaining({ "Add-Padding": "true" })
      })
    );
  });

  it("returns 0 when suffix not in list", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "0000000000000000000000000000000000000:1\n"
    });
    const n = await getPwnedPasswordCount("unlikely-password-xyz-12345", { fetchFn: mockFetch as typeof fetch });
    expect(n).toBe(0);
  });

  it("throws on non-ok response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(getPwnedPasswordCount("a", { fetchFn: mockFetch as typeof fetch })).rejects.toThrow("503");
  });
});

describe("getPwnedCountForHash", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("queries the range for a pre-computed hash", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "1E4C9B93F3F0682250B6CF8331B7EE68FD8:2\n"
    });
    const n = await getPwnedCountForHash("5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8", { fetchFn: mockFetch as typeof fetch });
    expect(n).toBe(2);
    expect(mockFetch).toHaveBeenCalledWith("https://api.pwnedpasswords.com/range/5BAA6", expect.anything());
  });

  it("normalizes lowercase input", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "1E4C9B93F3F0682250B6CF8331B7EE68FD8:2\n"
    });
    const n = await getPwnedCountForHash("5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8", { fetchFn: mockFetch as typeof fetch });
    expect(n).toBe(2);
  });

  it("rejects malformed hashes", async () => {
    const mockFetch = vi.fn();
    await expect(getPwnedCountForHash("abc123", { fetchFn: mockFetch as typeof fetch })).rejects.toThrow("Invalid SHA-1 length");
    expect(mockFetch).not.toHaveBeenCalled();
  });
});