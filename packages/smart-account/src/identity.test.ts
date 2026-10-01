// Covers the smart-account-configured branches of identity.ts that no other
// test exercises (kernel + config mocked, no chain calls).
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./config", () => ({
  isSmartAccountConfigured: vi.fn(() => true)
}));

vi.mock("./owner", () => ({
  getOwnerFromPassword: vi.fn(async () => ({
    address: "0x1111111111111111111111111111111111111111"
  }))
}));

vi.mock("./kernel", () => ({
  createVaultSmartAccount: vi.fn(async () => ({
    address: "0x2222222222222222222222222222222222222222"
  })),
  computeSmartAccountAddress: vi.fn(async () => "0x3333333333333333333333333333333333333333"),
  clearSmartAccountCache: vi.fn()
}));

import {
  initIdentityFromPassword,
  initIdentityFromSigner,
  clearIdentity,
  getIdentityAddress,
  isIdentityConnected,
  getIdentityMode,
  getIdentitySnapshot,
  subscribeIdentity
} from "./identity";
import { createVaultSmartAccount, computeSmartAccountAddress, clearSmartAccountCache } from "./kernel";

const OWNER = "0x1111111111111111111111111111111111111111";
const SA = "0x2222222222222222222222222222222222222222";
const COMPUTED = "0x3333333333333333333333333333333333333333";

describe("identity state machine (configured kernel)", () => {
  beforeEach(() => {
    clearIdentity();
    vi.mocked(createVaultSmartAccount).mockImplementation(async () => ({ address: SA }) as never);
    vi.mocked(computeSmartAccountAddress).mockImplementation(async () => COMPUTED);
    vi.mocked(clearSmartAccountCache).mockClear();
  });

  it("initializes from password with the smart account attached", async () => {
    const res = await initIdentityFromPassword("pw", "sk");
    expect(res.address).toBe(OWNER);
    expect(res.smartAccountAddress).toBe(SA);
    expect(res.aaAddress).toBe(SA);
    expect(isIdentityConnected()).toBe(true);
    expect(getIdentityAddress()).toBe(OWNER);
    expect(getIdentityMode()).toBe("password");
    expect(getIdentitySnapshot().initialized).toBe(true);
  });

  it("falls back to the computed AA address when SA init fails", async () => {
    vi.mocked(createVaultSmartAccount).mockImplementation(async () => {
      throw new Error("kernel down");
    });
    const res = await initIdentityFromPassword("pw");
    expect(res.smartAccountAddress).toBeNull();
    expect(res.aaAddress).toBe(COMPUTED);
  });

  it("returns null AA when derivation also fails (non-blocking)", async () => {
    vi.mocked(createVaultSmartAccount).mockImplementation(async () => {
      throw new Error("down");
    });
    vi.mocked(computeSmartAccountAddress).mockImplementation(async () => {
      throw new Error("also down");
    });
    const res = await initIdentityFromPassword("pw");
    expect(res.aaAddress).toBeNull();
    expect(res.address).toBe(OWNER);
  });

  it("initializes from an external signer in passkey mode", async () => {
    const signer = { address: OWNER } as never;
    const res = await initIdentityFromSigner(signer, "passkey");
    expect(res.address).toBe(OWNER);
    expect(getIdentityMode()).toBe("passkey");
  });

  it("notifies subscribers and survives throwing listeners", async () => {
    const good = vi.fn();
    const bad = vi.fn(() => {
      throw new Error("listener boom");
    });
    const unsubGood = subscribeIdentity(good);
    const unsubBad = subscribeIdentity(bad);

    await initIdentityFromPassword("pw");
    expect(good).toHaveBeenCalled();
    expect(bad).toHaveBeenCalled();

    unsubGood();
    unsubBad();
  });

  it("clears the state and the kernel cache", async () => {
    await initIdentityFromPassword("pw");
    clearIdentity();
    expect(isIdentityConnected()).toBe(false);
    expect(getIdentityAddress()).toBeNull();
    expect(clearSmartAccountCache).toHaveBeenCalled();
  });
});
