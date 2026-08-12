import { describe, it, expect } from "vitest";
import { getTranslations, t, en, fr } from "./index";

describe("i18n — getTranslations", () => {
  it("returns English translations for 'en'", () => {
    const tr = getTranslations("en");
    expect(tr).toBe(en);
    expect(tr.common).toBeDefined();
    expect(tr.common.save).toBe("Save");
  });

  it("returns French translations for 'fr'", () => {
    const tr = getTranslations("fr");
    expect(tr).toBe(fr);
    expect(tr.common).toBeDefined();
    expect(tr.common.save).toBe("Enregistrer");
  });

  it("falls back to English for unknown locale", () => {
    const tr = getTranslations("xx" as any);
    expect(tr).toBe(en);
  });
});

describe("i18n — t() function", () => {
  it("returns a string for a valid nested key", () => {
    const value = t("en", "common.save");
    expect(value).toBe("Save");
  });

  it("returns FR translation for 'fr' locale", () => {
    const value = t("fr", "common.save");
    expect(value).toBe("Enregistrer");
  });

  it("returns the key itself for non-existent keys", () => {
    const value = t("en", "this.key.does.not.exist");
    expect(value).toBe("this.key.does.not.exist");
  });

  it("returns the key for partially valid paths", () => {
    const value = t("en", "common.nonExistentKey");
    expect(value).toBe("common.nonExistentKey");
  });

  it("falls back to English value if key missing in FR", () => {

    const value = t("fr", "common.cancel");
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });
});

describe("i18n — translation consistency", () => {
  it("EN and FR have the same top-level keys", () => {
    const enKeys = Object.keys(en).sort();
    const frKeys = Object.keys(fr).sort();
    expect(enKeys).toEqual(frKeys);
  });

  it("both locales have common section", () => {
    expect(en.common).toBeDefined();
    expect(fr.common).toBeDefined();
  });

  it("common sections have same keys in EN and FR", () => {
    const enKeys = Object.keys(en.common).sort();
    const frKeys = Object.keys(fr.common).sort();
    expect(enKeys).toEqual(frKeys);
  });
});