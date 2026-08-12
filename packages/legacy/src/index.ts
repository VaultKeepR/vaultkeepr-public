







export type {
  LegacyConfig,
  LegacyEnvelope,
  LegacyEnvelopeBundle,
  LegacyPayload,
  HeartbeatStatus,
  LegacySetupParams,
  BeneficiaryInfo,
  BeneficiaryContact,
  IncomingLegacy } from
"./types";

export {
  isValidBeneficiaryContact } from
"./types";

export {
  LEGACY_VERSION,
  MAX_BENEFICIARIES,
  MIN_DELAY_DAYS,
  MAX_DELAY_DAYS,
  MIN_GRACE_DAYS,
  MAX_GRACE_DAYS,
  HEARTBEAT_DEBOUNCE_MS,
  HKDF_LEGACY_INFO } from
"./types";


export {
  setupLegacy,
  claimLegacy,
  revokeLegacy,
  getLegacyStatus,
  checkIncomingLegacy,
  type SetupLegacyResult,
  type ClaimLegacyResult,
  type IpfsAdapter } from
"./legacy";


export {
  createEnvelope,
  decryptEnvelope,
  createEnvelopeBundle,
  decryptFromBundle,
  hashEnvelopeBundle,
  getPublicKeyFromPrivate,
  isValidPublicKey } from
"./envelope";


export {
  scheduleLegacyHeartbeat,
  flushLegacyHeartbeat,
  computeHeartbeatStatus,
  getLegacyHeartbeatStatus,
  resetLegacyHeartbeat } from
"./heartbeat";


export {
  generateInviteLink,
  parseInviteLink,
  generateBeneficiaryQrPayload,
  parseBeneficiaryQrPayload,
  validateBeneficiaryAddress,
  validateBeneficiary,
  validateBeneficiaryList,
  formatAddressShort,
  type LegacyQrData } from
"./beneficiary";


export {
  LEGACY_ABI,
  isLegacyContractConfigured,
  registerLegacyOnChain,
  sendHeartbeatOnChain,
  claimLegacyOnChain,
  revokeLegacyOnChain,
  updateBeneficiariesOnChain,
  updateDelayOnChain,
  updateEnvelopeCidOnChain,
  readLegacyFromChain,
  readHeartbeatFromChain,
  isClaimableOnChain,
  readBeneficiariesFromChain,
  readDeadlineFromChain } from
"./contract";


export {
  encryptBeneficiaryMeta,
  decryptBeneficiaryMeta,
  syncBeneficiariesToIpfs,
  fetchBeneficiariesFromIpfs,
  type BeneficiaryMetaEntry,
  type BeneSyncAuthOptions } from
"./beneficiaryMeta";