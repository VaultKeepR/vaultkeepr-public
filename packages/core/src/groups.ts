import type { FolderNode, VaultEntry } from "./types";

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

const JUNK_SUBDOMAIN_PREFIXES = new Set([
"www", "app", "mobile", "accounts", "dashboard", "kyc", "mail", "web", "my", "login", "portal", "id", "news"]);

function brandFrom(url: string | undefined): { brand: string; host: string } | null {
  if (!url?.trim()) return null;
  try {
    const raw = url.includes("://") ? url : `https://${url}`;
    const host = new URL(raw).hostname.replace(/^www\./i, "");
    if (/^\d+(\.\d+){3}$/.test(host)) return null;
    const parts = host.split(".").filter(Boolean);
    if (parts.length < 2) return null;
    let label = parts[0];
    if (JUNK_SUBDOMAIN_PREFIXES.has(label.toLowerCase()) && parts.length > 2) label = parts[1];
    if (!label) return null;
    return { brand: label.charAt(0).toUpperCase() + label.slice(1).toLowerCase(), host: host.toLowerCase() };
  } catch {
    return null;
  }
}

// Cleans a list-title for display without touching stored data: strips the
// auto-generated "Passkey <date>" tail, replaces digits-only or host-like
// titles with the domain brand, falls back to the domain brand.
export function cleanEntryTitle(rawTitle: string, url?: string): string {
  const raw = rawTitle.trim();
  const passkeyMatch = raw.match(/^(.*?)\s+passkey\s+(.+)$/i);
  let candidate =
  passkeyMatch && passkeyMatch[1].trim() && /\d/.test(passkeyMatch[2])
    ? passkeyMatch[1].trim()
    : raw;
  const brandInfo = brandFrom(url);
  if (brandInfo) {
    if (!candidate) return brandInfo.brand;
    if (/^[\d\s()+.-]+$/.test(candidate)) return brandInfo.brand;
    if (candidate.toLowerCase() === brandInfo.brand.toLowerCase()) return brandInfo.brand;
    if (candidate.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase() === brandInfo.host) {
      return brandInfo.brand;
    }
  }
  return candidate || brandInfo?.brand || raw;
}

export function getEntryDisplayName(entry: VaultEntry, primaryUrl?: string): string {
  const url = primaryUrl ?? entry.urls?.[0]?.uri ?? entry.url ?? undefined;
  return cleanEntryTitle(entry.title ?? entry.username ?? "", url);
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