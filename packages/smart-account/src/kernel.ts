









import {
  createPublicClient,
  http,
  type Address,
  type Chain,
  type LocalAccount } from
"viem";
import { toKernelSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  createBundlerClient,
  entryPoint07Address } from
"viem/account-abstraction";
import { TARGET_CHAIN, getPimlicoUrl } from "./config";
import { logger, redactAddress } from "@vault-keeper/logger";



export interface VaultSmartAccount {

  address: Address;

  ownerAddress: Address;

  ownerAccount: LocalAccount;

  client: ReturnType<typeof createBundlerClient>;

  chain: Chain;

  mode: "passkey" | "password" | "biometric";
}

export interface CreateSmartAccountParams {

  ownerAccount: LocalAccount;

  mode: "passkey" | "password" | "biometric";
}







export async function computeSmartAccountAddress(
ownerAccount: LocalAccount): Promise<Address> {
  const publicClient = createPublicClient({
    chain: TARGET_CHAIN,
    transport: http()
  });

  const kernelAccount = await toKernelSmartAccount({
    client: publicClient,
    owners: [ownerAccount],
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7"
    }
  });

  return kernelAccount.address;
}



let _cached: VaultSmartAccount | null = null;
let _cachedKey: string | null = null;








export async function createVaultSmartAccount(
params: CreateSmartAccountParams)
: Promise<VaultSmartAccount> {
  const { ownerAccount, mode } = params;
  const cacheKey = `${mode}:${ownerAccount.address.toLowerCase()}`;

  if (_cached && _cachedKey === cacheKey) return _cached;


  const publicClient = createPublicClient({
    chain: TARGET_CHAIN,
    transport: http()
  });


  const kernelAccount = await toKernelSmartAccount({
    client: publicClient,
    owners: [ownerAccount],
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7"
    }
  });


  const pimlicoUrl = getPimlicoUrl();

  const pimlicoClient = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7"
    }
  });


  const bundlerClient = createBundlerClient({
    account: kernelAccount,
    chain: TARGET_CHAIN,
    transport: http(pimlicoUrl),
    paymaster: {
      async getPaymasterData(parameters) {
        return pimlicoClient.getPaymasterData(parameters);
      },
      async getPaymasterStubData(parameters) {
        return pimlicoClient.getPaymasterStubData(parameters);
      }
    },
    userOperation: {
      async estimateFeesPerGas() {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      }
    }
  });

  const result: VaultSmartAccount = {
    address: kernelAccount.address,
    ownerAddress: ownerAccount.address,
    ownerAccount,
    client: bundlerClient,
    chain: TARGET_CHAIN,
    mode
  };


  _cached = result;
  _cachedKey = cacheKey;

  logger.debug(
    `[SmartAccount] Kernel créé (${mode}) — ` +
    `SA: ${redactAddress(kernelAccount.address)} | Owner: ${redactAddress(ownerAccount.address)}`
  );

  return result;
}




export function getCachedSmartAccountAddress(): Address | null {
  return _cached?.address ?? null;
}




export function getCachedSmartAccountMode(): VaultSmartAccount["mode"] | null {
  return _cached?.mode ?? null;
}




export function clearSmartAccountCache(): void {
  _cached = null;
  _cachedKey = null;
}