import {
  createSecureShare,
  decryptSecureShare,
  generateSharePin,
  computeApiPinHash } from
"@vault-keeper/core";
import type { CloudFile } from "./cloud-types";





export interface CloudSharePayload {
  version: 1;
  type: "cloud_file";


  fileName: string;
  mimeType: string;
  originalSize: number;
  contentHash: string;


  fragments: string[];
  nonce: string;







  encryptionKeyHex: string;





  ownerWallet?: string;


  message?: string;
  senderLabel?: string;
  createdAt: number;
}




export interface CloudShareOptions {
  ttl: "1h" | "24h" | "7d" | "evergreen";
  isPublic: boolean;
  maxViews?: number;
  senderLabel?: string;
  message?: string;
}









export function createCloudSharePayload(
file: CloudFile,
isPublic: boolean,
masterKeyHex: string,
ownerWallet?: string)
{
  const pin = isPublic ? "" : generateSharePin();

  const payload: CloudSharePayload = {
    version: 1,
    type: "cloud_file",
    fileName: file.fileName,
    mimeType: file.mimeType,
    originalSize: file.originalSize,
    contentHash: file.contentHash || "",
    fragments: file.fragments,
    nonce: file.nonce,
    encryptionKeyHex: masterKeyHex,
    ownerWallet: ownerWallet || "",
    createdAt: Date.now()
  };

  const res = createSecureShare(payload as any, pin);

  return {
    payload: res.encryptedBlob,
    shareKey: res.privateKeyHex,
    pin: isPublic ? undefined : pin,
    id: res.shareId,
    pinHash: res.apiPinHash
  };
}




export async function createCloudShare(
file: CloudFile,
options: CloudShareOptions,
masterKeyHex: string,
customPin?: string)
{
  const pin = options.isPublic ? "" : customPin || generateSharePin();

  const payload: CloudSharePayload = {
    version: 1,
    type: "cloud_file",
    fileName: file.fileName,
    mimeType: file.mimeType,
    originalSize: file.originalSize,
    contentHash: file.contentHash,
    fragments: file.fragments,
    nonce: file.nonce,
    encryptionKeyHex: masterKeyHex,
    message: options.message,
    senderLabel: options.senderLabel,
    createdAt: Date.now()
  };




  return createSecureShare(payload as any, pin);
}





export function decryptCloudShare(
blobHex: string,
keyHex: string,
pin: string = "")
: CloudSharePayload {
  const payload = decryptSecureShare(blobHex, keyHex, pin);

  if ((payload as any).type !== "cloud_file") {
    throw new Error("INVALID_SHARE_TYPE");
  }

  return payload as unknown as CloudSharePayload;
}






export function buildCloudShareUrl(shareId: string, keyHex: string): string {
  const baseUrl = "https://cloud.vaultkeepr.xyz";
  return `${baseUrl}/s/${shareId}#${keyHex}`;
}