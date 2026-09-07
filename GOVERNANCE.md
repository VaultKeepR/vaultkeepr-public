# Governance

## Project members with access to sensitive resources

| Member | GitHub account | Role | Access |
|---|---|---|---|
| Just1 (founder & maintainer) | [@0xJust1](https://github.com/0xJust1) / org [VaultKeepR](https://github.com/VaultKeepR) | Owner | Admin on this repository; sole holder of release, secrets, and branch-protection administration |

This table is the authoritative list of members with access to sensitive
resources (admin settings, CI secrets, release publishing). It is updated
whenever access changes.

## Roles and responsibilities

| Role | Responsibilities | Currently held by |
|---|---|---|
| Owner / Maintainer | Product direction, code review and merge, releases and signing, security response, dependency triage | @0xJust1 |
| Contributor | Proposes changes via pull requests following [CONTRIBUTING.md](./CONTRIBUTING.md); no merge rights | Open — anyone |
| Security reporter | Reports vulnerabilities privately per [SECURITY.md](./SECURITY.md); no repository access | Open — anyone |

The project is currently maintained by a single maintainer. Permission
assignments are manual (GitHub default: new collaborators have no access until
explicitly granted), and `main` is protected by required status checks,
no force-push, linear history, and disabled branch deletion.

## Review before escalated permissions

No contributor receives escalated permissions (write, triage, or admin) on
this repository without a prior review, which includes:

1. **Identity**: the contributor's GitHub account must have two-factor
   authentication enabled.
2. **Track record**: a review of their contribution history (merged PRs,
   issue quality) over a meaningful period.
3. **Justification**: a documented reason for the specific permission level
   requested, granted with least privilege.
4. **Record**: the grant is added to the member table above with its date
   and scope.
5. **Periodic review**: access levels are re-checked at least annually and
   revoked when no longer needed.
