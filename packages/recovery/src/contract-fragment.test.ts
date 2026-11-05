import { describe, it, expect, vi, beforeEach } from "vitest";

const readContractMock = vi.fn();

vi.mock("viem", () => ({
  createPublicClient: () => ({ readContract: readContractMock }),
  http: () => ({}),
  hexToBytes: () => new Uint8Array(),
  encodeFunctionData: () => "0x"
}));

import { getFragmentOwnerFromChain, waitForFragmentOwnership } from "./contract-fragment";

const config = { contractAddress: "0x5A8E021F38DC302ba727ED9B9355E69C114972e3" };
const hash = `0x${"ab".repeat(32)}`;
const victim = `0x${"ab".repeat(20)}`;
const attacker = `0x${"12".repeat(20)}`;

describe("contract-fragment ownership read-back (front-run detection)", () => {
  beforeEach(() => {
    readContractMock.mockReset();
  });

  it("getFragmentOwnerFromChain returns the lowercase owner", async () => {
    readContractMock.mockResolvedValue(`0x${"AB".repeat(20)}`);
    expect(await getFragmentOwnerFromChain(hash, config)).toBe(`0x${"ab".repeat(20)}`);
  });

  it("getFragmentOwnerFromChain returns null for zero address or unconfigured contract", async () => {
    readContractMock.mockResolvedValue(`0x${"00".repeat(20)}`);
    expect(await getFragmentOwnerFromChain(hash, config)).toBeNull();
    expect(await getFragmentOwnerFromChain(hash, { contractAddress: "" })).toBeNull();
  });

  it("waitForFragmentOwnership resolves true once the store tx lands", async () => {
    readContractMock
      .mockResolvedValueOnce(`0x${"00".repeat(20)}`)
      .mockResolvedValue(victim);
    const ok = await waitForFragmentOwnership(hash, victim.toUpperCase(), config, { timeoutMs: 2000, pollMs: 1 });
    expect(ok).toBe(true);
  });

  it("waitForFragmentOwnership detects a squatted slot immediately", async () => {
    readContractMock.mockResolvedValue(attacker);
    const ok = await waitForFragmentOwnership(hash, victim, config, { timeoutMs: 2000, pollMs: 1 });
    expect(ok).toBe(false);
  });

  it("waitForFragmentOwnership times out to false when the RPC keeps failing", async () => {
    readContractMock.mockRejectedValue(new Error("rpc down"));
    const ok = await waitForFragmentOwnership(hash, victim, config, { timeoutMs: 20, pollMs: 5 });
    expect(ok).toBe(false);
  });

  it("waitForFragmentOwnership refuses to run without owner or contract config", async () => {
    expect(await waitForFragmentOwnership(hash, "", config)).toBe(false);
    expect(await waitForFragmentOwnership(hash, victim, { contractAddress: "" })).toBe(false);
  });
});