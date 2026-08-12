export interface VaultEntry {
  id: string;
  url: string;
  username: string;
  password: string;
  notes?: string;
  folder?: string;


  title?: string;


  urls?: VaultEntryUri[];


  customFields?: CustomField[];

  totpSecret?: string;


  totpAlgorithm?: string;

  notesMasked?: boolean;

  useCount?: number;

  lastUsedAt?: number;

  createdAt?: string;


  modifiedAt?: number;

  customGroup?: string;


  tags?: string[];


  favorite?: boolean;


  color?: string;


  passwordHistory?: {password: string;changedAt: number;}[];


  passwordMaxAgeDays?: number;


  passwordChangedAt?: number;
}





export interface CustomField {
  name: string;
  value: string;
  type: "text" | "hidden" | "url" | "boolean";
}






export type VaultEntryUriMatchType = "exact" | "hostname" | "baseDomain" | "never";

export interface VaultEntryUri {
  uri: string;
  matchType?: VaultEntryUriMatchType;
}






export interface FolderNode {
  id: string;
  name: string;

  parentId: string | null;
  icon?: string;
  sortOrder: number;
  createdAt: number;
}






export interface PasskeyEntry {
  id: string;
  type: "passkey";
  rpId: string;
  rpName: string;
  userName: string;
  userDisplayName: string;
  userId: string;
  credentialId: string;
  privateKeyHex: string;
  publicKeyHex: string;
  algorithm: -7;
  counter: number;
  createdAt: string;
  lastUsedAt?: string;
  transports?: string[];


  url: string;
  folder: "passkeys";
  username: string;
  password: string;
  notes?: string;
}






export interface SeedPhraseEntry {
  id: string;
  type: "seed";


  walletName: string;


  wordCount: 12 | 15 | 18 | 21 | 24;


  derivationPath?: string;


  network?: string;

  createdAt: string;


  url: string;
  folder: "seeds";
  username: string;
  password: string;
  notes?: string;
}


export type SecureDocumentType =
"cni" |
"passport" |
"permit" |
"rib" |
"insurance" |
"other";

export interface DocumentOcrData {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  documentNumber?: string;
  expiryDate?: string;
  birthDate?: string;
  nationality?: string;
  gender?: string;
  documentType?: string;
  issuingAuthority?: string;
  rawText?: string;
  faceImageBase64?: string;
}


export interface SecureDocument {
  id: string;
  type: SecureDocumentType;
  label: string;


  fragments: string[];


  nonce: string;


  nfcFaceFragments?: string[];


  nfcFaceNonce?: string;


  blurredThumbnail: string;


  ocr?: DocumentOcrData;


  originalSize: number;


  mimeType: string;

  addedAt: string;
  modifiedAt?: number;
}


export type CloudFileCategory = "photo" | "document";


export interface CloudFile {
  id: string;
  category: CloudFileCategory;
  fileName: string;
  folder?: string;
  fragments: string[];
  nonce: string;
  thumbnail?: string;
  originalSize: number;
  mimeType: string;
  fragmentCount: number;
  contentHash: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
  addedAt: string;
  modifiedAt?: number;
}

export const DEFAULT_FRAGMENT_COUNT = 4;

export interface Vault {
  version: number;
  createdAt: string;
  entries: VaultEntry[];
  folders: string[];

  folderTree?: FolderNode[];

  documents?: SecureDocument[];

  cloudFiles?: CloudFile[];

  cloudFolders?: string[];

  cloudQuotaUsed?: number;






  folderTombstones?: Record<string, number>;

  cloudFolderTombstones?: Record<string, number>;







  entryTombstones?: Record<string, number>;





  legacyContacts?: LegacyContact[];





  prfCredentials?: PrfCredentialRecord[];




  monitoredEmails?: string[];
}





export interface PrfCredentialRecord {
  credentialId: string;
  prfSalt: string;
  authenticatorType: string;
  deviceName: string;
  createdAt: string;
  lastUsedAt: string | null;
  passwordHash: string;
}





export interface LegacyContact {

  label: string;

  email?: string;

  telegram?: string;

  address?: string;

  publicKey?: string;

  status: "pending" | "confirmed";

  addedAt: string;
}

export interface EncryptedVault {
  ciphertext: string;
  nonce: string;
  envelope?: string;

  commitment?: string;
  version: number;
}

export interface KeyEnvelope {
  ephemeralPublicKey: string;
  ciphertext: string;
  nonce: string;
}

export interface VaultPayload {
  ciphertext: string;
  nonce: string;
  envelope: KeyEnvelope;
  version: number;
}

export type FragmentDestination =
"device" |
"ipfs" |
"contact" |
"smartcontract" |
"api";

export const FRAGMENTED_DEFAULT_THRESHOLD = 3;
export const FRAGMENTED_DEFAULT_TOTAL = 5;

export interface FragmentedConfig {
  threshold: number;
  total: number;

  distribution: Record<FragmentDestination, number>;
}

export interface FragmentedPayload {
  version: 5;
  ciphertext: string;
  nonce: string;
  commitment?: string;
  threshold: number;
  total: number;

  lookupIdHash: string;
  updatedAt?: number;
}

export interface EncryptedFragmentPayload {
  version: 5;
  fragmentIndex: number;
  ciphertext: string;
  nonce: string;
}

export interface FragmentedManifest {
  version: 5;
  lookupIdHash: string;
  vaultCid: string;
  threshold: number;
  total: number;

  partCids: Record<number, string>;
  updatedAt: number;
}