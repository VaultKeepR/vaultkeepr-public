# Architecture & Package Map

## Overview

pnpm + Turborepo monorepo (`vaultkeepr-core`). 15 MIT SDK packages under `packages/*` (npm scope `@vaultkeepr`) plus a Foundry project under `contracts/` (Base L2). Clients (web app, browser extension, iOS/Android) live in private repos — never reference or modify them here.

## Package Inventory

| Package | Role | Depends on |
|---|---|---|
| `@vaultkeepr/core` (0.1.2) | Hub: vault crypto (XChaCha20-Poly1305, Argon2id), ECIES envelopes, TOTP, passkeys, BIP-39, password health, 3-way merge, importers for 10+ manager formats | logger, `@noble/*`, ethers, viem, fflate |
| `@vaultkeepr/sync` | Automerge CRDT vault sync (`crdtVault`, `tombstones`, `schema`, `compat`) | core |
| `@vaultkeepr/ipfs` | CID handling, multi-gateway fetch with failover | — |
| `@vaultkeepr/cloud` | Zero-knowledge S3-compatible encrypted storage (`cloud-crypto`, `cloud-manager`, `cloud-sharing`, `cloud-validation`) | core, ipfs |
| `@vaultkeepr/recovery` | Shamir secret-sharing fragments + on-chain reads (`fragmented-vault`, `contract-fragment`) | core |
| `@vaultkeepr/legacy` | Digital inheritance: heartbeat, beneficiary, contract bindings | core, ipfs, logger, premium |
| `@vaultkeepr/smart-account` | ERC-4337 Kernel account + Pimlico paymaster (`identity`, `kernel`, `owner`, `onChainSync`, `cidRegistry`) | core, logger |
| `@vaultkeepr/alias` | Email alias forwarding (Postfix/Dovecot); server-side binaries + `pg` migrations | — (standalone) |
| `@vaultkeepr/logger` | Structured logging with automatic CID/key/address redaction | — |
| `@vaultkeepr/premium` | License key validation, tier limits | — |
| `@vaultkeepr/sentry` | Sentry adapters (browser, react-native) with privacy scrubber | — |
| `@vaultkeepr/i18n` | Translations (EN, FR) | — |
| `@vaultkeepr/ui` | Shared React components (Tailwind + shadcn), exports `./theme.css` | — |
| `@vaultkeepr/wallet-messages` | EIP-4361 + delegation message schemas | — |
| `@vaultkeepr/ocr-native` | Native OCR (VisionKit iOS, ML Kit Android) | logger |

## Contracts ↔ SDK Correspondence

| Contract (`contracts/src/`) | Role | SDK counterpart |
|---|---|---|
| `VaultKeeperCidRegistry.sol` | On-chain vault location pointers | `smart-account/cidRegistry.ts` |
| `VaultKeeperFragments.sol` | On-chain recovery fragments | `recovery/contract-fragment.ts` |
| `VaultKeeperLegacy.sol` | Time-locked inheritance to beneficiaries | `legacy/contract.ts` |

Each contract has a matching Foundry test in `contracts/test/*.t.sol`.

## Build Task Graph

Turbo (`turbo.json`): `build` dependsOn `^build`; `lint`, `test` dependOn `^build`. Build dependencies before consumers. Build output is `dist/` via tsup.

## Known Conventions Deviations

- `smart-account` ships raw TS source (`main: ./src/index.ts`) — not dist-built.
- `alias` is server-side with binaries (`vaultkeeper-forward`) and DB migrations.
- `ocr-native` has no build/test scripts (native module wrapper).