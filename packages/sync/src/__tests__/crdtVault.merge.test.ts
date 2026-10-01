import { describe, it, expect } from "vitest";
import type { VaultEntry } from "@vaultkeepr/core";
import {
  createEmptyDoc,
  addEntry,
  updateEntry,
  deleteEntry,
  addDocument,
  updateDocument,
  deleteDocument,
  addFolder,
  mergeDocuments,
  exportBinary,
  importBinary
} from "../crdtVault";

function makeEntry(overrides: Partial<VaultEntry> = {}): VaultEntry {
  return {
    id: "e-" + Math.random().toString(36).slice(2, 8),
    url: "https://example.com",
    username: "user@example.com",
    password: "s3cret!Pass",
    notes: "notes",
    folder: "identifiants",
    modifiedAt: Date.now(),
    ...overrides
  };
}

function makeSecureDoc(id = "doc-1") {
  return {
    id,
    type: "cni" as const,
    label: "Ma CNI",
    fragments: ["cid1", "cid2"],
    nonce: "abc123",
    blurredThumbnail: "base64...",
    originalSize: 1024,
    mimeType: "image/jpeg",
    addedAt: new Date().toISOString()
  };
}

describe("secure-document lifecycle", () => {
  it("adds, updates and tombstones documents", () => {
    let doc = createEmptyDoc("dev-a");
    doc = addDocument(doc, makeSecureDoc("doc-1"));
    expect(doc.documents["doc-1"]).toBeTruthy();

    doc = updateDocument(doc, { ...makeSecureDoc("doc-1"), label: "Renamed", modifiedAt: Date.now() });
    expect(doc.documents["doc-1"].label).toBe("Renamed");

    doc = deleteDocument(doc, "doc-1");
    expect(doc.documents["doc-1"]._deleted).toBe(true);
  });
});

describe("mergeDocuments staleness + independent paths", () => {
  it("merges disjoint entries and unions folders", () => {
    let local = createEmptyDoc("dev-a");
    local = addEntry(local, makeEntry({ id: "e1", username: "local-user" }));
    local = addFolder(local, "alpha");

    let remote = createEmptyDoc("dev-b");
    remote = addEntry(remote, makeEntry({ id: "e2", username: "remote-user" }));
    remote = addFolder(remote, "beta");

    const merged = mergeDocuments(local, remote);
    expect(merged.entries["e1"]).toBeTruthy();
    expect(merged.entries["e2"]).toBeTruthy();
    expect(merged.folders).toContain("alpha");
    expect(merged.folders).toContain("beta");
  });

  it("propagates a remote deletion (tombstone) onto a stale local copy", () => {
    let local = createEmptyDoc("dev-a");
    local = addEntry(local, makeEntry({ id: "e1", username: "shared" }));

    let remote = importBinary(exportBinary(local));
    remote = deleteEntry(remote, "e1");

    const merged = mergeDocuments(local, remote);
    expect(merged.entries["e1"]._deleted).toBe(true);
  });

  it("resolves per-field staleness towards the newer replica", () => {
    let local = createEmptyDoc("dev-a");
    local = addEntry(local, makeEntry({ id: "e1", username: "old" }));

    let remote = importBinary(exportBinary(local));
    remote = updateEntry(remote, makeEntry({ id: "e1", username: "new" }));

    const merged = mergeDocuments(local, remote);
    expect(merged.entries["e1"].username).toBe("new");
  });

  it("merges documents and cloud files arriving from the remote side", () => {
    let local = createEmptyDoc("dev-a");
    local = addDocument(local, makeSecureDoc("doc-1"));

    let remote = createEmptyDoc("dev-b");
    remote = addDocument(remote, makeSecureDoc("doc-2"));

    const merged = mergeDocuments(local, remote);
    expect(merged.documents["doc-1"]).toBeTruthy();
    expect(merged.documents["doc-2"]).toBeTruthy();
  });

  it("round-trips through exportBinary/importBinary without loss", () => {
    let doc = createEmptyDoc("dev-a");
    doc = addEntry(doc, makeEntry({ id: "e1" }));
    const copy = importBinary(exportBinary(doc));
    expect(copy.entries["e1"]).toBeTruthy();
    expect(copy.entries["e1"].username).toBe(doc.entries["e1"].username);
  });
});
