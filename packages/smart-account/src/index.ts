













export {
  createVaultSmartAccount,
  clearSmartAccountCache,
  getCachedSmartAccountAddress,
  getCachedSmartAccountMode } from
"./kernel";
export type { VaultSmartAccount, CreateSmartAccountParams } from "./kernel";

export { getOwnerFromPassword } from "./owner";

export {
  publishCidOnChain,
  readCidOnChain,
  isCidRegistryConfigured,
  CID_REGISTRY_ABI } from
"./cidRegistry";

export {
  isSmartAccountConfigured,
  getTargetChain,
  getPimlicoApiKey } from
"./config";

export {
  scheduleCidOnChainSync,
  flushCidOnChainSync,
  getOnChainSyncStatus,
  resetOnChainSync } from
"./onChainSync";



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