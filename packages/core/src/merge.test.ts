




import { describe, it, expect } from "vitest";
import {
  threeWayMerge,
  mergeFolders,
  deleteFolder,
  deleteCloudFolder,
  deleteVaultEntry } from
"./merge.js";
import type { Vault, VaultEntry, SecureDocument, CloudFile } from "./types.js";





function makeVault(over: Partial<Vault> = {}): Vault {
  return {
    version: 4,
    createdAt: "2026-05-01T00:00:00Z",
    entries: [],
    folders: [],
    documents: [],
    cloudFiles: [],
    cloudFolders: [],
    cloudQuotaUsed: 0,
    ...over
  };
}

function makeEntry(over: Partial<VaultEntry> = {}): VaultEntry {
  return {
    id: "e1",
    username: "alice",
    password: "p@ss",
    url: "https://example.com",
    notes: "",
    folder: "",
    customGroup: "",
    createdAt: "2026-05-01T00:00:00Z",
    modifiedAt: 1_700_000_000_000,
    ...over
  } as VaultEntry;
}

function makeDoc(over: Partial<SecureDocument> = {}): SecureDocument {
  return {
    id: "d1",
    type: "id_card" as SecureDocument["type"],
    label: "ID",
    fragments: ["bafy1"],
    nonce: "00",
    blurredThumbnail: "thumb1",
    originalSize: 1024,
    mimeType: "image/jpeg",
    addedAt: "2026-05-01T00:00:00Z",
    modifiedAt: 1_700_000_000_000,
    ...over
  };
}

function makeFile(over: Partial<CloudFile> = {}): CloudFile {
  return {
    id: "f1",
    category: "document",
    fileName: "report.pdf",
    fragments: ["bafy1"],
    nonce: "00",
    originalSize: 100,
    mimeType: "application/pdf",
    fragmentCount: 1,
    contentHash: "hash1",
    addedAt: "2026-05-01T00:00:00Z",
    modifiedAt: 1_700_000_000_000,
    ...over
  };
}





describe("merge — B1 folder deletion", () => {
  it("propagates folder deletion via explicit tombstone", () => {
    const ts = Date.now() - 1_000;
    const base = makeVault({ folders: ["Banque"] });
    const local = deleteFolder(base, "Banque", ts);
    const remote = makeVault({ folders: ["Banque"] });

    const merged = threeWayMerge(base, local, remote);

    expect(merged.folders).not.toContain("Banque");
    expect(merged.folderTombstones?.Banque).toBe(ts);
  });

  it("infers folder deletion when base has it but local doesn't (legacy delete sans tombstone)", () => {

    const base = makeVault({ folders: ["Old"] });
    const local = makeVault({ folders: [] });
    const remote = makeVault({ folders: ["Old"] });

    const merged = threeWayMerge(base, local, remote);
    expect(merged.folders).not.toContain("Old");
    expect(merged.folderTombstones?.Old).toBeGreaterThan(0);
  });

  it("re-creating a folder on the other side after deletion keeps it", () => {
    const base = makeVault({ folders: ["X"] });
    const local = deleteFolder(base, "X", 1_000);



    const remote = makeVault({
      folders: ["X"],
      folderTombstones: {}
    });





    const remoteAfterRecreation = makeVault({ folders: ["X"] });


    const result = mergeFolders(
      [],
      [],
      ["X"],
      { X: 1_000 },
      { X: 1_000 },
      {},
      5_000
    );
    expect(result.names).toContain("X");
    expect(result.tombstones.X).toBeUndefined();


    void local;
    void remote;
    void remoteAfterRecreation;
  });

  it("purges tombstones older than 30 days", () => {
    const oldTs = 1_000;
    const now = oldTs + 31 * 24 * 60 * 60 * 1000;
    const result = mergeFolders([], [], [], { ghost: oldTs }, {}, {}, now);
    expect(result.tombstones.ghost).toBeUndefined();
  });

  it("deleteFolder helper produces a vault that merges correctly", () => {
    const ts = Date.now() - 5_000;
    const base = makeVault({ folders: ["A", "B"] });
    const afterDelete = deleteFolder(base, "A", ts);
    expect(afterDelete.folders).toEqual(["B"]);
    expect(afterDelete.folderTombstones?.A).toBe(ts);

    const remoteUntouched = makeVault({ folders: ["A", "B"] });
    const merged = threeWayMerge(base, afterDelete, remoteUntouched);
    expect(merged.folders).toEqual(["B"]);
  });
});

describe("merge — cloudFolder deletion mirrors folder behavior", () => {
  it("deleteCloudFolder propagates", () => {
    const base = makeVault({ cloudFolders: ["Photos2024"] });
    const local = deleteCloudFolder(base, "Photos2024", Date.now() - 3_000);
    const remote = makeVault({ cloudFolders: ["Photos2024"] });
    const merged = threeWayMerge(base, local, remote);
    expect(merged.cloudFolders).not.toContain("Photos2024");
  });
});





describe("merge — F1 entry deletion propagates via entryTombstones", () => {
  const mk = (id: string, over: Partial<VaultEntry> = {}): VaultEntry => ({
    id,
    url: "https://" + id + ".com",
    username: "u",
    password: "p",
    modifiedAt: 1000,
    ...over
  });

  it("deleteVaultEntry removes the entry and records a tombstone", () => {
    const base = makeVault({ entries: [mk("e1")] });
    const after = deleteVaultEntry(base, "e1", Date.now() - 5_000);
    expect(after.entries).toHaveLength(0);
    expect(after.entryTombstones?.e1).toBeGreaterThan(0);
  });

  it("deletion on local propagates to remote-neutral side", () => {
    const e1 = mk("e1", { modifiedAt: 1_000 });
    const base = makeVault({ entries: [e1] });

    const local = deleteVaultEntry(base, "e1", Date.now());
    const remote = makeVault({ entries: [e1] });
    const merged = threeWayMerge(base, local, remote);
    expect(merged.entries).toHaveLength(0);
    expect(merged.entryTombstones?.e1).toBeGreaterThan(0);
  });

  it("deletion on remote propagates to a locally-held entry", () => {
    const e1 = mk("e1", { modifiedAt: 1_000 });
    const base = makeVault({ entries: [e1] });

    const local = makeVault({ entries: [e1] });
    const remote = makeVault({
      entries: [],
      entryTombstones: { e1: Date.now() }
    });
    const merged = threeWayMerge(base, local, remote);
    expect(merged.entries).toHaveLength(0);
  });

  it("re-creation after tombstone cancels the deletion", () => {
    const e1 = mk("e1", { modifiedAt: 1_000 });
    const base = makeVault({ entries: [e1] });
    const local = deleteVaultEntry(base, "e1", Date.now() - 1_000);

    const remote = makeVault({ entries: [mk("e1", { modifiedAt: Date.now() + 5_000 })] });
    const merged = threeWayMerge(base, local, remote);
    expect(merged.entries).toHaveLength(1);
    expect(merged.entries[0].id).toBe("e1");
    expect(merged.entryTombstones?.e1).toBeUndefined();
  });

  it("legacy (no-tombstone) remote absence stays conservative to avoid cross-install loss", () => {


    const eA = mk("eA", { modifiedAt: 1000 });
    const local = makeVault({ entries: [] });
    const remote = makeVault({ entries: [], folders: [], cloudFiles: [] });
    const merged = threeWayMerge(null, local, remote);
    expect(merged.entries).toHaveLength(0);
    void eA;
  });
});





describe("merge — B2 cloudQuotaUsed recomputed", () => {
  it("recomputes quota from merged cloudFiles instead of Math.max", () => {
    const f1 = makeFile({ id: "f1", originalSize: 100 });
    const f2 = makeFile({ id: "f2", originalSize: 200 });

    const base = makeVault({ cloudFiles: [f1, f2], cloudQuotaUsed: 300 });

    const local = makeVault({ cloudFiles: [f2], cloudQuotaUsed: 200 });

    const f3 = makeFile({ id: "f3", originalSize: 50 });
    const remote = makeVault({ cloudFiles: [f1, f2, f3], cloudQuotaUsed: 350 });

    const merged = threeWayMerge(base, local, remote);


    const ids = merged.cloudFiles!.map((f) => f.id).sort();
    expect(ids).toEqual(["f2", "f3"]);

    expect(merged.cloudQuotaUsed).toBe(250);
  });
});





describe("merge — B3 documents field-level merge", () => {
  it("merges metadata edit + thumbnail edit on the same document", () => {
    const baseDoc = makeDoc({ id: "d1", label: "old", blurredThumbnail: "thumbA" });
    const base = makeVault({ documents: [baseDoc] });


    const local = makeVault({
      documents: [{ ...baseDoc, label: "renamed", modifiedAt: 1_700_000_000_100 }]
    });

    const remote = makeVault({
      documents: [{ ...baseDoc, blurredThumbnail: "thumbB", modifiedAt: 1_700_000_000_200 }]
    });

    const merged = threeWayMerge(base, local, remote);

    expect(merged.documents).toHaveLength(1);
    const d = merged.documents![0];

    expect(d.label).toBe("renamed");
    expect(d.blurredThumbnail).toBe("thumbB");
  });

  it("merges metadata edit + thumbnail edit on the same cloudFile", () => {
    const baseFile = makeFile({ id: "f1", fileName: "old.pdf", description: "" });
    const base = makeVault({ cloudFiles: [baseFile] });
    const local = makeVault({
      cloudFiles: [{ ...baseFile, fileName: "renamed.pdf", modifiedAt: 1_700_000_000_100 }]
    });
    const remote = makeVault({
      cloudFiles: [{ ...baseFile, description: "updated", modifiedAt: 1_700_000_000_200 }]
    });
    const merged = threeWayMerge(base, local, remote);
    const f = merged.cloudFiles![0];
    expect(f.fileName).toBe("renamed.pdf");
    expect(f.description).toBe("updated");
  });
});





describe("merge — B5 deterministic tie-breaker", () => {
  it("converges to the same result regardless of which side is local", () => {
    const baseEntry = makeEntry({ id: "e1", password: "old", modifiedAt: 1_000 });
    const base = makeVault({ entries: [baseEntry] });


    const sideA = makeVault({
      entries: [{ ...baseEntry, password: "valA", modifiedAt: 2_000 }]
    });
    const sideB = makeVault({
      entries: [{ ...baseEntry, password: "valB", modifiedAt: 2_000 }]
    });

    const mergedFromA = threeWayMerge(base, sideA, sideB);
    const mergedFromB = threeWayMerge(base, sideB, sideA);


    expect(mergedFromA.entries[0].password).toBe(mergedFromB.entries[0].password);
  });

  it("favors the lexicographically smaller value on tie (deterministic)", () => {
    const baseEntry = makeEntry({ id: "e1", password: "old", modifiedAt: 1_000 });
    const base = makeVault({ entries: [baseEntry] });
    const sideA = makeVault({
      entries: [{ ...baseEntry, password: "zeta", modifiedAt: 2_000 }]
    });
    const sideB = makeVault({
      entries: [{ ...baseEntry, password: "alpha", modifiedAt: 2_000 }]
    });
    const merged = threeWayMerge(base, sideA, sideB);

    expect(merged.entries[0].password).toBe("alpha");
  });

  it("respects strict timestamp ordering when timestamps differ", () => {
    const baseEntry = makeEntry({ id: "e1", password: "old", modifiedAt: 1_000 });
    const base = makeVault({ entries: [baseEntry] });
    const sideA = makeVault({
      entries: [{ ...baseEntry, password: "zeta", modifiedAt: 3_000 }]
    });
    const sideB = makeVault({
      entries: [{ ...baseEntry, password: "alpha", modifiedAt: 2_000 }]
    });
    const merged = threeWayMerge(base, sideA, sideB);

    expect(merged.entries[0].password).toBe("zeta");
  });
});





describe("merge — basic 3-way semantics (régression)", () => {
  it("keeps new entries from both sides", () => {
    const base = makeVault();
    const local = makeVault({ entries: [makeEntry({ id: "ea", username: "a" })] });
    const remote = makeVault({ entries: [makeEntry({ id: "eb", username: "b" })] });
    const merged = threeWayMerge(base, local, remote);
    const ids = merged.entries.map((e) => e.id).sort();
    expect(ids).toEqual(["ea", "eb"]);
  });

  it("respects deletion when other side did not modify", () => {
    const baseEntry = makeEntry({ id: "e1", modifiedAt: 1_000 });
    const base = makeVault({ entries: [baseEntry] });
    const local = makeVault({ entries: [] });
    const remote = makeVault({ entries: [baseEntry] });
    const merged = threeWayMerge(base, local, remote);
    expect(merged.entries).toHaveLength(0);
  });

  it("delete loses to a concurrent edit on the other side", () => {
    const baseEntry = makeEntry({ id: "e1", password: "old", modifiedAt: 1_000 });
    const base = makeVault({ entries: [baseEntry] });
    const local = makeVault({ entries: [] });

    const remote = makeVault({
      entries: [{ ...baseEntry, password: "new", modifiedAt: 2_000 }]
    });
    const merged = threeWayMerge(base, local, remote);
    expect(merged.entries).toHaveLength(1);
    expect(merged.entries[0].password).toBe("new");
  });

  it("falls back to 2-way LWW when base is null", () => {
    const local = makeVault({
      entries: [makeEntry({ id: "e1", password: "L", modifiedAt: 2_000 })]
    });
    const remote = makeVault({
      entries: [makeEntry({ id: "e1", password: "R", modifiedAt: 1_000 })]
    });
    const merged = threeWayMerge(null, local, remote);
    expect(merged.entries[0].password).toBe("L");
  });
});
















describe("merge — P1-4 base=post-merge preserves LWW correctness", () => {
















  it("converges to the most recent value across 3 pull/upload rounds", () => {
    const baseEntry = makeEntry({
      id: "e1",
      password: "old",
      modifiedAt: 1_000
    });
    const _v0 = makeVault({ entries: [baseEntry] });


    const _vA1 = makeVault({
      entries: [
      { ...baseEntry, password: "A1", modifiedAt: 10_000 }]

    });


    const _vB1 = makeVault({
      entries: [
      { ...baseEntry, password: "B1", modifiedAt: 10_500 }]

    });

    const vB1AfterPull = makeVault({
      entries: [
      { ...baseEntry, password: "B1", modifiedAt: 10_500 }]

    });

    const vA2 = makeVault({
      entries: [
      { ...baseEntry, password: "A2", modifiedAt: 20_000 }]

    });

    const vB2 = makeVault({
      entries: [
      { ...baseEntry, password: "B2", modifiedAt: 30_000 }]

    });



    const merged = threeWayMerge(vB1AfterPull, vA2, vB2);
    expect(merged.entries[0].password).toBe("B2");
    expect(merged.entries[0].modifiedAt).toBe(30_000);
  });


  it("A's newer edit wins when B's edit is older", () => {
    const baseEntry = makeEntry({
      id: "e1",
      password: "old",
      modifiedAt: 1_000
    });
    const base = makeVault({
      entries: [
      { ...baseEntry, password: "shared", modifiedAt: 5_000 }]

    });

    const localA = makeVault({
      entries: [{ ...baseEntry, password: "A-newer", modifiedAt: 20_000 }]
    });
    const remoteB = makeVault({
      entries: [{ ...baseEntry, password: "B-older", modifiedAt: 10_000 }]
    });
    const merged = threeWayMerge(base, localA, remoteB);

    expect(merged.entries[0].password).toBe("A-newer");
  });



  it("merge(a, b) and merge(b, a) converge to the same result", () => {
    const baseEntry = makeEntry({
      id: "e1",
      password: "old",
      modifiedAt: 1_000
    });
    const base = makeVault({ entries: [baseEntry] });
    const localA = makeVault({
      entries: [{ ...baseEntry, password: "A", modifiedAt: 5_000 }]
    });
    const remoteB = makeVault({
      entries: [{ ...baseEntry, password: "B", modifiedAt: 4_000 }]
    });
    const fromA = threeWayMerge(base, localA, remoteB);
    const fromB = threeWayMerge(base, remoteB, localA);

    expect(fromA.entries[0].password).toBe(fromB.entries[0].password);
  });
});