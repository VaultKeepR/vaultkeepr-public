







import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

import { logger } from "@vault-keeper/logger";


export interface PasskeyPrfCredential {
  credentialId: string;
  prfSalt: string;
  deviceName: string;
  createdAt: string;
  lastUsedAt?: string;
  authenticatorType: "platform" | "cross-platform";
}






export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.credentials !== "undefined" &&
    typeof PublicKeyCredential !== "undefined");

}








export async function isPrfSupported(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {

    if (typeof PublicKeyCredential.getClientCapabilities === "function") {
      const caps = await PublicKeyCredential.getClientCapabilities();
      return caps?.["hmac-secret"] === true || caps?.["prf"] === true;
    }

    return typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function";
  } catch {
    return false;
  }
}



const PRF_SALT_LENGTH = 32;






export function generatePrfSalt(): Uint8Array {
  return randomBytes(PRF_SALT_LENGTH);
}



const PRF_HKDF_INFO = new TextEncoder().encode("vaultkeepr-v4-passkey-unlock");
const KEY_LENGTH = 32;








export function deriveKeyFromPrfResult(prfOutput: Uint8Array): Uint8Array {
  return hkdf(sha256, prfOutput, undefined, PRF_HKDF_INFO, KEY_LENGTH);
}












export async function enrollPasskeyForPrf(
userId: string,
userName: string)
: Promise<{
  credentialId: string;
  prfSalt: string;
  authenticatorType: "platform" | "cross-platform";
} | null> {
  if (!isWebAuthnSupported()) return null;

  const prfSalt = generatePrfSalt();
  const prfSaltHex = bytesToHex(prfSalt);

  const userIdBytes = new TextEncoder().encode(userId);
  const challengeBytes = randomBytes(32);

  try {
    const createOptions: PublicKeyCredentialCreationOptions = {
      rp: {
        id: location.hostname,
        name: "VaultKeepR"
      },
      user: {
        id: userIdBytes.buffer as ArrayBuffer,
        name: userName,
        displayName: userName
      },
      challenge: challengeBytes.buffer as ArrayBuffer,
      pubKeyCredParams: [
      { alg: -7, type: "public-key" },
      { alg: -257, type: "public-key" }],

      authenticatorSelection: {
        userVerification: "required",
        residentKey: "preferred"
      },
      extensions: {
        prf: {
          eval: {
            first: prfSalt.buffer as ArrayBuffer
          }
        }
      } as AuthenticationExtensionsClientInputs,
      timeout: 120000
    };
    const credential = (await navigator.credentials.create({
      publicKey: createOptions
    })) as PublicKeyCredential | null;

    if (!credential) return null;


    const extensions = credential.getClientExtensionResults() as Record<string, unknown>;
    const prfExt = extensions?.prf as Record<string, unknown> | undefined;
    const prfEnabled = prfExt?.enabled === true;
    const prfResults = prfExt?.results;

    if (!prfEnabled && !prfResults) {

      return null;
    }

    const rawId = new Uint8Array(credential.rawId);
    const credentialId = toBase64Url(rawId);

    const response = credential.response as AuthenticatorAttestationResponse;
    const transportHints = typeof response.getTransports === "function" ?
    response.getTransports() :
    [];

    const authenticatorType: "platform" | "cross-platform" =
    transportHints.includes("internal") ? "platform" : "cross-platform";

    return {
      credentialId,
      prfSalt: prfSaltHex,
      authenticatorType
    };
  } catch (err) {

    logger.warn("[VK-passkey] enrollPasskeyForPrf error:", err);
    return null;
  }
}











export async function deriveKeyFromPasskeyPrf(
credentialId: string,
prfSaltHex: string)
: Promise<Uint8Array | null> {
  if (!isWebAuthnSupported()) return null;

  const credentialIdBytes = fromBase64Url(credentialId);
  const prfSalt = hexToBytes(prfSaltHex);
  const challengeBytes = randomBytes(32);

  try {
    const getOptions: PublicKeyCredentialRequestOptions = {
      challenge: challengeBytes.buffer as ArrayBuffer,
      allowCredentials: [{
        id: credentialIdBytes.buffer as ArrayBuffer,
        type: "public-key"
      }],
      userVerification: "required",
      extensions: {
        prf: {
          eval: {
            first: prfSalt.buffer as ArrayBuffer
          }
        }
      } as AuthenticationExtensionsClientInputs,
      timeout: 120000
    };
    const assertion = (await navigator.credentials.get({
      publicKey: getOptions
    })) as PublicKeyCredential | null;

    if (!assertion) return null;

    const extensions = assertion.getClientExtensionResults() as Record<string, unknown>;
    const prfExt = extensions?.prf as Record<string, unknown> | undefined;
    const prfResultObj = prfExt?.results as Record<string, ArrayBuffer> | undefined;
    const prfResultBuffer = prfResultObj?.first;

    if (!prfResultBuffer) {
      logger.warn("[VK-passkey] PRF result not available");
      return null;
    }

    const prfOutput = new Uint8Array(prfResultBuffer);
    return deriveKeyFromPrfResult(prfOutput);
  } catch (err) {
    logger.warn("[VK-passkey] deriveKeyFromPasskeyPrf error:", err);
    return null;
  }
}



function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}