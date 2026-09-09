



import { describe, it, expect } from "vitest";
import {
  createEmptyDoc,
  addEntry,
  exportBinary,
  toVault } from
"../crdtVault";
import {
  detectPayloadFormat,
  migrateLegacyPayload } from
"../compat";
import type { VaultEntry } from "@vaultkeepr/core";

function makeEntry(id: string): VaultEntry {
  return {
    id,
    url: "https://test.com",
    username: "testuser",
    password: "testpass",
    modifiedAt: Date.now()
  };
}

describe("detectPayloadFormat", () => {
  it("detects JSON strings", () => {
    expect(detectPayloadFormat('{"entries":[]}')).toBe("json");
    expect(detectPayloadFormat("{}")).toBe("json");
  });

  it("detects Automerge binary", () => {
    let doc = createEmptyDoc("d1");
    doc = addEntry(doc, makeEntry("e1"));
    const binary = exportBinary(doc);
    expect(detectPayloadFormat(binary)).toBe("crdt");
  });

  it("detects non-Automerge binary as json", () => {
    const randomBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
    expect(detectPayloadFormat(randomBytes)).toBe("json");
  });
});

describe("migrateLegacyPayload", () => {
  it("migrates a JSON vault string to CRDT", () => {
    const json = JSON.stringify({
      version: 1,
      createdAt: "2025-06-01T00:00:00.000Z",
      entries: [
      {
        id: "e1",
        url: "https://github.com",
        username: "alice",
        password: "secret123",
        notes: "my account",
        folder: "dev",
        modifiedAt: 1700000000000
      }],

      folders: ["dev"]
    });

    const doc = migrateLegacyPayload(json, "migrator-device");
    const vault = toVault(doc);

    expect(vault.entries).toHaveLength(1);
    expect(vault.entries[0].username).toBe("alice");
    expect(vault.entries[0].password).toBe("secret123");
    expect(vault.folders).toContain("dev");
    expect(doc._deviceId).toBe("migrator-device");
  });

  it("sanitizes null values from legacy vault", () => {
    const json = JSON.stringify({
      version: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      entries: [
      {
        id: "e1",
        url: null,
        username: null,
        password: null,
        notes: null,
        folder: null,
        totpSecret: null,
        modifiedAt: 1700000000000
      }],

      folders: []
    });

    const doc = migrateLegacyPayload(json, "d1");
    const vault = toVault(doc);


    expect(vault.entries).toHaveLength(1);
    expect(vault.entries[0].url).toBe("");
    expect(vault.entries[0].username).toBe("");
    expect(vault.entries[0].password).toBe("");
  });

  it("handles vault with documents", () => {
    const json = JSON.stringify({
      version: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      entries: [],
      folders: [],
      documents: [
      {
        id: "doc-1",
        type: "passport",
        label: "Mon passeport",
        fragments: ["cid1", "cid2", "cid3"],
        nonce: "abc123hex",
        blurredThumbnail: "base64data",
        originalSize: 2048,
        mimeType: "image/png",
        addedAt: "2025-06-01T00:00:00.000Z",
        modifiedAt: 1700000000000
      }]

    });

    const doc = migrateLegacyPayload(json, "d1");
    const vault = toVault(doc);

    expect(vault.documents).toHaveLength(1);
    expect(vault.documents![0].type).toBe("passport");
    expect(vault.documents![0].fragments).toEqual(["cid1", "cid2", "cid3"]);
  });
});