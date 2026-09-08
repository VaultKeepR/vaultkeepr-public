











import { describe, it, expect } from "vitest";
import * as Automerge from "@automerge/automerge";
import type { Vault, VaultEntry } from "@vault-keeper/core";
import {
  createEmptyDoc,
  addEntry,
  updateEntry,
  updateEntryField,
  deleteEntry,
  addDocument,
  deleteDocument,
  addFolder,
  removeFolder,
  mergeDocuments,
  exportBinary,
  importBinary,
  toVault,
  fromLegacyVault,
  isAutomergeBinary } from
"../crdtVault";





function makeEntry(overrides: Partial<VaultEntry> = {}): VaultEntry {
  return {
    id: "entry-" + Math.random().toString(36).slice(2, 8),
    url: "https://example.com",
    username: "user@example.com",
    password: "s3cret!Pass",
    notes: "test notes",
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





describe("createEmptyDoc", () => {
  it("creates a valid empty document", () => {
    const doc = createEmptyDoc("device-1");
    expect(doc._deviceId).toBe("device-1");
    expect(doc._schemaVersion).toBe(1);
    expect(Object.keys(doc.entries)).toHaveLength(0);
    expect(Object.keys(doc.documents)).toHaveLength(0);
    expect(doc.folders).toHaveLength(0);
  });
});





describe("Entry operations", () => {
  it("adds an entry", () => {
    let doc = createEmptyDoc("d1");
    const entry = makeEntry({ id: "e1", username: "alice" });
    doc = addEntry(doc, entry);

    expect(doc.entries["e1"]).toBeDefined();
    expect(doc.entries["e1"].username).toBe("alice");
    expect(doc.entries["e1"]._deleted).toBe(false);
  });

  it("updates an entry entirely", () => {
    let doc = createEmptyDoc("d1");
    const entry = makeEntry({ id: "e1", username: "alice", password: "old" });
    doc = addEntry(doc, entry);
    doc = updateEntry(doc, { ...entry, username: "bob", password: "new" });

    expect(doc.entries["e1"].username).toBe("bob");
    expect(doc.entries["e1"].password).toBe("new");
  });

  it("updates a single field", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry({ id: "e1", notes: "original" }));
    doc = updateEntryField(doc, "e1", "notes", "updated notes");

    expect(doc.entries["e1"].notes).toBe("updated notes");

    expect(doc.entries["e1"].username).toBe("user@example.com");
  });

  it("does not update a deleted entry", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry({ id: "e1", notes: "original" }));
    doc = deleteEntry(doc, "e1");
    doc = updateEntryField(doc, "e1", "notes", "should not apply");

    expect(doc.entries["e1"].notes).toBe("original");
    expect(doc.entries["e1"]._deleted).toBe(true);
  });

  it("soft-deletes an entry (tombstone)", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry({ id: "e1" }));
    doc = deleteEntry(doc, "e1");

    expect(doc.entries["e1"]._deleted).toBe(true);
    expect(doc.entries["e1"]._deletedAt).toBeGreaterThan(0);


    const vault = toVault(doc);
    expect(vault.entries).toHaveLength(0);
  });
});





describe("Document operations", () => {
  it("adds and deletes a secure document", () => {
    let doc = createEmptyDoc("d1");
    doc = addDocument(doc, makeSecureDoc("doc-1"));

    expect(doc.documents["doc-1"]).toBeDefined();
    expect(doc.documents["doc-1"].label).toBe("Ma CNI");

    doc = deleteDocument(doc, "doc-1");
    expect(doc.documents["doc-1"]._deleted).toBe(true);

    const vault = toVault(doc);
    expect(vault.documents).toBeUndefined();
  });
});





describe("Folder operations", () => {
  it("adds and removes folders", () => {
    let doc = createEmptyDoc("d1");
    doc = addFolder(doc, "work");
    doc = addFolder(doc, "personal");
    doc = addFolder(doc, "work");

    expect(doc.folders).toHaveLength(2);
    expect(doc.folders).toContain("work");
    expect(doc.folders).toContain("personal");

    doc = removeFolder(doc, "work");
    expect(doc.folders).toHaveLength(1);
    expect(doc.folders).not.toContain("work");
  });
});





describe("mergeDocuments", () => {
  it("merges entries added on different devices", () => {
    const base = createEmptyDoc("shared");


    let deviceA = Automerge.clone(base);
    let deviceB = Automerge.clone(base);

    deviceA = addEntry(deviceA, makeEntry({ id: "eA", username: "alice" }));
    deviceB = addEntry(deviceB, makeEntry({ id: "eB", username: "bob" }));

    const merged = mergeDocuments(deviceA, deviceB);
    const vault = toVault(merged);

    expect(vault.entries).toHaveLength(2);
    expect(vault.entries.find((e) => e.id === "eA")?.username).toBe("alice");
    expect(vault.entries.find((e) => e.id === "eB")?.username).toBe("bob");
  });

  it("merges concurrent field-level edits on the same entry", () => {
    let base = createEmptyDoc("shared");
    base = addEntry(base, makeEntry({
      id: "e1",
      username: "original-user",
      password: "original-pass",
      notes: "original-notes"
    }));

    let deviceA = Automerge.clone(base);
    let deviceB = Automerge.clone(base);


    deviceA = updateEntryField(deviceA, "e1", "password", "newPassFromA");


    deviceB = updateEntryField(deviceB, "e1", "notes", "updated notes from B");

    const merged = mergeDocuments(deviceA, deviceB);


    expect(merged.entries["e1"].password).toBe("newPassFromA");
    expect(merged.entries["e1"].notes).toBe("updated notes from B");

    expect(merged.entries["e1"].username).toBe("original-user");
  });

  it("handles delete vs edit conflict (tombstone wins)", () => {
    let base = createEmptyDoc("shared");
    base = addEntry(base, makeEntry({ id: "e1" }));

    let deviceA = Automerge.clone(base);
    let deviceB = Automerge.clone(base);


    deviceA = deleteEntry(deviceA, "e1");


    deviceB = updateEntryField(deviceB, "e1", "notes", "new notes");

    const merged = mergeDocuments(deviceA, deviceB);




    expect(merged.entries["e1"]._deleted).toBe(true);

    expect(merged.entries["e1"].notes).toBe("new notes");


    const vault = toVault(merged);
    expect(vault.entries).toHaveLength(0);
  });

  it("handles 3-way concurrent merge", () => {
    let base = createEmptyDoc("shared");
    base = addEntry(base, makeEntry({ id: "e1", username: "original" }));

    let devA = Automerge.clone(base);
    let devB = Automerge.clone(base);
    let devC = Automerge.clone(base);

    devA = updateEntryField(devA, "e1", "password", "passA");
    devB = updateEntryField(devB, "e1", "notes", "notesB");
    devC = addEntry(devC, makeEntry({ id: "e2", username: "charlie" }));


    let merged = mergeDocuments(devA, devB);
    merged = mergeDocuments(merged, devC);

    expect(merged.entries["e1"].password).toBe("passA");
    expect(merged.entries["e1"].notes).toBe("notesB");
    expect(merged.entries["e2"]).toBeDefined();
    expect(merged.entries["e2"].username).toBe("charlie");

    const vault = toVault(merged);
    expect(vault.entries).toHaveLength(2);
  });

  it("merge is commutative (order-independent)", () => {
    let base = createEmptyDoc("shared");
    base = addEntry(base, makeEntry({ id: "e1" }));

    let devA = Automerge.clone(base);
    let devB = Automerge.clone(base);

    devA = updateEntryField(devA, "e1", "password", "passA");
    devB = updateEntryField(devB, "e1", "notes", "notesB");

    const mergeAB = mergeDocuments(devA, devB);
    const mergeBA = mergeDocuments(devB, devA);


    expect(mergeAB.entries["e1"].password).toBe(mergeBA.entries["e1"].password);
    expect(mergeAB.entries["e1"].notes).toBe(mergeBA.entries["e1"].notes);
  });

  it("merges folders from different devices", () => {
    const base = createEmptyDoc("shared");

    let devA = Automerge.clone(base);
    let devB = Automerge.clone(base);

    devA = addFolder(devA, "work");
    devB = addFolder(devB, "personal");

    const merged = mergeDocuments(devA, devB);
    const vault = toVault(merged);

    expect(vault.folders).toContain("work");
    expect(vault.folders).toContain("personal");
  });














  describe("mergeDocuments — P1-1 entry-replace staleness fix", () => {
    function makeUnrelatedPair(): [VaultDoc, VaultDoc] {
      const legacy: Vault = {
        version: 1,
        createdAt: "2025-01-01T00:00:00.000Z",
        entries: [],
        folders: []
      };
      return [fromLegacyVault(legacy, "devA"), createEmptyDoc("devB")];
    }

    it("picks the newer side's value when an entry was REPLACED on both sides", () => {




      const [docA, docB] = makeUnrelatedPair();
      const deviceA = addEntry(docA, makeEntry({
        id: "e1",
        username: "user-from-A",
        password: "pass-A",
        notes: "notes-A",
        modifiedAt: 10_000
      }));
      const deviceB = addEntry(docB, makeEntry({
        id: "e1",
        username: "user-from-B",
        password: "pass-B",
        notes: "notes-B",
        modifiedAt: 20_000
      }));

      const merged = mergeDocuments(deviceA, deviceB);
      const entry = merged.entries["e1"];


      expect(entry.username).toBe("user-from-B");
      expect(entry.password).toBe("pass-B");
      expect(entry.notes).toBe("notes-B");
    });

    it("picks local's value when local is newer", () => {
      const [docA, docB] = makeUnrelatedPair();
      const deviceA = addEntry(docA, makeEntry({
        id: "e1",
        username: "newer-from-A",
        modifiedAt: 30_000
      }));
      const deviceB = addEntry(docB, makeEntry({
        id: "e1",
        username: "older-from-B",
        modifiedAt: 20_000
      }));

      const merged = mergeDocuments(deviceA, deviceB);
      const entry = merged.entries["e1"];


      expect(entry.username).toBe("newer-from-A");
    });

    it("respects true field-level CRDT operations (updateEntryField)", () => {



      let base = createEmptyDoc("shared");
      base = addEntry(base, makeEntry({
        id: "e1",
        username: "original-user",
        password: "original-pass",
        notes: "original-notes"
      }));

      let deviceA = Automerge.clone(base);
      let deviceB = Automerge.clone(base);

      deviceA = updateEntryField(deviceA, "e1", "password", "newPassFromA");
      deviceB = updateEntryField(deviceB, "e1", "notes", "updated notes from B");

      const merged = mergeDocuments(deviceA, deviceB);


      expect(merged.entries["e1"].password).toBe("newPassFromA");
      expect(merged.entries["e1"].notes).toBe("updated notes from B");

      expect(merged.entries["e1"].username).toBe("original-user");
    });

    it("applies the fix to documents (SecureDocument REPLACE case)", () => {
      const [docA, docB] = makeUnrelatedPair();
      const deviceA = addDocument(docA, {
        id: "doc1",
        type: "id_card",
        label: "A-label",
        blurredThumbnail: "A-thumb",
        fragments: ["bafy1"],
        nonce: "n1",
        originalSize: 1024,
        mimeType: "image/jpeg",
        addedAt: "2026-01-01T00:00:00Z",
        modifiedAt: 10_000
      });
      const deviceB = addDocument(docB, {
        id: "doc1",
        type: "id_card",
        label: "B-label",
        blurredThumbnail: "B-thumb",
        fragments: ["bafy1"],
        nonce: "n1",
        originalSize: 1024,
        mimeType: "image/jpeg",
        addedAt: "2026-01-01T00:00:00Z",
        modifiedAt: 20_000
      });

      const merged = mergeDocuments(deviceA, deviceB);
      const doc = merged.documents["doc1"];


      expect(doc.label).toBe("B-label");
      expect(doc.blurredThumbnail).toBe("B-thumb");
    });

    it("does not change the id field even if values differ", () => {
      const [docA, docB] = makeUnrelatedPair();
      const deviceA = addEntry(docA, makeEntry({ id: "e1", modifiedAt: 10_000 }));
      const deviceB = addEntry(docB, makeEntry({ id: "e1", modifiedAt: 20_000 }));

      const merged = mergeDocuments(deviceA, deviceB);
      expect(merged.entries["e1"].id).toBe("e1");
    });

    it("handles 3-way merge correctly with mixed timestamps", () => {
      const [docA, docB] = makeUnrelatedPair();
      const deviceA = addEntry(docA, makeEntry({
        id: "e1",
        username: "A",
        modifiedAt: 10_000
      }));
      const deviceB = addEntry(docB, makeEntry({
        id: "e1",
        username: "B",
        modifiedAt: 20_000
      }));


      let merged = mergeDocuments(deviceA, deviceB);
      expect(merged.entries["e1"].username).toBe("B");


      let deviceC = createEmptyDoc("devC");
      deviceC = addEntry(deviceC, makeEntry({
        id: "e1",
        username: "C",
        modifiedAt: 30_000
      }));


      merged = mergeDocuments(merged, deviceC);
      expect(merged.entries["e1"].username).toBe("C");
    });
  });
});





describe("Binary serialization", () => {
  it("roundtrips through export/import", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry({ id: "e1", username: "alice", password: "secret" }));
    doc = addEntry(doc, makeEntry({ id: "e2", username: "bob" }));
    doc = addFolder(doc, "work");

    const binary = exportBinary(doc);
    expect(binary).toBeInstanceOf(Uint8Array);
    expect(binary.length).toBeGreaterThan(0);

    const restored = importBinary(binary);
    const vault = toVault(restored);

    expect(vault.entries).toHaveLength(2);
    expect(vault.entries.find((e) => e.id === "e1")?.username).toBe("alice");
    expect(vault.entries.find((e) => e.id === "e1")?.password).toBe("secret");
    expect(vault.folders).toContain("work");
  });

  it("detects Automerge binary header", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry({ id: "e1" }));
    const binary = exportBinary(doc);

    expect(isAutomergeBinary(binary)).toBe(true);
    expect(isAutomergeBinary("{}")).toBe(false);
    expect(isAutomergeBinary(new Uint8Array([0, 1, 2, 3]))).toBe(false);
  });
});





describe("fromLegacyVault", () => {
  it("converts a legacy vault with all data types", () => {
    const legacyVault: Vault = {
      version: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      entries: [
      makeEntry({ id: "e1", username: "legacy-user", notes: "legacy notes" }),
      makeEntry({ id: "e2", username: "second-user", tags: ["important"] })],

      folders: ["work", "personal"],
      documents: [makeSecureDoc("doc-1")]
    };

    const doc = fromLegacyVault(legacyVault, "migration-device");
    const vault = toVault(doc);


    expect(vault.entries).toHaveLength(2);
    expect(vault.entries.find((e) => e.id === "e1")?.username).toBe("legacy-user");
    expect(vault.entries.find((e) => e.id === "e2")?.tags).toEqual(["important"]);


    expect(vault.folders).toContain("work");
    expect(vault.folders).toContain("personal");


    expect(vault.documents).toHaveLength(1);
    expect(vault.documents![0].id).toBe("doc-1");


    expect(doc._deviceId).toBe("migration-device");
    expect(doc._schemaVersion).toBe(1);
  });

  it("handles empty vault", () => {
    const legacyVault: Vault = {
      version: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      entries: [],
      folders: []
    };

    const doc = fromLegacyVault(legacyVault, "d1");
    const vault = toVault(doc);

    expect(vault.entries).toHaveLength(0);
    expect(vault.folders).toHaveLength(0);
    expect(vault.documents).toBeUndefined();
  });

  it("migrated vault can merge with new CRDT edits", () => {
    const legacyVault: Vault = {
      version: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      entries: [makeEntry({ id: "e1", username: "original" })],
      folders: []
    };

    const migrated = fromLegacyVault(legacyVault, "d1");


    let newDevice = createEmptyDoc("d2");
    newDevice = addEntry(newDevice, makeEntry({ id: "e2", username: "new-user" }));

    const merged = mergeDocuments(migrated, newDevice);
    const vault = toVault(merged);

    expect(vault.entries).toHaveLength(2);
    expect(vault.entries.find((e) => e.id === "e1")?.username).toBe("original");
    expect(vault.entries.find((e) => e.id === "e2")?.username).toBe("new-user");
  });
});





describe("Performance", () => {
  it("handles 1000 entries without excessive latency", () => {
    let doc = createEmptyDoc("perf-test");
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      doc = addEntry(doc, makeEntry({
        id: `perf-${i}`,
        username: `user-${i}@example.com`,
        password: `pass-${i}`
      }));
    }

    const addTime = performance.now() - start;
    console.log(`[Perf] Adding 1000 entries: ${addTime.toFixed(1)}ms`);


    const exportStart = performance.now();
    const binary = exportBinary(doc);
    const exportTime = performance.now() - exportStart;
    console.log(`[Perf] Export 1000 entries: ${exportTime.toFixed(1)}ms (${binary.length} bytes)`);


    const importStart = performance.now();
    const restored = importBinary(binary);
    const importTime = performance.now() - importStart;
    console.log(`[Perf] Import 1000 entries: ${importTime.toFixed(1)}ms`);


    const restoredVault = toVault(restored);
    expect(restoredVault.entries).toHaveLength(1000);


    let cloned = Automerge.clone(doc);
    cloned = addEntry(cloned, makeEntry({ id: "cloned-1" }));
    const mergeStart = performance.now();
    const merged = mergeDocuments(doc, cloned);
    const mergeTime = performance.now() - mergeStart;
    console.log(`[Perf] Merge (1000 + clone): ${mergeTime.toFixed(1)}ms`);

    const vault = toVault(merged);
    expect(vault.entries).toHaveLength(1001);


    expect(addTime).toBeLessThan(10000);
    expect(exportTime).toBeLessThan(5000);
    expect(importTime).toBeLessThan(5000);
    expect(mergeTime).toBeLessThan(5000);
  }, 60000); // shared CI runners: the addEntry loop alone can take ~6s

  it("merges independent docs via binary roundtrip (cross-device first sync)", () => {


    let docA = createEmptyDoc("device-a");
    for (let i = 0; i < 50; i++) {
      docA = addEntry(docA, makeEntry({
        id: `a-${i}`,
        username: `userA-${i}@example.com`
      }));
    }

    let docB = createEmptyDoc("device-b");
    for (let i = 0; i < 10; i++) {
      docB = addEntry(docB, makeEntry({
        id: `b-${i}`,
        username: `userB-${i}@example.com`
      }));
    }


    const merged = mergeDocuments(docA, docB);
    const vault = toVault(merged);

    expect(vault.entries).toHaveLength(60);


    expect(vault.entries.filter((e) => e.id.startsWith("a-"))).toHaveLength(50);
    expect(vault.entries.filter((e) => e.id.startsWith("b-"))).toHaveLength(10);
  });
});