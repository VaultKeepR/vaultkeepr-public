



import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createEmptyDoc,
  addEntry,
  deleteEntry,
  addDocument,
  deleteDocument } from
"../crdtVault";
import {
  purgeTombstones,
  countTombstones,
  TOMBSTONE_TTL_MS } from
"../tombstones";
import type { VaultEntry, SecureDocument } from "@vault-keeper/core";

function makeEntry(id: string): VaultEntry {
  return {
    id,
    url: "https://example.com",
    username: "user",
    password: "pass",
    modifiedAt: Date.now()
  };
}

function makeDoc(id: string): SecureDocument {
  return {
    id,
    type: "cni",
    label: "Test",
    fragments: ["cid1"],
    nonce: "abc",
    blurredThumbnail: "base64",
    originalSize: 1024,
    mimeType: "image/jpeg",
    addedAt: new Date().toISOString()
  };
}

describe("Tombstone management", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts tombstones correctly", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry("e1"));
    doc = addEntry(doc, makeEntry("e2"));
    doc = addEntry(doc, makeEntry("e3"));
    doc = addDocument(doc, makeDoc("doc1"));

    doc = deleteEntry(doc, "e1");
    doc = deleteEntry(doc, "e3");
    doc = deleteDocument(doc, "doc1");

    const counts = countTombstones(doc);
    expect(counts.entries).toBe(2);
    expect(counts.documents).toBe(1);
    expect(counts.total).toBe(3);
  });

  it("does not purge recent tombstones", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry("e1"));
    doc = deleteEntry(doc, "e1");


    doc = purgeTombstones(doc);


    expect(doc.entries["e1"]).toBeDefined();
    expect(doc.entries["e1"]._deleted).toBe(true);
  });

  it("purges tombstones older than TTL", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry("e1"));
    doc = addEntry(doc, makeEntry("e2"));
    doc = addDocument(doc, makeDoc("doc1"));

    doc = deleteEntry(doc, "e1");
    doc = deleteDocument(doc, "doc1");


    vi.advanceTimersByTime(TOMBSTONE_TTL_MS + 1000);


    doc = deleteEntry(doc, "e2");

    doc = purgeTombstones(doc);


    expect(doc.entries["e1"]).toBeUndefined();
    expect(doc.documents["doc1"]).toBeUndefined();


    expect(doc.entries["e2"]).toBeDefined();
    expect(doc.entries["e2"]._deleted).toBe(true);
  });

  it("returns unchanged doc when nothing to purge", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry("e1"));

    const result = purgeTombstones(doc);

    expect(result).toBe(doc);
  });

  it("uses custom TTL", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry("e1"));
    doc = deleteEntry(doc, "e1");


    vi.advanceTimersByTime(2 * 60 * 60 * 1000);


    doc = purgeTombstones(doc, 1 * 60 * 60 * 1000);
    expect(doc.entries["e1"]).toBeUndefined();
  });
});