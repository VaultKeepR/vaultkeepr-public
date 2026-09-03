











import type { Doc } from "@automerge/automerge";


export const CRDT_SCHEMA_VERSION = 1;


export const AUTOMERGE_HEADER = new Uint8Array([0x85, 0x6f, 0x4a, 0x83]);









export interface CrdtVaultEntry {

  id: string;

  url: string;

  username: string;

  password: string;

  notes: string;

  folder: string;

  totpSecret: string;

  notesMasked: boolean;

  tags: string[];

  favorite: boolean;

  color: string;

  passwordHistory: Array<{password: string;changedAt: number;}>;

  passwordMaxAgeDays: number;

  passwordChangedAt: number;

  createdAt: string;

  customGroup: string;

  useCount: number;

  lastUsedAt: number;



  modifiedAt: number;

  replacedAt?: number;

  _deleted: boolean;

  _deletedAt: number;
}








export interface CrdtSecureDocument {
  id: string;

  type: string;

  label: string;

  fragments: string[];

  nonce: string;

  nfcFaceFragments: string[];

  nfcFaceNonce: string;

  blurredThumbnail: string;

  ocr: string;

  originalSize: number;

  mimeType: string;

  addedAt: string;

  modifiedAt: number;

  replacedAt?: number;

  _deleted: boolean;
  _deletedAt: number;
}








export interface CrdtCloudFile {
  id: string;
  category: string;
  fileName: string;
  folder: string;
  fragments: string[];
  nonce: string;
  thumbnail: string;
  originalSize: number;
  mimeType: string;
  fragmentCount: number;
  contentHash: string;
  description: string;
  tags: string[];
  favorite: boolean;
  addedAt: string;
  modifiedAt: number;

  replacedAt?: number;

  _deleted: boolean;
  _deletedAt: number;
}










export interface CrdtVaultSchema {

  [key: string]: unknown;

  version: number;

  createdAt: string;

  entries: Record<string, CrdtVaultEntry>;

  documents: Record<string, CrdtSecureDocument>;

  cloudFiles: Record<string, CrdtCloudFile>;

  folders: string[];

  cloudFolders: string[];



  _deviceId: string;

  _schemaVersion: number;
}


export type VaultDoc = Doc<CrdtVaultSchema>;