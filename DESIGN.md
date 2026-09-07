# Architecture and Security Design

This document describes all actions and actors within the VaultKeepR public
core, and maps them to the trust boundaries of the system. It complements
[`docs/THREAT_MODEL.md`](./docs/THREAT_MODEL.md), which analyses what can go
wrong, and [`SECURITY.md`](./SECURITY.md), which defines how vulnerabilities
are reported and handled.

## Actors

| Actor | Capabilities | Trust level |
|---|---|---|
| End user | Holds master password + wallet key; creates, encrypts, syncs, recovers vaults | Trusted (sole holder of secrets) |
| VaultKeepR clients (web/extension/mobile — private repos) | Execute the SDK locally; never receive plaintext outside the user's device | Trusted, out of scope here |
| IPFS network | Stores encrypted blobs (content-addressed, pinned); cannot read content | Untrusted storage |
| Base L2 chain | Stores registry pointers, recovery fragments, legacy records | Untrusted public ledger |
| Relayer / smart accounts | Submit user operations; sign via the user's on-chain smart account | Semi-trusted infrastructure |
| Maintainer | Merges code, publishes releases, responds to security reports | Trusted for code integrity, never for user secrets |

## Actions and data flows

1. **Vault creation** — user supplies master password on-device; Argon2id
   (t=3, m=64 MiB, p=4) derives the key; XChaCha20-Poly1305 AEAD encrypts the
   vault locally. Plaintext never crosses a network boundary.
2. **Sync** — encrypted blobs are addressed by content (CID) and pinned to
   IPFS. The SDK signs an on-chain pointer update through the user's smart
   account; the chain stores location pointers only, never keys.
3. **Recovery** — vault locations are recovered via on-chain fragments
   (`VaultKeeperFragments`); the master key is re-derived on-device from the
   user's password + wallet signature.
4. **Digital legacy** — `VaultKeeperLegacy` enforces time-locked inheritance
   to named beneficiaries; beneficiaries receive location pointers, never
   derived keys.
5. **Telemetry** — `packages/sentry` reports crash data with keys, CIDs, and
   addresses redacted at the logger level (`packages/logger`).

## External software interfaces

| Interface | Type | Description |
|---|---|---|
| `@vault-keeper/*` SDK packages | TypeScript API (source-consumed today) | Cryptographic core, sync, IPFS pinning, recovery, premium, wallet-messages, smart-account, cloud, alias, logger, i18n, ui, sentry, legacy, ocr-native |
| Solidity contracts on Base L2 | On-chain interface | `VaultKeeperCidRegistry` (vault location pointers), `VaultKeeperFragments` (recovery fragments), `VaultKeeperLegacy` (time-locked inheritance) |
| IPFS | Content-addressed storage | Encrypted blob storage and retrieval |
| Ethereum wallet provider | JSON-RPC (via `viem`) | Smart-account signatures for on-chain writes |

## Dependency selection, acquisition, and tracking

- **Selection**: cryptographic primitives come from `@noble/*` (ciphers,
  curves, hashes) — audited, minimal, dependency-free libraries. Chain
  interaction uses `viem`.
- **Acquisition**: npm registry via pnpm with `--frozen-lockfile` in CI;
  contract dependencies pinned as git submodules.
- **Tracking**: `pnpm-lock.yaml` at the root; Dependabot monitors npm and
  GitHub Actions weekly, with automated security fixes enabled; CodeQL scans
  the JS/TS code on every change.
