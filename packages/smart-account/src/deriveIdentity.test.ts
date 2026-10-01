import { describe, expect, it, vi } from "vitest";
import {
  encodePacked,
  getAddress,
  keccak256,
  type Address,
  type LocalAccount
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { deriveIdentity, verifyAAAuth } from "./deriveIdentity";

const computeSmartAccountAddressMock = vi.hoisted(() => vi.fn());

vi.mock("./kernel", () => ({
  computeSmartAccountAddress: computeSmartAccountAddressMock
}));

const aaFor = (owner: Address): Address =>
  `0x${keccak256(
    encodePacked(
      ["string", "address"],
      ["vaultkeepr-aa-v1:", owner.toLowerCase() as Address]
    )
  ).slice(26)}` as Address;

computeSmartAccountAddressMock.mockImplementation(
  async (account: LocalAccount) => aaFor(account.address.toLowerCase() as Address)
);

const PRIV_PASSWORD = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" as const;
const PRIV_PASSKEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" as const;
const PRIV_OTHER = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const;

const passwordOwner = privateKeyToAccount(PRIV_PASSWORD);
const passkeyOwner = privateKeyToAccount(PRIV_PASSKEY);
const otherSigner = privateKeyToAccount(PRIV_OTHER);

const MESSAGE = "vaultkeepr-test:identity";

describe("deriveIdentity", () => {
  it("derives a deterministic pair for the same owner", async () => {
    const first = await deriveIdentity(passwordOwner, "password");
    const second = await deriveIdentity(passwordOwner, "password");
    expect(first.ownerAddress).toBe(getAddress(passwordOwner.address));
    expect(first.aaAddress).toBe(second.aaAddress);
    expect(first.aaAddress).toBe(aaFor(passwordOwner.address));
    expect(first.mode).toBe("password");
  });

  it("keeps the same aaAddress for the same owner across modes", async () => {
    const password = await deriveIdentity(passwordOwner, "password");
    const passkey = await deriveIdentity(passwordOwner, "passkey");
    expect(password.aaAddress).toBe(passkey.aaAddress);
    expect(password.ownerAddress).toBe(passkey.ownerAddress);
    expect(passkey.mode).toBe("passkey");
  });

  it("derives distinct stable aaAddress for distinct derived owners cross-mode", async () => {
    const password = await deriveIdentity(passwordOwner, "password");
    const passkey = await deriveIdentity(passkeyOwner, "passkey");
    expect(password.aaAddress).not.toBe(passkey.aaAddress);
    expect(await deriveIdentity(passkeyOwner, "passkey")).toMatchObject({
      aaAddress: passkey.aaAddress
    });
    expect(await deriveIdentity(passwordOwner, "password")).toMatchObject({
      aaAddress: password.aaAddress
    });
  });
});

describe("verifyAAAuth", () => {
  it("accepts a valid EOA signature with the claimed owner", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now()
    });
    expect(result.ok).toBe(true);
    expect(result.ownerAddress.toLowerCase()).toBe(
      passwordOwner.address.toLowerCase()
    );
    expect(result.aaAddress.toLowerCase()).toBe(
      aaFor(passwordOwner.address).toLowerCase()
    );
  }, 30_000);

  it("recovers the owner when claimedOwner is absent", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      timestamp: Date.now()
    });
    expect(result.ok).toBe(true);
    expect(result.ownerAddress.toLowerCase()).toBe(
      passwordOwner.address.toLowerCase()
    );
  }, 30_000);

  it("accepts a claimed AA that matches the recompute", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      claimedAA: aaFor(passwordOwner.address),
      timestamp: Date.now()
    });
    expect(result.ok).toBe(true);
  }, 30_000);

  it("rejects a claimed AA that mismatches the recompute without throwing", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      claimedAA: aaFor(otherSigner.address),
      timestamp: Date.now()
    });
    expect(result.ok).toBe(false);
    expect(result.ownerAddress.toLowerCase()).toBe(
      passwordOwner.address.toLowerCase()
    );
  }, 30_000);

  it("rejects a signature outside the five minute skew", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const late = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now() - 6 * 60_000
    });
    const future = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now() + 6 * 60_000
    });
    expect(late.ok).toBe(false);
    expect(future.ok).toBe(false);
  });

  it("accepts a signature inside the five minute skew", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now() - 4 * 60_000
    });
    expect(result.ok).toBe(true);
  }, 30_000);

  it("rejects a non finite timestamp", async () => {
    const signature = await passwordOwner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Number.NaN
    });
    expect(result.ok).toBe(false);
  });

  it("rejects a signature over the wrong message", async () => {
    const signature = await passwordOwner.signMessage({
      message: "vaultkeepr-test:other"
    });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now()
    });
    expect(result.ok).toBe(false);
  }, 30_000);

  it("rejects a signature from a different signer than the claimed owner", async () => {
    const signature = await otherSigner.signMessage({ message: MESSAGE });
    const result = await verifyAAAuth({
      signature,
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now()
    });
    expect(result.ok).toBe(false);
  }, 30_000);

  it("rejects a malformed signature without throwing", async () => {
    const result = await verifyAAAuth({
      signature: "0xdeadbeef",
      message: MESSAGE,
      claimedOwner: passwordOwner.address,
      timestamp: Date.now()
    });
    expect(result.ok).toBe(false);
  }, 30_000);
});
