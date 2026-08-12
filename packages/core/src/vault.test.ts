import { describe, it, expect } from "vitest";
import {
  createEmptyVault,
  addEntry,
  updateEntry,
  removeEntry,
  serializeVault,
  parseVault } from
"./vault";

describe("vault", () => {
  it("creates empty vault", () => {
    const v = createEmptyVault();
    expect(v.entries).toEqual([]);
    expect(v.folders).toEqual([]);
    expect(v.version).toBeDefined();
  });

  it("adds entry to vault", () => {
    let v = createEmptyVault();
    v = addEntry(v, { url: "github.com", username: "dev", password: "pass123" });
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].url).toBe("github.com");
    expect(v.entries[0].username).toBe("dev");
    expect(v.entries[0].password).toBe("pass123");
    expect(v.entries[0].id).toBeDefined();
  });

  it("generates unique entry IDs", () => {
    let v = createEmptyVault();
    v = addEntry(v, { url: "a.com", username: "a", password: "1" });
    v = addEntry(v, { url: "b.com", username: "b", password: "2" });
    expect(v.entries[0].id).not.toBe(v.entries[1].id);
  });

  it("updates entry by ID", () => {
    let v = createEmptyVault();
    v = addEntry(v, { url: "github.com", username: "old", password: "pass" });
    const id = v.entries[0].id;
    v = updateEntry(v, id, { username: "new" });
    expect(v.entries[0].username).toBe("new");
    expect(v.entries[0].url).toBe("github.com");
  });

  it("removeEntry removes by ID", () => {
    let v = createEmptyVault();
    v = addEntry(v, { url: "a.com", username: "a", password: "1" });
    v = addEntry(v, { url: "b.com", username: "b", password: "2" });
    const id = v.entries[0].id;
    v = removeEntry(v, id);
    expect(v.entries).toHaveLength(1);
    expect(v.entries[0].url).toBe("b.com");
  });

  it("serializes and parses vault roundtrip", () => {
    let v = createEmptyVault();
    v = addEntry(v, { url: "test.com", username: "user", password: "secret" });
    const json = serializeVault(v);
    const parsed = parseVault(json);
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].url).toBe("test.com");
    expect(parsed.entries[0].password).toBe("secret");
  });

  it("rejects invalid JSON in parseVault", () => {
    expect(() => parseVault("not json")).toThrow();
  });
});