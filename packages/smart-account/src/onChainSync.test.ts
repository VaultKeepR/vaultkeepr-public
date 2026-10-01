// Coverage-round: debounced CID publication state machine (registry + chain
// mocked, no network).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("./cidRegistry", () => ({
  isCidRegistryConfigured: vi.fn(() => true),
  publishCidOnChain: vi.fn(async () => "0xtxhash")
}));

import { isCidRegistryConfigured, publishCidOnChain } from "./cidRegistry";
import {
  scheduleCidOnChainSync,
  flushCidOnChainSync,
  getOnChainSyncStatus,
  resetOnChainSync
} from "./onChainSync";

const SA = {} as never;

describe("onChainSync state machine", () => {
  beforeEach(() => {
    resetOnChainSync();
    vi.mocked(isCidRegistryConfigured).mockReturnValue(true);
    vi.mocked(publishCidOnChain).mockResolvedValue("0xtxhash");
  });
  afterEach(() => {
    resetOnChainSync();
    vi.clearAllMocks();
  });

  it("publishes a pending CID on flush", async () => {
    scheduleCidOnChainSync(SA, "cid-1");
    await expect(flushCidOnChainSync()).resolves.toBe(true);
    expect(publishCidOnChain).toHaveBeenCalledWith(SA, "cid-1");
    expect(getOnChainSyncStatus()).toBeTruthy();
  });

  it("skips scheduling when the registry is not configured", async () => {
    vi.mocked(isCidRegistryConfigured).mockReturnValue(false);
    scheduleCidOnChainSync(SA, "cid-2");
    await expect(flushCidOnChainSync()).resolves.toBe(true);
    expect(publishCidOnChain).not.toHaveBeenCalled();
  });

  it("ignores a null smart account", async () => {
    scheduleCidOnChainSync(null, "cid-3");
    await flushCidOnChainSync();
    expect(publishCidOnChain).not.toHaveBeenCalled();
  });

  it("deduplicates identical consecutive CIDs", async () => {
    scheduleCidOnChainSync(SA, "cid-4");
    await flushCidOnChainSync();
    vi.mocked(publishCidOnChain).mockClear();
    scheduleCidOnChainSync(SA, "cid-4");
    await expect(flushCidOnChainSync()).resolves.toBe(true);
    expect(publishCidOnChain).not.toHaveBeenCalled();
  });

  it("returns false when the publication throws", async () => {
    vi.mocked(publishCidOnChain).mockRejectedValueOnce(new Error("rpc down"));
    scheduleCidOnChainSync(SA, "cid-5");
    await expect(flushCidOnChainSync()).resolves.toBe(false);
  });

  it("returns false when the publication returns null", async () => {
    vi.mocked(publishCidOnChain).mockResolvedValueOnce(null as never);
    scheduleCidOnChainSync(SA, "cid-6");
    await expect(flushCidOnChainSync()).resolves.toBe(false);
  });
});
