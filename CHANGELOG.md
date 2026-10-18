# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
All packages are versioned together (see the README "Versioning" section).

## [Unreleased]

### Added

- New SDK modules: `core` key join (`key-join`), recovery code
  (`recovery-code`) and account state rules (`account-state`); `smart-account`
  key passage and keyed account migration; `premium` device limits per tier
  and licence choice.

### Changed

- `legacy`: `syncBeneficiariesToIpfs` takes a `proofFor(action)` callback that
  returns the owner proof for each request (`upload`, then
  `legacy-beneficiaries`). The `delegationSignature`, `sessionId`,
  `expiryTimestamp`, `signature` and `message` fields of `BeneSyncAuthOptions`
  are removed. **Breaking** for callers that pass them.
- npm packaging: every published package (`@vaultkeepr/*`, 12 packages) now
  ships a README and points `homepage` at `vaultkeepr.xyz`; patch bumps
  (`core`/`sync` 0.1.3, others 0.1.2) so the metadata lands on npmjs.org.

### Security

- `recovery`: fragment payloads are validated before decryption (version,
  nonce and ciphertext length), the recovered master key is wiped with
  `secureWipe`, and adversarial tests cover corrupted, duplicated and
  cross-vault shares, version and auth-tag tampering, and truncated nonces.
- CI supply-chain hardening: all GitHub Actions pinned to full commit SHAs,
  least-privilege workflow permissions, CodeQL `security-extended` scanning,
  Dependabot (npm + github-actions, weekly) with automated security fixes,
  secret scanning with push protection, and branch protection on `main`.

## [v0.1.0]

### Added

- Initial public release of the zero-knowledge SDK packages:
  `core`, `sync`, `ipfs`, `recovery`, `premium`, `wallet-messages`,
  `smart-account`, `cloud`, `alias`, `logger`, `i18n`, `ui`, `sentry`,
  `legacy`, and `ocr-native`.
- Solidity smart contracts (Base L2) anchoring vault locations, recovery
  fragments, and digital legacy, with Foundry test suites.
- Security policy (`SECURITY.md`) and one-page threat model (`docs/THREAT_MODEL.md`).

[Unreleased]: https://github.com/VaultKeepR/vaultkeepr-public/compare/v0.1.0...HEAD
[v0.1.0]: https://github.com/VaultKeepR/vaultkeepr-public/releases/tag/v0.1.0
