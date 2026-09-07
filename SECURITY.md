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
