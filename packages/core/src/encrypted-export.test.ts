import { describe, it, expect } from "vitest";
import { exportEncryptedVault, isEncryptedExport, importEncryptedVault } from "./encrypted-export";
import { createEmptyVault, createEntry } from "./vault";
import type { SecureDocument } from "./types";

describe("Encrypted Export / Import Workflow", () => {
  it("should encrypt a vault, verify its format, and correctly decrypt it", async () => {

    const vault = createEmptyVault();


    const folder = "Dossier Secret";
    vault.folders.push(folder);


    const entry = createEntry({
      url: "https://vaultkeepr.xyz",
      username: "testuser",
      password: "SuperSecretPassword123!",
      totpSecret: "JBSWY3DPEHPK3PXP",
      notes: "Ce compte est utilisé pour les tests unitaires."
    });
    entry.folder = folder;
    vault.entries.push(entry);


    const doc: SecureDocument = {
      id: "doc-123",
      type: "passport",
      label: "passport.pdf",
      mimeType: "application/pdf",
      originalSize: 1024,
      fragments: ["QmTestCID123456"],
      nonce: "1234567890",
      blurredThumbnail: "base64...",
      addedAt: new Date().toISOString()
    };
    if (!vault.documents) vault.documents = [];
    vault.documents.push(doc);

    const testPassword = "master-password-fort-456";
    const testSecretKey = "abc123def456";


    const exportedJson = await exportEncryptedVault(vault, testPassword, testSecretKey);


    expect(typeof exportedJson).toBe("string");


    const isExportFormat = isEncryptedExport(exportedJson);
    expect(isExportFormat).toBe(true);

    const payload = JSON.parse(exportedJson);
    expect(payload.format).toBe("vault-keeper-encrypted");
    expect(payload.version).toBe(2);
    expect(payload.salt).toBeDefined();
    expect(payload.nonce).toBeDefined();
    expect(payload.ciphertext).toBeDefined();


    const result = await importEncryptedVault(exportedJson, testPassword);
    const importedVault = result.vault;


    expect(result.secretKey).toBe(testSecretKey);


    expect(importedVault.version).toBe(vault.version);


    expect(importedVault.folders).toHaveLength(1);
    expect(importedVault.folders[0]).toBe("Dossier Secret");


    expect(importedVault.entries).toHaveLength(1);
    const importedEntry = importedVault.entries[0];
    expect(importedEntry.id).toBe(entry.id);
    expect(importedEntry.url).toBe("https://vaultkeepr.xyz");
    expect(importedEntry.username).toBe("testuser");
    expect(importedEntry.password).toBe("SuperSecretPassword123!");
    expect(importedEntry.totpSecret).toBe("JBSWY3DPEHPK3PXP");
    expect(importedEntry.notes).toBe("Ce compte est utilisé pour les tests unitaires.");
    expect(importedEntry.folder).toBe("Dossier Secret");


    expect(importedVault.documents).toBeDefined();
    expect(importedVault.documents!).toHaveLength(1);
    const importedDoc = importedVault.documents![0];
    expect(importedDoc.label).toBe("passport.pdf");
    expect(importedDoc.fragments[0]).toBe("QmTestCID123456");

  });

  it("should fail to decrypt with the WRONG password", async () => {
    const vault = createEmptyVault();
    vault.entries.push(createEntry({ url: "test.com", username: "a", password: "b" }));

    const correctPassword = "correct-pwd";
    const wrongPassword = "wrong-pwd";

    const exportedJson = await exportEncryptedVault(vault, correctPassword);


    await expect(importEncryptedVault(exportedJson, wrongPassword)).rejects.toThrow();
  });

  it("should detect invalid encrypted export formats", () => {

    expect(isEncryptedExport("Ceci n'est pas un JSON")).toBe(false);


    expect(isEncryptedExport(JSON.stringify({ encrypted: false, items: [] }))).toBe(false);


    expect(isEncryptedExport(JSON.stringify({ format: "vault-keeper-encrypted" }))).toBe(true);
  });
});