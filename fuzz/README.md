# Fuzzing

Jazzer.js fuzz targets for the parsing surfaces that receive untrusted input:
CRDT binary import (device-to-device sync), MRZ parsing (passport scans), and
third-party import parsers (CSV, Bitwarden, ProtonPass).

Oracle: a `TypeError`/`RangeError` escaping a parser on malformed input is a
crash (bug). Clean `Error` rejections and `undefined` returns are expected
outcomes.

## Run locally

```bash
pnpm install && pnpm build        # harnesses consume the built dist/
pnpm exec jazzer fuzz/harness/sync.fuzz.js    --sync -- -runs=1000
pnpm exec jazzer fuzz/harness/mrz.fuzz.js     --sync -- -runs=1000
pnpm exec jazzer fuzz/harness/imports.fuzz.js --sync -- -runs=1000
```

## CI

`.github/workflows/fuzz.yml` runs the three targets nightly and on demand
(workflow_dispatch), 2 minutes each. Any crash produces a reproducer input in
the uploaded artifact.
