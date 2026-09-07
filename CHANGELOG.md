# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
All packages are versioned together (see the README "Versioning" section).

## [Unreleased]

### Security

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
