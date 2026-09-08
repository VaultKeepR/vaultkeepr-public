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

## Secret and Credential Management Policy

- **Storage**: CI credentials live exclusively in encrypted GitHub Actions
  secrets (e.g. `SCORECARD_TOKEN`). They are never committed, logged, or
  passed to third-party services beyond their intended workflow.
- **No secrets in code**: secret scanning with push protection is enabled;
  any pushed secret is blocked before it reaches the repository.
- **Least privilege**: the default `GITHUB_TOKEN` is read-only; jobs that
  need more (CodeQL upload, Scorecard publish) declare minimal job-level
  permissions explicitly.
- **Rotation**: CI secrets are rotated at least every 90 days, immediately
  after any suspected exposure, and whenever a person with admin access
  leaves the project.
- **Local development**: local `.env` files are gitignored; wallet keys and
  production credentials are never stored in this repository.

## Vulnerability Remediation Policy

**SCA (dependency) findings** (Dependabot + lockfile scanning):

| Severity | Remediation target |
|---|---|
| Critical / High | Fix or mitigate within 7 days |
| Medium | Within 30 days |
| Low | Within 90 days or accepted with written justification |

License policy: dependencies shipped to clients must carry permissive
licenses (MIT, BSD, Apache-2.0, ISC); copyleft licenses are restricted to
development-only tooling. Violations block the dependency update.

**Pre-release check**: before any official release, all open Critical/High
SCA findings must be fixed, mitigated, or explicitly accepted in the release
notes.

### Accepted Risk Register

Open SCA findings that cannot be remediated upstream are documented here with
their exposure assessment. Each entry is re-evaluated monthly and removed as
soon as a patched version becomes available.

| Advisory | Package | Sev | Status | Rationale |
|---|---|---|---|---|
| [GHSA-w3rx-r6r6-pgpr](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr) | image-size (via `metro@0.87.0`) | High | Accepted 2026-09-09 | Infinite-loop DoS in the ICNS parser. `image-size` has **no patched release** (OSV lists `patched: <0.0.0`); the vulnerable version is pulled transitively by the React Native bundler used by `packages/ocr-native`. It only processes local asset files at build time — it is not part of any shipped runtime bundle and never parses attacker-controlled input. Re-evaluate on the next metro / React Native upgrade or when an `image-size` fix ships. |
| [GHSA-5p2g-fcmc-qvqq](https://github.com/advisories/GHSA-5p2g-fcmc-qvqq) | image-size (via `metro@0.87.0`) | High | Accepted 2026-09-09 | Same root cause and same exposure as above (JXL/HEIF parser infinite loops); remediation is blocked on the same upstream fix. |

**SAST findings** (CodeQL, `security-extended`):

- New High/Critical SAST findings block merge — CodeQL is a required status
  check on `main`.
- Triage target for any SAST finding: 7 days to fix or document
  non-exploitability (inline suppression with justification).

**Enforcement**: all changes are evaluated automatically on every PR
(Dependabot for dependencies, CodeQL for code weaknesses); violating
commits cannot merge while the required checks fail. Suppression of a
finding requires a written non-exploitability rationale.

## Security Model

VaultKeepR is zero-knowledge: the master password never leaves the user's device. All
encryption (XChaCha20-Poly1305, Argon2id) runs client-side. The on-device SLM engine
(auto-tagging, breach summary) performs all inference locally — no vault data is sent to
any server.

## Release Integrity (Signed Releases)

Release artifacts (Android APK, iOS IPA, browser extensions) are built on the
maintainer's machine and **signed with [minisign](https://github.com/jedisct1/minisign)**
(Ed25519). The signing public key is committed in this repository
([`minisign.pub`](minisign.pub)) — its integrity is anchored by the git history.

### Verify a release artifact

```bash
# 1. Download the artifact and the repository's public key
gh release download v0.2.0 -R VaultKeepR/vaultkeepr-public
curl -LO https://raw.githubusercontent.com/VaultKeepR/vaultkeepr-public/main/minisign.pub

# 2. Verify the signature (minisign: brew install minisign / apt install minisign)
minisign -Vm vaultkeepr-android-v0.2.0.apk -p minisign.pub
# → "Signature and comment signature verified"

# 3. Cross-check the SHA-256 against the signed checksums.txt
shasum -a 256 -c checksums.txt
```

Every release also ships `checksums.txt` (SHA-256 of all artifacts) with its own
minisign signature, so the checksum list itself is authenticated. If signature
verification fails, **do not install the artifact** and please
[open a security advisory](#reporting-vulnerabilities).
