import { describe, expect, it } from "vitest";
import { cleanEntryTitle, getEntryDisplayName } from "./groups";

describe("cleanEntryTitle", () => {
  it("strips the auto-generated passkey tail when it contains a date", () => {
    expect(cleanEntryTitle("Gnosis Passkey Dec 8 2025 10:02 PM", "https://app.gnosis.io")).toBe("Gnosis");
  });

  it("keeps user titles that merely contain the word passkey", () => {
    expect(cleanEntryTitle("My Passkey Notes", "https://app.gnosis.io")).toBe("My Passkey Notes");
  });

  it("replaces digits-only titles with the domain brand", () => {
    expect(cleanEntryTitle("0571016156228", "https://mobile.free.fr")).toBe("Free");
  });

  it("replaces a host-like title with the brand and drops junk subdomains", () => {
    expect(cleanEntryTitle("x.com", "https://x.com")).toBe("X");
    expect(cleanEntryTitle("news.ycombinator.com", "https://news.ycombinator.com")).toBe("Ycombinator");
  });

  it("falls back to the domain brand for an empty title", () => {
    expect(cleanEntryTitle("", "https://accounts.firefox.com")).toBe("Firefox");
  });

  it("returns the raw title untouched when it is already clean", () => {
    expect(cleanEntryTitle("Avalaunch", "https://kyc.avalaunch.app")).toBe("Avalaunch");
  });

  it("keeps the raw title when no brand can be derived", () => {
    expect(cleanEntryTitle("0571016156228")).toBe("0571016156228");
    expect(cleanEntryTitle("", undefined, )).toBe("");
  });
});

describe("cleanEntryTitle scanner edges", () => {
  it("ignores a 'passkey' glued to the previous word", () => {
    expect(cleanEntryTitle("xpasskey Dec 8 2025", "https://other.tld")).toBe("xpasskey Dec 8 2025");
  });

  it("ignores passkey occurrences behind a newline", () => {
    const t = "line1\nline2 passkey 2025-01-01";
    expect(cleanEntryTitle(t, "https://other.tld")).toBe(t);
  });

  it("keeps the title when the tail has no separator after 'passkey'", () => {
    expect(cleanEntryTitle("X passkey", "https://other.tld")).toBe("X passkey");
  });

  it("collapses a whitespace run before a dated tail", () => {
    expect(cleanEntryTitle("X passkey   12/12", "https://other.tld")).toBe("X");
  });

  it("keeps the tail when it has no digits", () => {
    expect(cleanEntryTitle("X passkey abc", "https://other.tld")).toBe("X passkey abc");
  });

  it("handles a leading passkey with nothing before it", () => {
    expect(cleanEntryTitle("passkey 12/12", "https://other.tld")).toBe("passkey 12/12");
  });

  it("replaces a scheme+path title with the domain brand", () => {
    expect(cleanEntryTitle("https://x.tld/path", "https://x.tld")).toBe("X");
  });

  it("stops host matching at a newline boundary", () => {
    expect(cleanEntryTitle("a\nb/c", "https://other.tld")).toBe("a\nb/c");
  });

  it("uses the first structurally valid passkey match", () => {
    expect(cleanEntryTitle("z passkey one 1111 passkey two", "https://other.tld")).toBe("z");
  });
});

describe("getEntryDisplayName", () => {
  it("prefers the explicit primary url", () => {
    expect(
      getEntryDisplayName({ title: "0571016156228", username: "0571016156228", url: "", password: "x" } as never, "https://mobile.free.fr")
    ).toBe("Free");
  });
});
