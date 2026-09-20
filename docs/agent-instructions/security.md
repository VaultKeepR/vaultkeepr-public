# Security Guidelines

## Overview

This is a security-focused SDK for a password manager. The rules here override general convenience. Threat model: `docs/THREAT_MODEL.md`; design rationale: `DESIGN.md`.

## Crypto Invariants

- Encryption is XChaCha20-Poly1305 AEAD; key derivation is Argon2id with t=3, m=64 MiB, p=4. Never change these parameters or swap primitives.
- Cryptographic primitives come from `@noble/ciphers`, `@noble/curves`, `@noble/hashes` — audited, minimal, dependency-free. Do not introduce `crypto-js`, custom ciphers, hand-rolled KDFs, or unvetted crypto deps.
- Chain interaction uses `viem`. Do not add ethers-specific crypto paths in new code (ethers exists in `core` only for compatibility).
- Zero-knowledge model: the master password never leaves the user's device. Plaintext never crosses a network boundary. Any feature must work with encrypted blobs only.

## Secrets & Logging

- Never log plaintext, keys, CIDs, addresses, or user identifiers. Use `@vaultkeepr/logger`, which redacts automatically.
- Telemetry (`@vaultkeepr/sentry`) runs a `beforeSend` scrubber — never bypass it or send raw error payloads.
- Never commit secrets or keys to the repository.

## Data Handling

- Vault storage is content-addressed (CID) on IPFS; the chain stores location pointers only, never keys.
- Recovery re-derives the master key on-device (password + wallet signature); beneficiaries receive location pointers, never derived keys.
- Fuzz oracle for parser changes: a `TypeError`/`RangeError` escaping a parser on malformed input is a bug; clean `Error` rejections are expected.

## Dependency Policy

- Install with `pnpm install --frozen-lockfile` (CI enforced). Update `pnpm-lock.yaml` intentionally, not incidentally.
- Contract dependencies are pinned git submodules under `contracts/lib`.
- Dependabot monitors npm + GitHub Actions weekly; CodeQL scans JS/TS on every change. Do not suppress these checks.

## Reporting

Security vulnerabilities are never public issues — follow `SECURITY.md` (GitHub Security Advisories or security@vaultkeepr.xyz).