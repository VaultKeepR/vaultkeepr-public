












import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readSrc(relPath: string): string {



  const repoRoot = join(__dirname, "..", "..", "..", "..");
  return readFileSync(join(repoRoot, relPath), "utf8");
}

describe("P2-2 — purgeTombstones integration", () => {
  function extractFunction(src: string, name: string): string {
    const start = src.indexOf(`function ${name}`);
    if (start < 0) return "";

    let depth = 0;
    let i = src.indexOf("{", start);
    if (i < 0) return "";
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;else
      if (src[i] === "}") {
        depth--;
        if (depth === 0) return src.slice(start, i + 1);
      }
    }
    return "";
  }

  it("iOS parseDecryptedVault calls purgeTombstones after importBinary", () => {
    const src = readSrc("apps/ios/src/sync/ipfsSync.ts");
    const fn = extractFunction(src, "parseDecryptedVault");
    expect(fn).toContain("importBinary");
    expect(fn).toContain("purgeTombstones");
    expect(fn.indexOf("importBinary")).toBeLessThan(fn.indexOf("purgeTombstones"));
  });

  it("iOS parseDecryptedVault handles JSON directly via parseVault (F1)", () => {
    const src = readSrc("apps/ios/src/sync/ipfsSync.ts");
    const fn = extractFunction(src, "parseDecryptedVault");




    expect(fn).toContain("parseVault");
    expect(fn).toContain("format === \"crdt\"");
  });

  it("Android parseDecryptedVault calls purgeTombstones (mirror iOS)", () => {
    const src = readSrc("apps/android/src/sync/ipfsSync.ts");
    const fn = extractFunction(src, "parseDecryptedVault");
    expect(fn).toContain("purgeTombstones");
  });

  it("extension parseCrdtResult calls purgeTombstones after importBinary", () => {
    const src = readSrc("apps/extension/background-src/vault-sync.js");
    const fn = extractFunction(src, "parseCrdtResult");
    expect(fn).toContain("importBinary");
    expect(fn).toContain("purgeTombstones");
    expect(fn.indexOf("importBinary")).toBeLessThan(fn.indexOf("purgeTombstones"));
  });
});