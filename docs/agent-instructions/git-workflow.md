# Git Workflow

## Overview

`main` is protected: no force-pushes, linear history enforced by CI.

## Commits

- Conventional Commits: `feat:`, `fix:`, `docs:`, `ci:` with optional scope, e.g. `fix(contracts): ...`. Match existing history.
- **Sign every commit** with `git commit -s` (DCO `Signed-off-by:` trailer). CI check `dco.yml` rejects unsigned commits — this cannot be skipped.
- Keep commits focused; one logical change per commit.

## Branches & PRs

1. Branch from `main` (or fork).
2. Open PR against `main`, describing what changed and why.
3. CI must pass: SDK packages (build + test), Foundry contracts, CodeQL (JS/TS), DCO, fuzz nightly separately.
4. Add or update tests for changed behaviour (see [Testing](testing.md)).

## Before Committing

- Never commit secrets, keys, or `dist/` output.
- Never commit to `contracts/lib` submodule state without intent (pinned git submodules).

## Security Issues

Do not open public issues for vulnerabilities. Use GitHub Security Advisories or security@vaultkeepr.xyz per `SECURITY.md` (48-hour acknowledgement target).

## Human-Facing Docs

`CONTRIBUTING.md` covers the contributor-facing process (forks, issue triage, licensing). Update it when workflow-visible policy changes; this file only covers what an agent must follow.