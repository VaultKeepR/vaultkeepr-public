# @vaultkeepr/i18n

Internationalization for VaultKeepR clients: message registration and translation lookup with parameter interpolation. Ships English and French.

## Install

```bash
npm install @vaultkeepr/i18n
```

## Usage

```ts
import { en, fr, registerMessages, t } from "@vaultkeepr/i18n";

// English is the built-in fallback; register French (or any custom locale)
registerMessages("fr", fr);

t("fr", "vault.unlock.title");
t("en", "vault.count", { count: 42 }); // {param} interpolation

// Custom locales
import type { Translations } from "@vaultkeepr/i18n";
registerMessages("es", { "vault.title": "Caja fuerte" } as unknown as Translations);
```

API: `registerMessages(locale, translations)`, `getTranslations(locale)` (falls back to `en`), `t(locale, key, params?)` (dot-path lookup, English fallback, `{param}` interpolation).

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.