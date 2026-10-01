// Adversarial regression tests for the ReDoS hardening round (CodeQL
// js/polynomial-redos, 2026-10-01). Each former regex is exercised with a
// 200k-character flood of its worst-case character; a quadratic pattern
// would take tens of seconds (the old code measured ~70s), while the linear
// replacements stay in the milliseconds. The assertions check both the
// behaviour and a generous wall-clock budget so a regression fails fast.
import { describe, it, expect } from "vitest";
import { cleanEntryTitle } from "./groups";
import { normalizeUrl } from "./vault";
import { cleanMrzField } from "./mrz-utils";
import { getTOTPCode } from "./totp";
import { importCsv } from "./import";

const FLOOD = 200_000;
const BUDGET_MS = 2000;

function timed<T>(fn: () => T): { value: T; ms: number } {
  const t0 = performance.now();
  const value = fn();
  return { value, ms: performance.now() - t0 };
}

describe("ReDoS hardening — adversarial floods stay linear", () => {
  it("cleanEntryTitle: whitespace flood without a passkey marker", () => {
    const s = "a" + " ".repeat(FLOOD) + "b";
    const { value, ms } = timed(() => cleanEntryTitle(s));
    expect(value).toBe(s);
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("cleanEntryTitle: passkey tail after a whitespace flood", () => {
    const s = "Work" + " ".repeat(FLOOD) + "passkey 2026";
    const { value, ms } = timed(() => cleanEntryTitle(s));
    expect(value).toBe("Work");
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("cleanEntryTitle: slash-flood host candidate with a newline", () => {
    const s = "/".repeat(FLOOD) + "\nx";
    const { value, ms } = timed(() => cleanEntryTitle(s, "https://example.com"));
    expect(value).toBe(s);
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("normalizeUrl: trailing slash flood", () => {
    const s = "https://example.com/" + "/".repeat(FLOOD) + "x";
    const { value, ms } = timed(() => normalizeUrl(s));
    expect(value).toBe("example.com/" + "/".repeat(FLOOD) + "x");
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("normalizeUrl: hash flood with a trailing newline suffix", () => {
    const s = "x" + "#".repeat(FLOOD) + "\nrest";
    const { value, ms } = timed(() => normalizeUrl(s));
    expect(value).toBe(s);
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("cleanMrzField: '<' flood", () => {
    const s = "<".repeat(FLOOD) + "X";
    const { value, ms } = timed(() => cleanMrzField(s));
    expect(value).toBe("X");
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("getTOTPCode: '=' padding flood", () => {
    const s = "A".repeat(64) + "=".repeat(FLOOD);
    const { value, ms } = timed(() => getTOTPCode(s));
    expect(typeof value).toBe("string");
    expect(ms).toBeLessThan(BUDGET_MS);
  });

  it("importCsv: TOTP/Fields notes with whitespace floods stay linear", () => {
    const note = "TOTP:" + " ".repeat(FLOOD) + "\nFields:" + " ".repeat(FLOOD) + "\n";
    const csv = `name,url,username,password,notes\n"entry","https://x.tld","u","p","${note.replace(/\n/g, "\\n")}"\n`;
    const { ms } = timed(() => importCsv(csv));
    expect(ms).toBeLessThan(BUDGET_MS);
  });
});
