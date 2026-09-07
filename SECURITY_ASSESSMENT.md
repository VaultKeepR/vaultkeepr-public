# Security Assessment (Baseline L2, OSPS-SA-03.01)

Status: initial assessment performed on the current codebase (release v0.1.0,
commit after `53e912e`). This is a living document — it is updated when the
attack surface changes.

## Method

Manual review of the public SDK packages and contracts, informed by the
[threat model](./docs/THREAT_MODEL.md), automated tooling (CodeQL
security-extended, Dependabot, secret scanning), and Scorecard 5.9/10 evidence.

## Most likely and impactful potential security problems

| # | Risk | Vector | Likelihood | Impact | Mitigations in place |
|---|---|---|---|---|---|
| 1 | Weak or misapplied cryptography | Argon2id parameters drift, AEAD nonce reuse in `packages/core` | Low | Critical | Parameterized KDF tested (m=64 MiB asserted in tests); XChaCha20-Poly1305 with random nonces via `@noble/ciphers`; 510 tests include tampering-resistance and v2/v3 key-separation cases |
| 2 | Supply-chain compromise of dependencies | Malicious or backdoored `@noble/*`/`viem` release | Low-medium | Critical | Lockfile + frozen installs, SHA-pinned CI actions, least-privilege workflows, secret scanning with push protection, Dependabot weekly + auto-fixes; majors on crypto libs reviewed manually before merge |
| 3 | Smart-account drain via contract bug | `VaultKeeperFragments`/`Legacy` allowing unauthorized beneficiary change | Low | High | Foundry test suites on every PR; contracts hold no funds; time-locks on legacy actions; deployed on Base L2 |
| 4 | Plaintext leakage through telemetry | Sentry capturing keys/CIDs/addresses | Medium | High | Redaction enforced in `packages/logger`; logger-level redaction asserted in tests |
| 5 | On-chain metadata correlation | Public registry linking users to vault activity | High | Medium | Documented and accepted: on-chain pointers are pseudonymous; alias package mitigates; user-facing docs disclose this |
| 6 | Malicious PR inserting exfiltration code | Contributor-supplied change in SDK | Low | Critical | Branch protection requires CI + maintainer merge; CodeQL on PRs; workflows grant read-only and `persist-credentials: false` |
| 7 | Build artifact tampering | Modified artifacts between build and distribution | Low | Medium | No binary releases yet; packages consumed from source; releases (when introduced) will be signed per release process |

## Accepted risks

- Public on-chain metadata (see #5) — inherent to the product design,
  disclosed in the README security model.
- Single-maintainer bus factor — mitigated by public process docs and CI
  enforcement; a second maintainer will be added when the contributor base
  grows.

## Next review

Re-assess after the first signed public release and after any major crypto
dependency upgrade (e.g. `@noble/*` v2 migration).
