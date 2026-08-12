












export type {
  CrdtVaultEntry,
  CrdtSecureDocument,
  CrdtVaultSchema,
  VaultDoc } from
"./schema";

export {
  CRDT_SCHEMA_VERSION,
  AUTOMERGE_HEADER } from
"./schema";

export {
  createEmptyDoc,
  addEntry,
  updateEntry,
  updateEntryField,
  deleteEntry,
  addDocument,
  updateDocument,
  deleteDocument,
  addFolder,
  removeFolder,
  mergeDocuments,
  exportBinary,
  importBinary,
  toVault,
  fromLegacyVault,
  syncLegacyToCrdt,
  isAutomergeBinary } from
"./crdtVault";

export {
  purgeTombstones,
  countTombstones,
  TOMBSTONE_TTL_MS } from
"./tombstones";

export {
  migrateLegacyPayload,
  detectPayloadFormat,
  type PayloadFormat } from
"./compat";