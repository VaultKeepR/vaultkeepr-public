export type { Locale, Translations } from "./translations";
export { en } from "./translations";
export { fr } from "./fr";

import type { Locale, Translations } from "./translations";
import { en } from "./translations";

const messages: Partial<Record<Locale, Translations>> = {};

export function registerMessages(locale: Locale, value: Translations): void {
  messages[locale] = value;
}

export function getTranslations(locale: Locale): Translations {
  return messages[locale] ?? en;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: unknown = getTranslations(locale);
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
    if (value === undefined) {

      value = en;
      for (const kk of keys) {
        value = (value as Record<string, unknown>)?.[kk];
      }
      break;
    }
  }

  let result = typeof value === "string" ? value : key;

  if (params && typeof result === "string") {
    Object.entries(params).forEach(([k, v]) => {
      result = (result as string).replace(`{${k}}`, String(v));
    });
  }

  return result;
}
