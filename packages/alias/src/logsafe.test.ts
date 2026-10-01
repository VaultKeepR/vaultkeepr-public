import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, symlinkSync, readFileSync, lstatSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { safeAppend } from "./logsafe";

describe("safeAppend (S5443/CWE-59 hardening)", () => {
  it("creates and appends to a regular file", () => {
    const dir = mkdtempSync(join(tmpdir(), "logsafe-"));
    const p = join(dir, "log.txt");
    safeAppend(p, "hello\n");
    safeAppend(p, "world\n");
    expect(readFileSync(p, "utf8")).toBe("hello\nworld\n");
  });

  it("refuses a planted symlink without touching the target (O_NOFOLLOW)", () => {
    const dir = mkdtempSync(join(tmpdir(), "logsafe-"));
    const victim = join(dir, "victim.txt");
    writeFileSync(victim, "", { mode: 0o600 });
    const link = join(dir, "linked.log");
    symlinkSync(victim, link);

    safeAppend(link, "evil\n");

    expect(readFileSync(victim, "utf8")).toBe("");
    expect(lstatSync(link).isSymbolicLink()).toBe(true);
  });

  it("swallows an unwritable path (never throws)", () => {
    expect(() => safeAppend("/proc/definitely/not/writable.log", "x\n")).not.toThrow();
  });
});
