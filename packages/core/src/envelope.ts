import { secp256k1 } from "@noble/curves/secp256k1.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import type { KeyEnvelope } from "./types";

const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;

const HKDF_INFO = new TextEncoder().encode("vaultkeepr-v3-envelope-encryption");

function deriveEncryptionKey(sharedSecret: Uint8Array): Uint8Array {
  return hkdf(sha256, sharedSecret, undefined, HKDF_INFO, KEY_LENGTH);
}

export function createKeyEnvelope(
masterKey: Uint8Array,
recipientPublicKeyHex: string)
: KeyEnvelope {
  const recipientPub = hexToBytes(recipientPublicKeyHex.replace(/^0x/, ""));
  const ephemeralSecret = secp256k1.utils.randomSecretKey();
  const ephemeralPublic = secp256k1.getPublicKey(ephemeralSecret, false);

  const sharedSecret = secp256k1.getSharedSecret(
    ephemeralSecret,
    recipientPub,
    false
  );
  const sharedSecretBytes = sharedSecret.slice(1);
  const encryptionKey = deriveEncryptionKey(sharedSecretBytes);

  const nonce = randomBytes(NONCE_LENGTH);
  const chacha = xchacha20poly1305(encryptionKey, nonce);
  const ciphertext = chacha.encrypt(masterKey);

  return {
    ephemeralPublicKey: bytesToHex(ephemeralPublic),
    ciphertext: bytesToHex(ciphertext),
    nonce: bytesToHex(nonce)
  };
}

export function decryptKeyEnvelope(
envelope: KeyEnvelope,
recipientPrivateKeyHex: string)
: Uint8Array {
  const privKey = hexToBytes(recipientPrivateKeyHex.replace(/^0x/, ""));
  const ephemeralPub = hexToBytes(
    envelope.ephemeralPublicKey.replace(/^0x/, "")
  );

  const sharedSecret = secp256k1.getSharedSecret(privKey, ephemeralPub, false);
  const sharedSecretBytes = sharedSecret.slice(1);
  const encryptionKey = deriveEncryptionKey(sharedSecretBytes);

  const nonce = hexToBytes(envelope.nonce);
  const ciphertext = hexToBytes(envelope.ciphertext);
  const chacha = xchacha20poly1305(encryptionKey, nonce);
  return chacha.decrypt(ciphertext);
}