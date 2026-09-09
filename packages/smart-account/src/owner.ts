






import { type LocalAccount } from "viem";
import { getHiddenWalletFromPassword, getHiddenWalletLegacy } from "@vaultkeepr/core";








export async function getOwnerFromPassword(password: string, secretKey?: string): Promise<LocalAccount> {
  return getHiddenWalletFromPassword(password, secretKey);
}




export function getOwnerFromPasswordLegacy(password: string, secretKey?: string): LocalAccount {
  return getHiddenWalletLegacy(password, secretKey);
}