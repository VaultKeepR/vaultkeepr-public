import {
  createPublicClient,
  http,
  getAddress,
  isAddressEqual,
  recoverMessageAddress,
  zeroAddress,
  type Address,
  type LocalAccount
} from "viem";
import { computeSmartAccountAddress } from "./kernel";
import { TARGET_CHAIN } from "./config";

export type VaultIdentityMode = "password" | "passkey" | "biometric";

export interface VaultIdentity {
  ownerAddress: Address;
  aaAddress: Address;
  mode: VaultIdentityMode;
}

export async function deriveIdentity(
  ownerAccount: LocalAccount,
  mode: VaultIdentityMode
): Promise<VaultIdentity> {
  const aaAddress = await computeSmartAccountAddress(ownerAccount);
  return {
    ownerAddress: ownerAccount.address,
    aaAddress,
    mode
  };
}

export interface VerifyAAAuthParams {
  signature: string;
  message: string;
  claimedOwner?: Address;
  claimedAA?: Address | null;
  timestamp: number;
}

export interface VerifyAAAuthResult {
  ok: boolean;
  ownerAddress: Address;
  aaAddress: Address;
}

const MAX_SKEW_MS = 5 * 60_000;

const UNSIGNABLE_OWNER = "verifyAAAuth: owner stub cannot sign";

function addressOnlyAccount(address: Address): LocalAccount {
  return {
    address,
    type: "local",
    publicKey: "0x",
    source: "custom",
    signMessage: async () => {
      throw new Error(UNSIGNABLE_OWNER);
    },
    signTypedData: async () => {
      throw new Error(UNSIGNABLE_OWNER);
    },
    signTransaction: async () => {
      throw new Error(UNSIGNABLE_OWNER);
    }
  };
}

export async function verifyAAAuth(
  params: VerifyAAAuthParams
): Promise<VerifyAAAuthResult> {
  const rejected: VerifyAAAuthResult = {
    ok: false,
    ownerAddress: zeroAddress,
    aaAddress: zeroAddress
  };
  try {
    if (
      !Number.isFinite(params.timestamp) ||
      Math.abs(Date.now() - params.timestamp) > MAX_SKEW_MS
    ) {
      return rejected;
    }

    const signature = params.signature as `0x${string}`;
    let ownerAddress: Address;
    if (params.claimedOwner) {
      ownerAddress = getAddress(params.claimedOwner);
      const publicClient = createPublicClient({
        chain: TARGET_CHAIN,
        transport: http()
      });
      const valid = await publicClient.verifyMessage({
        address: ownerAddress,
        message: params.message,
        signature
      });
      if (!valid) {
        return {
          ok: false,
          ownerAddress,
          aaAddress: params.claimedAA
            ? getAddress(params.claimedAA)
            : zeroAddress
        };
      }
    } else {
      ownerAddress = await recoverMessageAddress({
        message: params.message,
        signature
      });
    }

    const claimedAA = params.claimedAA ? getAddress(params.claimedAA) : null;
    const aaAddress = await computeSmartAccountAddress(
      addressOnlyAccount(ownerAddress)
    );
    if (claimedAA && !isAddressEqual(claimedAA, aaAddress)) {
      return { ok: false, ownerAddress, aaAddress };
    }
    return { ok: true, ownerAddress, aaAddress };
  } catch {
    return rejected;
  }
}
