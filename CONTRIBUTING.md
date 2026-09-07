# Contributing to VaultKeepR Core

Thank you for considering a contribution. This document explains how to report
defects, discuss changes, and submit pull requests.

## Reporting defects

- **Security vulnerabilities**: do **not** open a public issue. Follow
  [`SECURITY.md`](./SECURITY.md) — GitHub Security Advisories (preferred) or
  security@vaultkeepr.xyz.
- **Other defects**: open a [GitHub issue](https://github.com/VaultKeepR/vaultkeepr-public/issues)
  including:
  - what you did and what you expected,
  - what actually happened (error message, stack trace),
  - the package or contract involved and the commit/version you tested,
  - a minimal reproduction if possible.

Issues are triaged as they come in; expect an initial response within a few
days. Security reports follow the 48-hour acknowledgement target defined in
[`SECURITY.md`](./SECURITY.md).

## Public discussion

Proposed changes and usage obstacles are discussed in the
[issue tracker](https://github.com/VaultKeepR/vaultkeepr-public/issues).
Open an issue before large refactors so the approach can be agreed first.

## Repository scope

This repository is the **public core** of VaultKeepR: the MIT-licensed SDK
packages under `packages/` and the Solidity contracts under `contracts/`.
The web app, browser extension, iOS/Android apps, and the enterprise/API server
live in private repositories and are **out of scope** for contributions here.

## Development setup

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

The full test suite must pass before any PR is merged; CI runs the same
commands (see `.github/workflows/ci.yml`).

## Submitting changes

1. Fork the repository (or create a branch from `main`).
2. Keep commits focused. Commit messages follow Conventional Commits, as in
   the existing history (`feat:`, `fix:`, `docs:`, `ci:`, with optional scope,
   e.g. `fix(contracts): ...`).
3. **Sign every commit** (`git commit -s`) to certify that you are legally
   authorized to contribute it, under the
   [Developer Certificate of Origin (DCO)](https://developercertificate.org).
   The `Signed-off-by:` trailer is enforced by a CI check — unsigned commits
   cannot merge.
4. Open a pull request against `main`. Describe what changed and why.
5. CI must pass: `SDK packages`, `Foundry contracts`, and (for JS/TS changes)
   the CodeQL analysis. `main` is protected — no force-pushes, linear history.
6. Add or update tests for behaviour you change.

All contributions are made under the project's [MIT license](./LICENSE).
