# @vaultkeepr/sentry

Sentry error tracking for VaultKeepR with a privacy-first `beforeSend` scrubber: crash data is reported with keys, CIDs, addresses, and user identifiers redacted before anything leaves the device.

## Install

```bash
npm install @vaultkeepr/sentry
```

## Usage

Platform adapters share one scrubber:

```ts
// Browser / extension
import { initBrowserSentry } from "@vaultkeepr/sentry/browser";
initBrowserSentry({ dsn, environment });

// React Native (iOS/Android)
import { initReactNativeSentry } from "@vaultkeepr/sentry/react-native";
initReactNativeSentry({ dsn, environment });
```

Scrubbing internals: `createBeforeSend(options)` builds the Sentry `beforeSend` hook; `scrubEventValue(value)` recursively redacts a value. It plugs into `@vaultkeepr/logger`'s error hooks, so structured logs and crash reports share the same redaction rules.

## Security notes

Never bypass the scrubber or send raw error payloads — the threat model treats telemetry as a leak surface (see `docs/THREAT_MODEL.md` in the repo).

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.