# @vaultkeepr/core

Vault cryptography for VaultKeepR: XChaCha20-Poly1305 AEAD encryption, Argon2id key derivation, ECIES wallet envelopes, TOTP, passkeys, BIP-39, password tooling, and import/export for 10+ password manager formats.

Zero-knowledge by design: the master password never leaves the user's device, and plaintext never crosses a network boundary.

## Install

```bash
npm install @vaultkeepr/core
```

## Usage

```ts
import {
  addEntry,
  createEmptyVault,
  decryptVault,
  deriveKeyFromPasswordArgon2,
  encryptVault,
  generatePassword,
  generateSaltArgon2,
  serializeVault,
} from "@vaultkeepr/core";

// Build a vault
const vault = addEntry(createEmptyVault(), {
  title: "GitHub",
  url: "https://github.com",
  username: "octocat",
  password: generatePassword(),
});

// Encrypt locally — Argon2id (t=3, m=64 MiB, p=4) + XChaCha20-Poly1305
const salt = generateSaltArgon2();
const key = deriveKeyFromPasswordArgon2("correct horse battery staple", salt);
const encrypted = encryptVault(serializeVault(vault), key);

// Decrypt (the key is wiped after each use — re-derive it)
const plaintext = decryptVault(encrypted, deriveKeyFromPasswordArgon2("correct horse battery staple", salt));
```

Other surfaces: TOTP (`getTOTPCode`, `parseTOTPUri`), importers (`importFromPgp`, `importVaultText`, LastPass, Keeper, Dashlane, Enpass, KeePass XML, RoboForm, Bitwarden/1Password exports), passkey/NFC/MRZ crypto, password health and entropy, BIP-39/EFF wordlists, three-way merge, pairing.

## Security notes

- Crypto primitives come from `@noble/ciphers`, `@noble/curves`, `@noble/hashes`.
- `encryptVault`/`decryptVault` wipe the master key after use by default (`wipeKeyAfterUse`).
- Vault integrity is enforced via an HMAC-SHA256 commitment — tampering throws.

## Related packages

- [`@vaultkeepr/sync`](https://www.npmjs.com/package/@vaultkeepr/sync) — CRDT synchronization
- [`@vaultkeepr/ipfs`](https://www.npmjs.com/package/@vaultkeepr/ipfs) — CID storage and gateway fetch
- [`@vaultkeepr/recovery`](https://www.npmjs.com/package/@vaultkeepr/recovery) — fragmented recovery

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz) · Threat model: [`docs/THREAT_MODEL.md`](https://github.com/VaultKeepR/vaultkeepr-public/blob/main/docs/THREAT_MODEL.md)

MIT licensed.