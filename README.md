<p align="center">
  <img src="https://vaultkeepr.xyz/logos/vaultkeepr-shield-og.png" alt="VaultKeepR" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">VaultKeepR Core</h1>

<p align="center">
  <strong>Open-source cryptographic SDK & smart contracts powering the VaultKeepR ecosystem</strong>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178c6.svg?logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="./contracts"><img src="https://img.shields.io/badge/Solidity-0.8.20-363636.svg?logo=solidity" alt="Solidity" /></a>
  <a href="https://basescan.org"><img src="https://img.shields.io/badge/chain-Base_L2-0052FF.svg?logo=ethereum&logoColor=white" alt="Base" /></a>
</p>

<p align="center">
  <a href="https://vaultkeepr.xyz">🌐 Website</a> •
  <a href="./SECURITY.md">🔒 Security</a> •
  <a href="#-français">🇫🇷 Français</a>
</p>

---

## English

### Overview

This repository contains the **open-source** components of VaultKeepR — a decentralized,
zero-knowledge password manager. The cryptographic core, synchronization engine, recovery
modules, and on-chain smart contracts are published here for transparency and independent
security auditing.

> The web app, browser extension, iOS/Android apps, and enterprise/API server remain in a
> private repository. Only the SDK packages and contracts are open-sourced.

### Packages

| Package | Description |
|---------|-------------|
| [`core`](./packages/core) | Cryptographic SDK — XChaCha20-Poly1305, Argon2id, ECIES, TOTP, passkeys, QR pairing, BIP-39, NFC/PACE, on-device SLM engine |
| [`sync`](./packages/sync) | CRDT-based cross-device synchronization (Automerge) |
| [`ipfs`](./packages/ipfs) | Decentralized storage gateway for encrypted vaults |
| [`recovery`](./packages/recovery) | Shamir Secret Sharing (3-of-5) fragmented vault recovery |
| [`smart-account`](./packages/smart-account) | ERC-4337 Account Abstraction — identity derivation, on-chain sync |
| [`wallet`](./packages/wallet) | Multi-chain wallet integration (EIP-1193, EIP-6963) and ENS resolution |
| [`wallet-messages`](./packages/wallet-messages) | Typed signing message schemas for wallet-based authentication |
| [`cloud`](./packages/cloud) | Zero-knowledge encrypted cloud storage (S3-compatible) |
| [`alias`](./packages/alias) | Email alias forwarding (Postfix/Dovecot integration) |
| [`premium`](./packages/premium) | License key validation, tier resolution and tier limits |
| [`logger`](./packages/logger) | Privacy-first structured logging (redacts keys/CIDs/addresses) |
| [`i18n`](./packages/i18n) | Internationalization (English + Français) |
| [`ui`](./packages/ui) | Shared React component library (Tailwind + shadcn) |
| [`sentry`](./packages/sentry) | Error tracking (browser + React Native adapters) |
| [`legacy`](./packages/legacy) | Legacy inheritance types and beneficiary management |
| [`ocr-native`](./packages/ocr-native) | Native OCR module (VisionKit iOS / ML Kit Android) |

### Smart Contracts

| Contract | Description |
|----------|-------------|
| [`VaultKeeperCidRegistry`](./contracts/src/VaultKeeperCidRegistry.sol) | On-chain CID pointer registry (IPFS vault location) |
| [`VaultKeeperFragments`](./contracts/src/VaultKeeperFragments.sol) | Shamir fragment storage for fragmented recovery |
| [`VaultKeeperLegacy`](./contracts/src/VaultKeeperLegacy.sol) | Digital legacy / inheritance contract (time-locked beneficiary transfer) |

Deployed on **Base L2**. Audited with Foundry (`contracts/test/`).

### Security Model

- **Zero-knowledge**: the master password never leaves the user's device.
- **Encryption**: XChaCha20-Poly1305 AEAD + Argon2id key derivation (t=3, m=64 MiB, p=4).
- **On-device AI**: the SLM engine (auto-tagging, breach summary) runs entirely locally —
  no vault data is sent to any server.
- **Libraries**: `@noble/*` (ciphers, curves, hashes), `ethers` v6, `viem` v2.
- **No logged keys/secrets** — the logger redacts CIDs and addresses automatically.

See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting.

### Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run a single package's tests
cd packages/core && npx vitest run
```

### Contracts (Foundry)

```bash
cd contracts
forge test
```

### License

MIT — see [`LICENSE`](./LICENSE).

---

## Français

### Aperçu

Ce dépôt contient les composants **open-source** de VaultKeepR — un gestionnaire de mots de
passe décentralisé à connaissance nulle (zero-knowledge). Le cœur cryptographique, le moteur
de synchronisation, les modules de récupération et les smart contracts sont publiés ici pour
transparence et audit de sécurité indépendant.

> L'application web, l'extension navigateur, les apps iOS/Android et le serveur
> enterprise/API restent dans un dépôt privé. Seuls les packages SDK et les contrats sont
> open-source.

### Packages

| Package | Description |
|---------|-------------|
| [`core`](./packages/core) | SDK cryptographique — XChaCha20-Poly1305, Argon2id, ECIES, TOTP, passkeys, appairage QR, BIP-39, NFC/PACE, moteur SLM on-device |
| [`sync`](./packages/sync) | Synchronisation multi-appareils par CRDT (Automerge) |
| [`ipfs`](./packages/ipfs) | Passerelle de stockage décentralisé pour coffres chiffrés |
| [`recovery`](./packages/recovery) | Récupération fragmentée par Secret Sharing Shamir (3-sur-5) |
| [`smart-account`](./packages/smart-account) | Account Abstraction ERC-4337 — dérivation d'identité, synchronisation on-chain |
| [`wallet`](./packages/wallet) | Intégration multi-chain (EIP-1193, EIP-6963) et résolution ENS |
| [`wallet-messages`](./packages/wallet-messages) | Schémas de signature typée pour l'authentification par wallet |
| [`cloud`](./packages/cloud) | Stockage cloud chiffré zero-knowledge (compatible S3) |
| [`alias`](./packages/alias) | Redirection d'alias email (intégration Postfix/Dovecot) |
| [`premium`](./packages/premium) | Validation de clé de licence, résolution et limites par palier |
| [`logger`](./packages/logger) | Journalisation structurée respectant la vie privée (masque clés/CID/adresses) |
| [`i18n`](./packages/i18n) | Internationalisation (Anglais + Français) |
| [`ui`](./packages/ui) | Bibliothèque de composants React partagés (Tailwind + shadcn) |
| [`sentry`](./packages/sentry) | Suivi d'erreurs (adaptateurs browser + React Native) |
| [`legacy`](./packages/legacy) | Types d'héritage et gestion des bénéficiaires |
| [`ocr-native`](./packages/ocr-native) | Module OCR natif (VisionKit iOS / ML Kit Android) |

### Smart Contracts

| Contrat | Description |
|---------|-------------|
| [`VaultKeeperCidRegistry`](./contracts/src/VaultKeeperCidRegistry.sol) | Registre on-chain des pointeurs CID (localisation IPFS du coffre) |
| [`VaultKeeperFragments`](./contracts/src/VaultKeeperFragments.sol) | Stockage des fragments Shamir pour la récupération fragmentée |
| [`VaultKeeperLegacy`](./contracts/src/VaultKeeperLegacy.sol) | Contrat d'héritage numérique (transfert au bénéficiaire verrouillé dans le temps) |

Déployés sur **Base L2**. Audités avec Foundry (`contracts/test/`).

### Modèle de sécurité

- **Connaissance nulle** : le mot de passe maître ne quitte jamais l'appareil de l'utilisateur.
- **Chiffrement** : XChaCha20-Poly1305 AEAD + dérivation Argon2id (t=3, m=64 MiB, p=4).
- **IA on-device** : le moteur SLM (auto-tagging, résumé de brèche) s'exécute entièrement en
  local — aucune donnée du coffre n'est envoyée à un serveur.
- **Bibliothèques** : `@noble/*` (chiffrements, courbes, hachages), `ethers` v6, `viem` v2.
- **Aucune clé/secret journalisé** — le logger masque automatiquement les CID et adresses.

Voir [`SECURITY.md`](./SECURITY.md) pour le signalement de vulnérabilités.

### Démarrage rapide

```bash
# Installer les dépendances
pnpm install

# Compiler tous les packages
pnpm build

# Lancer les tests
pnpm test

# Tests d'un seul package
cd packages/core && npx vitest run
```

### Contrats (Foundry)

```bash
cd contracts
forge test
```

### Licence

MIT — voir [`LICENSE`](./LICENSE).
