import { describe, it, expect } from "vitest";
import {
  parseVault,
  serializeVault,
  createEmptyVault,
  createEntry,
  createExportPayload } from
"./vault";
import { exportEncryptedVault, isEncryptedExport, importEncryptedVault } from "./encrypted-export";

describe("Vault validation (parseVault)", () => {
  describe("rejects malformed payloads", () => {
    it("rejects non-object", () => {
      expect(() => parseVault('"string"')).toThrow("Invalid vault format");
      expect(() => parseVault("42")).toThrow("Invalid vault format");
      expect(() => parseVault("null")).toThrow("Invalid vault format");
    });

    it("rejects missing version", () => {
      expect(() => parseVault('{"entries":[]}')).toThrow("Invalid vault format");
    });

    it("rejects missing entries", () => {
      expect(() => parseVault('{"version":1}')).toThrow("Invalid vault format");
    });

    it("rejects entries as non-array", () => {
      expect(() => parseVault('{"version":1,"entries":"not-array"}')).toThrow(
        "Invalid vault format"
      );
    });

    it("rejects entry with missing id", () => {
      const vault = {
        version: 1,
        entries: [{ url: "test.com", username: "u", password: "p" }]
      };
      expect(() => parseVault(JSON.stringify(vault))).toThrow("missing or invalid id");
    });

    it("rejects entry with empty id", () => {
      const vault = {
        version: 1,
        entries: [{ id: "", url: "test.com", username: "u", password: "p" }]
      };
      expect(() => parseVault(JSON.stringify(vault))).toThrow("missing or invalid id");
    });

    it("rejects entry with non-string url", () => {
      const vault = {
        version: 1,
        entries: [{ id: "1", url: 123, username: "u", password: "p" }]
      };
      expect(() => parseVault(JSON.stringify(vault))).toThrow("url must be a string");
    });

    it("rejects entry with non-string password", () => {
      const vault = {
        version: 1,
        entries: [{ id: "1", url: "test.com", username: "u", password: 123 }]
      };
      expect(() => parseVault(JSON.stringify(vault))).toThrow("password must be a string");
    });

    it("accepts null url/username/password (coerces to empty string)", () => {
      const vault = {
        version: 1,
        entries: [{ id: "1", url: null, username: null, password: null }]
      };
      const parsed = parseVault(JSON.stringify(vault));
      expect(parsed.entries[0].url).toBe("");
      expect(parsed.entries[0].username).toBe("");
      expect(parsed.entries[0].password).toBe("");
    });

    it("rejects non-string folders", () => {
      const vault = {
        version: 1,
        entries: [],
        folders: [123, true]
      };
      expect(() => parseVault(JSON.stringify(vault))).toThrow("must be a string");
    });
  });

  describe("accepts valid payloads", () => {
    it("minimal valid vault", () => {
      const vault = { version: 1, entries: [] };
      const parsed = parseVault(JSON.stringify(vault));
      expect(parsed.version).toBe(1);
      expect(parsed.entries).toEqual([]);
    });

    it("vault with all optional fields", () => {
      const vault = {
        version: 1,
        entries: [
        {
          id: "entry-1",
          url: "https://example.com",
          username: "user",
          password: "pass",
          notes: "note",
          folder: "default",
          totpSecret: "JBSWY3DPEHPK3PXP"
        }],

        folders: ["default", "archive"],
        cloudFiles: [],
        cloudFolders: [],
        cloudQuotaUsed: 0
      };
      const parsed = parseVault(JSON.stringify(vault));
      expect(parsed.entries.length).toBe(1);
      expect(parsed.folders.length).toBe(2);
    });
  });
});

describe("Plaintext leak prevention", () => {
  it("encrypted export does not contain plaintext passwords", async () => {
    const vault = {
      ...createEmptyVault(),
      entries: [
      createEntry({
        url: "https://bank.com",
        username: "john@bank.com",
        password: "SuperSecretBankP@ss!",
        notes: "Account: 123456789"
      })]

    };

    const encrypted = await exportEncryptedVault(vault, "master-password");


    expect(encrypted).not.toContain("SuperSecretBankP@ss!");
    expect(encrypted).not.toContain("john@bank.com");
    expect(encrypted).not.toContain("123456789");


    expect(encrypted).toContain("vault-keeper-encrypted");


    const parsed = JSON.parse(encrypted);
    expect(parsed.format).toBe("vault-keeper-encrypted");
    expect(parsed.ciphertext).toBeDefined();
    expect(parsed.salt).toBeDefined();
    expect(parsed.nonce).toBeDefined();
  });

  it("encrypted export roundtrips correctly", async () => {
    const vault = {
      ...createEmptyVault(),
      entries: [
      createEntry({
        url: "https://example.com",
        username: "user@test.com",
        password: "testPassword123"
      })]

    };

    const encrypted = await exportEncryptedVault(vault, "master-password");
    const { vault: decrypted } = await importEncryptedVault(encrypted, "master-password");

    expect(decrypted.entries.length).toBe(1);
    expect(decrypted.entries[0].password).toBe("testPassword123");
  });

  it("encrypted export with secretKey does not leak secretKey in plaintext", async () => {
    const vault = { ...createEmptyVault(), entries: [] };
    const secretKey = "a".repeat(64);

    const encrypted = await exportEncryptedVault(vault, "pass", secretKey);
    const parsed = JSON.parse(encrypted);




    expect(parsed.secretKey).toBeUndefined();

    expect(encrypted).not.toContain(secretKey);

    const { secretKey: restored } = await importEncryptedVault(encrypted, "pass");
    expect(restored).toBe(secretKey);
  });

  it("isEncryptedExport detects encrypted format", () => {
    const encrypted = JSON.stringify({ format: "vault-keeper-encrypted", ciphertext: "abc" });
    expect(isEncryptedExport(encrypted)).toBe(true);
  });

  it("isEncryptedExport rejects plain JSON", () => {
    const plain = JSON.stringify({ entries: [], version: 1 });
    expect(isEncryptedExport(plain)).toBe(false);
  });

  it("wrong password fails to decrypt encrypted export", async () => {
    const vault = {
      ...createEmptyVault(),
      entries: [createEntry({ url: "", username: "u", password: "p" })]
    };

    const encrypted = await exportEncryptedVault(vault, "correct-password");

    await expect(importEncryptedVault(encrypted, "wrong-password")).rejects.toThrow();
  });
});

describe("serializeVault null sanitization", () => {
  it("converts null url/username/password to empty strings", () => {
    const vault: any = {
      version: 1,
      entries: [
      {
        id: "1",
        url: null,
        username: null,
        password: null,
        notes: null,
        folder: null,
        totpSecret: null
      }],

      folders: []
    };

    const serialized = serializeVault(vault);
    const parsed = JSON.parse(serialized);

    expect(parsed.entries[0].url).toBe("");
    expect(parsed.entries[0].username).toBe("");
    expect(parsed.entries[0].password).toBe("");
    expect(parsed.entries[0].notes).toBeUndefined();
    expect(parsed.entries[0].folder).toBeUndefined();
    expect(parsed.entries[0].totpSecret).toBeUndefined();
  });
});