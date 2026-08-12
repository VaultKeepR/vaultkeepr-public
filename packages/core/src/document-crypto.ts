









import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { DEFAULT_FRAGMENT_COUNT } from "./types";

const NONCE_LENGTH = 24;








export function splitBuffer(data: Uint8Array, count: number): Uint8Array[] {
  if (count < 1) throw new Error("Fragment count must be >= 1");
  if (data.length === 0) throw new Error("Cannot fragment empty data");

  const chunkSize = Math.floor(data.length / count);
  const fragments: Uint8Array[] = [];

  for (let i = 0; i < count; i++) {
    const start = i * chunkSize;
    const end = i === count - 1 ? data.length : start + chunkSize;
    fragments.push(data.slice(start, end));
  }

  return fragments;
}





export function mergeFragments(fragments: Uint8Array[]): Uint8Array {
  if (fragments.length === 0) throw new Error("No fragments to merge");

  const totalLength = fragments.reduce((sum, f) => sum + f.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const fragment of fragments) {
    result.set(fragment, offset);
    offset += fragment.length;
  }

  return result;
}




async function compressData(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream !== "undefined") {
    const buf = new Uint8Array(data).buffer as ArrayBuffer;
    const stream = new Blob([buf]).
    stream().
    pipeThrough(new CompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  return data;
}


async function decompressData(data: Uint8Array): Promise<Uint8Array> {

  if (
  data.length >= 2 &&
  data[0] === 0x1f &&
  data[1] === 0x8b &&
  typeof DecompressionStream !== "undefined")
  {
    const buf = data.buffer as ArrayBuffer;
    const stream = new Blob([buf]).
    stream().
    pipeThrough(new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  return data;
}











export async function encryptAndFragmentDocument(
imageData: Uint8Array,
masterKey: Uint8Array,
fragmentCount: number = DEFAULT_FRAGMENT_COUNT)
: Promise<{fragments: Uint8Array[];nonce: string;}> {

  const compressed = await compressData(imageData);


  const nonce = randomBytes(NONCE_LENGTH);
  const chacha = xchacha20poly1305(masterKey, nonce);
  const ciphertext = chacha.encrypt(compressed);


  const fragments = splitBuffer(ciphertext, fragmentCount);

  return {
    fragments,
    nonce: bytesToHex(nonce)
  };
}









export async function reassembleAndDecryptDocument(
fragments: Uint8Array[],
nonce: string,
masterKey: Uint8Array)
: Promise<Uint8Array> {

  const ciphertext = mergeFragments(fragments);


  const nonceBytes = hexToBytes(nonce);
  const chacha = xchacha20poly1305(masterKey, nonceBytes);
  const compressed = chacha.decrypt(ciphertext);


  return decompressData(compressed);
}
















export function generateBlurredThumbnailCanvas(
imageBase64: string,
targetWidth: number = 16)
: Promise<string> {
  return new Promise((resolve, reject) => {

    if (typeof document === "undefined" || typeof HTMLCanvasElement === "undefined") {

      resolve("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const aspectRatio = img.height / img.width;
        const targetHeight = Math.round(targetWidth * aspectRatio);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }


        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);


        const dataUrl = canvas.toDataURL("image/jpeg", 0.3);
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for thumbnail"));
    img.src = imageBase64.startsWith("data:") ?
    imageBase64 :
    `data:image/jpeg;base64,${imageBase64}`;
  });
}




export function generateDocumentId(): string {
  const timestamp = Date.now().toString(36);
  const random = bytesToHex(randomBytes(8));
  return `doc-${timestamp}-${random}`;
}