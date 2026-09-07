import { ALLOWED_MIME_TYPES, CLOUD_MAX_FILE_SIZE } from "./cloud-types";





const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xFF, 0xD8, 0xFF]],
  "image/png": [[0x89, 0x50, 0x4E, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
  "text/plain": [],
  "application/msword": [[0xD0, 0xCF, 0x11, 0xE0]],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [[0x50, 0x4B, 0x03, 0x04]]
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
  category?: "photo" | "document";
}




export async function validateCloudFile(
file: File | {fileName: string;fileSize: number;mimeType: string;data?: Uint8Array;})
: Promise<ValidationResult> {
  const fileName = "name" in file ? file.name : file.fileName;
  const fileSize = "size" in file ? file.size : file.fileSize;
  const mimeType = "type" in file ? file.type : file.mimeType;


  if (fileSize > CLOUD_MAX_FILE_SIZE) {
    return { valid: false, error: "too_large" };
  }


  if (mimeType.startsWith("video/") || fileName.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm)$/)) {
    return { valid: false, error: "video_forbidden" };
  }


  if (!ALLOWED_MIME_TYPES[mimeType]) {
    const ext = "." + fileName.split(".").pop()?.toLowerCase();
    const foundMime = Object.entries(ALLOWED_MIME_TYPES).find(([, exts]) => exts.includes(ext));
    if (!foundMime) {
      return { valid: false, error: "invalid_type" };
    }
  }



  let data: Uint8Array | undefined;
  if ("data" in file) {
    data = file.data;
  } else if ("arrayBuffer" in file) {

    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    data = new Uint8Array(buffer);
  }

  if (data) {
    const signatures = MAGIC_BYTES[mimeType];
    if (signatures && signatures.length > 0) {
      const isMatch = signatures.some((sig) => {
        for (let i = 0; i < sig.length; i++) {
          if (data![i] !== sig[i]) return false;
        }
        return true;
      });

      if (!isMatch) {
        return { valid: false, error: "invalid_header" };
      }
    }
  }


  const category = mimeType.startsWith("image/") ? "photo" : "document";

  return { valid: true, category };
}




export function checkCloudQuota(
usedBytes: number,
newFileBytes: number,
maxQuota: number)
: boolean {
  return usedBytes + newFileBytes <= maxQuota;
}