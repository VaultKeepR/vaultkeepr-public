










import * as Automerge from "@automerge/automerge";
import type { VaultDoc } from "./schema";


export const TOMBSTONE_TTL_MS = 30 * 24 * 60 * 60 * 1000;











export function purgeTombstones(
doc: VaultDoc,
ttlMs: number = TOMBSTONE_TTL_MS)
: VaultDoc {
  const cutoff = Date.now() - ttlMs;


  const entryIdsToPurge: string[] = [];
  const docIdsToPurge: string[] = [];

  for (const [id, entry] of Object.entries(doc.entries || {})) {
    if (entry._deleted && entry._deletedAt > 0 && entry._deletedAt < cutoff) {
      entryIdsToPurge.push(id);
    }
  }

  for (const [id, secDoc] of Object.entries(doc.documents || {})) {
    if (secDoc._deleted && secDoc._deletedAt > 0 && secDoc._deletedAt < cutoff) {
      docIdsToPurge.push(id);
    }
  }


  if (entryIdsToPurge.length === 0 && docIdsToPurge.length === 0) {
    return doc;
  }

  return Automerge.change(doc, "purge-tombstones", (d) => {
    for (const id of entryIdsToPurge) {
      delete d.entries[id];
    }
    for (const id of docIdsToPurge) {
      delete d.documents[id];
    }
  });
}





export function countTombstones(doc: VaultDoc): {
  entries: number;
  documents: number;
  total: number;
} {
  let entries = 0;
  let documents = 0;

  for (const entry of Object.values(doc.entries || {})) {
    if (entry._deleted) entries++;
  }

  for (const secDoc of Object.values(doc.documents || {})) {
    if (secDoc._deleted) documents++;
  }

  return { entries, documents, total: entries + documents };
}