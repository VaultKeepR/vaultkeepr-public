import { describe, it, expect } from "vitest";
import { scorePassword, analyzeVaultHealth } from "./passwordHealth.js";
import type { VaultEntry } from "./types.js";



describe("scorePassword", () => {
  it("scores empty password as critical (0)", () => {
    const { score, strength, issues } = scorePassword("");
    expect(score).toBe(0);
    expect(strength).toBe("critical");
    expect(issues).toContain("Empty password");
  });

  it("scores common password as critical", () => {
    const { strength, issues } = scorePassword("password");
    expect(strength).toBe("critical");
    expect(issues.some((i) => /common/i.test(i))).toBe(true);
  });

  it("scores 'qwerty' as critical", () => {
    const { strength } = scorePassword("qwerty");
    expect(strength).toBe("critical");
  });

  it("scores short lowercase as weak", () => {
    const { strength } = scorePassword("abcde");
    expect(["critical", "weak"]).toContain(strength);
  });

  it("scores medium password as fair", () => {
    const { score, strength } = scorePassword("MyPass12");
    expect(score).toBeGreaterThanOrEqual(25);
    expect(["fair", "weak"]).toContain(strength);
  });

  it("scores strong password highly", () => {
    const { score, strength } = scorePassword("X#k9!mZ$p@2wL&qR");
    expect(score).toBeGreaterThanOrEqual(75);
    expect(strength).toBe("strong");
  });

  it("detects repeated characters", () => {
    const { issues } = scorePassword("aaaaaaaaaa");
    expect(issues.some((i) => /repeat/i.test(i))).toBe(true);
  });

  it("detects predictable sequences", () => {
    const { issues } = scorePassword("123456789");
    expect(issues.some((i) => /sequence/i.test(i) || /common/i.test(i))).toBe(true);
  });

  it("rewards long passwords", () => {
    const short = scorePassword("Ab1!");
    const long = scorePassword("Ab1!Ab1!Ab1!Ab1!Ab1!");
    expect(long.score).toBeGreaterThan(short.score);
  });

  it("score is always 0-100", () => {
    const passwords = ["", "a", "password", "X#k9!mZ$p@2wL&qR", "aaaaaaaaa", "12345"];
    for (const p of passwords) {
      const { score } = scorePassword(p);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});



function makeEntry(overrides: Partial<VaultEntry> & {id: string;}): VaultEntry {
  return {
    url: "test.com",
    username: "user",
    password: "test123",
    folder: "identifiants",
    ...overrides
  } as VaultEntry;
}

describe("analyzeVaultHealth", () => {
  it("returns 100 for empty vault", () => {
    const report = analyzeVaultHealth([]);
    expect(report.overallScore).toBe(100);
    expect(report.stats.total).toBe(0);
  });

  it("correctly counts strengths", () => {
    const entries = [
    makeEntry({ id: "1", password: "X#k9!mZ$p@2wL&qR" }),
    makeEntry({ id: "2", password: "abc" }),
    makeEntry({ id: "3", password: "" })];

    const report = analyzeVaultHealth(entries);
    expect(report.stats.total).toBe(3);
    expect(report.stats.strong).toBeGreaterThanOrEqual(1);
    expect(report.stats.empty).toBe(1);
  });

  it("detects password reuse", () => {
    const sharedPw = "SharedPassword123!";
    const entries = [
    makeEntry({ id: "1", password: sharedPw, url: "site1.com" }),
    makeEntry({ id: "2", password: sharedPw, url: "site2.com" }),
    makeEntry({ id: "3", password: "UniquePassword456!", url: "site3.com" })];

    const report = analyzeVaultHealth(entries);
    expect(report.stats.reused).toBe(2);

    const reused1 = report.entries.find((e) => e.entryId === "1")!;
    const reused2 = report.entries.find((e) => e.entryId === "2")!;
    expect(reused1.reusedWith).toContain("2");
    expect(reused2.reusedWith).toContain("1");

    const unique = report.entries.find((e) => e.entryId === "3")!;
    expect(unique.reusedWith).toHaveLength(0);
  });

  it("excludes entries without a URL", () => {
    const entries = [
    makeEntry({ id: "1", password: "abc", folder: "notes", url: "" }),
    makeEntry({ id: "2", password: "X#k9!mZ$p@2wL&qR", folder: "identifiants", url: "" })];

    const report = analyzeVaultHealth(entries);

    expect(report.stats.total).toBe(0);
  });

  it("includes entries from any folder that have a URL", () => {
    const entries = [
    makeEntry({ id: "1", password: "abc", folder: "notes", url: "https://note-site.com" }),
    makeEntry({ id: "2", password: "abc", folder: "cartes", url: "https://card-site.com" }),
    makeEntry({ id: "3", password: "X#k9!mZ$p@2wL&qR", folder: "identifiants", url: "https://login.com" })];

    const report = analyzeVaultHealth(entries);

    expect(report.stats.total).toBe(3);
  });

  it("detects two-factor missing entries", () => {
    const entries = [
    makeEntry({ id: "1", password: "abc123", url: "https://example.com" }),
    makeEntry({ id: "2", password: "abc123", url: "https://example.org", totpSecret: "JBSWY3DPEHPK3PXP" })];

    const report = analyzeVaultHealth(entries);
    expect(report.stats.twoFactorMissing).toBe(1);
    const missing2fa = report.entries.find((e) => e.entryId === "1")!;
    expect(missing2fa.twoFactorMissing).toBe(true);
    expect(missing2fa.issues).toContain("Two-factor authentication not set up");
    const has2fa = report.entries.find((e) => e.entryId === "2")!;
    expect(has2fa.twoFactorMissing).toBe(false);
  });

  it("detects unsecure HTTP URLs", () => {
    const entries = [
    makeEntry({ id: "1", password: "abc123", url: "http://insecure-site.com" }),
    makeEntry({ id: "2", password: "abc123", url: "https://secure-site.com" })];

    const report = analyzeVaultHealth(entries);
    expect(report.stats.unsecureWebsites).toBe(1);
    const unsecure = report.entries.find((e) => e.entryId === "1")!;
    expect(unsecure.unsecureUrl).toBe(true);
    expect(unsecure.issues).toContain("Site does not use HTTPS");
    const secure = report.entries.find((e) => e.entryId === "2")!;
    expect(secure.unsecureUrl).toBe(false);
  });

  it("detects expired passwords", () => {
    const oldDate = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [
    makeEntry({
      id: "1",
      password: "OldPass123!",
      passwordChangedAt: new Date(oldDate).getTime(),
      passwordMaxAgeDays: 365
    })];

    const report = analyzeVaultHealth(entries);
    expect(report.stats.expired).toBe(1);
    expect(report.entries[0].expired).toBe(true);
  });

  it("overall score is average of individual scores", () => {
    const entries = [
    makeEntry({ id: "1", password: "X#k9!mZ$p@2wL&qR" }),
    makeEntry({ id: "2", password: "X#k9!mZ$p@2wL&qR" })];

    const report = analyzeVaultHealth(entries);
    const avg = Math.round(
      report.entries.reduce((s, e) => s + e.score, 0) / report.entries.length
    );
    expect(report.overallScore).toBe(avg);
  });
});