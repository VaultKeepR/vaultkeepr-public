// Coverage-round additions for import.ts paths not exercised by the existing
// suite: delimited-line parsing (quoted fields, CRLF, ; and tab delimiters)
// and the Bitwarden username-field fallback scan.
import { describe, it, expect } from "vitest";
import { importCsv, importBitwardenJson } from "./import";

describe("importCsv delimited parsing", () => {
  it("handles quoted values containing the delimiter and CRLF endings", () => {
    const csv =
      'name,url,username,password,notes\r\n"Entry, one","https://a.tld","u1","p1","note ""quoted"" here"\r\n';
    const v = importCsv(csv);
    expect(v.entries.length).toBe(1);
    expect(v.entries[0].username).toBe("u1");
  });

  it("handles semicolon-delimited CSV", () => {
    const csv = 'name;url;username;password\n"Site";"https://b.tld";"u2";"p2"\n';
    const v = importCsv(csv);
    expect(v.entries.length).toBe(1);
    expect(v.entries[0].username).toBe("u2");
  });

  it("handles tab-delimited rows", () => {
    const csv = "name\turl\tusername\tpassword\nSite\thttps://c.tld\tu3\tp3\n";
    const v = importCsv(csv);
    expect(v.entries.length).toBe(1);
    expect(v.entries[0].username).toBe("u3");
  });
});

describe("importBitwardenJson username fallbacks", () => {
  it("falls back to a fields[] entry named like an identity", () => {
    const bw = {
      items: [
        {
          type: 1,
          name: "Site",
          login: { username: "", password: "pw1" },
          fields: [{ name: "email", value: "  user@x.tld  " }],
          uris: [{ uri: "https://site.tld", match: 0 }]
        }
      ]
    };
    const v = importBitwardenJson(JSON.stringify(bw));
    expect(v.entries.length).toBe(1);
    expect(v.entries[0].username).toBe("user@x.tld");
  });

  it("falls back to an email-like item name", () => {
    const bw = {
      items: [
        {
          type: 1,
          name: "  account@y.tld ",
          login: { username: "", password: "pw2" },
          uris: [{ uri: "https://y.tld", match: 0 }]
        }
      ]
    };
    const v = importBitwardenJson(JSON.stringify(bw));
    expect(v.entries.length).toBe(1);
    expect(v.entries[0].username).toBe("account@y.tld");
  });
});

describe("importCsv note markers (TOTP / Fields)", () => {
  it("extracts a TOTP secret from a note column", () => {
    const csv = 'name,url,username,password,notes\n"S","https://e.tld","u5","p5","TOTP: JBSWY3DPEHPK3PXP"\n';
    const v = importCsv(csv);
    expect(v.entries.length).toBe(1);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("extracts custom fields from a Fields: note line", () => {
    const csv = 'name,url,username,password,notes\n"S","https://f.tld","u6","p6","Fields: PIN:1234 | Groupe:Perso"\n';
    const v = importCsv(csv);
    expect(v.entries.length).toBe(1);
    const cf = v.entries[0].customFields || [];
    expect(
      cf.some(
        (f: { name: string; value: string }) => f.name === "PIN" && f.value === "1234"
      )
    ).toBe(true);
  });
});
