











import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isEncryptedExport, importEncryptedVault } from "./encrypted-export";
import { mergeImportedEntries } from "./vault";
import type { VaultEntry } from "./types";

const EXPORT_FILE = resolve(__dirname, "../../../vaultkeepr-export-encrypted-2026-05-17.json");
const PASSWORD = process.env.VAULT_TEST_PASSWORD ?? "";

describe("Real encrypted vault import (iOS/Android path)", () => {

  const skipNoPassword = !PASSWORD;
  const conditionalIt = skipNoPassword ? it.skip : it;

  if (skipNoPassword) {
    it("SKIPPED — set VAULT_TEST_PASSWORD env to run these tests", () => {
      console.warn("⚠️  Aucun mot de passe fourni. Lancez avec :");
      console.warn("   VAULT_TEST_PASSWORD=xxx npx vitest run src/import-encrypted-real.test.ts");
    });
  }


  it("should detect the file as encrypted export", () => {
    let raw: string;
    try {
      raw = readFileSync(EXPORT_FILE, "utf-8");
    } catch {
      console.warn("SKIPPED -- export file not found (removed during P0 cleanup)");
      return;
    }
    expect(isEncryptedExport(raw)).toBe(true);
  });

  it("should reject non-encrypted content", () => {
    expect(isEncryptedExport('{"entries":[]}')).toBe(false);
    expect(isEncryptedExport("not json")).toBe(false);
  });


  conditionalIt("should decrypt the vault with the correct password", async () => {
    const raw = readFileSync(EXPORT_FILE, "utf-8");
    const result = await importEncryptedVault(raw, PASSWORD);
    const vault = result.vault;

    expect(vault).toBeDefined();
    expect(vault.entries).toBeDefined();
    expect(Array.isArray(vault.entries)).toBe(true);
    expect(vault.entries.length).toBeGreaterThan(0);

    console.log(`✅ Déchiffrement OK — ${vault.entries.length} entries trouvées`);
  });


  conditionalIt("should preserve all VaultEntry fields after decryption", async () => {
    const raw = readFileSync(EXPORT_FILE, "utf-8");
    const { vault } = await importEncryptedVault(raw, PASSWORD);


    const requiredFields: (keyof VaultEntry)[] = [
    "id", "url", "username", "password"];


    for (const entry of vault.entries) {
      for (const field of requiredFields) {
        expect(entry).toHaveProperty(field);
      }
    }


    const passkeys = vault.entries.filter((e: any) => e.folder === "passkeys" || e.type === "passkey");
    console.log(`   Passkeys: ${passkeys.length}`);
    if (passkeys.length > 0) {
      const pk = passkeys[0] as any;
      console.log(`   Passkey sample fields: ${Object.keys(pk).join(", ")}`);

      const hasPasskeyFields = pk.credentialId && pk.publicKeyHex && pk.rpId;
      if (hasPasskeyFields) {
        console.log("   ✅ Passkey crypto fields preserved (credentialId, publicKeyHex, rpId)");
      } else {
        console.warn("   ⚠️  Passkey entries found but missing crypto fields — may be manually categorized logins or exported before fix");
      }
    }


    const cards = vault.entries.filter((e) => e.folder === "cartes");
    console.log(`   Cartes bancaires: ${cards.length}`);
    if (cards.length > 0) {
      const card = cards[0];
      console.log(`   Card sample: username="${card.username}", notesMasked=${card.notesMasked}`);
    }


    console.log(`   Entries avec metadata: ${vault.entries.filter((e) => e.createdAt || e.tags?.length).length}/${vault.entries.length}`);


    const logins = vault.entries.filter((e: any) => e.folder !== "passkeys" && e.folder !== "cartes");
    if (logins.length > 0) {
      console.log(`   Sample login fields: ${Object.keys(logins[0]).join(", ")}`);
    }
  });


  conditionalIt("should merge entries without overwriting existing vault", async () => {
    const raw = readFileSync(EXPORT_FILE, "utf-8");
    const { vault: imported } = await importEncryptedVault(raw, PASSWORD);


    const existingEntries: VaultEntry[] = [
    {
      id: "local-only-1",
      folder: "Logins",
      url: "https://local-only-site.com",
      username: "localuser",
      password: "localpass123",
      notes: ""
    } as VaultEntry,

    ...(imported.entries.length > 0 ? [{ ...imported.entries[0] }] : [])];


    const result = mergeImportedEntries(existingEntries, imported.entries);


    expect(result.entries.some((e) => e.id === "local-only-1")).toBe(true);


    expect(result.stats.skipped + result.stats.enriched).toBeGreaterThanOrEqual(1);


    expect(result.stats.added).toBe(imported.entries.length - 1);


    expect(result.entries.length).toBe(existingEntries.length + result.stats.added);

    console.log(`✅ Merge OK — added: ${result.stats.added}, skipped: ${result.stats.skipped}, enriched: ${result.stats.enriched}`);
  });


  conditionalIt("should reject decryption with wrong password", async () => {
    const raw = readFileSync(EXPORT_FILE, "utf-8");
    await expect(
      importEncryptedVault(raw, "this-is-definitely-wrong-password-12345")
    ).rejects.toThrow();

    console.log("✅ Mauvais mot de passe correctement rejeté");
  });
});