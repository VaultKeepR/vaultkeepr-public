# @vaultkeepr/sync

Cross-device vault synchronization for VaultKeepR, built on [Automerge](https://automerge.org/) CRDTs. Conflict-free merges across devices, with tombstones so deletions propagate correctly.

## Install

```bash
npm install @vaultkeepr/sync
```

Requires `@vaultkeepr/core`.

## Usage

```ts
import { createEmptyDoc, addEntry, updateEntry, deleteEntry, mergeDocuments } from "@vaultkeepr/sync";

// Device A
let docA = createEmptyDoc("device-a");
docA = addEntry(docA, entry);

// Device B
let docB = createEmptyDoc("device-b");
docB = updateEntry(docB, editedEntry);

// Merge — order does not matter, result is identical
docA = mergeDocuments(docA, docB);
docB = mergeDocuments(docB, docA);
```

Tombstones keep deletions in sync: `deleteEntry` records a tombstone, and `purgeTombstones` / `countTombstones` manage the log. Legacy non-CRDT payloads can be migrated with `migrateLegacyPayload` / `detectPayloadFormat`.

## Security notes

The CRDT binary import surface is fuzzed in CI (`fuzz/harness/sync.fuzz.js`): malformed Automerge input must fail with a clean `Error`, never a crash.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.