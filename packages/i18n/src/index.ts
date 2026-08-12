export type { Locale, Translations } from "./translations";
export { en, fr } from "./translations";

import type { Locale, Translations } from "./translations";
import { en, fr } from "./translations";

const translations: Record<Locale, Translations> = { en, fr };

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? en;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: unknown = translations[locale] ?? en;
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