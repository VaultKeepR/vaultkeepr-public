







import {
  createPublicClient,
  encodeFunctionData,
  http,
  type Address } from
"viem";
import { base } from "viem/chains";
import type { LegacyConfig } from "./types";

import { logger } from "@vaultkeepr/logger";


export const LEGACY_ABI = [
{
  name: "registerLegacy",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [
  { name: "envelopeCid", type: "string" },
  { name: "delaySeconds", type: "uint256" },
  { name: "gracePeriodSeconds", type: "uint256" },
  { name: "beneficiaries", type: "address[]" }],

  outputs: []
},
{
  name: "heartbeat",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [],
  outputs: []
},
{
  name: "claimLegacy",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [{ name: "legacyOwner", type: "address" }],
  outputs: []
},
{
  name: "revokeLegacy",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [],
  outputs: []
},
{
  name: "updateBeneficiaries",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [{ name: "newBeneficiaries", type: "address[]" }],
  outputs: []
},
{
  name: "updateDelay",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [
  { name: "newDelaySeconds", type: "uint256" },
  { name: "newGracePeriodSeconds", type: "uint256" }],

  outputs: []
},
{
  name: "updateEnvelopeCid",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [{ name: "newCid", type: "string" }],
  outputs: []
},
{
  name: "getLegacy",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "legacyOwner", type: "address" }],
  outputs: [
  { name: "envelopeCid", type: "string" },
  { name: "delaySeconds", type: "uint256" },
  { name: "gracePeriodSeconds", type: "uint256" },
  { name: "lastHeartbeat", type: "uint256" },
  { name: "registeredAt", type: "uint256" },
  { name: "active", type: "bool" },
  { name: "claimed", type: "bool" },
  { name: "claimedBy", type: "address" },
  { name: "beneficiaryCount", type: "uint256" }]

},
{
  name: "getLastHeartbeat",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "legacyOwner", type: "address" }],
  outputs: [{ name: "", type: "uint256" }]
},
{
  name: "isClaimable",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "legacyOwner", type: "address" }],
  outputs: [{ name: "", type: "bool" }]
},
{
  name: "getBeneficiaries",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "legacyOwner", type: "address" }],
  outputs: [{ name: "", type: "address[]" }]
},
{
  name: "isBeneficiary",
  type: "function",
  stateMutability: "view",
  inputs: [
  { name: "legacyOwner", type: "address" },
  { name: "candidate", type: "address" }],

  outputs: [{ name: "", type: "bool" }]
},
{
  name: "getDeadline",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "legacyOwner", type: "address" }],
  outputs: [{ name: "", type: "uint256" }]
}] as
const;



function getLegacyContractAddress(): Address {
  let addr = "";
  try {addr = process.env.LEGACY_CONTRACT_ADDRESS || "";} catch {}
  if (addr) return addr as Address;
  try {addr = process.env.NEXT_PUBLIC_LEGACY_CONTRACT_ADDRESS || "";} catch {}
  if (addr) return addr as Address;
  try {addr = process.env.EXPO_PUBLIC_LEGACY_CONTRACT_ADDRESS || "";} catch {}
  if (addr) return addr as Address;
  return "0x0000000000000000000000000000000000000000" as Address;
}

export function isLegacyContractConfigured(): boolean {
  return getLegacyContractAddress() !== "0x0000000000000000000000000000000000000000";
}

function getPublicClient() {
  return createPublicClient({ chain: base, transport: http() });
}



interface SmartAccountClient {
  client: {
    sendUserOperation: (params: {
      calls: Array<{to: Address;data: `0x${string}`;value: bigint;}>;
    }) => Promise<`0x${string}`>;
    waitForUserOperationReceipt: (params: {
      hash: `0x${string}`;
    }) => Promise<{receipt: {transactionHash: `0x${string}`;};}>;
  };
  address: Address;
}



async function sendGaslessCall(
smartAccount: SmartAccountClient,
calldata: `0x${string}`)
: Promise<`0x${string}` | null> {
  if (!isLegacyContractConfigured()) {
    logger.warn("[Legacy] Contrat non configure, skip");
    return null;
  }
  try {
    const userOpHash = await smartAccount.client.sendUserOperation({
      calls: [{ to: getLegacyContractAddress(), data: calldata, value: 0n }]
    });
    const receipt = await smartAccount.client.waitForUserOperationReceipt({
      hash: userOpHash
    });
    return receipt.receipt.transactionHash;
  } catch (error: any) {
    const msg: string = error?.message || String(error);

    if (
    msg.includes("0xb6da93a7") ||
    msg.includes("0x80cb55e2") ||
    msg.toLowerCase().includes("heartbeatcooldown") ||
    msg.toLowerCase().includes("notactive"))
    {
      logger.warn("[Legacy] HeartbeatCooldown/NotActive: skip silencieux.");
      return null;
    }
    logger.error("[Legacy] Erreur gasless call:", msg);
    return null;
  }
}



export async function registerLegacyOnChain(
smartAccount: SmartAccountClient,
envelopeCid: string,
delaySeconds: number,
gracePeriodSeconds: number,
beneficiaries: Address[])
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "registerLegacy",
    args: [envelopeCid, BigInt(delaySeconds), BigInt(gracePeriodSeconds), beneficiaries]
  });
  logger.debug(`[Legacy] Register on-chain — ${beneficiaries.length} beneficiaires, delai ${delaySeconds}s`);
  return sendGaslessCall(smartAccount, data);
}


export async function sendHeartbeatOnChain(
smartAccount: SmartAccountClient)
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "heartbeat",
    args: []
  });
  return sendGaslessCall(smartAccount, data);
}


export async function claimLegacyOnChain(
smartAccount: SmartAccountClient,
ownerAddress: Address)
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "claimLegacy",
    args: [ownerAddress]
  });
  logger.debug(`[Legacy] Claim heritage de ${ownerAddress}`);
  return sendGaslessCall(smartAccount, data);
}


export async function revokeLegacyOnChain(
smartAccount: SmartAccountClient)
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "revokeLegacy",
    args: []
  });
  logger.debug("[Legacy] Revocation on-chain");
  return sendGaslessCall(smartAccount, data);
}


export async function updateBeneficiariesOnChain(
smartAccount: SmartAccountClient,
newBeneficiaries: Address[])
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "updateBeneficiaries",
    args: [newBeneficiaries]
  });
  return sendGaslessCall(smartAccount, data);
}


export async function updateDelayOnChain(
smartAccount: SmartAccountClient,
newDelaySeconds: number,
newGracePeriodSeconds: number)
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "updateDelay",
    args: [BigInt(newDelaySeconds), BigInt(newGracePeriodSeconds)]
  });
  return sendGaslessCall(smartAccount, data);
}


export async function updateEnvelopeCidOnChain(
smartAccount: SmartAccountClient,
newCid: string)
: Promise<`0x${string}` | null> {
  const data = encodeFunctionData({
    abi: LEGACY_ABI,
    functionName: "updateEnvelopeCid",
    args: [newCid]
  });
  return sendGaslessCall(smartAccount, data);
}




export async function readLegacyFromChain(
ownerAddress: Address)
: Promise<LegacyConfig | null> {
  if (!isLegacyContractConfigured()) return null;
  try {
    const client = getPublicClient();
    const result = await client.readContract({
      address: getLegacyContractAddress(),
      abi: LEGACY_ABI,
      functionName: "getLegacy",
      args: [ownerAddress]
    });
    const [envelopeCid, delaySeconds, gracePeriodSeconds, lastHeartbeat, registeredAt, active, claimed, claimedBy, beneficiaryCount] = result;
    return {
      envelopeCid,
      delaySeconds: Number(delaySeconds),
      gracePeriodSeconds: Number(gracePeriodSeconds),
      lastHeartbeat: Number(lastHeartbeat),
      registeredAt: Number(registeredAt),
      active,
      claimed,
      claimedBy,
      beneficiaryCount: Number(beneficiaryCount)
    };
  } catch (error: any) {
    logger.error("[Legacy] Erreur lecture:", error.message);
    return null;
  }
}


export async function readHeartbeatFromChain(
ownerAddress: Address)
: Promise<number | null> {
  if (!isLegacyContractConfigured()) return null;
  try {
    const client = getPublicClient();
    const result = await client.readContract({
      address: getLegacyContractAddress(),
      abi: LEGACY_ABI,
      functionName: "getLastHeartbeat",
      args: [ownerAddress]
    });
    return Number(result);
  } catch (error: any) {
    logger.error("[Legacy] Erreur lecture heartbeat:", error.message);
    return null;
  }
}


export async function isClaimableOnChain(
ownerAddress: Address)
: Promise<boolean> {
  if (!isLegacyContractConfigured()) return false;
  try {
    const client = getPublicClient();
    return await client.readContract({
      address: getLegacyContractAddress(),
      abi: LEGACY_ABI,
      functionName: "isClaimable",
      args: [ownerAddress]
    });
  } catch {
    return false;
  }
}


export async function readBeneficiariesFromChain(
ownerAddress: Address)
: Promise<Address[]> {
  if (!isLegacyContractConfigured()) return [];
  try {
    const client = getPublicClient();
    return (await client.readContract({
      address: getLegacyContractAddress(),
      abi: LEGACY_ABI,
      functionName: "getBeneficiaries",
      args: [ownerAddress]
    })) as Address[];
  } catch {
    return [];
  }
}


export async function readDeadlineFromChain(
ownerAddress: Address)
: Promise<number> {
  if (!isLegacyContractConfigured()) return 0;
  try {
    const client = getPublicClient();
    const result = await client.readContract({
      address: getLegacyContractAddress(),
      abi: LEGACY_ABI,
      functionName: "getDeadline",
      args: [ownerAddress]
    });
    return Number(result);
  } catch {
    return 0;
  }
}