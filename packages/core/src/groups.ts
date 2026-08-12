import type { FolderNode } from "./types";

export const ENTRY_GROUP_IDS = ["identifiants", "cartes", "notes", "identites", "seeds"] as const;
export type EntryGroupId = (typeof ENTRY_GROUP_IDS)[number];

export const ENTRY_GROUP_LABELS: Record<EntryGroupId, string> = {
  identifiants: "Identifiants",
  cartes: "Cartes bancaires",
  notes: "Notes",
  identites: "Identités",
  seeds: "Crypto Seeds"
};

export const DEFAULT_ENTRY_GROUP: EntryGroupId = "identifiants";


export const BUILTIN_FOLDER_IDS: Record<EntryGroupId | "passkeys", string> = {
  identifiants: "builtin-identifiants",
  cartes: "builtin-cartes",
  notes: "builtin-notes",
  identites: "builtin-identites",
  seeds: "builtin-seeds",
  passkeys: "builtin-passkeys"
};


export const BUILTIN_FOLDER_NODES: FolderNode[] = [
{ id: BUILTIN_FOLDER_IDS.identifiants, name: "Identifiants", parentId: null, sortOrder: 0, createdAt: 0 },
{ id: BUILTIN_FOLDER_IDS.cartes, name: "Cartes bancaires", parentId: null, sortOrder: 1, createdAt: 0 },
{ id: BUILTIN_FOLDER_IDS.notes, name: "Notes", parentId: null, sortOrder: 2, createdAt: 0 },
{ id: BUILTIN_FOLDER_IDS.identites, name: "Identités", parentId: null, sortOrder: 3, createdAt: 0 },
{ id: BUILTIN_FOLDER_IDS.seeds, name: "Crypto Seeds", parentId: null, sortOrder: 4, createdAt: 0 },
{ id: BUILTIN_FOLDER_IDS.passkeys, name: "Passkeys", parentId: null, sortOrder: 5, createdAt: 0 }];


export function getEntryGroupLabel(folder: string | undefined): string {
  if (!folder) return ENTRY_GROUP_LABELS.identifiants;
  return ENTRY_GROUP_LABELS[folder as EntryGroupId] ?? folder;
}





export function resolveFolderName(
folderId: string | undefined,
folderTree: FolderNode[] | undefined)
: string {
  if (!folderId) return ENTRY_GROUP_LABELS.identifiants;

  if (folderId in ENTRY_GROUP_LABELS) return ENTRY_GROUP_LABELS[folderId as EntryGroupId];

  if (folderId === "passkeys") return "Passkeys";

  if (folderTree) {
    const node = folderTree.find((n) => n.id === folderId);
    if (node) return node.name;
  }

  return folderId;
}