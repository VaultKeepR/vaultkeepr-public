import { describe, it, expect } from "vitest";
import {
  importCsv,
  import1PasswordPif,
  isOnePasswordPif,
  importBitwardenJson,
  importProtonPassJson } from
"./import";
import { exportBitwardenJson, exportProtonPassJson } from "./export";
import { isLastPassExport, importLastPass } from "./import-lastpass";
import { isDashlaneCsv, isDashlaneJson, importDashlaneCsv, importDashlaneJson } from "./import-dashlane";
import { isRoboFormExport, importRoboForm } from "./import-roboform";
import { isKeeperCsv, isKeeperJson, importKeeperCsv, importKeeperJson } from "./import-keeper";
import { isEnpassCsv, isEnpassJson, importEnpassCsv, importEnpassJson } from "./import-enpass";
import {
  mergeImportedEntries,
  normalizeUrl,
  entryFingerprint,
  createEntry,
  createEmptyVault } from
"./vault";



describe("normalizeUrl", () => {
  it("strips protocol, www, and trailing slash", () => {
    expect(normalizeUrl("https://www.example.com/")).toBe("example.com");
    expect(normalizeUrl("http://example.com")).toBe("example.com");
    expect(normalizeUrl("example.com/path/")).toBe("example.com/path");
  });

  it("handles empty and null-ish input", () => {
    expect(normalizeUrl("")).toBe("");
    expect(normalizeUrl(undefined as unknown as string)).toBe("");
  });
});

describe("entryFingerprint", () => {
  it("creates consistent fingerprints regardless of case/protocol", () => {
    const fp1 = entryFingerprint({ url: "https://GitHub.com", username: "Me@Test.COM", password: "pw" });
    const fp2 = entryFingerprint({ url: "http://www.github.com/", username: "me@test.com", password: "pw" });
    expect(fp1).toBe(fp2);
  });

  it("distinguishes different passwords", () => {
    const fp1 = entryFingerprint({ url: "a.com", username: "u", password: "p1" });
    const fp2 = entryFingerprint({ url: "a.com", username: "u", password: "p2" });
    expect(fp1).not.toBe(fp2);
  });
});

describe("mergeImportedEntries", () => {
  const existing = [
  createEntry({ url: "https://github.com", username: "user1", password: "pass1" }),
  createEntry({ url: "https://gitlab.com", username: "user2", password: "pass2" })];


  it("skips exact duplicates", () => {
    const imported = [
    createEntry({ url: "https://www.github.com/", username: "user1", password: "pass1" })];

    const { entries, stats } = mergeImportedEntries(existing, imported);
    expect(entries).toHaveLength(2);
    expect(stats.added).toBe(0);
    expect(stats.skipped).toBe(1);
    expect(stats.enriched).toBe(0);
  });

  it("adds truly new entries", () => {
    const imported = [
    createEntry({ url: "https://bitbucket.org", username: "user3", password: "pass3" })];

    const { entries, stats } = mergeImportedEntries(existing, imported);
    expect(entries).toHaveLength(3);
    expect(stats.added).toBe(1);
    expect(stats.skipped).toBe(0);
  });

  it("enriches existing entry with TOTP from import", () => {
    const imported = [
    createEntry({ url: "https://github.com", username: "user1", password: "pass1", totpSecret: "JBSWY3DPEHPK3PXP" })];

    const { entries, stats } = mergeImportedEntries(existing, imported);
    expect(entries).toHaveLength(2);
    expect(stats.enriched).toBe(1);
    expect(stats.skipped).toBe(0);
    expect(entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("does not overwrite existing TOTP", () => {
    const withTotp = [
    createEntry({ url: "https://github.com", username: "user1", password: "pass1", totpSecret: "ORIGINAL" })];

    const imported = [
    createEntry({ url: "https://github.com", username: "user1", password: "pass1", totpSecret: "DIFFERENT" })];

    const { entries, stats } = mergeImportedEntries(withTotp, imported);
    expect(entries[0].totpSecret).toBe("ORIGINAL");
    expect(stats.skipped).toBe(1);
  });

  it("handles double import without duplicating", () => {
    const imported = existing.map((e) => createEntry({ url: e.url, username: e.username, password: e.password }));
    const { entries, stats } = mergeImportedEntries(existing, imported);
    expect(entries).toHaveLength(2);
    expect(stats.skipped).toBe(2);
    expect(stats.added).toBe(0);
  });
});



describe("importBitwardenJson TOTP", () => {
  it("extracts raw base32 TOTP secret", () => {
    const bw = JSON.stringify({
      encrypted: false,
      items: [{
        login: {
          uris: [{ uri: "https://example.com" }],
          username: "user",
          password: "pass",
          totp: "JBSWY3DPEHPK3PXP"
        }
      }]
    });
    const v = importBitwardenJson(bw);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("extracts TOTP from otpauth URI", () => {
    const bw = JSON.stringify({
      encrypted: false,
      items: [{
        login: {
          uris: [{ uri: "https://example.com" }],
          username: "user",
          password: "pass",
          totp: "otpauth://totp/Example:user?secret=JBSWY3DPEHPK3PXP&issuer=Example"
        }
      }]
    });
    const v = importBitwardenJson(bw);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("no TOTP when field is absent", () => {
    const bw = JSON.stringify({
      encrypted: false,
      items: [{
        login: {
          uris: [{ uri: "https://example.com" }],
          username: "user",
          password: "pass"
        }
      }]
    });
    const v = importBitwardenJson(bw);
    expect(v.entries[0].totpSecret).toBeUndefined();
  });
});

describe("importCsv TOTP", () => {
  it("extracts TOTP from totp column (raw base32)", () => {
    const csv = "url,username,password,totp\nhttps://example.com,user,pass,JBSWY3DPEHPK3PXP\n";
    const v = importCsv(csv);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("extracts TOTP from otpauth column", () => {
    const csv = "url,username,password,otpauth\nhttps://example.com,user,pass,otpauth://totp/Example?secret=ABCDEFGHIJKLMNOP&issuer=Test\n";
    const v = importCsv(csv);
    expect(v.entries[0].totpSecret).toBe("ABCDEFGHIJKLMNOP");
  });

  it("no TOTP when column is absent", () => {
    const csv = "url,username,password\nhttps://example.com,user,pass\n";
    const v = importCsv(csv);
    expect(v.entries[0].totpSecret).toBeUndefined();
  });

  it("extracts notes from CSV", () => {
    const csv = "url,username,password,notes\nhttps://example.com,user,pass,some notes here\n";
    const v = importCsv(csv);
    expect(v.entries[0].notes).toBe("some notes here");
  });
});

describe("import1PasswordPif TOTP", () => {
  it("extracts TOTP from secureContents.sections", () => {
    const line = JSON.stringify({
      typeName: "webforms.WebForm",
      location: "https://example.com",
      secureContents: {
        fields: [
        { designation: "username", value: "me" },
        { designation: "password", value: "pw" }],

        sections: [{
          fields: [{
            k: "TOTP",
            t: "one-time password",
            v: "otpauth://totp/Example:me?secret=JBSWY3DPEHPK3PXP&issuer=Example"
          }]
        }]
      }
    });
    const v = import1PasswordPif(line);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("extracts raw base32 TOTP from secureContents.sections", () => {
    const line = JSON.stringify({
      typeName: "webforms.WebForm",
      location: "https://example.com",
      secureContents: {
        fields: [
        { designation: "username", value: "me" },
        { designation: "password", value: "pw" }],

        sections: [{
          fields: [{
            k: "concealed",
            n: "TOTP_secret",
            t: "2fa code",
            v: "JBSWY3DPEHPK3PXP"
          }]
        }]
      }
    });
    const v = import1PasswordPif(line);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });
});

describe("importProtonPassJson TOTP (already supported)", () => {
  it("extracts TOTP from totpUri", () => {
    const json = JSON.stringify({
      vaults: {
        v1: {
          name: "Personal",
          items: [{
            type: "login",
            data: {
              content: {
                itemUsername: "user",
                password: "pass",
                urls: ["https://example.com"],
                totpUri: "otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&issuer=Example"
              },
              metadata: { name: "Example" }
            }
          }]
        }
      }
    });
    const v = importProtonPassJson(json);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });
});



describe("importBitwardenJson cards", () => {
  it("imports a Bitwarden card item", () => {
    const bw = JSON.stringify({
      encrypted: false,
      items: [{
        type: 3,
        name: "My Visa",
        card: {
          cardholderName: "John Doe",
          number: "4111111111111111",
          expMonth: "05",
          expYear: "2028",
          code: "123"
        }
      }]
    });
    const v = importBitwardenJson(bw);
    expect(v.entries).toHaveLength(1);
    const e = v.entries[0];
    expect(e.folder).toBe("cartes");
    expect(e.password).toBe("4111111111111111");
    expect(e.username).toContain("Visa");
    expect(e.username).toContain("1111");
    expect(e.notesMasked).toBe(true);
    const notes = JSON.parse(e.notes!);
    expect(notes.brand).toBe("visa");
    expect(notes.last4).toBe("1111");
    expect(notes.expiry).toBe("05/28");
    expect(notes.cvv).toBe("123");
    expect(notes.cardholderName).toBe("John Doe");
  });

  it("imports both login and card items", () => {
    const bw = JSON.stringify({
      encrypted: false,
      items: [
      { login: { uris: [{ uri: "https://a.com" }], username: "u", password: "p" } },
      { type: 3, card: { number: "5500000000000004", expMonth: "12", expYear: "2025", code: "456", cardholderName: "Jane" } }]

    });
    const v = importBitwardenJson(bw);
    expect(v.entries).toHaveLength(2);
    expect(v.entries[0].folder).toBe("identifiants");
    expect(v.entries[1].folder).toBe("cartes");
    expect(v.entries[1].username).toContain("Mastercard");
  });
});

describe("importProtonPassJson cards", () => {
  it("imports a ProtonPass creditCard item", () => {
    const json = JSON.stringify({
      vaults: {
        v1: {
          name: "Personal",
          items: [{
            type: "creditCard",
            data: {
              content: {
                cardholderName: "Alice Martin",
                number: "4242424242424242",
                expirationDate: "2026-09",
                verificationNumber: "321"
              },
              metadata: { name: "Ma Visa" }
            }
          }]
        }
      }
    });
    const v = importProtonPassJson(json);
    expect(v.entries).toHaveLength(1);
    const e = v.entries[0];
    expect(e.folder).toBe("cartes");
    expect(e.password).toBe("4242424242424242");
    expect(e.username).toContain("Visa");
    expect(e.username).toContain("4242");
    const notes = JSON.parse(e.notes!);
    expect(notes.expiry).toBe("09/26");
    expect(notes.cvv).toBe("321");
    expect(notes.cardholderName).toBe("Alice Martin");
  });

  it("imports both logins and cards from ProtonPass", () => {
    const json = JSON.stringify({
      vaults: {
        v1: {
          name: "Personal",
          items: [
          {
            type: "login",
            data: {
              content: { itemUsername: "user", password: "pass", urls: ["https://a.com"] },
              metadata: { name: "Login" }
            }
          },
          {
            type: "creditCard",
            data: {
              content: { number: "5555555555554444", expirationDate: "01/29", verificationNumber: "789", cardholderName: "Bob" },
              metadata: { name: "MC Bob" }
            }
          },
          {
            type: "note",
            data: {
              content: { note: "A note" },
              metadata: { name: "My note" }
            }
          }]

        }
      }
    });
    const v = importProtonPassJson(json);
    expect(v.entries).toHaveLength(3);
    expect(v.entries[0].folder).toBe("identifiants");
    expect(v.entries[1].folder).toBe("cartes");
    expect(v.entries[1].username).toContain("Mastercard");
    expect(v.entries[2].folder).toBe("notes");
  });

  it("handles numeric type 4 for creditCard", () => {
    const json = JSON.stringify({
      vaults: {
        v1: {
          name: "Personal",
          items: [{
            type: 4,
            data: {
              content: {
                cardholderName: "Test User",
                number: "4000056655665556",
                expirationDate: "2027-03",
                verificationNumber: "999"
              },
              metadata: { name: "Test Card" }
            }
          }]
        }
      }
    });
    const v = importProtonPassJson(json);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].folder).toBe("cartes");
    expect(v.entries[0].password).toBe("4000056655665556");
    const notes = JSON.parse(v.entries[0].notes!);
    expect(notes.expiry).toBe("03/27");
    expect(notes.cardholderName).toBe("Test User");
  });
});



describe("multi-URI round-trip", () => {
  it("preserves urls[] through Bitwarden export → import", () => {
    const vault = createEmptyVault();
    vault.entries.push(
      createEntry({
        url: "https://primary.example.com",
        username: "user",
        password: "pass",
        urls: [
        { uri: "https://primary.example.com", matchType: "exact" },
        { uri: "https://sub.example.com", matchType: "hostname" },
        { uri: "https://other.example.org", matchType: "baseDomain" },
        { uri: "https://never-match.com", matchType: "never" }]

      })
    );

    const exported = exportBitwardenJson(vault);
    const reimported = importBitwardenJson(exported.content);

    expect(reimported.entries).toHaveLength(1);
    const entry = reimported.entries[0];
    expect(entry.url).toBe("https://primary.example.com");
    expect(entry.urls).toBeDefined();
    expect(entry.urls).toHaveLength(4);


    const exact = entry.urls!.find((u) => u.uri === "https://primary.example.com");
    expect(exact?.matchType).toBe("exact");

    const hostname = entry.urls!.find((u) => u.uri === "https://sub.example.com");
    expect(hostname?.matchType).toBe("hostname");

    const baseDomain = entry.urls!.find((u) => u.uri === "https://other.example.org");
    expect(baseDomain?.matchType).toBe("baseDomain");

    const never = entry.urls!.find((u) => u.uri === "https://never-match.com");
    expect(never?.matchType).toBe("never");
  });

  it("preserves urls[] through ProtonPass export → import", () => {
    const vault = createEmptyVault();
    vault.entries.push(
      createEntry({
        url: "https://example.com",
        username: "user",
        password: "pass",
        urls: [
        { uri: "https://example.com" },
        { uri: "https://sub.example.com" }]

      })
    );

    const exported = exportProtonPassJson(vault);
    const reimported = importProtonPassJson(exported.content);

    expect(reimported.entries).toHaveLength(1);
    const entry = reimported.entries[0];
    expect(entry.url).toBe("https://example.com");


    const totalUris = entry.url ? 1 : 0;
    const urisInArray = entry.urls?.length ?? 0;
    expect(totalUris + urisInArray).toBe(2);
  });
});



describe("isLastPassExport", () => {
  it("detects LastPass CSV with grouping column", () => {
    expect(isLastPassExport("url,username,password,totp,extra,name,grouping,fav")).toBe(true);
  });
  it("rejects non-LastPass CSV", () => {
    expect(isLastPassExport("url,username,password")).toBe(false);
  });
  it("rejects JSON", () => {
    expect(isLastPassExport('{"url":"a"}')).toBe(false);
  });
});

describe("isDashlaneCsv", () => {
  it("detects Dashlane CSV with otpSecret column", () => {
    expect(isDashlaneCsv("title,url,username,password,note,category,otpSecret")).toBe(true);
  });
  it("rejects generic CSV", () => {
    expect(isDashlaneCsv("url,username,password")).toBe(false);
  });
});

describe("isDashlaneJson", () => {
  it("detects Dashlane JSON with AUTHENTIFIANT key", () => {
    expect(isDashlaneJson('{"AUTHENTIFIANT":[]}')).toBe(true);
  });
  it("rejects other JSON", () => {
    expect(isDashlaneJson('{"items":[]}')).toBe(false);
  });
});

describe("importDashlaneJson", () => {
  it("imports Dashlane credentials", () => {
    const json = JSON.stringify({
      AUTHENTIFIANT: [
      { title: "MySite", login: "user@example.com", password: "secret123", url: "https://example.com", note: "extra info", otpSecret: "JBSWY3DPEHPK3PXP", category: "" }]

    });
    const v = importDashlaneJson(json);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].url).toBe("https://example.com");
    expect(v.entries[0].username).toBe("user@example.com");
    expect(v.entries[0].password).toBe("secret123");
    expect(v.entries[0].title).toBe("MySite");
    expect(v.entries[0].notes).toBe("extra info");
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });
});

describe("isRoboFormExport", () => {
  it("detects RoboForm CSV with rf_note column", () => {
    expect(isRoboFormExport("Name,Url,Login,Password,Note,Folder,Rf_Note")).toBe(true);
  });
  it("rejects non-RoboForm CSV", () => {
    expect(isRoboFormExport("url,username,password")).toBe(false);
  });
});

describe("isKeeperCsv", () => {
  it("detects Keeper CSV with login_url + custom_fields", () => {
    expect(isKeeperCsv("folder,title,login,password,login_url,notes,custom_fields")).toBe(true);
  });
  it("rejects generic CSV", () => {
    expect(isKeeperCsv("url,username,password")).toBe(false);
  });
});

describe("isKeeperJson", () => {
  it("detects Keeper JSON with records key", () => {
    expect(isKeeperJson('{"records":[]}')).toBe(true);
  });
  it("rejects other JSON", () => {
    expect(isKeeperJson('{"items":[]}')).toBe(false);
  });
});

describe("importKeeperJson", () => {
  it("imports Keeper records with custom fields", () => {
    const json = JSON.stringify({
      records: [
      { title: "Bank", login: "bankuser", password: "bankpass", login_url: "https://bank.com", notes: "my bank", folder: "Finance", totp: "JBSWY3DPEHPK3PXP", custom_fields: '[{"name":"PIN","value":"1234"}]' }]

    });
    const v = importKeeperJson(json);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].url).toBe("https://bank.com");
    expect(v.entries[0].username).toBe("bankuser");
    expect(v.entries[0].password).toBe("bankpass");
    expect(v.entries[0].title).toBe("Bank");
    expect(v.entries[0].notes).toBe("my bank");
    expect(v.entries[0].folder).toBe("Finance");
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
    expect(v.entries[0].customFields).toHaveLength(1);
    expect(v.entries[0].customFields![0].name).toBe("PIN");
    expect(v.entries[0].customFields![0].value).toBe("1234");
  });
});

describe("isEnpassCsv", () => {
  it("detects Enpass CSV with Title and Category columns", () => {
    expect(isEnpassCsv("Title,URL,Username,Password,Notes,Category,TOTP")).toBe(true);
  });
  it("rejects generic CSV", () => {
    expect(isEnpassCsv("url,username,password")).toBe(false);
  });
});

describe("isEnpassJson", () => {
  it("detects Enpass JSON with items key", () => {
    expect(isEnpassJson('{"items":[]}')).toBe(true);
  });
  it("rejects Keeper JSON (has records AND items)", () => {

    expect(isEnpassJson('{"items":[],"records":[]}')).toBe(false);
  });
});

describe("importEnpassJson", () => {
  it("imports Enpass login items with fields", () => {
    const json = JSON.stringify({
      items: [
      {
        title: "Google",
        category: "login",
        note: "work account",
        fields: [
        { label: "URL", value: "https://google.com", type: "url" },
        { label: "Username", value: "user@gmail.com", type: "text" },
        { label: "Password", value: "gpass123", type: "password" },
        { label: "TOTP", value: "JBSWY3DPEHPK3PXP", type: "totp" }]

      }]

    });
    const v = importEnpassJson(json);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].url).toBe("https://google.com");
    expect(v.entries[0].username).toBe("user@gmail.com");
    expect(v.entries[0].password).toBe("gpass123");
    expect(v.entries[0].title).toBe("Google");
    expect(v.entries[0].notes).toBe("work account");
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("maps Enpass categories to VaultKeepR folders", () => {
    const json = JSON.stringify({
      items: [
      { title: "Visa", category: "creditcard", fields: [{ label: "URL", value: "https://visa.com" }] },
      { title: "Note1", category: "secure note", note: "secret" },
      { title: "ID", category: "identity", fields: [{ label: "URL", value: "https://id.com" }] }]

    });
    const v = importEnpassJson(json);
    expect(v.entries).toHaveLength(3);
    expect(v.entries[0].folder).toBe("cartes");
    expect(v.entries[1].folder).toBe("notes");
    expect(v.entries[2].folder).toBe("identites");
  });
});