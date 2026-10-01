import type { CloudFile, CloudFileCategory } from "@vaultkeepr/core";

export type { CloudFile, CloudFileCategory };


export const CLOUD_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const CLOUD_MAX_FILE_SIZE_FREE = 2 * 1024 * 1024;
export const CLOUD_MAX_FILE_SIZE_PRO = 10 * 1024 * 1024;







export const CLOUD_MAX_TOTAL_QUOTA_FREE = 10 * 1024 * 1024;
export const CLOUD_MAX_TOTAL_QUOTA_STANDARD = 1 * 1024 * 1024 * 1024;
export const CLOUD_MAX_TOTAL_QUOTA_CLOUD_PRO = 50 * 1024 * 1024 * 1024;
export const CLOUD_MAX_TOTAL_QUOTA_ULTIMATE = 500 * 1024 * 1024 * 1024;

export const CLOUD_MAX_TOTAL_QUOTA_PRO = CLOUD_MAX_TOTAL_QUOTA_STANDARD;
export const CLOUD_MAX_FILES = 500;


export const ALLOWED_MIME_TYPES: Record<string, string[]> = {

  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
  "image/avif": [".avif"],


  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/rtf": [".rtf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
};