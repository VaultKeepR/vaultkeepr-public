



import { base } from "viem/chains";
import { createPublicClient, http, hexToBytes, encodeFunctionData } from "viem";

export const FRAGMENT_CONTRACT_CHAIN_ID = base.id;

const ABI = [
{
  inputs: [
  { name: "lookupIdHash", type: "bytes32", internalType: "bytes32" },
  { name: "encryptedPayload", type: "bytes", internalType: "bytes" }],

  name: "storeFragment",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function"
},
{
  inputs: [{ name: "lookupIdHash", type: "bytes32", internalType: "bytes32" }],
  name: "deleteFragment",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function"
},
{
  inputs: [{ name: "lookupIdHash", type: "bytes32", internalType: "bytes32" }],
  name: "getFragment",
  outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
  stateMutability: "view",
  type: "function"
},
{
  inputs: [{ name: "lookupIdHash", type: "bytes32", internalType: "bytes32" }],
  name: "getFragmentOwner",
  outputs: [{ name: "", type: "address", internalType: "address" }],
  stateMutability: "view",
  type: "function"
}] as
const;

export interface FragmentContractConfig {
  contractAddress: string;
}

function toBytes32(lookupIdHash: string): `0x${string}` {
  const h = lookupIdHash.replace(/^0x/, "").toLowerCase();
  if (h.length !== 64 || !/^[a-f0-9]+$/.test(h)) {
    throw new Error("lookupIdHash must be 64 hex characters");
  }
  return `0x${h}` as `0x${string}`;
}

export function isContractConfigured(config: FragmentContractConfig): boolean {
  return !!config.contractAddress && config.contractAddress.length === 42;
}





export async function getFragmentFromChain(
lookupIdHash: string,
config: FragmentContractConfig)
: Promise<string | null> {
  if (!isContractConfigured(config)) return null;

  const publicClient = createPublicClient({
    chain: base,
    transport: http()
  });

  const hash = toBytes32(lookupIdHash);
  const bytes = await publicClient.readContract({
    address: config.contractAddress as `0x${string}`,
    abi: ABI,
    functionName: "getFragment",
    args: [hash]
  });

  if (!bytes) return null;
  const hex = typeof bytes === "string" ? bytes : `0x${bytes}`;
  const arr = hexToBytes(hex as `0x${string}`);
  if (arr.length === 0) return null;

  return new TextDecoder().decode(arr);
}






export function getStoreFragmentTxParams(
lookupIdHash: string,
encryptedPayload: string,
config: FragmentContractConfig)
: {to: string;data: `0x${string}`;value: bigint;chainId: number;} {
  if (!isContractConfigured(config)) {
    throw new Error("Contract address not configured");
  }

  const hexPayload =
  `0x${Array.from(new TextEncoder().encode(encryptedPayload)).
  map((b) => b.toString(16).padStart(2, "0")).
  join("")}` as `0x${string}`;

  const hash = toBytes32(lookupIdHash);
  const data = encodeFunctionData({
    abi: ABI,
    functionName: "storeFragment",
    args: [hash, hexPayload]
  });

  return {
    to: config.contractAddress,
    data,
    value: 0n,
    chainId: FRAGMENT_CONTRACT_CHAIN_ID
  };
}






export function getDeleteFragmentTxParams(
lookupIdHash: string,
config: FragmentContractConfig)
: {to: string;data: `0x${string}`;value: bigint;chainId: number;} {
  if (!isContractConfigured(config)) {
    throw new Error("Contract address not configured");
  }

  const hash = toBytes32(lookupIdHash);
  const data = encodeFunctionData({
    abi: ABI,
    functionName: "deleteFragment",
    args: [hash]
  });

  return {
    to: config.contractAddress,
    data,
    value: 0n,
    chainId: FRAGMENT_CONTRACT_CHAIN_ID
  };
}


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// shortcut: the first-write slot race (front-run griefing) has no on-chain fix —
// both storeFragment and storeFragmentMeta let the caller pick the first owner.
// Mitigation is client-side: read the owner back after the store tx lands.
export async function getFragmentOwnerFromChain(
lookupIdHash: string,
config: FragmentContractConfig)
: Promise<string | null> {
  if (!isContractConfigured(config)) return null;

  const publicClient = createPublicClient({
    chain: base,
    transport: http()
  });

  const hash = toBytes32(lookupIdHash);
  const owner = await publicClient.readContract({
    address: config.contractAddress as `0x${string}`,
    abi: ABI,
    functionName: "getFragmentOwner",
    args: [hash]
  });

  const normalized = String(owner).toLowerCase();
  if (!normalized || normalized === ZERO_ADDRESS) return null;
  return normalized;
}

export async function waitForFragmentOwnership(
lookupIdHash: string,
expectedOwner: string,
config: FragmentContractConfig,
options?: { timeoutMs?: number; pollMs?: number })
: Promise<boolean> {
  if (!isContractConfigured(config) || !expectedOwner) return false;

  const timeoutMs = options?.timeoutMs ?? 90_000;
  const pollMs = options?.pollMs ?? 3_000;
  const expected = expectedOwner.toLowerCase();
  const deadline = Date.now() + timeoutMs;

  do {
    try {
      const owner = await getFragmentOwnerFromChain(lookupIdHash, config);
      if (owner === expected) return true;
      if (owner) return false;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  } while (Date.now() < deadline);

  return false;
}