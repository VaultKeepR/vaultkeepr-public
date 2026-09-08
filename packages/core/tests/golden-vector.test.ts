import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { importEncryptedVault } from "../src/encrypted-export";

const __dirname = dirname(fileURLToPath(import.meta.url));

// GOLDEN VECTOR — vault chiffré par les primitives @noble 1.8.0/0.5.3
// (généré par scripts/generate-golden-vector.mjs AVANT le bump lockstep 2.4).
// Ce test verrouille la compatibilité du format des vaults chiffrés à travers
// les montées de version de @noble/*. Toute divergence de sortie des primitives
// (sha256, hmac, hkdf, argon2id, xchacha20poly1305) fait échouer ce test.
describe("golden vector — vault format compat across @noble versions", () => {
  const fixturePath = resolve(__dirname, "fixtures/golden-noble18-vault.json");
  const fixture = readFileSync(fixturePath, "utf8");

  it("decrypts a vault encrypted with @noble 1.8.0 / ciphers 0.5.3", async () => {
    const { vault } = await importEncryptedVault(fixture, "golden-vector-v1");

    expect(vault.version).toBe(1);
    expect(vault.entries).toHaveLength(2);
    expect(vault.entries[0].id).toBe("gv-1");
    expect(vault.entries[0].url).toBe("https://golden.vaultkeepr.xyz");
    expect(vault.entries[0].username).toBe("golden");
    expect(vault.entries[0].password).toBe("noble-1-8-to-2-4");
    expect(vault.entries[1].id).toBe("gv-2");
    expect(vault.entries[1].folder).toBe("cartes");
  });

  it("rejects a wrong password on the golden vector (commitment holds)", async () => {
    await expect(
      importEncryptedVault(fixture, "wrong-password")
    ).rejects.toThrow();
  });
});
