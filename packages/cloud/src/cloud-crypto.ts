import {
  encryptAndFragmentDocument,
  reassembleAndDecryptDocument } from
"@vaultkeepr/core";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";




export function getAdaptiveFragmentCount(fileSize: number): number {
  if (fileSize < 5 * 1024 * 1024) return 4;
  if (fileSize < 15 * 1024 * 1024) return 8;
  return 12;
}




export async function encryptCloudFile(
data: Uint8Array,
masterKey: Uint8Array)
: Promise<{
  fragments: Uint8Array[];
  nonce: string;
  contentHash: string;
  fragmentCount: number;
}> {
  const fragmentCount = getAdaptiveFragmentCount(data.length);


  const contentHash = bytesToHex(sha256(data));


  const result = await encryptAndFragmentDocument(data, masterKey, fragmentCount);

  return {
    ...result,
    contentHash,
    fragmentCount
  };
}




export async function decryptCloudFile(
fragments: Uint8Array[],
nonce: string,
masterKey: Uint8Array)
: Promise<Uint8Array> {
  return reassembleAndDecryptDocument(fragments, nonce, masterKey);
}