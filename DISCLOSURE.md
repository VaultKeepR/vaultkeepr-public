# Coordinated Vulnerability Disclosure Policy

VaultKeepR follows coordinated vulnerability disclosure.

## How to report

See [`SECURITY.md`](./SECURITY.md) — GitHub Security Advisories (preferred,
private by design) or security@vaultkeepr.xyz. Private vulnerability reporting
is available at all times directly to the security contacts.

## Our commitments

- **Acknowledgement within 48 hours** of your report.
- **Status updates** at least every 7 days while a fix is in progress.
- **Fix or mitigation target within 30 days**, depending on severity.
- No legal action against researchers acting in good faith within this policy.
- You will be offered credit in the release notes and
  [CHANGELOG](./CHANGELOG.md) unless you prefer to remain anonymous.

## Disclosure timeline

1. Report received (private) → acknowledgement ≤ 48 h.
2. Verification and severity assessment (CVSS) → triage.
3. Fix developed and tested privately; patch released as soon as ready.
4. Public advisory published **after** a patch is available (or a documented
   mitigation), normally within 30 days of the fix release, crediting the
   reporter.
5. Discovered vulnerabilities are publicly documented in the repository
   (GitHub Security Advisories are public once patched, and summaries are
   added to the CHANGELOG "Security" section).

## Scope

See [`SECURITY.md`](./SECURITY.md) for the in-scope packages and contracts.
Out of scope: the private web/extension/mobile clients and API server
(documented in [CONTRIBUTING.md](./CONTRIBUTING.md) "Repository scope").
