<div align="center">
  <img src="https://vaultkeepr.xyz/logos/vaultkeepr-shield-og.png" alt="VaultKeepR" width="96" />

  # VaultKeepR Core

  The open-source SDK and smart contracts behind VaultKeepR, a zero-knowledge password manager.

  [**vaultkeepr.xyz**](https://vaultkeepr.xyz)

  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg?logo=typescript&logoColor=white)](./packages)
  [![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636.svg?logo=solidity&logoColor=white)](./contracts)
  [![Base](https://img.shields.io/badge/deployed%20on-Base%20L2-0052FF.svg?logo=ethereum&logoColor=white)](https://basescan.org)
</div>

## What this repository is

VaultKeepR is a password manager. This repository contains its reusable building blocks: the cryptographic SDK packages shared by every VaultKeepR client, and the Solidity contracts that anchor vault locations, recovery fragments, and digital legacy on Base.

The web app, the browser extension, and the iOS/Android apps live in a private repository. Everything here is MIT and safe to reuse in your own projects.

## Packages

| Package | Description |
|---|---|
| [`core`](./packages/core) | Vault crypto: XChaCha20-Poly1305, Argon2id, ECIES envelopes, TOTP, passkeys, BIP-39, import/export for 10+ manager formats |
| [`sync`](./packages/sync) | Cross-device synchronization built on Automerge CRDTs |
| [`ipfs`](./packages/ipfs) | Content-addressed vault storage: CID handling and multi-gateway fetching with failover |
| [`recovery`](./packages/recovery) | Fragmented recovery with on-chain contract reads (Base) |
| [`smart-account`](./packages/smart-account) | ERC-4337 account abstraction: identity derivation and on-chain sync |
| [`wallet-messages`](./packages/wallet-messages) | EIP-4361 and delegation message schemas for signed sessions |
| [`cloud`](./packages/cloud) | Zero-knowledge encrypted cloud storage (S3-compatible) |
| [`alias`](./packages/alias) | Email alias forwarding (Postfix/Dovecot integration) |
| [`premium`](./packages/premium) | License key validation and tier limits |
| [`logger`](./packages/logger) | Structured logging that redacts keys, CIDs, and addresses |
| [`i18n`](./packages/i18n) | Internationalization (English, French) |
| [`ui`](./packages/ui) | Shared React components (Tailwind + shadcn) |
| [`sentry`](./packages/sentry) | Error tracking adapters (browser, React Native) |
| [`legacy`](./packages/legacy) | Digital inheritance types and beneficiary management |
| [`ocr-native`](./packages/ocr-native) | Native OCR module (VisionKit on iOS, ML Kit on Android) |

## Smart contracts

| Contract | Description |
|---|---|
| [`VaultKeeperCidRegistry`](./contracts/src/VaultKeeperCidRegistry.sol) | On-chain registry of vault location pointers |
| [`VaultKeeperFragments`](./contracts/src/VaultKeeperFragments.sol) | On-chain storage for recovery fragments |
| [`VaultKeeperLegacy`](./contracts/src/VaultKeeperLegacy.sol) | Time-locked inheritance to named beneficiaries |

All three are deployed on Base L2 and covered by Foundry tests (`forge test`).

## Security model

- **Zero-knowledge**: the master password never leaves the user's device.
- **Encryption**: XChaCha20-Poly1305 AEAD with Argon2id key derivation (t=3, m=64 MiB, p=4).
- **On-device AI**: the SLM engine (auto-tagging, breach summary) runs locally. No vault data reaches a server.
- **Dependencies**: `@noble/*` for ciphers, curves, and hashes. `viem` for Ethereum types and clients.
- **Logging**: keys, CIDs, and addresses are redacted at the logger level.

See [`SECURITY.md`](./SECURITY.md) to report a vulnerability.

## Quick start

Requirements: Node.js 20+, pnpm 9+, Foundry (contracts only).

```bash
pnpm install
pnpm build
pnpm test
```

Contracts:

```bash
cd contracts
forge install
forge test
```

## Project layout

```
vaultkeepr-public/
├── packages/        15 MIT SDK packages (see table above)
├── contracts/       Solidity sources + Foundry tests (Base L2)
├── turbo.json       build/test task graph
└── pnpm-workspace.yaml
```

## Versioning

All packages are versioned together. This is release `v0.1.0`. Tags follow `vX.Y.Z`.

## License

MIT. See [`LICENSE`](./LICENSE).

---

## Français

### Ce dépôt

VaultKeepR est un gestionnaire de mots de passe. Ce dépôt contient ses briques réutilisables : les packages SDK cryptographiques partagés par tous les clients VaultKeepR, et les contrats Solidity qui ancrent sur Base la localisation des coffres, les fragments de récupération et l'héritage numérique.

L'application web, l'extension navigateur et les apps iOS/Android restent dans un dépôt privé. Tout ce qui est ici est sous licence MIT et réutilisable dans vos projets.

### Modèle de sécurité

- **Zéro connaissance** : le mot de passe maître ne quitte jamais l'appareil.
- **Chiffrement** : XChaCha20-Poly1305 AEAD avec dérivation Argon2id (t=3, m=64 MiB, p=4).
- **IA locale** : le moteur SLM (auto-tagging, résumé de brèche) s'exécute sur l'appareil. Aucune donnée du coffre n'est envoyée à un serveur.
- **Dépendances** : `@noble/*` pour le chiffrement, les courbes et les hachages. `viem` pour les types et clients Ethereum.
- **Journalisation** : clés, CID et adresses sont masqués au niveau du logger.

Voir [`SECURITY.md`](./SECURITY.md) pour signaler une vulnérabilité.

### Démarrage rapide

Prérequis : Node.js 20+, pnpm 9+, Foundry (contrats uniquement).

```bash
pnpm install
pnpm build
pnpm test
```

Contrats :

```bash
cd contracts
forge install
forge test
```

### Licence

MIT. Voir [`LICENSE`](./LICENSE).
