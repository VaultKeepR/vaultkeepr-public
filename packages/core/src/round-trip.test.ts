import { describe, it, expect } from "vitest";
import {
  createEmptyVault,
  createEntry,
  createExportPayload,
  serializeVault,
  parseVault,
  exportEncryptedVault,
  importEncryptedVault,
  encryptPgpContent,
  importFromPgp,
  importVaultText } from
"./index";
import type { Vault, PasskeyEntry, SeedPhraseEntry } from "./types";


function sampleVault(): Vault {
  const vault = createEmptyVault();


  vault.entries.push(
    createEntry({
      url: "https://github.com",
      username: "alice",
      password: "p@ss",
      totpSecret: "JBSWY3DPEHPK3PXP",
      totpAlgorithm: "SHA-256",
      notes: "login note",
      folder: "identifiants"
    })
  );


  vault.entries.push(
    createEntry({
      url: "",
      username: "",
      password: "",
      title: "Wifi café",
      notes: "SSID: Foo\nPSK: bar",
      folder: "notes"
    })
  );


  vault.entries.push(
    createEntry({
      url: "",
      username: "Visa •••• 4242",
      password: "4111111111111111",
      notes: JSON.stringify({
        brand: "visa",
        last4: "1111",
        expiry: "12/28",
        cvv: "123",
        cardholderName: "Alice"
      }),
      notesMasked: true,
      folder: "cartes"
    })
  );


  vault.entries.push(
    createEntry({
      url: "",
      username: "Alice Doe",
      password: "",
      notes: JSON.stringify({ firstName: "Alice", lastName: "Doe", email: "a@b.com" }),
      folder: "identites"
    })
  );


  vault.entries.push(
    createEntry({
      url: "https://bank.com",
      username: "alice",
      password: "secret",
      customFields: [
      { name: "Numéro client", value: "C-123", type: "text" },
      { name: "Code de récupération", value: "rec-hidden", type: "hidden" }],

      folder: "identifiants"
    })
  );


  vault.entries.push(
    createEntry({
      url: "google.com",
      username: "user@gmail.com",
      password: "",
      folder: "passkeys",

      ...({
        type: "passkey",
        rpId: "google.com",
        rpName: "Google",
        userDisplayName: "User",
        userId: "dXNlcg",
        credentialId: "cred-id-base64url",
        privateKeyHex: "a1b2c3",
        publicKeyHex: "04deadbeef",
        algorithm: -7,
        counter: 3,
        createdAt: "2025-01-01T00:00:00Z",
        transports: ["internal", "hybrid"]
      } as Record<string, unknown>)
    })
  );


  vault.entries.push(
    createEntry({
      url: "Ledger Main",
      username: "Ledger Main",
      password: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
      folder: "seeds",
      ...({
        type: "seed",
        walletName: "Ledger Main",
        wordCount: 12,
        derivationPath: "m/44'/60'/0'/0/0",
        network: "ethereum",
        createdAt: "2025-01-01T00:00:00Z"
      } as Record<string, unknown>)
    })
  );

  return vault;
}

function expectAllPreserved(v: Vault) {
  expect(v.entries).toHaveLength(7);

  const login = v.entries.find((e) => e.folder === "identifiants" && e.url === "https://github.com")!;
  expect(login.totpSecret).toBe("JBSWY3DPEHPK3PXP");
  expect(login.totpAlgorithm).toBe("SHA-256");
  expect(login.notes).toBe("login note");

  const note = v.entries.find((e) => e.folder === "notes")!;
  expect(note.title).toBe("Wifi café");
  expect(note.notes).toBe("SSID: Foo\nPSK: bar");

  const card = v.entries.find((e) => e.folder === "cartes")!;
  expect(card.password).toBe("4111111111111111");
  expect(card.notesMasked).toBe(true);
  expect(JSON.parse(card.notes!).last4).toBe("1111");

  const id = v.entries.find((e) => e.folder === "identites")!;
  expect(id.username).toBe("Alice Doe");
  expect(JSON.parse(id.notes!).firstName).toBe("Alice");

  const custom = v.entries.find((e) => e.url === "https://bank.com")!;
  expect(custom.customFields).toEqual([
  { name: "Numéro client", value: "C-123", type: "text" },
  { name: "Code de récupération", value: "rec-hidden", type: "hidden" }]
  );

  const passkey = v.entries.find((e) => e.folder === "passkeys") as unknown as PasskeyEntry;
  expect(passkey.type).toBe("passkey");
  expect(passkey.rpId).toBe("google.com");
  expect(passkey.credentialId).toBe("cred-id-base64url");
  expect(passkey.privateKeyHex).toBe("a1b2c3");
  expect(passkey.publicKeyHex).toBe("04deadbeef");
  expect(passkey.algorithm).toBe(-7);
  expect(passkey.counter).toBe(3);
  expect(passkey.transports).toEqual(["internal", "hybrid"]);

  const seed = v.entries.find((e) => e.folder === "seeds") as unknown as SeedPhraseEntry;
  expect(seed.type).toBe("seed");
  expect(seed.walletName).toBe("Ledger Main");
  expect(seed.wordCount).toBe(12);
  expect(seed.derivationPath).toBe("m/44'/60'/0'/0/0");
  expect(seed.network).toBe("ethereum");
  expect(seed.password).toContain("abandon");
}

describe("Round-trip export/import preserves all entry types", () => {
  const source = sampleVault();

  it("plain JSON (createExportPayload → importVaultText) is lossless", async () => {
    const json = createExportPayload(source);
    const { vault } = await importVaultText(json);
    expectAllPreserved(vault);
  });

  it("serializeVault → parseVault (internal storage) is lossless", () => {
    const json = serializeVault(source);
    const vault = parseVault(json);
    expectAllPreserved(vault);
  });

  it("encrypted export (exportEncryptedVault → importEncryptedVault) is lossless", async () => {
    const encrypted = await exportEncryptedVault(source, "sup3r-password");
    const { vault } = await importEncryptedVault(encrypted, "sup3r-password");
    expectAllPreserved(vault);
  });

  it("PGP armored (encryptPgpContent → importFromPgp) is lossless", async () => {
    const plaintext = createExportPayload(source);
    const armored = await encryptPgpContent(plaintext, "pgp-passphrase");
    const { vault } = await importFromPgp(armored, "pgp-passphrase");
    expectAllPreserved(vault);
  });

  it("PGP wrapping an encrypted export (double layer) is lossless", async () => {
    const encrypted = await exportEncryptedVault(source, "vk-master-pwd");
    const armored = await encryptPgpContent(encrypted, "pgp-pass");
    const { vault } = await importFromPgp(armored, "pgp-pass", "vk-master-pwd");
    expectAllPreserved(vault);
  });
});