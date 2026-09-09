






import {
  createPublicClient,
  encodeFunctionData,
  http,
  type Address } from
"viem";
import { TARGET_CHAIN, isSmartAccountConfigured } from "./config";
import type { VaultSmartAccount } from "./kernel";

import { logger } from "@vaultkeepr/logger";



export const CID_REGISTRY_ABI = [
{
  name: "setCid",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [{ name: "cid", type: "string" }],
  outputs: []
},
{
  name: "deleteCid",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [],
  outputs: []
},
{
  name: "getCid",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "account", type: "address" }],
  outputs: [{ name: "", type: "string" }]
},
{
  name: "hasCid",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "account", type: "address" }],
  outputs: [{ name: "", type: "bool" }]
},
{
  name: "getUpdatedAt",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "account", type: "address" }],
  outputs: [{ name: "", type: "uint256" }]
},
{
  name: "nextAllowedUpdate",
  type: "function",
  stateMutability: "view",
  inputs: [{ name: "account", type: "address" }],
  outputs: [{ name: "", type: "uint256" }]
},
{
  name: "cooldownSeconds",
  type: "function",
  stateMutability: "view",
  inputs: [],
  outputs: [{ name: "", type: "uint256" }]
}] as
const;







function getCidRegistryAddress(): Address {
  let addr = "";
  try {addr = process.env.CID_REGISTRY_ADDRESS || "";} catch {}
  if (addr) return addr as Address;
  try {addr = process.env.NEXT_PUBLIC_CID_REGISTRY_ADDRESS || "";} catch {}
  if (addr) return addr as Address;
  try {addr = process.env.EXPO_PUBLIC_CID_REGISTRY_ADDRESS || "";} catch {}
  if (addr) return addr as Address;

  return "0x0000000000000000000000000000000000000000" as Address;
}




export function isCidRegistryConfigured(): boolean {

  return (
    getCidRegistryAddress() !==
    "0x0000000000000000000000000000000000000000" &&
    isSmartAccountConfigured());

}













export async function publishCidOnChain(
smartAccount: VaultSmartAccount,
cid: string)
: Promise<`0x${string}` | null> {
  if (!isCidRegistryConfigured()) {
    logger.warn(
      "[CidRegistry] Non configuré, skip on-chain publish"
    );
    return null;
  }

  try {
    const calldata = encodeFunctionData({
      abi: CID_REGISTRY_ABI,
      functionName: "setCid",
      args: [cid]
    });


    const userOpHash = await smartAccount.client.sendUserOperation({
      calls: [
      {
        to: getCidRegistryAddress(),
        data: calldata,
        value: BigInt(0)
      }]

    });

    logger.debug(
      `[CidRegistry] UserOp soumise: ${userOpHash}`
    );


    const receipt = await smartAccount.client.waitForUserOperationReceipt({
      hash: userOpHash
    });

    logger.debug(
      `[CidRegistry] CID publié on-chain — tx: ${receipt.receipt.transactionHash} | CID: ${cid.slice(0, 20)}...`
    );
    return receipt.receipt.transactionHash;
  } catch (error) {
    logger.error("[CidRegistry] Erreur:", error instanceof Error ? error.message : error);
    return null;
  }
}










export async function readCidOnChain(
smartAccountAddress: Address)
: Promise<string | null> {
  if (!isCidRegistryConfigured()) return null;

  try {
    const publicClient = createPublicClient({
      chain: TARGET_CHAIN,
      transport: http()
    });

    const cid = await publicClient.readContract({
      address: getCidRegistryAddress(),
      abi: CID_REGISTRY_ABI,
      functionName: "getCid",
      args: [smartAccountAddress]
    });

    return cid && cid.length > 0 ? cid : null;
  } catch (error) {
    logger.error("[CidRegistry] Erreur lecture:", error instanceof Error ? error.message : error);
    return null;
  }
}