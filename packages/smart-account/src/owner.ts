






import { type LocalAccount } from "viem";
import { getHiddenWalletFromPassword, getHiddenWalletFromSecretKey, getHiddenWalletLegacy } from "@vaultkeepr/core";








export async function getOwnerFromPassword(password: string, secretKey?: string): Promise<LocalAccount> {
  if (secretKey) {
    return getHiddenWalletFromSecretKey(secretKey);
  }
  return getHiddenWalletFromPassword(password);
}




export function getOwnerFromPasswordLegacy(password: string, secretKey?: string): LocalAccount {
  return getHiddenWalletLegacy(password, secretKey);
}