import { describe, it, expect } from "vitest";
import { vi } from "vitest";


vi.mock("openpgp", () => ({
  default: { config: {}, createMessage: vi.fn(), encrypt: vi.fn(), readMessage: vi.fn(), decrypt: vi.fn() },
  config: {},
  createMessage: vi.fn(),
  encrypt: vi.fn(),
  readMessage: vi.fn(),
  decrypt: vi.fn()
}));

import {
  createFragmentedVault,
  combineFragmentsAndDecrypt,
  encryptFragment,
  decryptFragment,
  encryptFragmentsForStorage,
  computeLookupIdHash,
  generateRecoveryId,
  DEFAULT_FRAGMENTED_CONFIG } from
"./fragmented-vault";
import { createEmptyVault, createEntry } from "@vaultkeepr/core";
import type { Vault } from "@vaultkeepr/core";

describe("Fragmented vault (Shamir secret sharing)", () => {
  describe("createFragmentedVault", () => {
    it("creates encrypted vault + Shamir shares", async () => {
      const vault = {
        ...createEmptyVault(),
        entries: [
        createEntry({
          url: "https://example.com",
          username: "user",
          password: "pass"
        })]

      };

      const result = await createFragmentedVault(vault, "recovery-id-123");

      expect(result.masterKey.length).toBe(32);
      expect(result.fragments.length).toBe(DEFAULT_FRAGMENTED_CONFIG.total);
      expect(result.lookupIdHash.length).toBe(64);
      expect(result.encryptedVault.ciphertext).toBeDefined();
      expect(result.encryptedVault.nonce).toBeDefined();
    });

    it("default config: 3-of-5 threshold", () => {
      expect(DEFAULT_FRAGMENTED_CONFIG.threshold).toBe(3);
      expect(DEFAULT_FRAGMENTED_CONFIG.total).toBe(5);
    });
  });

  describe("combineFragmentsAndDecrypt", () => {
    it("decrypts vault with threshold fragments", async () => {
      const vault = {
        ...createEmptyVault(),
        entries: [
        createEntry({
          url: "https://secure.example.com",
          username: "admin",
          password: "admin123"
        })]

      };

      const { masterKey, encryptedVault, fragments } = await createFragmentedVault(
        vault,
        "recovery-test"
      );


      const recovered = await combineFragmentsAndDecrypt(
        fragments.slice(0, 3),
        encryptedVault,
        3
      );

      expect(recovered.entries.length).toBe(1);
      expect(recovered.entries[0].password).toBe("admin123");
    });

    it("rejects when fewer than threshold fragments", async () => {
      const vault = { ...createEmptyVault(), entries: [] };
      const { encryptedVault, fragments } = await createFragmentedVault(vault, "id");

      await expect(
        combineFragmentsAndDecrypt(fragments.slice(0, 2), encryptedVault, 3)
      ).rejects.toThrow("At least 3 parts required");
    });

    it("rejects with 0 fragments", async () => {
      const vault = { ...createEmptyVault(), entries: [] };
      const { encryptedVault } = await createFragmentedVault(vault, "id");

      await expect(
        combineFragmentsAndDecrypt([], encryptedVault, 3)
      ).rejects.toThrow("At least 3 parts required");
    });

    it("works with more than threshold fragments", async () => {
      const vault = {
        ...createEmptyVault(),
        entries: [createEntry({ url: "", username: "u", password: "p" })]
      };

      const { masterKey, encryptedVault, fragments } = await createFragmentedVault(vault, "id");


      const recovered = await combineFragmentsAndDecrypt(fragments, encryptedVault, 3);
      expect(recovered.entries[0].password).toBe("p");
    });

    it("wrong fragments produce wrong key (throws)", async () => {
      const vault = { ...createEmptyVault(), entries: [] };
      const { encryptedVault } = await createFragmentedVault(vault, "correct-id");


      const { fragments: wrongFragments } = await createFragmentedVault(vault, "wrong-id");

      await expect(
        combineFragmentsAndDecrypt(wrongFragments.slice(0, 3), encryptedVault, 3)
      ).rejects.toThrow();
    });
  });

  describe("Fragment encryption roundtrip", () => {
    it("encryptFragment / decryptFragment roundtrip", () => {
      const fragment = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
      const recoveryId = "test-recovery-id";

      const encrypted = encryptFragment(fragment, 0, recoveryId);
      const decrypted = decryptFragment(encrypted, recoveryId);

      expect(decrypted).toEqual(fragment);
    });

    it("different recoveryIds produce different ciphertexts", () => {
      const fragment = new Uint8Array([10, 20, 30]);

      const e1 = encryptFragment(fragment, 0, "id-1");
      const e2 = encryptFragment(fragment, 0, "id-2");

      expect(e1.ciphertext).not.toBe(e2.ciphertext);
    });

    it("wrong recoveryId fails to decrypt", () => {
      const fragment = new Uint8Array([1, 2, 3]);
      const encrypted = encryptFragment(fragment, 0, "correct-id");

      expect(() => decryptFragment(encrypted, "wrong-id")).toThrow();
    });
  });

  describe("encryptFragmentsForStorage", () => {
    it("encrypts multiple fragments with correct indices", () => {
      const fragments = [
      new Uint8Array([1, 2]),
      new Uint8Array([3, 4]),
      new Uint8Array([5, 6])];


      const encrypted = encryptFragmentsForStorage(fragments, "recovery-id", [0, 1, 2]);

      expect(encrypted.length).toBe(3);
      expect(encrypted[0].fragmentIndex).toBe(0);
      expect(encrypted[1].fragmentIndex).toBe(1);
      expect(encrypted[2].fragmentIndex).toBe(2);
    });
  });

  describe("Recovery ID", () => {
    it("generateRecoveryId produces 32-char hex", () => {
      const id = generateRecoveryId();
      expect(id.length).toBe(32);
      expect(/^[0-9a-f]+$/.test(id)).toBe(true);
    });

    it("generateRecoveryId produces unique IDs", () => {
      const ids = new Set(Array.from({ length: 10 }, () => generateRecoveryId()));
      expect(ids.size).toBe(10);
    });
  });

  describe("computeLookupIdHash", () => {
    it("produces SHA-256 hex", () => {
      const hash = computeLookupIdHash("my-recovery-id");
      expect(hash.length).toBe(64);
    });

    it("deterministic", () => {
      const h1 = computeLookupIdHash("same-id");
      const h2 = computeLookupIdHash("same-id");
      expect(h1).toBe(h2);
    });
  });

  describe("End-to-end: fragmented recovery roundtrip", () => {
    it("full cycle: create → encrypt fragments → decrypt fragments → combine → verify", async () => {
      const originalVault = {
        ...createEmptyVault(),
        entries: [
        createEntry({
          url: "https://bank.example.com",
          username: "john@bank.com",
          password: "BankP@ss123!"
        }),
        createEntry({
          url: "https://email.example.com",
          username: "john@email.com",
          password: "EmailP@ss456!"
        })],

        folders: ["finance", "personal"]
      };

      const recoveryId = generateRecoveryId();


      const { masterKey, encryptedVault, fragments } = await createFragmentedVault(
        originalVault,
        recoveryId
      );


      const encryptedFragments = encryptFragmentsForStorage(fragments, recoveryId, [0, 1, 2, 3, 4]);


      const decryptedFragments = encryptedFragments.map((ef) =>
      decryptFragment(ef, recoveryId)
      );


      const recovered = await combineFragmentsAndDecrypt(
        decryptedFragments.slice(0, 3),
        encryptedVault,
        3
      );


      expect(recovered.entries.length).toBe(2);
      expect(recovered.entries[0].password).toBe("BankP@ss123!");
      expect(recovered.entries[1].password).toBe("EmailP@ss456!");
      expect(recovered.folders).toEqual(["finance", "personal"]);



    });
  });
});