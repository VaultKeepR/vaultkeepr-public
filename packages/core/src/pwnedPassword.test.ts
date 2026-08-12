import { describe, it, expect, vi, afterEach } from "vitest";
import { getPwnedPasswordCount } from "./pwnedPassword";

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