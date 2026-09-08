












import * as Automerge from "@automerge/automerge";
import type {
  CrdtVaultSchema,
  CrdtVaultEntry,
  CrdtSecureDocument,
  CrdtCloudFile,
  VaultDoc } from
"./schema";
import { CRDT_SCHEMA_VERSION, AUTOMERGE_HEADER } from "./schema";
import type {
  Vault,
  VaultEntry,
  SecureDocument,
  DocumentOcrData,
  CloudFile,
  CloudFileCategory } from
"@vault-keeper/core";










export function createEmptyDoc(deviceId: string): VaultDoc {
  return Automerge.from<CrdtVaultSchema>({
    version: 1,
    createdAt: new Date().toISOString(),
    entries: {},
    documents: {},
    cloudFiles: {},
    folders: [],
    cloudFolders: [],
    _deviceId: deviceId,
    _schemaVersion: CRDT_SCHEMA_VERSION
  });
}








export function addEntry(doc: VaultDoc, entry: VaultEntry): VaultDoc {
  return Automerge.change(doc, `add-entry-${entry.id}`, (d) => {
    d.entries[entry.id] = vaultEntryToCrdt(entry);
  });
}




export function updateEntry(doc: VaultDoc, entry: VaultEntry): VaultDoc {
  return Automerge.change(doc, `update-entry-${entry.id}`, (d) => {
    const existing = d.entries[entry.id];
    if (!existing || existing._deleted) return;

    const updated = vaultEntryToCrdt(entry);

    updated._deleted = false;
    updated._deletedAt = 0;
    updated.createdAt = existing.createdAt || updated.createdAt;
    updated.modifiedAt = Date.now();

    d.entries[entry.id] = updated;
  });
}





export function updateEntryField<K extends keyof CrdtVaultEntry>(
doc: VaultDoc,
entryId: string,
field: K,
value: CrdtVaultEntry[K])
: VaultDoc {
  return Automerge.change(doc, `update-${entryId}-${String(field)}`, (d) => {
    const entry = d.entries[entryId];
    if (!entry || entry._deleted) return;
    (entry as unknown as Record<string, unknown>)[field as string] = value;
    entry.modifiedAt = Date.now();
  });
}






export function deleteEntry(doc: VaultDoc, entryId: string): VaultDoc {
  return Automerge.change(doc, `delete-${entryId}`, (d) => {
    const entry = d.entries[entryId];
    if (!entry) return;
    entry._deleted = true;
    entry._deletedAt = Date.now();
  });
}








export function addDocument(doc: VaultDoc, secDoc: SecureDocument): VaultDoc {
  return Automerge.change(doc, `add-doc-${secDoc.id}`, (d) => {
    d.documents[secDoc.id] = secureDocToCrdt(secDoc);
  });
}




export function updateDocument(doc: VaultDoc, secDoc: SecureDocument): VaultDoc {
  return Automerge.change(doc, `update-doc-${secDoc.id}`, (d) => {
    const existing = d.documents[secDoc.id];
    if (!existing || existing._deleted) return;
    const updated = secureDocToCrdt(secDoc);
    updated._deleted = false;
    updated._deletedAt = 0;
    d.documents[secDoc.id] = updated;
  });
}




export function deleteDocument(doc: VaultDoc, docId: string): VaultDoc {
  return Automerge.change(doc, `delete-doc-${docId}`, (d) => {
    const document = d.documents[docId];
    if (!document) return;
    document._deleted = true;
    document._deletedAt = Date.now();
  });
}








export function addFolder(doc: VaultDoc, folderName: string): VaultDoc {
  return Automerge.change(doc, `add-folder-${folderName}`, (d) => {
    if (!d.folders.includes(folderName)) {
      d.folders.push(folderName);
    }
  });
}




export function removeFolder(doc: VaultDoc, folderName: string): VaultDoc {
  return Automerge.change(doc, `remove-folder-${folderName}`, (d) => {
    const idx = d.folders.indexOf(folderName);
    if (idx >= 0) {
      d.folders.splice(idx, 1);
    }
  });
}

















export function mergeDocuments(local: VaultDoc, remote: VaultDoc): VaultDoc {

  try {
    const localClone = Automerge.clone(local);
    const merged = Automerge.merge(localClone, remote);



    const remoteEntryIds = Object.keys(remote.entries || {});
    const localEntryIds = Object.keys(local.entries || {});
    const mergedEntryIds = new Set(Object.keys(merged.entries || {}));
    const allRemotePresent = remoteEntryIds.every((id) => mergedEntryIds.has(id));
    const allLocalPresent = localEntryIds.every((id) => mergedEntryIds.has(id));

    if (allRemotePresent && allLocalPresent ||
    remoteEntryIds.length === 0 && localEntryIds.length === 0) {




      return postProcessPerFieldLww(merged, local, remote);
    }

  } catch {

  }



  return mergeIndependentDocs(Automerge.clone(local), remote);
}






















function postProcessPerFieldLww(
merged: VaultDoc,
local: VaultDoc,
remote: VaultDoc)
: VaultDoc {
  return Automerge.change(merged, "post-process-per-field-lww", (d) => {
    for (const [id, localEntry] of Object.entries(local.entries || {})) {
      const remoteEntry = remote.entries?.[id];
      const mergedEntry = d.entries[id];
      if (!remoteEntry || !mergedEntry) continue;
      applyStalenessFix(
        mergedEntry as unknown as Record<string, unknown>,
        localEntry as unknown as Record<string, unknown>,
        remoteEntry as unknown as Record<string, unknown>
      );
    }
    for (const [id, localDoc] of Object.entries(local.documents || {})) {
      const remoteDoc = remote.documents?.[id];
      const mergedDoc = d.documents[id];
      if (!remoteDoc || !mergedDoc) continue;
      applyStalenessFix(
        mergedDoc as unknown as Record<string, unknown>,
        localDoc as unknown as Record<string, unknown>,
        remoteDoc as unknown as Record<string, unknown>
      );
    }
    for (const [id, localCloud] of Object.entries(local.cloudFiles || {})) {
      const remoteCloud = remote.cloudFiles?.[id];
      const mergedCloud = d.cloudFiles[id];
      if (!remoteCloud || !mergedCloud) continue;
      applyStalenessFix(
        mergedCloud as unknown as Record<string, unknown>,
        localCloud as unknown as Record<string, unknown>,
        remoteCloud as unknown as Record<string, unknown>
      );
    }
  });
}









function applyStalenessFix(
merged: Record<string, unknown>,
local: Record<string, unknown>,
remote: Record<string, unknown>)
: void {
  const localRep = (local.replacedAt as number | undefined) ?? (local.modifiedAt as number | undefined) ?? 0;
  const remoteRep = (remote.replacedAt as number | undefined) ?? (remote.modifiedAt as number | undefined) ?? 0;
  if (localRep === remoteRep) return;

  const newerIsLocal = localRep > remoteRep;
  const allKeys = new Set<string>([...Object.keys(local), ...Object.keys(remote)]);
  for (const key of allKeys) {
    if (key === "id") continue;
    if (key === "_deleted" || key === "_deletedAt") continue;

    const lVal = local[key];
    const rVal = remote[key];
    if (deepEqual(lVal, rVal)) continue;

    if (newerIsLocal) {

      if (!deepEqual(merged[key], rVal)) continue;
      if (deepEqual(lVal, rVal)) continue;
      merged[key] = lVal;
    } else {

      if (!deepEqual(merged[key], lVal)) continue;
      if (deepEqual(rVal, lVal)) continue;
      merged[key] = rVal;
    }
  }
}


























function mergeIndependentDocs(local: VaultDoc, remote: VaultDoc): VaultDoc {
  return Automerge.change(local, "merge-independent-remote", (d) => {

    for (const [id, remoteEntry] of Object.entries(remote.entries || {})) {
      const localEntry = d.entries[id];
      if (!localEntry) {
        d.entries[id] = { ...remoteEntry } as CrdtVaultEntry;
        continue;
      }
      applyStalenessFix(
        localEntry as unknown as Record<string, unknown>,
        localEntry as unknown as Record<string, unknown>,
        remoteEntry as unknown as Record<string, unknown>
      );

      if (remoteEntry._deleted && !localEntry._deleted) {
        localEntry._deleted = true;
        localEntry._deletedAt = remoteEntry._deletedAt;
      }
    }


    for (const [id, remoteDoc] of Object.entries(remote.documents || {})) {
      const localDoc = d.documents[id];
      if (!localDoc) {
        d.documents[id] = { ...remoteDoc } as CrdtSecureDocument;
        continue;
      }
      applyStalenessFix(
        localDoc as unknown as Record<string, unknown>,
        localDoc as unknown as Record<string, unknown>,
        remoteDoc as unknown as Record<string, unknown>
      );
      if (remoteDoc._deleted && !localDoc._deleted) {
        localDoc._deleted = true;
        localDoc._deletedAt = remoteDoc._deletedAt;
      }
    }


    for (const [id, remoteCloud] of Object.entries(remote.cloudFiles || {})) {
      const localCloud = d.cloudFiles[id];
      if (!localCloud) {
        d.cloudFiles[id] = { ...remoteCloud } as CrdtCloudFile;
        continue;
      }
      applyStalenessFix(
        localCloud as unknown as Record<string, unknown>,
        localCloud as unknown as Record<string, unknown>,
        remoteCloud as unknown as Record<string, unknown>
      );
      if (remoteCloud._deleted && !localCloud._deleted) {
        localCloud._deleted = true;
        localCloud._deletedAt = remoteCloud._deletedAt;
      }
    }


    for (const folder of remote.folders || []) {
      if (!d.folders.includes(folder)) {
        d.folders.push(folder);
      }
    }
  });
}





function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (!deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
  }
  return true;
}






export function exportBinary(doc: VaultDoc): Uint8Array {
  return Automerge.save(doc);
}








export function importBinary(binary: Uint8Array): VaultDoc {
  let doc: VaultDoc;
  try {
    doc = Automerge.load<CrdtVaultSchema>(binary);
  } catch (e) {
    throw new Error(`Failed to load CRDT document: ${e instanceof Error ? e.message : "unknown error"}`);
  }

  if (typeof doc.entries !== "object" || doc.entries === null) {
    throw new Error("Invalid CRDT document: missing entries map");
  }
  return doc;
}





export function isAutomergeBinary(data: Uint8Array | string): boolean {
  if (typeof data === "string") {

    return false;
  }
  if (data.length < AUTOMERGE_HEADER.length) return false;
  return data.every((byte, i) =>
  i < AUTOMERGE_HEADER.length ? byte === AUTOMERGE_HEADER[i] : true
  );
}












export function toVault(doc: VaultDoc): Vault {
  const entries: VaultEntry[] = [];
  for (const entry of Object.values(doc.entries || {})) {
    if (entry._deleted) continue;
    entries.push(crdtToVaultEntry(entry));
  }

  const documents: SecureDocument[] = [];
  for (const secDoc of Object.values(doc.documents || {})) {
    if (secDoc._deleted) continue;
    documents.push(crdtToSecureDoc(secDoc));
  }

  const cloudFiles: CloudFile[] = [];
  let cloudQuotaUsed = 0;
  for (const cFile of Object.values(doc.cloudFiles || {})) {
    if (cFile._deleted) continue;
    cloudFiles.push(crdtToCloudFile(cFile));
    cloudQuotaUsed += cFile.originalSize || 0;
  }

  return {
    version: doc.version || 1,
    createdAt: doc.createdAt || new Date().toISOString(),
    entries,
    folders: [...(doc.folders || [])],
    documents: documents.length > 0 ? documents : undefined,
    cloudFiles: cloudFiles.length > 0 ? cloudFiles : undefined,
    cloudFolders: doc.cloudFolders && doc.cloudFolders.length > 0 ? [...doc.cloudFolders] : undefined,
    cloudQuotaUsed
  };
}










export function fromLegacyVault(vault: Vault, deviceId: string): VaultDoc {
  const initial: CrdtVaultSchema = {
    version: vault.version || 1,
    createdAt: vault.createdAt || new Date().toISOString(),
    entries: {},
    documents: {},
    cloudFiles: {},
    folders: vault.folders || [],
    cloudFolders: vault.cloudFolders || [],
    _deviceId: deviceId,
    _schemaVersion: CRDT_SCHEMA_VERSION
  };

  let doc = Automerge.from<CrdtVaultSchema>(initial);

  doc = Automerge.change(doc, "migrate-from-lww", (d) => {
    for (const entry of vault.entries) {
      d.entries[entry.id] = vaultEntryToCrdt(entry);
    }
    for (const secDoc of vault.documents || []) {
      d.documents[secDoc.id] = secureDocToCrdt(secDoc);
    }
    for (const cFile of vault.cloudFiles || []) {
      d.cloudFiles[cFile.id] = cloudFileToCrdt(cFile);
    }
  });

  return doc;
}














export function syncLegacyToCrdt(doc: VaultDoc, vault: Vault): VaultDoc {
  return Automerge.change(doc, "sync-from-legacy", (d) => {

    d.version = vault.version || d.version || 1;
    if (vault.folders) d.folders = [...vault.folders];


    const presentEntryIds = new Set<string>();
    const presentDocIds = new Set<string>();
    const presentCloudIds = new Set<string>();


    for (const entry of vault.entries) {
      presentEntryIds.add(entry.id);
      const existing = d.entries[entry.id];
      if (!existing) {
        d.entries[entry.id] = vaultEntryToCrdt(entry);
      } else {

        if (!existing.modifiedAt || entry.modifiedAt && entry.modifiedAt >= existing.modifiedAt) {
          for (const key of Object.keys(entry) as Array<keyof VaultEntry>) {
            if (key === "id") continue;
            const val = entry[key];
            if (val === undefined) {
              delete (existing as unknown as Record<string, unknown>)[key];
            } else {
              (existing as unknown as Record<string, unknown>)[key] = val;
            }
          }
        }
      }
    }


    for (const secDoc of vault.documents || []) {
      presentDocIds.add(secDoc.id);
      const existing = d.documents[secDoc.id];
      if (!existing) {
        d.documents[secDoc.id] = secureDocToCrdt(secDoc);
      } else {
        if (!existing.modifiedAt || secDoc.modifiedAt && secDoc.modifiedAt >= existing.modifiedAt) {
          for (const key of Object.keys(secDoc) as Array<keyof SecureDocument>) {
            if (key === "id") continue;
            const val = secDoc[key];
            if (val === undefined) {
              delete (existing as unknown as Record<string, unknown>)[key];
            } else {
              (existing as unknown as Record<string, unknown>)[key] = val;
            }
          }
        }
      }
    }


    for (const cFile of vault.cloudFiles || []) {
      presentCloudIds.add(cFile.id);
      const existing = d.cloudFiles[cFile.id];
      if (!existing) {
        d.cloudFiles[cFile.id] = cloudFileToCrdt(cFile);
      } else {
        if (!existing.modifiedAt || cFile.modifiedAt && cFile.modifiedAt >= existing.modifiedAt) {
          for (const key of Object.keys(cFile) as Array<keyof CloudFile>) {
            if (key === "id") continue;
            const val = cFile[key];
            if (val === undefined) {
              delete (existing as unknown as Record<string, unknown>)[key];
            } else {
              (existing as unknown as Record<string, unknown>)[key] = val;
            }
          }
        }
      }
    }


    for (const [id, crdtEntry] of Object.entries(d.entries)) {
      if (!crdtEntry._deleted && !presentEntryIds.has(id)) {
        crdtEntry._deleted = true;
        crdtEntry._deletedAt = Date.now();
      }
    }


    for (const [id, crdtSecDoc] of Object.entries(d.documents)) {
      if (!crdtSecDoc._deleted && !presentDocIds.has(id)) {
        crdtSecDoc._deleted = true;
        crdtSecDoc._deletedAt = Date.now();
      }
    }


    for (const [id, crdtCloud] of Object.entries(d.cloudFiles || {})) {
      if (!crdtCloud._deleted && !presentCloudIds.has(id)) {
        crdtCloud._deleted = true;
        crdtCloud._deletedAt = Date.now();
      }
    }


    const newCloudFolders = vault.cloudFolders || [];

    while (d.cloudFolders && d.cloudFolders.length > 0) {
      d.cloudFolders.pop();
    }
    if (!d.cloudFolders) {
      d.cloudFolders = [];
    }
    for (const f of newCloudFolders) {
      d.cloudFolders.push(f);
    }
  });
}

function vaultEntryToCrdt(e: VaultEntry): CrdtVaultEntry {
  return {
    id: e.id,
    url: e.url || "",
    username: e.username || "",
    password: e.password || "",
    notes: e.notes || "",
    folder: e.folder || "identifiants",
    totpSecret: e.totpSecret || "",
    notesMasked: e.notesMasked || false,
    tags: e.tags || [],
    favorite: e.favorite || false,
    color: e.color || "",
    passwordHistory: e.passwordHistory || [],
    passwordMaxAgeDays: e.passwordMaxAgeDays || 0,
    passwordChangedAt: e.passwordChangedAt || 0,
    createdAt: e.createdAt || new Date().toISOString(),
    customGroup: e.customGroup || "",
    useCount: e.useCount || 0,
    lastUsedAt: e.lastUsedAt || 0,
    modifiedAt: e.modifiedAt || Date.now(),
    replacedAt: e.modifiedAt || Date.now(),
    _deleted: false,
    _deletedAt: 0
  };
}

function crdtToVaultEntry(c: CrdtVaultEntry): VaultEntry {
  return {
    id: c.id,
    url: c.url,
    username: c.username,
    password: c.password,
    notes: c.notes || undefined,
    folder: c.folder || undefined,
    totpSecret: c.totpSecret || undefined,
    notesMasked: c.notesMasked || undefined,
    tags: c.tags?.length ? c.tags : undefined,
    favorite: c.favorite || undefined,
    color: c.color || undefined,
    passwordHistory: c.passwordHistory?.length ? c.passwordHistory : undefined,
    passwordMaxAgeDays: c.passwordMaxAgeDays || undefined,
    passwordChangedAt: c.passwordChangedAt || undefined,
    createdAt: c.createdAt,
    customGroup: c.customGroup || undefined,
    useCount: c.useCount || undefined,
    lastUsedAt: c.lastUsedAt || undefined,
    modifiedAt: c.modifiedAt
  };
}

function secureDocToCrdt(d: SecureDocument): CrdtSecureDocument {
  return {
    id: d.id,
    type: d.type,
    label: d.label,
    fragments: [...d.fragments],
    nonce: d.nonce,
    nfcFaceFragments: d.nfcFaceFragments ? [...d.nfcFaceFragments] : [],
    nfcFaceNonce: d.nfcFaceNonce || "",
    blurredThumbnail: d.blurredThumbnail,
    ocr: d.ocr ? JSON.stringify(d.ocr) : "",
    originalSize: d.originalSize,
    mimeType: d.mimeType,
    addedAt: d.addedAt,
    modifiedAt: d.modifiedAt || 0,
    replacedAt: d.modifiedAt || 0,
    _deleted: false,
    _deletedAt: 0
  };
}

function crdtToSecureDoc(c: CrdtSecureDocument): SecureDocument {
  let ocr: DocumentOcrData | undefined;
  if (c.ocr) {
    try {
      ocr = JSON.parse(c.ocr) as DocumentOcrData;
    } catch {

    }
  }

  return {
    id: c.id,
    type: c.type as SecureDocument["type"],
    label: c.label,
    fragments: [...c.fragments],
    nonce: c.nonce,
    nfcFaceFragments: c.nfcFaceFragments?.length ? [...c.nfcFaceFragments] : undefined,
    nfcFaceNonce: c.nfcFaceNonce || undefined,
    blurredThumbnail: c.blurredThumbnail,
    ocr,
    originalSize: c.originalSize,
    mimeType: c.mimeType,
    addedAt: c.addedAt,
    modifiedAt: c.modifiedAt || undefined
  };
}

function cloudFileToCrdt(c: CloudFile): CrdtCloudFile {
  return {
    id: c.id,
    category: c.category,
    fileName: c.fileName,
    folder: c.folder || "",
    fragments: [...c.fragments],
    nonce: c.nonce,
    thumbnail: c.thumbnail || "",
    originalSize: c.originalSize,
    mimeType: c.mimeType,
    fragmentCount: c.fragmentCount,
    contentHash: c.contentHash,
    description: c.description || "",
    tags: c.tags ? [...c.tags] : [],
    favorite: c.favorite || false,
    addedAt: c.addedAt,
    modifiedAt: c.modifiedAt || Date.now(),
    replacedAt: c.modifiedAt || Date.now(),
    _deleted: false,
    _deletedAt: 0
  };
}

function crdtToCloudFile(c: CrdtCloudFile): CloudFile {
  return {
    id: c.id,
    category: c.category as CloudFileCategory,
    fileName: c.fileName,
    folder: c.folder || undefined,
    fragments: [...c.fragments],
    nonce: c.nonce,
    thumbnail: c.thumbnail || undefined,
    originalSize: c.originalSize,
    mimeType: c.mimeType,
    fragmentCount: c.fragmentCount,
    contentHash: c.contentHash,
    description: c.description || undefined,
    tags: c.tags?.length ? [...c.tags] : undefined,
    favorite: c.favorite || undefined,
    addedAt: c.addedAt,
    modifiedAt: c.modifiedAt || undefined
  };
}