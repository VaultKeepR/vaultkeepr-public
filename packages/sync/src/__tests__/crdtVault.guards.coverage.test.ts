// Coverage-round: both outcomes of the prototype-pollution guards in
// crdtVault (CodeQL js/prototype-polluting-assignment hardening).
import { describe, it, expect } from "vitest";
import { createEmptyDoc, addEntry, updateEntryField, syncLegacyToCrdt } from "../crdtVault";
import type { VaultEntry } from "@vaultkeepr/core";

function makeEntry(id: string): VaultEntry {
  return {
    id,
    url: "https://x.tld",
    username: "u",
    password: "p",
    notes: "",
    folder: "identifiants",
    modifiedAt: 1
  } as VaultEntry;
}

function makeSecureDoc(id: string) {
  return {
    id,
    type: "cni" as const,
    label: "Doc " + id,
    fragments: ["cid1"],
    nonce: "abc123",
    blurredThumbnail: "base64...",
    originalSize: 1024,
    mimeType: "image/jpeg",
    addedAt: "2026-10-01T00:00:00.000Z"
  };
}

function withKey<T extends object>(obj: T, key: string, value: string): T {
  Object.defineProperty(obj, key, { enumerable: true, configurable: true, value });
  return obj;
}

describe("crdtVault prototype-pollution guards", () => {
  it("refuses dangerous field names on updateEntryField, keeps normal ones", () => {
    let doc = addEntry(createEmptyDoc("dev-a"), makeEntry("e1"));
    for (const key of ["__proto__", "constructor", "prototype"]) {
      doc = updateEntryField(doc, "e1", key as never, "boom");
    }
    doc = updateEntryField(doc, "e1", "username", "updated");
    expect(doc.entries.e1.username).toBe("updated");
  });

  it("covers the missing-entry early return", () => {
    const doc = createEmptyDoc("dev-a");
    expect(() => updateEntryField(doc, "ghost", "username", "x")).not.toThrow();
  });

  it("skips dangerous ids and own keys in syncLegacyToCrdt (entries)", () => {
    const doc = createEmptyDoc("dev-a");

    const badEntry = withKey(makeEntry("__proto__"), "constructor", "zz");
    const ePlain = makeEntry("e-plain");
    const eProto = withKey(makeEntry("e-proto"), "__proto__", "pp");
    const eCtor = withKey(makeEntry("e-ctor"), "constructor", "cc");
    const eProtoType = withKey(makeEntry("e-prototype"), "prototype", "tt");

    const vault = {
      entries: [badEntry, ePlain, eProto, eCtor, eProtoType],
      documents: [],
      cloudFiles: []
    } as never;

    const out = syncLegacyToCrdt(doc, vault);
    expect(Object.keys(out.entries).sort()).toEqual(["e-ctor", "e-plain", "e-proto", "e-prototype"]);
  });

  it("skips dangerous ids and own keys in syncLegacyToCrdt (documents)", () => {
    const doc = createEmptyDoc("dev-a");

    const badDoc = withKey(makeSecureDoc("constructor"), "__proto__", "qq");
    const dPlain = makeSecureDoc("d-plain");
    const dProto = withKey(makeSecureDoc("d-proto"), "__proto__", "pp");
    const dCtor = withKey(makeSecureDoc("d-ctor"), "constructor", "cc");
    const dProtoType = withKey(makeSecureDoc("d-prototype"), "prototype", "tt");

    const vault = {
      entries: [],
      documents: [badDoc, dPlain, dProto, dCtor, dProtoType],
      cloudFiles: []
    } as never;

    const out = syncLegacyToCrdt(doc, vault);
    expect(Object.keys(out.documents).sort()).toEqual(["d-ctor", "d-plain", "d-proto", "d-prototype"]);
  });

  it("skips a dangerous cloud-file id before conversion", () => {
    const doc = createEmptyDoc("dev-a");
    const badFile = withKey({ id: "prototype", name: "f", size: 1 } as never, "constructor", "cc");

    const vault = { entries: [], documents: [], cloudFiles: [badFile] } as never;
    const out = syncLegacyToCrdt(doc, vault);
    expect(Object.keys(out.cloudFiles)).toEqual([]);
  });
});
