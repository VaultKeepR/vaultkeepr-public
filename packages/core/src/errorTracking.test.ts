import { describe, it, expect, beforeEach } from "vitest";
import {
  captureError,
  getErrorBuffer,
  clearErrorBuffer,
  formatErrorReport } from
"./errorTracking";

describe("errorTracking", () => {
  beforeEach(() => {
    clearErrorBuffer();
  });

  it("captures an error with string message", () => {
    const report = captureError("test error", "TestModule", "web");
    expect(report.message).toBe("test error");
    expect(report.component).toBe("TestModule");
    expect(report.runtime).toBe("web");
    expect(report.ts).toBeTruthy();
    expect(report.stack).toBeNull();
  });

  it("captures an Error object", () => {
    const err = new Error("crash!");
    const report = captureError(err, "Component", "extension");
    expect(report.message).toBe("crash!");
    expect(report.runtime).toBe("extension");
    expect(report.stack).toBeTruthy();
  });

  it("truncates message to 500 chars", () => {
    const longMsg = "a".repeat(1000);
    const report = captureError(longMsg, "Test", "ios");
    expect(report.message.length).toBe(500);
  });

  it("stores reports in the buffer", () => {
    captureError("err1", "A", "web");
    captureError("err2", "B", "ios");
    const buffer = getErrorBuffer();
    expect(buffer).toHaveLength(2);
    expect(buffer[0].message).toBe("err1");
    expect(buffer[1].message).toBe("err2");
  });

  it("maintains max buffer size of 50", () => {
    for (let i = 0; i < 55; i++) {
      captureError(`err${i}`, "Test", "web");
    }
    const buffer = getErrorBuffer();
    expect(buffer).toHaveLength(50);

    expect(buffer[0].message).toBe("err5");
  });

  it("clears the buffer", () => {
    captureError("err", "Test", "web");
    expect(getErrorBuffer()).toHaveLength(1);
    clearErrorBuffer();
    expect(getErrorBuffer()).toHaveLength(0);
  });

  it("formatErrorReport returns 'No errors' when empty", () => {
    const report = formatErrorReport();
    expect(report).toBe("No errors captured.");
  });

  it("formatErrorReport generates readable text", () => {
    captureError("crash!", "Component", "extension");
    const report = formatErrorReport();
    expect(report).toContain("VaultKeepR Error Report");
    expect(report).toContain("crash!");
    expect(report).toContain("Component");
    expect(report).toContain("extension");
  });

  it("cleans stack traces — removes home directory", () => {
    const err = new Error("test");
    err.stack = "Error: test\n    at /Users/dev/project/file.js:10:5";
    const report = captureError(err, "Test", "web");
    expect(report.stack).not.toContain("/Users/dev/");
    expect(report.stack).toContain("~/");
  });

  it("cleans stack traces — removes query params", () => {
    const err = new Error("test");
    err.stack = "Error: test\n    at https://app.vaultkeepr.xyz/chunk.js?v=abc123:10:5";
    const report = captureError(err, "Test", "web");
    expect(report.stack).not.toContain("?v=abc123");
  });

  it("returns read-only buffer copy", () => {
    captureError("err", "Test", "web");
    const buf1 = getErrorBuffer();
    const buf2 = getErrorBuffer();
    expect(buf1).toEqual(buf2);
    expect(buf1).not.toBe(buf2);
  });

  it("includes version when provided", () => {
    const report = captureError("err", "Test", "extension", {
      version: "1.2.3"
    });
    expect(report.version).toBe("1.2.3");
  });
});