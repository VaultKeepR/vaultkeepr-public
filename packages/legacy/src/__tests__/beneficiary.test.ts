import { describe, it, expect } from "vitest";
import {
  generateInviteLink,
  parseInviteLink,
  generateBeneficiaryQrPayload,
  parseBeneficiaryQrPayload,
  validateBeneficiaryAddress,
  validateBeneficiary,
  validateBeneficiaryList,
  formatAddressShort } from
"../beneficiary";
import type { BeneficiaryInfo } from "../types";
import type { Address } from "viem";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { randomBytes } from "@noble/ciphers/utils.js";


function validPubKey(): string {
  const priv = randomBytes(32);
  return bytesToHex(secp256k1.getPublicKey(priv, true));
}

const VALID_ADDRESS = "0x1234567890AbcdEF1234567890aBcdef12345678" as Address;
const VALID_PUBKEY = validPubKey();

describe("beneficiary", () => {


  describe("generateInviteLink / parseInviteLink", () => {
    it("round-trip : genere et parse correctement", () => {
      const link = generateInviteLink(
        "https://vaultkeepr.com/legacy/invite",
        VALID_ADDRESS,
        VALID_PUBKEY
      );

      expect(link).toContain("https://vaultkeepr.com/legacy/invite#");

      const data = parseInviteLink(link);
      expect(data).not.toBeNull();
      expect(data!.ownerAddress).toBe(VALID_ADDRESS);
      expect(data!.ownerPublicKey).toBe(VALID_PUBKEY.replace(/^0x/, ""));
      expect(data!.version).toBe(1);
    });

    it("parse echoue sur URL sans fragment", () => {
      expect(parseInviteLink("https://vaultkeepr.com")).toBeNull();
    });

    it("parse echoue sur fragment invalide", () => {
      expect(parseInviteLink("https://vaultkeepr.com#not-base64-json")).toBeNull();
    });
  });



  describe("generateBeneficiaryQrPayload / parseBeneficiaryQrPayload", () => {
    it("round-trip : genere et parse correctement", () => {
      const payload = generateBeneficiaryQrPayload(VALID_ADDRESS, VALID_PUBKEY, "Marie");
      const data = parseBeneficiaryQrPayload(payload);

      expect(data).not.toBeNull();
      expect(data!.type).toBe("legacy-beneficiary");
      expect(data!.address).toBe(VALID_ADDRESS);
      expect(data!.label).toBe("Marie");
    });

    it("parse echoue sur JSON invalide", () => {
      expect(parseBeneficiaryQrPayload("not json")).toBeNull();
    });

    it("parse echoue sur mauvais type", () => {
      expect(parseBeneficiaryQrPayload(JSON.stringify({ type: "other" }))).toBeNull();
    });
  });



  describe("validateBeneficiaryAddress", () => {
    it("accepte une adresse valide", () => {
      const result = validateBeneficiaryAddress("0x1234567890abcdef1234567890abcdef12345678");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBeTruthy();
    });

    it("rejette une adresse vide", () => {
      expect(validateBeneficiaryAddress("").valid).toBe(false);
    });

    it("rejette un format invalide", () => {
      expect(validateBeneficiaryAddress("not-an-address").valid).toBe(false);
    });
  });

  describe("validateBeneficiary", () => {
    it("accepte un beneficiaire valide", () => {
      const info: BeneficiaryInfo = { address: VALID_ADDRESS, publicKey: VALID_PUBKEY };
      expect(validateBeneficiary(info).valid).toBe(true);
    });

    it("rejette une cle publique manquante", () => {
      const info: BeneficiaryInfo = { address: VALID_ADDRESS, publicKey: "" };
      expect(validateBeneficiary(info).valid).toBe(false);
    });

    it("rejette une cle publique invalide", () => {
      const info: BeneficiaryInfo = { address: VALID_ADDRESS, publicKey: "deadbeef" };
      expect(validateBeneficiary(info).valid).toBe(false);
    });
  });

  describe("validateBeneficiaryList", () => {
    it("accepte 1 a 5 beneficiaires valides", () => {
      const list: BeneficiaryInfo[] = [
      { address: VALID_ADDRESS, publicKey: VALID_PUBKEY }];

      expect(validateBeneficiaryList(list).valid).toBe(true);
    });

    it("rejette une liste vide", () => {
      expect(validateBeneficiaryList([]).valid).toBe(false);
    });

    it("rejette plus de 5 beneficiaires", () => {
      const list: BeneficiaryInfo[] = Array.from({ length: 6 }, (_, i) => ({
        address: `0x${"0".repeat(39)}${i}` as Address,
        publicKey: validPubKey()
      }));
      expect(validateBeneficiaryList(list).valid).toBe(false);
    });

    it("rejette les doublons", () => {
      const list: BeneficiaryInfo[] = [
      { address: VALID_ADDRESS, publicKey: VALID_PUBKEY },
      { address: VALID_ADDRESS, publicKey: validPubKey() }];

      expect(validateBeneficiaryList(list).valid).toBe(false);
    });
  });



  describe("formatAddressShort", () => {
    it("formate correctement", () => {
      const result = formatAddressShort("0x1234567890abcdef1234567890abcdef12345678" as Address);
      expect(result).toBe("0x1234...5678");
    });
  });
});