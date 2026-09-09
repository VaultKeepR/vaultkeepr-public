import type { Vault } from "@vaultkeepr/core";
import type { CloudFile } from "./cloud-types";


export const DEFAULT_CLOUD_FOLDERS = ["Documents", "Images"] as const;




export function autoDetectFolder(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Images";

  if (
  mimeType === "application/pdf" ||
  mimeType.startsWith("text/") ||
  mimeType.includes("document") ||
  mimeType.includes("spreadsheet") ||
  mimeType.includes("presentation") ||
  mimeType.includes("msword") ||
  mimeType.includes("officedocument") ||
  mimeType === "application/rtf" ||
  mimeType === "application/json" ||
  mimeType === "application/xml" ||
  mimeType === "text/csv")
  {
    return "Documents";
  }

  return "Documents";
}




export function addCloudFile(vault: Vault, file: CloudFile): Vault {
  const cloudFiles = vault.cloudFiles ? [...vault.cloudFiles, file] : [file];
  const cloudQuotaUsed = (vault.cloudQuotaUsed || 0) + file.originalSize;

  return {
    ...vault,
    cloudFiles,
    cloudQuotaUsed
  };
}




export function removeCloudFile(vault: Vault, fileId: string): Vault {
  if (!vault.cloudFiles) return vault;

  const fileToRemove = vault.cloudFiles.find((f) => f.id === fileId);
  if (!fileToRemove) return vault;

  const cloudFiles = vault.cloudFiles.filter((f) => f.id !== fileId);
  const cloudQuotaUsed = Math.max(0, (vault.cloudQuotaUsed || 0) - fileToRemove.originalSize);

  return {
    ...vault,
    cloudFiles,
    cloudQuotaUsed
  };
}




export function updateCloudFile(
vault: Vault,
fileId: string,
updates: Partial<Pick<CloudFile, "fileName" | "folder" | "tags" | "favorite" | "description">>)
: Vault {
  if (!vault.cloudFiles) return vault;

  const cloudFiles = vault.cloudFiles.map((f) => {
    if (f.id === fileId) {
      return { ...f, ...updates, modifiedAt: Date.now() };
    }
    return f;
  });

  return {
    ...vault,
    cloudFiles
  };
}




export function moveCloudFile(vault: Vault, fileId: string, newFolder: string): Vault {
  return updateCloudFile(vault, fileId, { folder: newFolder });
}




export function getCloudFilesByFolder(vault: Vault, folder?: string): CloudFile[] {
  if (!vault.cloudFiles) return [];
  return vault.cloudFiles.filter((f) => f.folder === folder);
}





export function getCloudFolders(vault: Vault): string[] {
  const folders = new Set<string>(DEFAULT_CLOUD_FOLDERS);


  if (vault.cloudFolders) {
    vault.cloudFolders.forEach((f) => folders.add(f));
  }


  if (vault.cloudFiles) {
    vault.cloudFiles.forEach((f) => {
      if (f.folder) folders.add(f.folder);
    });
  }

  return Array.from(folders).sort();
}




export function addCloudFolder(vault: Vault, folderName: string): Vault {
  const existing = vault.cloudFolders || [];
  if (existing.includes(folderName)) return vault;
  return {
    ...vault,
    cloudFolders: [...existing, folderName]
  };
}





export function removeCloudFolder(vault: Vault, folderName: string): Vault {

  if ((DEFAULT_CLOUD_FOLDERS as readonly string[]).includes(folderName)) return vault;

  const cloudFolders = (vault.cloudFolders || []).filter((f) => f !== folderName);
  const cloudFiles = (vault.cloudFiles || []).map((f) =>
  f.folder === folderName ? { ...f, folder: undefined, modifiedAt: Date.now() } : f
  );

  return {
    ...vault,
    cloudFolders,
    cloudFiles
  };
}






export function migrateCloudFileFolders(vault: Vault): Vault {
  if (!vault.cloudFiles || vault.cloudFiles.length === 0) return vault;

  let changed = false;
  const cloudFiles = vault.cloudFiles.map((f) => {
    if (!f.folder) {
      changed = true;
      return { ...f, folder: autoDetectFolder(f.mimeType), modifiedAt: Date.now() };
    }
    return f;
  });

  if (!changed) return vault;

  return { ...vault, cloudFiles };
}