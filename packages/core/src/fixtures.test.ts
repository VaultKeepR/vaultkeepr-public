import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { importVaultText } from "./import";

const fixturesDir = join(__dirname, "__fixtures__");

function loadFixture(name: string): string | Uint8Array {
  const path = join(fixturesDir, name);
  if (name.endsWith(".1pux")) {
    return new Uint8Array(readFileSync(path));
  }
  return readFileSync(path, "utf-8");
}

describe("real fixtures — 8 majors (T6.4)", () => {
  const cases: {
    name: string;
    file: string;
    minEntries: number;
    expect: {match: string;folder: string;}[];
  }[] = [
  {
    name: "Bitwarden JSON",
    file: "bitwarden.json",
    minEntries: 4,
    expect: [
    { match: "github.com", folder: "identifiants" },
    { match: "Wifi café", folder: "notes" },
    { match: "Visa", folder: "cartes" },
    { match: "Alice Doe", folder: "identites" }]

  },
  {
    name: "Bitwarden CSV",
    file: "bitwarden.csv",
    minEntries: 2,
    expect: [
    { match: "github.com", folder: "identifiants" },
    { match: "Alice Visa", folder: "cartes" }]

  },
  {
    name: "ProtonPass JSON",
    file: "protonpass.json",
    minEntries: 4,
    expect: [
    { match: "github.com", folder: "identifiants" },
    { match: "Wifi café", folder: "notes" },
    { match: "Alice Visa", folder: "cartes" },
    { match: "Alice Doe", folder: "identites" }]

  },
  {
    name: "Chrome CSV",
    file: "chrome.csv",
    minEntries: 1,
    expect: [
    { match: "github.com", folder: "identifiants" }]

  },
  {
    name: "Firefox CSV",
    file: "firefox.csv",
    minEntries: 1,
    expect: [
    { match: "github.com", folder: "identifiants" }]

  },
  {
    name: "LastPass CSV",
    file: "lastpass.csv",
    minEntries: 1,
    expect: [
    { match: "github.com", folder: "Work" }]

  },
  {
    name: "KeePass XML",
    file: "keepass.xml",
    minEntries: 2,
    expect: [
    { match: "github.com", folder: "identifiants" },
    { match: "Wifi café", folder: "notes" }]

  },
  {
    name: "1Password PIF",
    file: "1password.1pif",
    minEntries: 4,
    expect: [
    { match: "github.com", folder: "identifiants" },
    { match: "Wifi café", folder: "notes" },
    { match: "Alice Visa", folder: "cartes" },
    { match: "Alice Doe", folder: "identites" }]

  },
  {
    name: "1Password 1PUX",
    file: "1password.1pux",
    minEntries: 2,
    expect: [
    { match: "github.com", folder: "identifiants" },
    { match: "Wifi café", folder: "notes" }]

  }];


  for (const c of cases) {
    it(`${c.name}: imports all entries to correct folders`, async () => {
      const input = loadFixture(c.file);
      const result = await importVaultText(input);
      expect(result.vault.entries.length).toBeGreaterThanOrEqual(c.minEntries);

      for (const e of c.expect) {
        const found = result.vault.entries.find(
          (en) =>
          (en.title ?? "").includes(e.match) ||
          (en.url ?? "").includes(e.match) ||
          (en.username ?? "").includes(e.match)
        );
        expect(found, `entry matching "${e.match}" not found in ${c.name}`).toBeTruthy();
        expect(found!.folder).toBe(e.folder);
      }
    });
  }

  it("structured formats (JSON/XML/PIF/1PUX) produce zero skipped on valid data", async () => {
    const csvFormats = new Set(["Bitwarden CSV", "Chrome CSV", "LastPass CSV"]);
    for (const c of cases) {
      if (csvFormats.has(c.name)) continue;
      const input = loadFixture(c.file);
      const result = await importVaultText(input);
      expect(result.skipped, `${c.name} had skipped items`).toHaveLength(0);
    }
  });
});