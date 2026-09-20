# VaultKeepR Core

Open-source cryptographic SDK (TypeScript packages) and Solidity contracts powering the VaultKeepR password manager. Client apps (web, extension, iOS/Android) live in private repos and are out of scope here.

## Quick Reference

- **Package Manager:** pnpm 9 (workspace), Node.js 20+
- **Build:** `pnpm build` (turbo)
- **Test:** `pnpm test` (must pass before any PR)
- **Lint:** `pnpm lint`
- **Install:** `pnpm install --frozen-lockfile`
- **Contracts:** `cd contracts && forge install && forge build && forge test -vvv`

## Critical Rules

- Security-focused codebase: never weaken crypto primitives (Argon2id, XChaCha20-Poly1305, `@noble/*`), never log plaintext, keys, CIDs, or addresses (use `@vaultkeepr/logger` redaction).
- Sign every commit with `git commit -s` (DCO trailer, enforced by CI — unsigned commits cannot merge).
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, optional scope).
- `main` is protected: no force-pushes, linear history.

## Detailed Guidelines

- [Architecture & Package Map](docs/agent-instructions/architecture.md)
- [Security Guidelines](docs/agent-instructions/security.md)
- [Testing](docs/agent-instructions/testing.md)
- [Code Conventions](docs/agent-instructions/conventions.md)
- [Git Workflow](docs/agent-instructions/git-workflow.md)