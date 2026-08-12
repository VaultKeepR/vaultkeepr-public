import type { Vault, VaultEntry, FolderNode } from "./types";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  const cr =
  typeof crypto !== "undefined" ?
  crypto :
  (globalThis as unknown as {crypto: Crypto;}).crypto;
  cr.getRandomValues(bytes);

  bytes[6] = bytes[6] & 0x0f | 0x40;
  bytes[8] = bytes[8] & 0x3f | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    ""
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function createEmptyVault(): Vault {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    entries: [],
    folders: []
  };
}

export function createEntry(entry: Omit<VaultEntry, "id">): VaultEntry {
  return {
    ...entry,
    id: generateId(),
    modifiedAt: Date.now()
  };
}

export function addEntry(vault: Vault, entry: Omit<VaultEntry, "id">): Vault {
  const newEntry = createEntry(entry);
  return {
    ...vault,
    entries: [...vault.entries, newEntry]
  };
}

export function updateEntry(
vault: Vault,
id: string,
updates: Partial<Omit<VaultEntry, "id">>)
: Vault {
  const MAX_PASSWORD_HISTORY = 10;
  return {
    ...vault,
    entries: vault.entries.map((e) => {
      if (e.id !== id) return e;


      let passwordHistory = e.passwordHistory ? [...e.passwordHistory] : [];
      let passwordChangedAt = e.passwordChangedAt;

      if (
      updates.password !== undefined &&
      updates.password !== e.password &&
      e.password)
      {
        passwordHistory.push({
          password: e.password,
          changedAt: Date.now()
        });

        if (passwordHistory.length > MAX_PASSWORD_HISTORY) {
          passwordHistory = passwordHistory.slice(-MAX_PASSWORD_HISTORY);
        }
        passwordChangedAt = Date.now();
      }

      return {
        ...e,
        ...updates,
        passwordHistory,
        passwordChangedAt: passwordChangedAt ?? e.passwordChangedAt,
        modifiedAt: Date.now()
      };
    })
  };
}

export function removeEntry(vault: Vault, id: string): Vault {
  return {
    ...vault,
    entries: vault.entries.filter((e) => e.id !== id),




    entryTombstones: {
      ...(vault.entryTombstones ?? {}),
      [id]: Date.now()
    }
  };
}







export function createFolder(
vault: Vault,
name: string,
parentId: string | null = null)
: Vault {
  const id = `folder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const node: FolderNode = {
    id,
    name,
    parentId,
    sortOrder: (vault.folderTree ?? []).length,
    createdAt: Date.now()
  };
  return {
    ...vault,
    folderTree: [...(vault.folderTree ?? []), node],
    folders: [...(vault.folders ?? []), name]
  };
}




export function renameFolder(
vault: Vault,
folderId: string,
newName: string)
: Vault {
  const oldNode = (vault.folderTree ?? []).find((n) => n.id === folderId);
  const tree = (vault.folderTree ?? []).map((n) =>
  n.id === folderId ? { ...n, name: newName } : n
  );

  const folders = (vault.folders ?? []).map((f) =>
  f === (oldNode?.name ?? "") ? newName : f
  );
  return { ...vault, folderTree: tree, folders };
}




export function moveFolder(
vault: Vault,
folderId: string,
newParentId: string | null)
: Vault {
  const tree = (vault.folderTree ?? []).map((n) =>
  n.id === folderId ? { ...n, parentId: newParentId } : n
  );
  return { ...vault, folderTree: tree };
}





export function deleteUserFolder(vault: Vault, folderId: string): Vault {
  const node = (vault.folderTree ?? []).find((n) => n.id === folderId);
  const tree = (vault.folderTree ?? []).filter((n) => n.id !== folderId);
  const folders = node ? (vault.folders ?? []).filter((f) => f !== node.name) : vault.folders;


  const tombstones: Record<string, number> = { ...(vault.folderTombstones ?? {}) };
  tombstones[folderId] = Date.now();

  return { ...vault, folderTree: tree, folders, folderTombstones: tombstones };
}

export function parseVault(json: string): Vault {
  const parsed = JSON.parse(json);



  if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof parsed.version !== "number" ||
  !Array.isArray(parsed.entries))
  {
    throw new Error("Invalid vault format: missing required fields");
  }


  for (let i = 0; i < parsed.entries.length; i++) {
    const e = parsed.entries[i];
    if (
    typeof e !== "object" ||
    e === null ||
    typeof e.id !== "string" ||
    e.id.length === 0)
    {
      throw new Error(
        `Invalid vault entry at index ${i}: missing or invalid id`
      );
    }

    if (typeof e.url !== "string") {
      if (e.url === null || e.url === undefined) e.url = "";else

      throw new Error(
        `Invalid vault entry at index ${i}: url must be a string`
      );
    }
    if (typeof e.username !== "string") {
      if (e.username === null || e.username === undefined) e.username = "";else

      throw new Error(
        `Invalid vault entry at index ${i}: username must be a string`
      );
    }
    if (typeof e.password !== "string") {
      if (e.password === null || e.password === undefined) e.password = "";else

      throw new Error(
        `Invalid vault entry at index ${i}: password must be a string`
      );
    }

    if (
    e.notes !== undefined &&
    e.notes !== null &&
    typeof e.notes !== "string")
    {
      throw new Error(
        `Invalid vault entry at index ${i}: notes must be a string`
      );
    }
    if (e.notes === null) e.notes = undefined;

    if (
    e.folder !== undefined &&
    e.folder !== null &&
    typeof e.folder !== "string")
    {
      throw new Error(
        `Invalid vault entry at index ${i}: folder must be a string`
      );
    }
    if (e.folder === null) e.folder = undefined;


    if (e.urls !== undefined && e.urls !== null) {
      if (!Array.isArray(e.urls)) {
        throw new Error(
          `Invalid vault entry at index ${i}: urls must be an array`
        );
      }
      for (let j = 0; j < e.urls.length; j++) {
        if (typeof e.urls[j] !== "object" || e.urls[j] === null || typeof e.urls[j].uri !== "string") {
          throw new Error(
            `Invalid vault entry at index ${i}: urls[${j}] must have a string uri property`
          );
        }
      }
    }
    if (e.urls === null) e.urls = undefined;

    if (
    e.totpSecret !== undefined &&
    e.totpSecret !== null &&
    typeof e.totpSecret !== "string")
    {
      throw new Error(
        `Invalid vault entry at index ${i}: totpSecret must be a string`
      );
    }
    if (e.totpSecret === null) e.totpSecret = undefined;
  }


  if (!Array.isArray(parsed.folders)) {

    parsed.folders = [];
  } else {
    for (let i = 0; i < parsed.folders.length; i++) {
      if (typeof parsed.folders[i] !== "string") {
        throw new Error(`Invalid vault folder at index ${i}: must be a string`);
      }
    }
  }


  if (parsed.cloudFiles !== undefined && parsed.cloudFiles !== null) {
    if (!Array.isArray(parsed.cloudFiles)) {
      throw new Error("Invalid vault format: cloudFiles must be an array");
    }
    for (let i = 0; i < parsed.cloudFiles.length; i++) {
      const f = parsed.cloudFiles[i];
      if (typeof f !== "object" || f === null || typeof f.id !== "string") {
        throw new Error(
          `Invalid cloud file at index ${i}: missing or invalid id`
        );
      }
      if (typeof f.fileName !== "string") {
        throw new Error(
          `Invalid cloud file at index ${i}: fileName must be a string`
        );
      }
      if (!Array.isArray(f.fragments)) {
        throw new Error(
          `Invalid cloud file at index ${i}: fragments must be an array`
        );
      }
    }
  }

  return parsed as Vault;
}

export function serializeVault(vault: Vault): string {
  const sanitized = {
    ...vault,
    entries: vault.entries.map((e) => ({
      ...e,
      url: e.url ?? "",
      username: e.username ?? "",
      password: e.password ?? "",
      notes: e.notes ?? undefined,
      folder: e.folder ?? undefined,
      totpSecret: e.totpSecret ?? undefined
    })),
    cloudFiles: vault.cloudFiles ?? undefined,
    cloudFolders: vault.cloudFolders ?? undefined,
    cloudQuotaUsed: vault.cloudQuotaUsed ?? 0,
    prfCredentials: vault.prfCredentials ?? undefined
  };
  return JSON.stringify(sanitized);
}











export function createExportPayload(vault: Vault, secretKey?: string): string {
  const payload: Record<string, unknown> = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: vault.entries.map((e) => ({

      ...e,

      url: e.url ?? "",
      username: e.username ?? "",
      password: e.password ?? ""
    }))
  };
  if (secretKey) {
    payload.secretKey = secretKey;
  }
  return JSON.stringify(payload, null, 2);
}

export async function updateEntryUseCount(
vault: Vault,
entryId: string,
increment: number = 1)
: Promise<Vault> {
  const updatedEntries = vault.entries.map((entry) => {
    if (entry.id === entryId) {
      return {
        ...entry,
        useCount: (entry.useCount || 0) + increment,
        lastUsedAt: Date.now()
      };
    }
    return entry;
  });
  return { ...vault, entries: updatedEntries };
}

export function getMostUsedEntries(
vault: Vault,
count: number = 5)
: VaultEntry[] {
  return [...vault.entries].
  filter((entry) => entry.useCount && entry.useCount > 0).
  sort((a, b) => (b.useCount || 0) - (a.useCount || 0)).
  slice(0, count);
}



export interface MergeImportStats {
  added: number;
  skipped: number;
  enriched: number;
}

export interface MergeImportResult {
  entries: VaultEntry[];
  stats: MergeImportStats;
}





export function normalizeUrl(raw: string): string {
  let u = (raw ?? "").trim().toLowerCase();

  u = u.replace(/^https?:\/\//, "");

  u = u.replace(/^www\./, "");

  u = u.replace(/#.*$/, "");

  u = u.replace(/\/+$/, "");
  return u;
}






export function entryFingerprint(entry: {
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  folder?: string;
}): string {
  const url = normalizeUrl(entry.url ?? "");
  const user = (entry.username ?? "").trim().toLowerCase();
  const pass = entry.password ?? "";
  const notes = (entry.notes ?? "").trim();
  const folder = (entry.folder ?? "").trim().toLowerCase();
  return `${url}|${user}|${pass}|${notes}|${folder}`;
}








export function mergeImportedEntries(
existing: VaultEntry[],
imported: VaultEntry[])
: MergeImportResult {
  const stats: MergeImportStats = { added: 0, skipped: 0, enriched: 0 };


  const fpMap = new Map<string, number>();
  for (let i = 0; i < existing.length; i++) {
    const fp = entryFingerprint(existing[i]);
    fpMap.set(fp, i);
  }


  const merged = existing.map((e) => ({ ...e }));
  const enrichedIndices = new Set<number>();

  for (const imp of imported) {
    const fp = entryFingerprint(imp);

    const existingIdx = fpMap.get(fp);
    if (existingIdx !== undefined) {

      if (
      imp.totpSecret &&
      !merged[existingIdx].totpSecret &&
      !enrichedIndices.has(existingIdx))
      {
        merged[existingIdx] = {
          ...merged[existingIdx],
          totpSecret: imp.totpSecret,
          totpAlgorithm: imp.totpAlgorithm
        };
        enrichedIndices.add(existingIdx);
        stats.enriched++;
      } else {

        if (
        imp.notes &&
        !merged[existingIdx].notes &&
        !enrichedIndices.has(existingIdx))
        {
          merged[existingIdx] = { ...merged[existingIdx], notes: imp.notes };
          enrichedIndices.add(existingIdx);
          stats.enriched++;
        } else {
          stats.skipped++;
        }
      }
    } else {

      merged.push(imp);
      fpMap.set(fp, merged.length - 1);
      stats.added++;
    }
  }

  return { entries: merged, stats };
}








export function deduplicateEntries(entries: VaultEntry[]): {
  entries: VaultEntry[];
  removed: number;
} {


  const coreFingerprint = (e: VaultEntry): string => {
    const url = normalizeUrl(e.url ?? "");
    const user = (e.username ?? "").trim().toLowerCase();
    const pass = e.password ?? "";
    return `${url}|${user}|${pass}`;
  };

  const fpMap = new Map<string, number>();
  const result: VaultEntry[] = [];
  let removed = 0;

  for (const entry of entries) {
    const fp = coreFingerprint(entry);
    const existingIdx = fpMap.get(fp);
    if (existingIdx !== undefined) {

      const existing = result[existingIdx];
      if (entry.totpSecret && !existing.totpSecret) {
        result[existingIdx] = {
          ...existing,
          totpSecret: entry.totpSecret,
          totpAlgorithm: entry.totpAlgorithm
        };
      }
      if (entry.notes && !existing.notes) {
        result[existingIdx] = { ...existing, notes: entry.notes };
      }
      removed++;
    } else {
      fpMap.set(fp, result.length);
      result.push({ ...entry });
    }
  }

  return { entries: result, removed };
}