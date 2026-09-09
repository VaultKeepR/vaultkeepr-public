import { describe, it, expect } from "vitest";
import {
  createEnvelope,
  decryptEnvelope,
  createEnvelopeBundle,
  decryptFromBundle,
  hashEnvelopeBundle,
  getPublicKeyFromPrivate,
  isValidPublicKey } from
"../envelope";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import type { BeneficiaryInfo } from "../types";
import type { Address } from "viem";



function generateKeypair() {
  const privateKey = randomBytes(32);
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  return {
    privateKey: bytesToHex(privateKey),
    publicKey: bytesToHex(publicKey)
  };
}

const owner = generateKeypair();
const beneficiary1 = generateKeypair();
const beneficiary2 = generateKeypair();
const intruder = generateKeypair();

const TEST_MASTER_KEY = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
const TEST_VAULT_CID = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";



describe("envelope", () => {
  describe("createEnvelope / decryptEnvelope", () => {
    it("round-trip : chiffre et dechiffre correctement", () => {
      const envelope = createEnvelope(
        owner.privateKey,
        owner.publicKey,
        beneficiary1.publicKey,
        TEST_MASTER_KEY,
        TEST_VAULT_CID
      );

      expect(envelope.version).toBe(1);
      expect(envelope.ownerPublicKey).toBe(owner.publicKey);
      expect(envelope.beneficiaryPublicKey).toBe(beneficiary1.publicKey);
      expect(envelope.ciphertext).toBeTruthy();
      expect(envelope.nonce).toBeTruthy();

      const payload = decryptEnvelope(beneficiary1.privateKey, envelope);
      expect(payload.masterKey).toBe(TEST_MASTER_KEY);
      expect(payload.vaultCid).toBe(TEST_VAULT_CID);
    });

    it("ECDH est commutatif : meme resultat dans les deux sens", () => {
      const envelope = createEnvelope(
        owner.privateKey,
        owner.publicKey,
        beneficiary1.publicKey,
        TEST_MASTER_KEY,
        TEST_VAULT_CID
      );


      const payload = decryptEnvelope(beneficiary1.privateKey, envelope);
      expect(payload.masterKey).toBe(TEST_MASTER_KEY);
    });

    it("mauvaise cle privee = echec dechiffrement", () => {
      const envelope = createEnvelope(
        owner.privateKey,
        owner.publicKey,
        beneficiary1.publicKey,
        TEST_MASTER_KEY,
        TEST_VAULT_CID
      );

      expect(() => decryptEnvelope(intruder.privateKey, envelope)).toThrow();
    });

    it("ciphertext corrompu = echec dechiffrement", () => {
      const envelope = createEnvelope(
        owner.privateKey,
        owner.publicKey,
        beneficiary1.publicKey,
        TEST_MASTER_KEY,
        TEST_VAULT_CID
      );


      const flipped =
        envelope.ciphertext.slice(0, 2) === "ff" ? "00" : "ff";
      const corrupted = {
        ...envelope,
        ciphertext: flipped + envelope.ciphertext.slice(2)
      };
      expect(() => decryptEnvelope(beneficiary1.privateKey, corrupted)).toThrow();
    });

    it("nonce different = enveloppes differentes (pas de replay)", () => {
      const env1 = createEnvelope(owner.privateKey, owner.publicKey, beneficiary1.publicKey, TEST_MASTER_KEY, TEST_VAULT_CID);
      const env2 = createEnvelope(owner.privateKey, owner.publicKey, beneficiary1.publicKey, TEST_MASTER_KEY, TEST_VAULT_CID);

      expect(env1.nonce).not.toBe(env2.nonce);
      expect(env1.ciphertext).not.toBe(env2.ciphertext);


      const p1 = decryptEnvelope(beneficiary1.privateKey, env1);
      const p2 = decryptEnvelope(beneficiary1.privateKey, env2);
      expect(p1.masterKey).toBe(p2.masterKey);
      expect(p1.vaultCid).toBe(p2.vaultCid);
    });
  });



  describe("createEnvelopeBundle / decryptFromBundle", () => {
    const ownerAddress = "0x1234567890abcdef1234567890abcdef12345678" as Address;

    it("cree un bundle avec plusieurs beneficiaires", () => {
      const beneficiaries: BeneficiaryInfo[] = [
      { address: "0xaaaa000000000000000000000000000000000001" as Address, publicKey: beneficiary1.publicKey },
      { address: "0xbbbb000000000000000000000000000000000002" as Address, publicKey: beneficiary2.publicKey }];


      const bundle = createEnvelopeBundle(
        owner.privateKey,
        beneficiaries,
        TEST_MASTER_KEY,
        TEST_VAULT_CID,
        ownerAddress
      );

      expect(bundle.version).toBe(1);
      expect(bundle.owner).toBe(ownerAddress);
      expect(Object.keys(bundle.envelopes)).toHaveLength(2);
    });

    it("chaque beneficiaire dechiffre sa propre enveloppe", () => {
      const addr1 = "0xaaaa000000000000000000000000000000000001" as Address;
      const addr2 = "0xbbbb000000000000000000000000000000000002" as Address;
      const beneficiaries: BeneficiaryInfo[] = [
      { address: addr1, publicKey: beneficiary1.publicKey },
      { address: addr2, publicKey: beneficiary2.publicKey }];


      const bundle = createEnvelopeBundle(
        owner.privateKey,
        beneficiaries,
        TEST_MASTER_KEY,
        TEST_VAULT_CID,
        ownerAddress
      );

      const payload1 = decryptFromBundle(beneficiary1.privateKey, addr1, bundle);
      expect(payload1.masterKey).toBe(TEST_MASTER_KEY);

      const payload2 = decryptFromBundle(beneficiary2.privateKey, addr2, bundle);
      expect(payload2.masterKey).toBe(TEST_MASTER_KEY);
    });

    it("un beneficiaire ne peut pas dechiffrer l'enveloppe d'un autre", () => {
      const addr1 = "0xaaaa000000000000000000000000000000000001" as Address;
      const addr2 = "0xbbbb000000000000000000000000000000000002" as Address;
      const beneficiaries: BeneficiaryInfo[] = [
      { address: addr1, publicKey: beneficiary1.publicKey },
      { address: addr2, publicKey: beneficiary2.publicKey }];


      const bundle = createEnvelopeBundle(
        owner.privateKey,
        beneficiaries,
        TEST_MASTER_KEY,
        TEST_VAULT_CID,
        ownerAddress
      );


      expect(() => decryptFromBundle(beneficiary1.privateKey, addr2, bundle)).toThrow();
    });

    it("adresse inexistante dans le bundle = erreur", () => {
      const addr1 = "0xaaaa000000000000000000000000000000000001" as Address;
      const beneficiaries: BeneficiaryInfo[] = [
      { address: addr1, publicKey: beneficiary1.publicKey }];


      const bundle = createEnvelopeBundle(owner.privateKey, beneficiaries, TEST_MASTER_KEY, TEST_VAULT_CID, ownerAddress);

      const unknownAddr = "0xcccc000000000000000000000000000000000003" as Address;
      expect(() => decryptFromBundle(beneficiary1.privateKey, unknownAddr, bundle)).toThrow(/No envelope found/);
    });
  });



  describe("hashEnvelopeBundle", () => {
    it("hash deterministe pour le meme bundle", () => {
      const bundle = createEnvelopeBundle(
        owner.privateKey,
        [{ address: "0xaaaa000000000000000000000000000000000001" as Address, publicKey: beneficiary1.publicKey }],
        TEST_MASTER_KEY,
        TEST_VAULT_CID,
        "0x1234567890abcdef1234567890abcdef12345678" as Address
      );

      const hash1 = hashEnvelopeBundle(bundle);
      const hash2 = hashEnvelopeBundle(bundle);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });
  });



  describe("getPublicKeyFromPrivate", () => {
    it("derive correctement la cle publique", () => {
      const pubKey = getPublicKeyFromPrivate(owner.privateKey);
      expect(pubKey).toBe(owner.publicKey);
    });
  });

  describe("isValidPublicKey", () => {
    it("accepte une cle publique valide (compressee)", () => {
      expect(isValidPublicKey(beneficiary1.publicKey)).toBe(true);
    });

    it("rejette une cle publique invalide", () => {
      expect(isValidPublicKey("0000")).toBe(false);
      expect(isValidPublicKey("not-a-key")).toBe(false);
    });

    it("rejette une chaine vide", () => {
      expect(isValidPublicKey("")).toBe(false);
    });
  });
});