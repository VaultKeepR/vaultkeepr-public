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

describe("getEntryDisplayName", () => {
  it("prefers the explicit primary url", () => {
    expect(
      getEntryDisplayName({ title: "0571016156228", username: "0571016156228", url: "", password: "x" } as never, "https://mobile.free.fr")
    ).toBe("Free");
  });
});
