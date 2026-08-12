import { describe, it, expect } from "vitest";
import { zipSync, strToU8 } from "fflate";
import { import1Pux, isOnePassword1Pux } from "./import-1pux";
import { importVaultText } from "./import";


function makePux(payload: unknown): Uint8Array {
  const json = strToU8(JSON.stringify(payload));
  return zipSync({ "export.unencrypted.json": json });
}

describe("isOnePassword1Pux", () => {
  it("detects a ZIP archive by magic bytes", () => {
    const pux = makePux({ accounts: [] });
    expect(isOnePassword1Pux(pux)).toBe(true);
  });

  it("rejects non-zip data", () => {
    expect(isOnePassword1Pux(strToU8("hello"))).toBe(false);
    expect(isOnePassword1Pux(new Uint8Array([1, 2, 3]))).toBe(false);
  });
});

describe("import1Pux", () => {
  it("imports logins with username, password, URL, notes", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            uuid: "i1",
            favIndex: 0,
            categoryUuid: "001",
            details: {
              loginFields: [
              { id: "u", designation: "username", value: "alice" },
              { id: "p", designation: "password", value: "secret" }],

              notesPlain: "my login note"
            },
            overview: {
              title: "GitHub",
              urls: [{ url: "https://github.com" }]
            }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    expect(v.entries).toHaveLength(1);
    const e = v.entries[0];
    expect(e.folder).toBe("identifiants");
    expect(e.title).toBe("GitHub");
    expect(e.url).toBe("https://github.com");
    expect(e.username).toBe("alice");
    expect(e.password).toBe("secret");
    expect(e.notes).toBe("my login note");
  });

  it("extracts TOTP from a section field (otpauth URI)", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            details: {
              loginFields: [{ designation: "username", value: "u" }],
              sections: [
              {
                fields: [
                {
                  title: "one-time password",
                  value:
                  "otpauth://totp/Alice?secret=JBSWY3DPEHPK3PXP&issuer=Alice"
                }]

              }]

            },
            overview: { title: "TOTP", urls: [{ url: "https://t.com" }] }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("imports secure notes (no password, no urls, has notes)", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            details: { notesPlain: "remember this" },
            overview: { title: "My Note", urls: [] }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    expect(v.entries).toHaveLength(1);
    const e = v.entries[0];
    expect(e.folder).toBe("notes");
    expect(e.title).toBe("My Note");
    expect(e.notes).toBe("remember this");
    expect(e.password).toBe("");
  });

  it("imports a credit card (long digit field, no password)", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            details: {
              loginFields: [{ id: "cc", value: "4111111111111111" }]
            },
            overview: { title: "Visa Gold", urls: [] }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    expect(v.entries).toHaveLength(1);
    const e = v.entries[0];
    expect(e.folder).toBe("cartes");
    expect(e.password).toBe("4111111111111111");
    expect(e.username).toContain("Visa");
    expect(e.username).toContain("1111");
    expect(e.notesMasked).toBe(true);
  });

  it("preserves custom fields from loginFields and sections", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            details: {
              loginFields: [
              { id: "u", designation: "username", value: "u" },
              { id: "p", designation: "password", value: "pw" },
              { id: "cust", name: "Numéro client", value: "C-42", fieldType: "T" }],

              sections: [
              {
                fields: [{ title: "Ref", value: "N-7", kind: "string" }]
              }]

            },
            overview: { title: "X", urls: [{ url: "https://x.com" }] }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    const cf = v.entries[0].customFields!;
    expect(cf.find((f) => f.name === "Numéro client")).toEqual({
      name: "Numéro client",
      value: "C-42",
      type: "text"
    });
    expect(cf.find((f) => f.name === "Ref")).toEqual({
      name: "Ref",
      value: "N-7",
      type: "text"
    });
  });

  it("keeps extra URLs as url custom fields", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            details: {
              loginFields: [
              { designation: "username", value: "u" },
              { designation: "password", value: "p" }]

            },
            overview: {
              title: "Multi",
              urls: [
              { url: "https://a.com" },
              { url: "https://b.com" },
              "https://c.com"]

            }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    const e = v.entries[0];
    expect(e.url).toBe("https://a.com");
    const urlFields = e.customFields!.filter((f) => f.type === "url");
    expect(urlFields).toHaveLength(2);
    expect(urlFields.map((f) => f.value)).toEqual([
    "https://b.com",
    "https://c.com"]
    );
  });

  it("preserves the favorite flag", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            favIndex: 1,
            details: {
              loginFields: [
              { designation: "username", value: "u" },
              { designation: "password", value: "p" }]

            },
            overview: { title: "Fav", urls: [{ url: "https://f.com" }] }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    expect(v.entries[0].favorite).toBe(true);
  });

  it("skips trashed items", () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            trashed: true,
            details: { notesPlain: "deleted" },
            overview: { title: "X" }
          },
          {
            details: {
              loginFields: [{ designation: "password", value: "p" }]
            },
            overview: { title: "Y", urls: [{ url: "https://y.com" }] }
          }]

        }]

      }]

    });
    const v = import1Pux(pux);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].title).toBe("Y");
  });

  it("rejects a non-zip input", () => {
    expect(() => import1Pux(strToU8("not a zip"))).toThrow(/1PUX/);
  });

  it("rejects a zip without export.unencrypted.json", () => {
    const bad = zipSync({ "other.json": strToU8("{}") });
    expect(() => import1Pux(bad)).toThrow(/export\.unencrypted\.json/);
  });
});

describe("importVaultText routes binary 1PUX", () => {
  it("imports a .1pux via the unified importer", async () => {
    const pux = makePux({
      accounts: [
      {
        vaults: [
        {
          items: [
          {
            details: {
              loginFields: [
              { designation: "username", value: "u" },
              { designation: "password", value: "p" }]

            },
            overview: { title: "V", urls: [{ url: "https://v.com" }] }
          }]

        }]

      }]

    });
    const { vault } = await importVaultText(pux);
    expect(vault.entries).toHaveLength(1);
    expect(vault.entries[0].url).toBe("https://v.com");
    expect(vault.entries[0].folder).toBe("identifiants");
  });
});