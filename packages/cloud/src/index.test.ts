import { describe, it, expect } from "vitest";
import { checkCloudQuota, validateCloudFile } from "./cloud-validation";
import {
  addCloudFile,
  removeCloudFile,
  updateCloudFile,
  moveCloudFile,
  getCloudFilesByFolder,
  getCloudFolders } from
"./cloud-manager";
import type { Vault } from "@vault-keeper/core";
import type { CloudFile } from "./cloud-types";

describe("Cloud Validation", () => {
  it("should check quota correctly", () => {

    expect(checkCloudQuota(100, 10, 500)).toBe(true);

    expect(checkCloudQuota(490, 20, 500)).toBe(false);
  });

  it("should validate a valid file", async () => {
    const file = { fileName: "test.pdf", fileSize: 1024 * 1024, mimeType: "application/pdf" };
    const res = await validateCloudFile(file);
    expect(res.valid).toBe(true);
    expect(res.category).toBe("document");
  });

  it("should reject a file that is too large", async () => {

    const file = { fileName: "test.pdf", fileSize: 30 * 1024 * 1024, mimeType: "application/pdf" };
    const res = await validateCloudFile(file);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("too_large");
  });

  it("should reject video files", async () => {
    const file = { fileName: "video.mp4", fileSize: 10 * 1024 * 1024, mimeType: "video/mp4" };
    const res = await validateCloudFile(file);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("video_forbidden");
  });
});

describe("Cloud Manager", () => {
  const emptyVault: Vault = {
    version: 1,
    createdAt: new Date().toISOString(),
    entries: [],
    folders: []
  };

  const sampleFile: CloudFile = {
    id: "file-1",
    category: "document",
    fileName: "passport.pdf",
    fragments: ["cid-1", "cid-2"],
    nonce: "abcdef",
    originalSize: 1000000,
    mimeType: "application/pdf",
    fragmentCount: 2,
    contentHash: "hash",
    addedAt: new Date().toISOString()
  };

  it("should add a cloud file and update quota", () => {
    const v1 = addCloudFile(emptyVault, sampleFile);
    expect(v1.cloudFiles).toHaveLength(1);
    expect(v1.cloudQuotaUsed).toBe(1000000);
  });

  it("should remove a cloud file and update quota", () => {
    const v1 = addCloudFile(emptyVault, sampleFile);
    const v2 = removeCloudFile(v1, "file-1");
    expect(v2.cloudFiles).toHaveLength(0);
    expect(v2.cloudQuotaUsed).toBe(0);
  });

  it("should update a cloud file metadata", () => {
    const v1 = addCloudFile(emptyVault, sampleFile);
    const v2 = updateCloudFile(v1, "file-1", { fileName: "new-name.pdf", favorite: true });
    expect(v2.cloudFiles?.[0].fileName).toBe("new-name.pdf");
    expect(v2.cloudFiles?.[0].favorite).toBe(true);
  });

  it("should move a cloud file to a folder", () => {
    const v1 = addCloudFile(emptyVault, sampleFile);
    const v2 = moveCloudFile(v1, "file-1", "documents");
    expect(v2.cloudFiles?.[0].folder).toBe("documents");
  });

  it("should get files filtered by folder", () => {
    const file2: CloudFile = { ...sampleFile, id: "file-2", folder: "perso" };
    const v1 = addCloudFile(addCloudFile(emptyVault, sampleFile), file2);


    const noFolder = getCloudFilesByFolder(v1, undefined);
    expect(noFolder).toHaveLength(1);
    expect(noFolder[0].id).toBe("file-1");

    const persoFiles = getCloudFilesByFolder(v1, "perso");
    expect(persoFiles).toHaveLength(1);
    expect(persoFiles[0].id).toBe("file-2");
  });

  it("should get cloud folders", () => {
    const file2: CloudFile = { ...sampleFile, id: "file-2", folder: "perso" };
    const file3: CloudFile = { ...sampleFile, id: "file-3", folder: "travail" };
    const v1 = addCloudFile(addCloudFile(addCloudFile(emptyVault, sampleFile), file2), file3);

    const folders = getCloudFolders(v1);

    expect(folders).toEqual(expect.arrayContaining(["Documents", "Images", "perso", "travail"]));
    expect(folders).toHaveLength(4);
  });
});