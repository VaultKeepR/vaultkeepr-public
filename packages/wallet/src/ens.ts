import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http()
});

const VAULT_CID_KEY = "vault.cid";

export async function resolveEnsVaultCid(ensName: string): Promise<string | null> {
  try {
    const name = ensName.includes(".") ? normalize(ensName) : normalize(`${ensName}.eth`);
    const cid = await client.getEnsText({
      name,
      key: VAULT_CID_KEY
    });
    return cid ?? null;
  } catch {
    return null;
  }
}

export async function getEnsName(address: string): Promise<string | null> {
  try {
    const name = await client.getEnsName({
      address: address as `0x${string}`
    });
    return name;
  } catch {
    return null;
  }
}