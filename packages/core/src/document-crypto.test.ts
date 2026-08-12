import { describe, it, expect } from "vitest";
import {
  splitBuffer,
  mergeFragments,
  encryptAndFragmentDocument,
  reassembleAndDecryptDocument,
  generateDocumentId } from
"./document-crypto";
import { generateMasterKey } from "./crypto";

describe("Document crypto (XChaCha20-Poly1305 + fragmentation)", () => {
  describe("splitBuffer / mergeFragments", () => {
    it("splits and merges back to original", () => {
      const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const fragments = splitBuffer(data, 3);

      expect(fragments.length).toBe(3);
      const merged = mergeFragments(fragments);
      expect(merged).toEqual(data);
    });

    it("splits into approximately equal chunks", () => {
      const data = new Uint8Array(100);
      const fragments = splitBuffer(data, 4);

      expect(fragments.length).toBe(4);

      expect(fragments[0].length).toBe(25);
      expect(fragments[3].length).toBe(25);
    });

    it("last fragment gets remainder", () => {
      const data = new Uint8Array(10);
      const fragments = splitBuffer(data, 3);

      expect(fragments[0].length).toBe(3);
      expect(fragments[1].length).toBe(3);
      expect(fragments[2].length).toBe(4);
    });

    it("throws for empty data", () => {
      expect(() => splitBuffer(new Uint8Array(0), 1)).toThrow("empty");
    });

    it("throws for count < 1", () => {
      expect(() => splitBuffer(new Uint8Array(5), 0)).toThrow(">= 1");
    });
  });

  describe("encryptAndFragmentDocument / reassembleAndDecryptDocument roundtrip", () => {
    it("roundtrips document data", async () => {
      const key = generateMasterKey();
      const original = new Uint8Array([0xff, 0xfe, 0xfd, 0xfc, 0xfb, 0xfa]);

      const { fragments, nonce } = await encryptAndFragmentDocument(original, key);
      expect(fragments.length).toBe(4);

      const decrypted = await reassembleAndDecryptDocument(fragments, nonce, key);
      expect(decrypted).toEqual(original);
    });

    it("roundtrips with custom fragment count", async () => {
      const key = generateMasterKey();
      const original = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

      const { fragments, nonce } = await encryptAndFragmentDocument(original, key, 2);
      expect(fragments.length).toBe(2);

      const decrypted = await reassembleAndDecryptDocument(fragments, nonce, key);
      expect(decrypted).toEqual(original);
    });

    it("each fragment is independently unreadable", async () => {
      const key = generateMasterKey();
      const original = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80]);

      const { fragments } = await encryptAndFragmentDocument(original, key);


      for (const frag of fragments) {
        expect(frag).not.toEqual(original);
      }
    });

    it("wrong key fails to decrypt", async () => {
      const key = generateMasterKey();
      const wrongKey = generateMasterKey();
      const original = new Uint8Array([1, 2, 3, 4]);

      const { fragments, nonce } = await encryptAndFragmentDocument(original, key);

      await expect(
        reassembleAndDecryptDocument(fragments, nonce, wrongKey)
      ).rejects.toThrow();
    });

    it("documentId generation produces unique IDs", () => {
      const id1 = generateDocumentId();
      const id2 = generateDocumentId();

      expect(id1.startsWith("doc-")).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });
});