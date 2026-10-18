













export {
  createVaultSmartAccount,
  clearSmartAccountCache,
  getCachedSmartAccountAddress,
  getCachedSmartAccountMode } from
"./kernel";
export type { VaultSmartAccount, CreateSmartAccountParams } from "./kernel";

export { computeSmartAccountAddress } from "./kernel";

export {
  deriveIdentity,
  verifyAAAuth } from
"./deriveIdentity";
export type {
  VaultIdentity,
  VaultIdentityMode,
  VerifyAAAuthParams,
  VerifyAAAuthResult } from
"./deriveIdentity";

export { getOwnerFromPassword } from "./owner";

export {
  isSmartAccountConfigured,
  getTargetChain,
  getPimlicoApiKey } from
"./config";




export {
  initIdentityFromPassword,
  initIdentityFromSigner,
  clearIdentity,
  getIdentityAddress,
  isIdentityConnected,
  getIdentityOwner,
  getIdentitySmartAccount,
  getIdentityMode,
  signMessageWithIdentity,
  subscribeIdentity,
  getIdentitySnapshot } from
"./identity";

export { useIdentity } from "./useIdentity";
export type { UseIdentityReturn } from "./useIdentity";



export {
  generateSecretKey,
  isValidSecretKey,
  formatSecretKeyForDisplay,
  parseSecretKeyInput } from
"./secretKey";

export * from "./keyPassage";
export * from "./passageClient";
export * from "./keyedMigration";
