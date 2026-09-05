# Security Policy

## Reporting Vulnerabilities

**Do not** open public GitHub issues for security vulnerabilities.

Report vulnerabilities privately via:
- GitHub Security Advisories (preferred): use the "Report a vulnerability" button on the Security tab.
- Email: security@vaultkeepr.xyz

Please include:
- A clear description of the issue and its impact.
- Steps to reproduce (proof of concept if possible).
- The affected package(s) and version(s).

## Scope

This policy covers the open-source packages and Solidity contracts in this repository:
`packages/core`, `packages/sync`, `packages/ipfs`, `packages/recovery`, `packages/premium`,
`packages/wallet-messages`, `packages/smart-account`, `packages/cloud`,
`packages/alias`, `packages/logger`, `packages/i18n`, `packages/ui`, `packages/sentry`,
`packages/legacy`, `packages/ocr-native`, and `contracts/`.

The web app, browser extension, iOS/Android apps, and the enterprise/API server are in a
private repository and are **out of scope** for this public policy.

## Response

We acknowledge reports within 48 hours and aim to provide a fix or mitigation within 30 days,
depending on severity. Coordinated disclosure is appreciated.

## Security Model

VaultKeepR is zero-knowledge: the master password never leaves the user's device. All
encryption (XChaCha20-Poly1305, Argon2id) runs client-side. The on-device SLM engine
(auto-tagging, breach summary) performs all inference locally — no vault data is sent to
any server.
