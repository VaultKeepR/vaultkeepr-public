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
| [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | braces (via `micromatch@4.0.8` in the Metro file map) | High | Accepted 2026-10-22 | Stack overflow in the recursive AST walkers: `parse()` caps the pattern length (10,000 characters) but not brace nesting depth, so a few thousand nested braces (~3,500 in the default `compile` path, ~4,000 in `expand`) exhaust the call stack and terminate the Node.js process with an uncaught `RangeError`. **No patched release exists**: `braces@3.0.3` is the latest published version, OSV lists no fixed version, and upstream will not add a depth guard ([micromatch/braces#70](https://github.com/micromatch/braces/issues/70), thread locked; maintainer position: `maxLength` already bounds the input and callers should not run untrusted patterns). Exposure is build-time only: `braces` is reached exclusively through the Metro file map used by `packages/ocr-native`, which matches the developer's own repo paths and locally configured glob patterns — no untrusted pattern ever reaches it at runtime, and nothing ships in any client bundle. Worst case is a crashed bundler process in dev/CI. Re-evaluate on the next metro / React Native upgrade, or if a maintained fork or patched release ever ships. |
| [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) | deepmerge (via `@expo/config` 57.0.9 in the Expo toolchain) | Low | Accepted 2026-10-30 | Prototype poisoning in `mergeObject()`: keys of the source object are copied without filtering `__proto__` / `constructor` / `prototype`, so a malicious source object can inject properties into the returned object's prototype. **No patched release exists**: the advisory covers `>= 4.2.0, <= 4.3.1`, which is the latest published version, and OSV lists no fixed version. The single `deepmerge@4.3.1` copy is pulled by `@expo/config@57.0.9` (through `@expo/cli`, `@expo/metro-config`, `@expo/prebuild-config` and `@expo/local-build-cache-provider`) for `packages/ocr-native` only (12 resolution paths, all under the Expo toolchain), so exposure is build-time only: it merges the repo's own `app.json` / `package.json` Expo config at local or CI build time — never request-supplied JSON — and nothing ships in any client bundle. `deepmerge-ts@8.0.2` (via `html-to-text` in `packages/alias`) is a different package and is not affected. Re-evaluate monthly, on the next Expo / React Native upgrade, or if a fix ships. |

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

A full threat model — assets, adversaries, trust boundaries, and accepted
limitations — is documented in [`docs/THREAT_MODEL.md`](./docs/THREAT_MODEL.md).
The most impactful risks and their mitigations are tracked in
[`SECURITY_ASSESSMENT.md`](./SECURITY_ASSESSMENT.md).

## Security Scans & Reports

Automated security scan reports for the shipped clients and web app are
published in the [`audits/`](./audits) directory for transparency. These are
tool-generated reports (not manual third-party code audits); findings are
triaged under the [Vulnerability Remediation Policy](#vulnerability-remediation-policy).

| Report | Scope | Tool | Date |
|---|---|---|---|
| [`2026-08-audit-extension-v1.8.5.pdf`](audits/2026-08-audit-extension-v1.8.5.pdf) | Browser extension v1.8.5 | Internal full audit | 2026-08 |
| [`2026-09-appsec-scorecard-ios.pdf`](audits/2026-09-appsec-scorecard-ios.pdf) | iOS client | AppSec Scorecard | 2026-09 |
| [`2026-09-appsec-scorecard-android.pdf`](audits/2026-09-appsec-scorecard-android.pdf) | Android client | AppSec Scorecard | 2026-09 |
| [`2026-09-virustotal-ios-v1.8.5.pdf`](audits/2026-09-virustotal-ios-v1.8.5.pdf) | iOS IPA v1.8.5 | VirusTotal | 2026-09 |
| [`2026-09-virustotal-android-v1.8.5.pdf`](audits/2026-09-virustotal-android-v1.8.5.pdf) | Android APK v1.8.5 | VirusTotal | 2026-09 |
| [`2026-09-http-observatory-web.pdf`](audits/2026-09-http-observatory-web.pdf) | vaultkeepr.xyz web app | MDN HTTP Observatory | 2026-09 |
| [`2026-09-maestro-e2e-ios.pdf`](audits/2026-09-maestro-e2e-ios.pdf) | iOS client — functional E2E | Maestro | 2026-09 |
| [`2026-09-maestro-e2e-android.pdf`](audits/2026-09-maestro-e2e-android.pdf) | Android client — functional E2E | Maestro | 2026-09 |
| [`2026-09-mobsf-android-v1.8.9.pdf`](audits/2026-09-mobsf-android-v1.8.9.pdf) | Android APK v1.8.9 — static analysis (0/432 trackers) | MobSF | 2026-09 |

Reports are refreshed with each client release. Manually conducted code
audits, when they happen, will be published here under the auditor's
consent.

## Release Integrity (Signed Releases)

The GitHub Releases of this repository carry **SDK artifacts only**. The
`@vaultkeepr/*` packages are built and published by GitHub Actions from this
repository. The client apps (web, browser extension, iOS and Android) are out of
scope for this repository and are not attached to its releases.

### Verify the SDK build provenance

The `@vaultkeepr/*` packages published to npmjs.org are built and published by
GitHub Actions from this repository, so they carry a **SLSA build provenance**
attestation generated by
[`actions/attest-build-provenance`](https://github.com/actions/attest-build-provenance).
The bundle is attached to each GitHub Release as
`vaultkeepr-sdk-<tag>.intoto.jsonl` (one line per SDK tarball), and npm shows
the same provenance on the package page:

```bash
# Download the tarball and check it was built by this repository's release workflow
npm pack @vaultkeepr/core
gh attestation verify vaultkeepr-core-<version>.tgz --repo VaultKeepR/vaultkeepr-public
```

**Scope, stated plainly:** this attestation covers the npm SDK tarballs built by
the release workflow. No other artifact is published from this repository.
