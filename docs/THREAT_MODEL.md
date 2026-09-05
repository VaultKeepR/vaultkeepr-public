# Threat Model

Scope: the open-source SDK packages and Solidity contracts in this repository, as used by VaultKeepR clients. Client applications (web, extension, mobile) live in a private repository; this document covers the cryptographic primitives and on-chain components shipped here.

## Assets

| Asset | Protection | Where it lives |
|---|---|---|
| Vault plaintext (passwords, secrets, notes) | XChaCha20-Poly1305 AEAD, key derived client-side | Never leaves the device unencrypted |
| Master password | Argon2id (t=3, m=64 MiB, p=4), never transmitted or stored | User's memory only |
| Vault encryption key | Derived client-side; session copies held in memory only (`SessionKeyStore`) | Device memory |
| Encrypted vault snapshots | Ciphertext on IPFS / S3-compatible storage | Content-addressed (CID) |
| Recovery fragments | Shamir secret splitting (configurable threshold), encrypted fragments | IPFS + on-chain pointers |
| Vault location pointers (CIDs) | Public by design — they reference ciphertext, not plaintext | `VaultKeeperCidRegistry` on Base L2 |
| Digital legacy instructions | Time-locked on-chain storage, encrypted beneficiary payloads | `VaultKeeperLegacy` on Base L2 |
| Session / delegation signatures | EIP-4361 schemas, ECIES (secp256k1) envelopes | `wallet-messages`, `smart-account` |

## Adversaries

1. **Passive network observer** — sees ciphertext blobs, CIDs, and traffic metadata. Learns *that* a vault exists, when it changes, and how big it is. Learns nothing about contents.
2. **Storage operator (IPFS gateway, S3 host)** — holds ciphertext, cannot decrypt. Can withhold, corrupt, or censor data: an *availability* threat, not confidentiality. Content addressing makes tampering detectable.
3. **On-chain analyst** — reads the public registries on Base: registry writes, fragment pointers, legacy schedules, timestamps, sender addresses. Activity is linkable (see accepted limitations).
4. **Malicious client / dependency** — a compromised SDK build or supply-chain injection could exfiltrate keys. Mitigations: pinned `@noble/*` primitives, phishing config inlined at build time (zero runtime fetch), redacting logger, CI on every push.
5. **Server operator of the commercial service** — zero-knowledge by architecture: any cloud relay only ever handles ciphertext. Compromise of the commercial backend does not decrypt vaults.
6. **Physical or malware attacker with device access** — out of cryptographic scope; see accepted limitations.

## Trust boundaries

- **Device ↔ network**: everything crossing this line is ciphertext (AES-grade AEAD) or public pointers.
- **Build system ↔ runtime**: security-critical data (phishing blocklist) is inlined at build time; the extension performs no runtime fetches, so no IP-leaking requests and no remote blocklist tampering.
- **Client ↔ Base L2**: contracts hold public pointers and encrypted payloads only; contract bugs are in scope (Foundry tests, deployed on Base).

## Accepted limitations

- **Metadata is not protected.** Timing, size, frequency, CID access patterns on gateways, and on-chain activity are observable. An adversary can correlate vault updates with real-world events.
- **Compromised endpoint = compromised vault.** Keyloggers, memory scrapers, and screen capture defeat any password manager's client-side crypto. The threat model ends at the OS boundary.
- **Master password strength is the user's risk.** Argon2id raises offline attack costs but cannot rescue a weak password; the bundled entropy estimator informs, it does not enforce.
- **Availability depends on storage economics.** IPFS gateways and pinning services can fail or disappear; recovery fragments mitigate but require the user to hold the threshold.
- **On-chain records are permanent and public.** Registry entries and legacy schedules cannot be hidden or removed once written; treat chain addresses as pseudonymous, not anonymous.
- **Legacy windows are on-chain visible.** Beneficiary timing leaks exist even though beneficiary payloads stay encrypted.

## Reporting

See [`SECURITY.md`](../SECURITY.md). Private disclosure only.
