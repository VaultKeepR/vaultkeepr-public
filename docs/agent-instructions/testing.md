# Testing

## Overview

Full suite must pass before any PR is merged (CI runs the same commands). Turbo makes `test` depend on `^build`, so build before testing.

## Commands

- **SDK packages:** `pnpm test` (runs vitest per package, workspace-wide via turbo)
- **Single package:** `pnpm --filter @vaultkeepr/core exec vitest run`
- **Coverage:** only `@vaultkeepr/core` runs coverage in CI (`vitest run --coverage`)
- **Contracts:** `cd contracts && forge build && forge test -vvv`

## Rules

- Add or update tests for every behaviour change (CONTRIBUTING requirement).
- Tests live next to sources: `packages/<pkg>/src/<module>.test.ts`; shared fixtures under `src/__fixtures__/`.
- Round-trip tests exist for vault crypto (`round-trip.test.ts`) — extend them for payload/encryption changes.
- Never weaken existing test coverage to make CI pass.

## Fuzzing (Jazzer.js)

Harnesses in `fuzz/harness/` cover untrusted-input parsers: `sync.fuzz.js` (CRDT binary import), `mrz.fuzz.js` (passport scans), `imports.fuzz.js` (third-party import parsers: CSV, Bitwarden, ProtonPass).

- Harnesses consume built `dist/` — run `pnpm build` first.
- Run one target: `pnpm exec jazzer fuzz/harness/sync.fuzz.js --sync -- -runs=1000`
- Oracle: `TypeError`/`RangeError` escaping a parser = crash (bug). Clean `Error` rejections or `undefined` returns = expected outcomes.
- CI runs all three targets nightly (`.github/workflows/fuzz.yml`); any crash uploads a reproducer artifact.