// Coverage-round: exercises the CRDT-detection branches of compat.ts
// (base64-encoded CRDT payloads and raw binary), plus the JSON fallbacks.
import { describe, it, expect } from "vitest";
import { createEmptyDoc, addEntry, exportBinary } from "../crdtVault";
import { detectPayloadFormat } from "../compat";

function b64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

describe("detectPayloadFormat", () => {
  it("detects raw CRDT binary", () => {
    const doc = addEntry(createEmptyDoc("dev-a"), {
      id: "e1",
      url: "https://x.tld",
      username: "u",
      password: "p",
      notes: "",
      folder: "",
      modifiedAt: 1
    });
    expect(detectPayloadFormat(exportBinary(doc))).toBe("crdt");
  });

  it("detects a base64-encoded CRDT payload", () => {
    const doc = createEmptyDoc("dev-a");
    expect(detectPayloadFormat(b64(exportBinary(doc)))).toBe("crdt");
  });

  it("treats JSON text as json", () => {
    expect(detectPayloadFormat('{"vault":true}')).toBe("json");
  });

  it("falls back to json on non-base64 strings", () => {
    expect(detectPayloadFormat("not base64 at all!")).toBe("json");
  });
});
