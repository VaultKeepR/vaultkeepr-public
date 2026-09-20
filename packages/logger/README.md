# @vaultkeepr/logger

Secure structured logging for VaultKeepR with automatic redaction of keys, CIDs, and addresses, gated to development by default.

## Install

```bash
npm install @vaultkeepr/logger
```

## Usage

```ts
import { logger, redactAddress, redactCid } from "@vaultkeepr/logger";

logger.info("vault pinned", { location: redactCid(cid), owner: redactAddress(addr) });

// Deep redaction of arbitrary payloads (keys, CIDs, addresses, user identifiers)
import { redact } from "@vaultkeepr/logger";
logger.debug("state", redact(state));
```

- `setLogLevel` / `getLogLevel` control verbosity; output is dev-gated by default (`isDev`).
- Error hooks: `addErrorHook` / `removeErrorHook` / `clearErrorHooks` feed crash reporting without exposing secrets.
- Redaction helpers: `redactString`, `redactCid` (keeps a 6-char prefix by default), `redactAddress`, and structural `redact(value, maxDepth)`.

## Security notes

Never log plaintext, keys, CIDs, or addresses raw — this package exists to enforce that rule across the VaultKeepR ecosystem, including Sentry scrubbing (`@vaultkeepr/sentry`).

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.