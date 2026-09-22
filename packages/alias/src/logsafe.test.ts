import { describe, it, expect, afterEach } from "vitest";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
  lstatSync,
  existsSync,
  statSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { safeAppend, errLog, log } from "./logsafe";

const dirs: string[] = [];

function tmpPath(name: string): string {
  const dir = mkdtempSync(join(tmpdir(), "logsafe-test-"));
  dirs.push(dir);
  return join(dir, name);
}

afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe("logsafe — safeAppend", () => {
  it("creates the file with 0600 and writes the message", () => {
    const p = tmpPath("app.log");
    safeAppend(p, "hello");
    expect(readFileSync(p, "utf8")).toBe("hello");
    expect((statSync(p).mode & 0o777) === 0o600).toBe(true);
  });

  it("appends successive writes", () => {
    const p = tmpPath("app.log");
    safeAppend(p, "one");
    safeAppend(p, "two");
    expect(readFileSync(p, "utf8")).toBe("onetwo");
  });

  it("refuses to write through a planted symlink (O_NOFOLLOW)", () => {
    const dir = mkdtempSync(join(tmpdir(), "logsafe-test-"));
    dirs.push(dir);
    const p = join(dir, "app.log");
    const victim = join(dir, "victim.txt");
    writeFileSync(victim, "", { mode: 0o600 });
    symlinkSync(victim, p);
    safeAppend(p, "evil");
    // The write was dropped: target untouched, symlink not replaced by a file.
    expect(readFileSync(victim, "utf8")).toBe("");
    expect(lstatSync(p).isSymbolicLink()).toBe(true);
  });
});

describe("logsafe — errLog", () => {
  it("writes an ISO-timestamped line to the given path", () => {
    const p = tmpPath("err.log");
    errLog("boom", p);
    const content = readFileSync(p, "utf8");
    expect(content).toContain("boom");
    expect(content).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
  });
});

describe("logsafe — log (debug-gated)", () => {
  const KEY = "VAULTKEEPER_FORWARD_DEBUG";
  let saved: string | undefined;

  afterEach(() => {
    if (saved === undefined) delete process.env[KEY];
    else process.env[KEY] = saved;
    saved = undefined;
  });

  it("does not write when debug is off", () => {
    saved = process.env[KEY];
    delete process.env[KEY];
    const p = tmpPath("debug.log");
    log("trace", p);
    expect(existsSync(p)).toBe(false);
  });

  it("writes when VAULTKEEPER_FORWARD_DEBUG=1", () => {
    saved = process.env[KEY];
    process.env[KEY] = "1";
    const p = tmpPath("debug.log");
    log("trace", p);
    expect(readFileSync(p, "utf8")).toContain("trace");
  });
});