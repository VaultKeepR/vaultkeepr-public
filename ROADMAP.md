# Roadmap (next 12 months)

This roadmap describes what VaultKeepR **intends** to do and **does not
intend** to do over the next year. It is a living document: items may move,
but the scope boundaries below are firm commitments.

## Intended (next 12 months)

### Security & trust (top priority)

- **Third-party security audit** of the crypto core (`packages/core`) and the
  three Base L2 contracts, with the public report linked from this repository.
- **Signed releases**: the first GitHub Release will ship signed artifacts
  (sigstore/cosign) with a documented verification procedure.
- **SBOM generation** (CycloneDX) wired into the release pipeline.
- **Coverage gating**: keep statement coverage ≥ 80% on `packages/core`,
  enforced in CI, and extend coverage to `sync` and `recovery` packages.
- **Fuzzing**: property-based/fuzz testing of vault parsing and the
  encryption envelope (fills the current `dynamic_analysis` gap).

### Product

- **Mobile clients** (iOS/Android) built on the private clients, consuming
  this public core as-is.
- **`VaultKeeperLegacy` hardening**: beneficiary UX flows and on-chain
  notification for time-locked inheritance.
- **Relayer improvements**: gasless operations via smart accounts, with the
  relayer kept out of the trust boundary (documented in
  [`DESIGN.md`](./DESIGN.md)).

### Process

- **Second maintainer onboarding** (bus factor): documented in
  [`GOVERNANCE.md`](./GOVERNANCE.md) when the contributor base grows.
- **DCO enforcement** (`Signed-off-by`) as soon as the first external
  contributor lands.
- Keep the OpenSSF Baseline at level 3 and the Best Practices badge
  **gold**-ready (coverage, fuzzing, signed releases are the remaining gaps).

## Explicitly NOT intended (next 12 months)

- **No custodial features**: the project will never hold user keys or
  passwords server-side. Zero-knowledge is a permanent design constraint.
- **No telemetry beyond crash reports**: no analytics, no tracking; crash
  data stays redacted (keys/CIDs/addresses) per the logger policy.
- **No support for chains other than Base L2** in the public core during this
  period (multichain is out of scope until the audit lands).
- **No breaking change to the on-chain contract interfaces** deployed at
  `v0.1.0` (additive upgrades only, with migration docs in the CHANGELOG).

## Release cadence

Minor releases as features land; patch releases for security fixes with a
30-day fix target (see [`DISCLOSURE.md`](./DISCLOSURE.md)). Only the latest
release line receives security updates ([`SUPPORT.md`](./SUPPORT.md)).
