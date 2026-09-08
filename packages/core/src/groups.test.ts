import { describe, it, expect } from "vitest";
import {
  ENTRY_GROUP_IDS,
  ENTRY_GROUP_LABELS,
  DEFAULT_ENTRY_GROUP,
  BUILTIN_FOLDER_IDS,
  BUILTIN_FOLDER_NODES,
  getEntryGroupLabel,
  resolveFolderName
} from "./groups";
import type { FolderNode } from "./types";

describe("entry group constants", () => {
  it("every group id has a label and a builtin folder", () => {
    for (const id of ENTRY_GROUP_IDS) {
      expect(typeof ENTRY_GROUP_LABELS[id]).toBe("string");
      expect(BUILTIN_FOLDER_IDS[id]).toMatch(/^builtin-/);
    }
  });

  it("builtin folder nodes match ids, ordering and labels", () => {
    expect(BUILTIN_FOLDER_NODES).toHaveLength(6);
    BUILTIN_FOLDER_NODES.forEach((node, i) => {
      expect(node.sortOrder).toBe(i);
      expect(node.createdAt).toBe(0);
      expect(node.parentId).toBeNull();
    });
    for (const id of ENTRY_GROUP_IDS) {
      expect(BUILTIN_FOLDER_NODES.find((n) => n.id === BUILTIN_FOLDER_IDS[id])?.name).toBe(
        ENTRY_GROUP_LABELS[id]
      );
    }
    expect(DEFAULT_ENTRY_GROUP).toBe("identifiants");
  });
});

describe("getEntryGroupLabel", () => {
  it("defaults to the identifiers label", () => {
    expect(getEntryGroupLabel(undefined)).toBe("Identifiants");
  });

  it("maps known group ids", () => {
    expect(getEntryGroupLabel("cartes")).toBe("Cartes bancaires");
    expect(getEntryGroupLabel("seeds")).toBe("Crypto Seeds");
  });

  it("passes unknown folder ids through", () => {
    expect(getEntryGroupLabel("custom-folder")).toBe("custom-folder");
  });
});

describe("resolveFolderName", () => {
  const tree: FolderNode[] = [
    { id: "f-1", name: "Work", parentId: null, sortOrder: 0, createdAt: 0 },
    { id: "f-2", name: "Banking", parentId: "f-1", sortOrder: 1, createdAt: 0 }
  ];

  it("returns the identifiers label without a folder", () => {
    expect(resolveFolderName(undefined, tree)).toBe("Identifiants");
  });

  it("resolves group ids to labels", () => {
    expect(resolveFolderName("notes", tree)).toBe("Notes");
    expect(resolveFolderName("identites", undefined)).toBe("Identités");
  });

  it("resolves passkeys alias", () => {
    expect(resolveFolderName("passkeys", undefined)).toBe("Passkeys");
  });

  it("looks up custom folders in the tree", () => {
    expect(resolveFolderName("f-2", tree)).toBe("Banking");
  });

  it("falls back to the raw id for unknown folders", () => {
    expect(resolveFolderName("f-404", tree)).toBe("f-404");
    expect(resolveFolderName("f-404", undefined)).toBe("f-404");
  });
});
