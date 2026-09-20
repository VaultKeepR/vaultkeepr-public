# Code Conventions

## Overview

TypeScript SDK packages + Solidity contracts. Root `tsconfig.json` applies to all packages.

## TypeScript

- Strict mode, ES2022 target, ESNext modules, Bundler resolution, `declaration: true` (root tsconfig).
- Unused vars/args are errors; prefix intentionally-unused params with `_` (`argsIgnorePattern: "^_"`, `varsIgnorePattern: "^_"`).
- `@typescript-eslint/no-explicit-any` is off only for `packages/*/src/**/*.test.ts` (test fixtures use loose `any` payloads). Keep strict typing in library code.
- No `dist/` in lint scope; do not commit `dist/` output.

## Package Structure

- Entry point: `packages/<pkg>/src/index.ts`, re-exported via `export * from "./<module>"`.
- Build: tsup, dual format `cjs,esm` with `--dts`; output `dist/`.
- Dual package exports: `dist/index.js` (require) + `dist/index.mjs` (import) + `dist/index.d.ts` (types).
- Versioning: independent per package (e.g. core 0.1.2, cloud 1.0.0); bump `package.json` versions deliberately.
- Deviations to preserve: `smart-account` ships raw TS source; `alias` includes binaries and migrations; `ocr-native` is source-only.

## Naming

- npm scope `@vaultkeepr/*`; workspace globs `packages/*` in `pnpm-workspace.yaml`.
- Test files: `<module>.test.ts`; fuzz harnesses: `<target>.fuzz.js`.

## Solidity

- Contracts in `contracts/src/`, Foundry tests mirrored in `contracts/test/` as `<Contract>.t.sol`.
- Dependencies are git submodules in `contracts/lib` (add with `forge install`, pinned in `.gitmodules`).