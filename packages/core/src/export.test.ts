import { describe, it, expect } from "vitest";
import {
  createEmptyVault,
  createEntry,
  exportCsv,
  exportBitwardenJson,
  exportProtonPassJson,
  importBitwardenJson,
  importCsv,
  importProtonPassJson } from
"./index";
import type { Vault } from "./types";



function sampleVault(): Vault {
  const v = createEmptyVault();
  v.entries.push(
    createEntry({
      url: "https://github.com",
      username: "alice",
      password: "p@ss",
      totpSecret: "JBSWY3DPEHPK3PXP",
      notes: "login note",
      title: "GitHub",
      folder: "identifiants",
      favorite: true,
      customFields: [
      { name: "Numéro client", value: "C-123", type: "text" },
      { name: "Code", value: "hidden-val", type: "hidden" }]

    })
  );
  v.entries.push(
    createEntry({
      url: "",
      username: "",
      password: "",
      title: "Wifi café",
      notes: "SSID: Foo\nPSK: bar",
      folder: "notes"
    })
  );
  v.entries.push(
    createEntry({
      url: "",
      username: "Visa •••• 1111",
      password: "4111111111111111",
      notes: JSON.stringify({
        brand: "visa",
        last4: "1111",
        expiry: "05/28",
        cvv: "123",
        cardholderName: "Alice"
      }),
      notesMasked: true,
      folder: "cartes",
      title: "Ma Visa"
    })
  );
  v.entries.push(
    createEntry({
      url: "",
      username: "Alice Doe",
      password: "",
      notes: JSON.stringify({
        firstName: "Alice",
        lastName: "Doe",
        email: "alice@example.com",
        phone: "+1 555",
        address: "1 Main St",
        city: "Paris",
        postalCode: "75001",
        country: "France"
      }),
      folder: "identites",
      title: "Alice Doe"
    })
  );
  return v;
}

describe("exportCsv chrome variant", () => {
  const source = sampleVault();

  it("produces a valid CSV with the Chrome header", () => {
    const r = exportCsv(source, { variant: "chrome" });
    expect(r.extension).toBe(".csv");
    expect(r.mimeType).toBe("text/csv");
    const lines = r.content.split("\r\n");
    expect(lines[0]).toBe("name,url,username,password,note");
    expect(lines.length).toBe(1 + source.entries.length);
  });

  it("round-trips logins back via importCsv (title/url/user/pass)", () => {
    const r = exportCsv(source, { variant: "chrome" });
    const v = importCsv(r.content);
    const login = v.entries.find((e) => e.url === "https://github.com")!;
    expect(login.username).toBe("alice");
    expect(login.password).toBe("p@ss");

    expect(login.notes).toContain("login note");
    expect(login.title).toBe("GitHub");
  });

  it("preserves TOTP and customFields inside the note column", () => {
    const r = exportCsv(source, { variant: "chrome" });
    const v = importCsv(r.content);
    const login = v.entries.find((e) => e.url === "https://github.com")!;

    expect(login.notes).toContain("TOTP: JBSWY3DPEHPK3PXP");
    expect(login.notes).toContain("Numéro client: C-123");
    expect(login.notes).toContain("Code: hidden-val");

    expect(login.notes).toContain("login note");
  });
});

describe("exportCsv bitwarden variant", () => {
  const source = sampleVault();

  it("emits typed rows (1=login, 2=note, 3=card, 4=identity)", () => {
    const r = exportCsv(source, { variant: "bitwarden" });
    const lines = r.content.split("\r\n");
    expect(lines[0]).toContain("type");

    const githubRow = lines.find((l) => l.includes("https://github.com"))!;
    expect(gitHubContains(githubRow, ",1,")).toBe(true);
    const noteRow = lines.find((l) => l.includes("Wifi café"))!;
    expect(noteRow.includes(",2,")).toBe(true);
    const cardRow = lines.find((l) => l.includes("4111111111111111"))!;
    expect(cardRow.includes(",3,")).toBe(true);
    const idRow = lines.find((l) => l.includes("Alice Doe"))!;
    expect(idRow.includes(",4,")).toBe(true);
  });

  it("round-trips logins back via importCsv", () => {
    const r = exportCsv(source, { variant: "bitwarden" });
    const v = importCsv(r.content);
    const login = v.entries.find((e) => e.url === "https://github.com")!;
    expect(login.username).toBe("alice");
    expect(login.password).toBe("p@ss");
    expect(login.totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });
});


function gitHubContains(row: string, needle: string): boolean {
  return row.includes(needle);
}

describe("exportBitwardenJson", () => {
  const source = sampleVault();

  it("produces a valid Bitwarden JSON payload", () => {
    const r = exportBitwardenJson(source);
    expect(r.extension).toBe(".json");
    expect(r.mimeType).toBe("application/json");
    const parsed = JSON.parse(r.content);
    expect(parsed.encrypted).toBe(false);
    expect(parsed.items.length).toBe(source.entries.length);
  });

  it("round-trips through importBitwardenJson preserving types", () => {
    const r = exportBitwardenJson(source);
    const v = importBitwardenJson(r.content);

    const login = v.entries.find((e) => e.url === "https://github.com")!;
    expect(login.username).toBe("alice");
    expect(login.password).toBe("p@ss");
    expect(login.totpSecret).toBe("JBSWY3DPEHPK3PXP");
    expect(login.favorite).toBe(true);
    expect(login.customFields).toEqual([
    { name: "Numéro client", value: "C-123", type: "text" },
    { name: "Code", value: "hidden-val", type: "hidden" }]
    );

    const note = v.entries.find((e) => e.folder === "notes")!;
    expect(note.title).toBe("Wifi café");
    expect(note.notes).toBe("SSID: Foo\nPSK: bar");

    const card = v.entries.find((e) => e.folder === "cartes")!;
    expect(card.password).toBe("4111111111111111");
    expect(card.username).toContain("Visa");
    const cm = JSON.parse(card.notes!);
    expect(cm.expiry).toBe("05/28");
    expect(cm.cvv).toBe("123");
    expect(cm.cardholderName).toBe("Alice");

    const id = v.entries.find((e) => e.folder === "identites")!;
    expect(id.username).toBe("Alice Doe");
    const im = JSON.parse(id.notes!);
    expect(im.firstName).toBe("Alice");
    expect(im.email).toBe("alice@example.com");
  });

  it("skips passkeys and reports them", () => {
    const v = createEmptyVault();
    v.entries.push(
      createEntry({
        url: "google.com",
        username: "u@gmail.com",
        password: "",
        folder: "passkeys",
        ...({ type: "passkey", credentialId: "x", privateKeyHex: "y" } as Record<string, unknown>)
      })
    );
    v.entries.push(
      createEntry({
        url: "https://x.com",
        username: "u",
        password: "p",
        folder: "identifiants"
      })
    );
    const r = exportBitwardenJson(v);
    expect(r.skipped).toHaveLength(1);
    expect(r.skipped[0].folder).toBe("passkeys");
    const parsed = JSON.parse(r.content);
    expect(parsed.items).toHaveLength(1);
  });
});

describe("exportProtonPassJson", () => {
  const source = sampleVault();

  it("produces a valid ProtonPass JSON payload", () => {
    const r = exportProtonPassJson(source);
    expect(r.extension).toBe(".json");
    const parsed = JSON.parse(r.content);
    expect(parsed.vaults.Default.items.length).toBe(source.entries.length);
  });

  it("round-trips through importProtonPassJson preserving types", () => {
    const r = exportProtonPassJson(source);
    const v = importProtonPassJson(r.content);

    const login = v.entries.find((e) => e.url === "https://github.com")!;
    expect(login.username).toBe("alice");
    expect(login.password).toBe("p@ss");
    expect(login.totpSecret).toBe("JBSWY3DPEHPK3PXP");
    expect(login.title).toBe("GitHub");
    expect(login.notes).toBe("login note");

    const note = v.entries.find((e) => e.folder === "notes")!;
    expect(note.title).toBe("Wifi café");
    expect(note.notes).toBe("SSID: Foo\nPSK: bar");

    const card = v.entries.find((e) => e.folder === "cartes")!;
    expect(card.password).toBe("4111111111111111");
    const cm = JSON.parse(card.notes!);
    expect(cm.cvv).toBe("123");
    expect(cm.cardholderName).toBe("Alice");

    const id = v.entries.find((e) => e.folder === "identites")!;
    expect(id.username).toBe("Alice Doe");
    const im = JSON.parse(id.notes!);
    expect(im.firstName).toBe("Alice");
  });

  it("skips passkeys and reports them", () => {
    const v = createEmptyVault();
    v.entries.push(
      createEntry({
        url: "google.com",
        username: "u@gmail.com",
        password: "",
        folder: "passkeys"
      })
    );
    const r = exportProtonPassJson(v);
    expect(r.skipped).toHaveLength(1);
    expect(r.skipped[0].reason).toContain("passkey");
  });

  it("maps url-type customFields as additional urls", () => {
    const v = createEmptyVault();
    v.entries.push(
      createEntry({
        url: "https://a.com",
        username: "u",
        password: "p",
        folder: "identifiants",
        customFields: [
        { name: "url", value: "https://b.com", type: "url" }]

      })
    );
    const r = exportProtonPassJson(v);
    const parsed = JSON.parse(r.content);
    const item = parsed.vaults.Default.items[0];
    expect(item.data.content.urls).toEqual(["https://a.com", "https://b.com"]);
  });
});