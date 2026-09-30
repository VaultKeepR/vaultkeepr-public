import { describe, it, expect } from "vitest";
import { en } from "./index";
import { fr } from "./fr";

const BANNED = /[\u2014]/; // em-dash = ponctuation interdite
const EN_DASH_PUNCT = /(?<![0-9A-Za-z])\u2013|\u2013(?![0-9A-Za-z])/; // en-dash hors range (13-19, A-Z, 0-9 ok)
const DOUBLE_DASH = / -- /;

function collectStrings(
  value: unknown,
  path: string,
  out: { path: string; text: string }[] = [],
): { path: string; text: string }[] {
  if (typeof value === "string") {
    out.push({ path, text: value });
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, `${path}.${key}`, out);
    }
  }
  return out;
}

// civilityNone est une valeur de champ vide ("—"), pas de la prose — exemptée.
function withoutCivilityNone(entries: { path: string; text: string }[]) {
  return entries.filter((entry) => !entry.path.endsWith("civilityNone"));
}

describe("i18n: aucun tiret cadratin / en-dash dans TOUT l'objet i18n", () => {
  it("EN: ni em-dash ni en-dash nulle part (hors civilityNone)", () => {
    const offenders = collectStrings(en, "en")
      .filter((entry) => !entry.path.endsWith("civilityNone"))
      .filter(
        (entry) =>
          BANNED.test(entry.text) ||
          DOUBLE_DASH.test(entry.text) ||
          EN_DASH_PUNCT.test(entry.text),
      );
    expect(offenders).toEqual([]);
  });

  it("FR: ni em-dash ni en-dash nulle part (hors civilityNone)", () => {
    const offenders = collectStrings(fr, "fr")
      .filter((entry) => !entry.path.endsWith("civilityNone"))
      .filter(
        (entry) =>
          BANNED.test(entry.text) ||
          DOUBLE_DASH.test(entry.text) ||
          EN_DASH_PUNCT.test(entry.text),
      );
    expect(offenders).toEqual([]);
  });
});
