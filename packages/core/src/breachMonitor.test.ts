import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { vi as viCore } from "vitest";

vi.mock("./pwnedPassword", () => ({
  getPwnedPasswordCount: vi.fn()
}));

import { checkVaultBreaches } from "./breachMonitor";
import { getPwnedPasswordCount } from "./pwnedPassword";
import type { VaultEntry } from "./types";

const mockCount = viCore.mocked(getPwnedPasswordCount);

function entry(overrides: Partial<VaultEntry> & { id: string }): VaultEntry {
  return {
    url: "https://example.com",
    username: "user@example.com",
    password: "correct-horse",
    ...overrides
  } as VaultEntry;
}

describe("checkVaultBreaches", () => {
  beforeEach(() => {
    mockCount.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("only checks entries with url and password", async () => {
    mockCount.mockResolvedValue(0);
    const report = await checkVaultBreaches([
      entry({ id: "a" }),
      entry({ id: "b", url: "  " }),
      entry({ id: "c", password: "" }),
      entry({ id: "d" })
    ], { delayMs: 0 });

    expect(report.totalCount).toBe(2);
    expect(report.results.map((r) => r.entryId)).toEqual(["a", "d"]);
    expect(report.checkedCount).toBe(2);
    expect(report.breachedCount).toBe(0);
  });

  it("aggregates breached counts", async () => {
    mockCount.mockResolvedValueOnce(42).mockResolvedValueOnce(0);
    const report = await checkVaultBreaches([
      entry({ id: "a" }),
      entry({ id: "b" })
    ], { delayMs: 0 });

    expect(report.results[0]).toMatchObject({ entryId: "a", breachCount: 42, checked: true });
    expect(report.breachedCount).toBe(1);
  });

  it("records errors without failing the whole run", async () => {
    mockCount.mockRejectedValueOnce(new Error("network down")).mockResolvedValueOnce(3);
    const report = await checkVaultBreaches([
      entry({ id: "a" }),
      entry({ id: "b" })
    ], { delayMs: 0 });

    expect(report.results[0]).toMatchObject({ entryId: "a", checked: false, error: "network down" });
    expect(report.results[1]).toMatchObject({ entryId: "b", checked: true, breachCount: 3 });
    expect(report.checkedCount).toBe(1);
  });

  it("reports progress after each entry", async () => {
    mockCount.mockResolvedValue(1);
    const progress = vi.fn();
    await checkVaultBreaches([entry({ id: "a" }), entry({ id: "b" })], {
      delayMs: 0,
      onProgress: progress
    });

    expect(progress).toHaveBeenCalledTimes(2);
    expect(progress).toHaveBeenNthCalledWith(1, expect.objectContaining({ entryId: "a" }), 0, 2);
    expect(progress).toHaveBeenNthCalledWith(2, expect.objectContaining({ entryId: "b" }), 1, 2);
  });

  it("stops early when the signal is aborted", async () => {
    mockCount.mockResolvedValue(0);
    const controller = new AbortController();
    const report = await checkVaultBreaches([entry({ id: "a" }), entry({ id: "b" })], {
      delayMs: 0,
      signal: controller.signal,
      onProgress: () => controller.abort()
    });

    expect(report.results).toHaveLength(1);
    expect(report.totalCount).toBe(2);
  });

  it("skips remaining entries when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const report = await checkVaultBreaches([entry({ id: "a" })], {
      delayMs: 0,
      signal: controller.signal
    });

    expect(report.results).toHaveLength(0);
    expect(mockCount).not.toHaveBeenCalled();
  });
});
