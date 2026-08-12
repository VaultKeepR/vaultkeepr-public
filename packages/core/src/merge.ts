






















import type { Vault, VaultEntry, SecureDocument, CloudFile, PrfCredentialRecord, FolderNode } from "./types";



const TOMBSTONE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function eq(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}






function deterministicPick<T>(a: T, b: T): T {
  return JSON.stringify(a) <= JSON.stringify(b) ? a : b;
}







function mergeEntry(base: VaultEntry, local: VaultEntry, remote: VaultEntry): VaultEntry {
  return mergeItemByField(base, local, remote) as VaultEntry;
}


















function mergeEntries(
base: VaultEntry[],
local: VaultEntry[],
remote: VaultEntry[],
baseTombstones: Record<string, number>,
localTombstones: Record<string, number>,
remoteTombstones: Record<string, number>,
now: number)
: {entries: VaultEntry[];tombstones: Record<string, number>;} {

  const tombstones: Record<string, number> = { ...baseTombstones };
  for (const ts of [localTombstones, remoteTombstones]) {
    for (const [id, t] of Object.entries(ts)) {
      tombstones[id] = Math.max(tombstones[id] ?? 0, t);
    }
  }

  const baseMap = new Map(base.map((e) => [e.id, e]));
  const localMap = new Map(local.map((e) => [e.id, e]));
  const remoteMap = new Map(remote.map((e) => [e.id, e]));
  const allIds = new Set([...baseMap.keys(), ...localMap.keys(), ...remoteMap.keys()]);
  const merged: VaultEntry[] = [];

  for (const id of allIds) {
    const b = baseMap.get(id);
    const l = localMap.get(id);
    const r = remoteMap.get(id);
    const ts = tombstones[id];


    if (ts !== undefined) {
      const lTime = l?.modifiedAt ?? 0;
      const rTime = r?.modifiedAt ?? 0;
      const lRecreated = !!l && lTime > ts;
      const rRecreated = !!r && rTime > ts;

      if (lRecreated || rRecreated) {

        delete tombstones[id];
        if (lRecreated && rRecreated) {
          merged.push(lTime >= rTime ? l! : r!);
        } else if (lRecreated) {
          merged.push(l!);
        } else {
          merged.push(r!);
        }
        continue;
      }

      continue;
    }



    if (!b && l && !r) {merged.push(l);continue;}

    if (!b && !l && r) {merged.push(r);continue;}

    if (!b && l && r) {
      const lTime = l.modifiedAt ?? 0;
      const rTime = r.modifiedAt ?? 0;
      merged.push(lTime >= rTime ? l : r);
      continue;
    }

    if (b && !l && r) {
      const rTime = r.modifiedAt ?? 0;
      const bTime = b.modifiedAt ?? 0;
      if (rTime > bTime) merged.push(r);
      continue;
    }

    if (b && l && !r) {
      const lTime = l.modifiedAt ?? 0;
      const bTime = b.modifiedAt ?? 0;
      if (lTime < bTime) continue;
      merged.push(l);
      continue;
    }

    if (b && !l && !r) continue;

    if (b && l && r) {merged.push(mergeEntry(b, l, r));continue;}

    if (l) merged.push(l);else
    if (r) merged.push(r);
  }


  for (const [id, t] of Object.entries(tombstones)) {
    if (now - t > TOMBSTONE_TTL_MS) delete tombstones[id];
  }

  return { entries: merged, tombstones };
}





function mergeItemByField<T extends {id: string;modifiedAt?: number;}>(
base: T,
local: T,
remote: T)
: T {
  const allKeys = new Set<string>([
  ...Object.keys(base),
  ...Object.keys(local),
  ...Object.keys(remote)]
  );

  const result: Record<string, unknown> = { ...base };
  const lTime = local.modifiedAt ?? 0;
  const rTime = remote.modifiedAt ?? 0;

  for (const key of allKeys) {
    if (key === "id") continue;

    const bVal = (base as Record<string, unknown>)[key];
    const lVal = (local as Record<string, unknown>)[key];
    const rVal = (remote as Record<string, unknown>)[key];

    const localChanged = !eq(lVal, bVal);
    const remoteChanged = !eq(rVal, bVal);

    if (localChanged && !remoteChanged) {
      result[key] = lVal;
    } else if (!localChanged && remoteChanged) {
      result[key] = rVal;
    } else if (localChanged && remoteChanged) {
      if (lTime > rTime) result[key] = lVal;else
      if (rTime > lTime) result[key] = rVal;else
      result[key] = deterministicPick(lVal, rVal);
    }

  }

  result.modifiedAt = Math.max(lTime, rTime);
  return result as unknown as T;
}





function mergeById<T extends {id: string;modifiedAt?: number;updatedAt?: number;}>(
base: T[],
local: T[],
remote: T[],
fieldMerge?: (b: T, l: T, r: T) => T)
: T[] {
  const baseMap = new Map(base.map((i) => [i.id, i]));
  const localMap = new Map(local.map((i) => [i.id, i]));
  const remoteMap = new Map(remote.map((i) => [i.id, i]));
  const allIds = new Set([...baseMap.keys(), ...localMap.keys(), ...remoteMap.keys()]);
  const merged: T[] = [];

  for (const id of allIds) {
    const b = baseMap.get(id);
    const l = localMap.get(id);
    const r = remoteMap.get(id);


    if (!b && l && !r) {merged.push(l);continue;}

    if (!b && !l && r) {merged.push(r);continue;}

    if (!b && l && r) {
      const lTime = l.modifiedAt ?? l.updatedAt ?? 0;
      const rTime = r.modifiedAt ?? r.updatedAt ?? 0;
      merged.push(lTime >= rTime ? l : r);
      continue;
    }

    if (b && !l && r) {
      const rTime = r.modifiedAt ?? r.updatedAt ?? 0;
      const bTime = b.modifiedAt ?? b.updatedAt ?? 0;

      if (rTime > bTime) merged.push(r);

      continue;
    }










    if (b && l && !r) {
      const lTime = l.modifiedAt ?? l.updatedAt ?? 0;
      const bTime = b.modifiedAt ?? b.updatedAt ?? 0;
      if (lTime < bTime) {

        continue;
      }




      merged.push(l);
      continue;
    }

    if (b && !l && !r) continue;

    if (b && l && r) {
      if (fieldMerge) {
        merged.push(fieldMerge(b, l, r));
      } else {

        const lTime = l.modifiedAt ?? l.updatedAt ?? 0;
        const rTime = r.modifiedAt ?? r.updatedAt ?? 0;
        merged.push(lTime >= rTime ? l : r);
      }
      continue;
    }

    if (l) merged.push(l);else
    if (r) merged.push(r);
  }

  return merged;
}












function mergePrfCredentials(
local: PrfCredentialRecord[],
remote: PrfCredentialRecord[])
: PrfCredentialRecord[] {
  const byId = new Map<string, PrfCredentialRecord>();
  for (const cred of remote) byId.set(cred.credentialId, cred);
  for (const cred of local) byId.set(cred.credentialId, cred);
  return Array.from(byId.values());
}

export function threeWayMerge(
base: Vault | null | undefined,
local: Vault,
remote: Vault)
: Vault {

  const effectiveBase: Vault = base ?? {
    version: local.version,
    createdAt: local.createdAt,
    entries: [],
    folders: [],
    documents: [],
    cloudFiles: [],
    cloudFolders: []
  };


  const entryResult = mergeEntries(
    effectiveBase.entries,
    local.entries,
    remote.entries,
    base ? base.entryTombstones ?? {} : {},
    local.entryTombstones ?? {},
    remote.entryTombstones ?? {},
    Date.now()
  );
  const mergedEntries = entryResult.entries;
  const mergedEntryTombstones = entryResult.tombstones;


  const mergedDocuments = mergeById<SecureDocument>(
    effectiveBase.documents ?? [],
    local.documents ?? [],
    remote.documents ?? [],
    mergeItemByField
  );


  const mergedCloudFiles = mergeById<CloudFile>(
    effectiveBase.cloudFiles ?? [],
    local.cloudFiles ?? [],
    remote.cloudFiles ?? [],
    mergeItemByField
  );




  const folderResult = mergeFolders(
    base ? base.folders : null,
    local.folders || [],
    remote.folders || [],
    base ? base.folderTombstones ?? {} : {},
    local.folderTombstones ?? {},
    remote.folderTombstones ?? {},
    Date.now()
  );
  const mergedFolders = folderResult.names;
  const mergedFolderTombstones = folderResult.tombstones;

  const cloudFolderResult = mergeFolders(
    base ? base.cloudFolders ?? null : null,
    local.cloudFolders || [],
    remote.cloudFolders || [],
    base ? base.cloudFolderTombstones ?? {} : {},
    local.cloudFolderTombstones ?? {},
    remote.cloudFolderTombstones ?? {},
    Date.now()
  );
  const mergedCloudFolders = cloudFolderResult.names;
  const mergedCloudFolderTombstones = cloudFolderResult.tombstones;


  const mergedFolderTree = mergeFolderTrees(
    local.folderTree ?? [],
    remote.folderTree ?? []
  );


  const mergedQuota = mergedCloudFiles.reduce(
    (sum, f) => sum + (f.originalSize || 0),
    0
  );

  const out: Vault = {
    version: Math.max(local.version, remote.version),
    createdAt: local.createdAt,
    entries: mergedEntries,
    folders: mergedFolders,
    folderTree: mergedFolderTree,
    documents: mergedDocuments,
    cloudFiles: mergedCloudFiles,
    cloudFolders: mergedCloudFolders,
    cloudQuotaUsed: mergedQuota,
    prfCredentials: mergePrfCredentials(
      local.prfCredentials ?? [],
      remote.prfCredentials ?? []
    )
  };
  if (Object.keys(mergedFolderTombstones).length > 0) {
    out.folderTombstones = mergedFolderTombstones;
  }
  if (Object.keys(mergedCloudFolderTombstones).length > 0) {
    out.cloudFolderTombstones = mergedCloudFolderTombstones;
  }
  if (Object.keys(mergedEntryTombstones).length > 0) {
    out.entryTombstones = mergedEntryTombstones;
  }
  return out;
}


















export function mergeFolders(
base: string[] | null,
local: string[],
remote: string[],
baseTombstones: Record<string, number>,
localTombstones: Record<string, number>,
remoteTombstones: Record<string, number>,
now: number)
: {names: string[];tombstones: Record<string, number>;} {

  const tombstones: Record<string, number> = { ...baseTombstones };
  for (const ts of [localTombstones, remoteTombstones]) {
    for (const [name, t] of Object.entries(ts)) {
      tombstones[name] = Math.max(tombstones[name] ?? 0, t);
    }
  }



  if (base) {
    const localSet = new Set(local);
    const remoteSet = new Set(remote);
    for (const name of base) {
      const inLocal = localSet.has(name);
      const inRemote = remoteSet.has(name);
      if (!inLocal || !inRemote) {
        if (tombstones[name] === undefined) {
          tombstones[name] = now;
        }
      }
    }
  }






  const result = new Set<string>();
  const localSet = new Set(local);
  const remoteSet = new Set(remote);
  const baseSet = new Set(base ?? []);

  for (const name of new Set([...localSet, ...remoteSet])) {
    const tombstoneTs = tombstones[name];
    if (tombstoneTs === undefined) {
      result.add(name);
      continue;
    }


    const stillInBoth = localSet.has(name) && remoteSet.has(name);
    const wasInBase = baseSet.has(name);
    if (stillInBoth && wasInBase) {

      delete tombstones[name];
      result.add(name);
      continue;
    }


    if (!wasInBase && (localSet.has(name) || remoteSet.has(name))) {
      delete tombstones[name];
      result.add(name);
      continue;
    }

  }


  for (const [name, t] of Object.entries(tombstones)) {
    if (now - t > TOMBSTONE_TTL_MS) delete tombstones[name];
  }

  return { names: [...result], tombstones };
}







export function deleteFolder(vault: Vault, name: string, now: number = Date.now()): Vault {
  return {
    ...vault,
    folders: (vault.folders || []).filter((f) => f !== name),
    folderTombstones: { ...(vault.folderTombstones ?? {}), [name]: now }
  };
}


export function deleteCloudFolder(vault: Vault, name: string, now: number = Date.now()): Vault {
  return {
    ...vault,
    cloudFolders: (vault.cloudFolders || []).filter((f) => f !== name),
    cloudFolderTombstones: { ...(vault.cloudFolderTombstones ?? {}), [name]: now }
  };
}







export function deleteVaultEntry(vault: Vault, entryId: string, now: number = Date.now()): Vault {
  return {
    ...vault,
    entries: (vault.entries || []).filter((e) => e.id !== entryId),
    entryTombstones: {
      ...(vault.entryTombstones ?? {}),
      [entryId]: now
    }
  };
}







export function mergeFolderTrees(
local: FolderNode[],
remote: FolderNode[])
: FolderNode[] {
  const map = new Map<string, FolderNode>();

  for (const n of local) map.set(n.id, n);
  for (const n of remote) {
    const existing = map.get(n.id);
    if (!existing) {
      map.set(n.id, n);
    } else if (n.sortOrder > existing.sortOrder) {

      map.set(n.id, n);
    }

  }

  return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}