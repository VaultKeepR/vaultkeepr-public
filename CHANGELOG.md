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

- Release assets: GitHub Releases carry SDK artifacts only. Client app binaries (APK, IPA, browser extension zips) are no longer attached to this repository.
- `smart-account`: the on-chain CID publish path is removed (`publishCidOnChain`
  and the on-chain sync). CIDs are stored only on the sync server. **Breaking.**
- `core`: `computeApiPinHash(pin, keyHex)` takes the share URL key and keys the
  API PIN proof with it (HMAC-SHA256). **Breaking** for callers of the previous
  one-argument function. Shares created before this release cannot be opened
  after it. `core` and `smart-account` move to 0.2.0 for these breaking changes.
- `legacy`: `syncBeneficiariesToIpfs` takes a `proofFor(action)` callback that
  returns the owner proof for each request (`upload`, then
  `legacy-beneficiaries`). The `delegationSignature`, `sessionId`,
  `expiryTimestamp`, `signature` and `message` fields of `BeneSyncAuthOptions`
  are removed. **Breaking** for callers that pass them.
- npm packaging: every published package (`@vaultkeepr/*`, 12 packages) now
  ships a README and points `homepage` at `vaultkeepr.xyz`; patch bumps
  (`core`/`sync` 0.1.3, others 0.1.2) so the metadata lands on npmjs.org.

### Security

- `core`: the API PIN proof sent to the server was an unkeyed SHA-256 of the PIN,
  which a server holding it could invert offline in about a million steps. It is
  now keyed by the share URL key, which the server never receives.
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
