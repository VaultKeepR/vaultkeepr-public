import { unzipSync, strFromU8 } from "fflate";
import { createEmptyVault, createEntry } from "./vault";
import type { CustomField, Vault } from "./types";
import type { SkippedItem } from "./import";
import { getCardBrand, getLast4, CARD_BRAND_LABELS } from "./cards";


function extractTotp(
raw: string)
: {secret: string;algorithm?: string;} | undefined {
  const v = (raw ?? "").trim();
  if (!v) return undefined;
  if (v.includes("secret=")) {
    const m = v.match(/secret=([A-Z2-7]+)/i);
    if (m?.[1]) {
      let algorithm: string | undefined;
      try {
        const u = new URL(v);
        const a = (u.searchParams.get("algorithm") ?? "SHA1").
        toUpperCase().
        replace(/[^A-Z0-9]/g, "");
        if (a === "SHA256") algorithm = "SHA-256";else
        if (a === "SHA512") algorithm = "SHA-512";
      } catch {

      }
      return { secret: m[1], algorithm };
    }
  }
  if (/^[A-Z2-7]{16,}$/i.test(v)) return { secret: v.toUpperCase() };
  return undefined;
}

interface PuxLoginField {
  id?: string;
  name?: string;
  value?: string;

  designation?: string;

  fieldType?: string;
}

interface PuxSectionField {
  id?: string;
  title?: string;
  value?: string;

  kind?: string;
  n?: string;
  t?: string;
  v?: string;
  k?: string;
}

interface PuxSection {
  id?: string;
  title?: string;
  fields?: PuxSectionField[];
}

interface PuxItem {
  uuid?: string;
  favIndex?: number;
  trashed?: boolean;
  categoryUuid?: string;
  details?: {
    loginFields?: PuxLoginField[];
    notesPlain?: string;
    sections?: PuxSection[];
  };
  overview?: {
    title?: string;
    urls?: Array<{url?: string;label?: string;} | string>;
    tags?: string[];
  };
}

interface PuxVault {
  attrs?: {name?: string;desc?: string;};
  items?: PuxItem[];
}

interface PuxAccount {
  attrs?: Record<string, unknown>;
  vaults?: PuxVault[];
}

interface PuxExport {
  version?: string;
  accounts?: PuxAccount[];
}


export function isOnePassword1Pux(data: Uint8Array): boolean {

  return (
    data.length > 4 &&
    data[0] === 0x50 &&
    data[1] == 0x4b &&
    data[2] === 0x03 &&
    data[3] === 0x04);

}















export function import1Pux(
data: Uint8Array,
skipped?: SkippedItem[])
: Vault {
  if (!isOnePassword1Pux(data)) {
    throw new Error("Format 1PUX invalide (pas une archive ZIP).");
  }

  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(data);
  } catch {
    throw new Error("Décompression 1PUX échouée (archive corrompue).");
  }

  const jsonKey = Object.keys(files).find((k) =>
  k.endsWith("export.unencrypted.json")
  );
  if (!jsonKey) {
    throw new Error(
      "Export 1PUX invalide : `export.unencrypted.json` introuvable dans l'archive."
    );
  }

  let parsed: PuxExport;
  try {
    parsed = JSON.parse(strFromU8(files[jsonKey])) as PuxExport;
  } catch {
    throw new Error("Export 1PUX invalide : JSON illisible.");
  }

  const vault = createEmptyVault();
  const accounts = parsed.accounts ?? [];

  for (const account of accounts) {
    const vaults = account.vaults ?? [];
    for (const v of vaults) {
      const items = v.items ?? [];
      for (const item of items) {
        if (item.trashed) continue;
        pushPuxItem(vault, item, skipped);
      }
    }
  }

  return vault;
}

function pushPuxItem(
vault: Vault,
item: PuxItem,
skipped?: SkippedItem[])
: void {
  const details = item.details ?? {};
  const overview = item.overview ?? {};
  const title = (overview.title ?? "").trim();
  const notes = (details.notesPlain ?? "").trim();
  const loginFields = details.loginFields ?? [];
  const fav = (item.favIndex ?? 0) > 0;


  let username = "";
  let password = "";
  let cardNumber = "";
  const consumedFieldIds = new Set<string>();
  for (const lf of loginFields) {
    const id = lf.id ?? lf.name ?? "";
    const des = (lf.designation ?? "").toLowerCase();
    const ft = (lf.fieldType ?? "").toUpperCase();
    const val = lf.value ?? "";
    if (des === "username" || des === "email") {
      if (val) {
        username = val;
        consumedFieldIds.add(id);
      }
    } else if (des === "password" || ft === "P") {
      if (val) {
        password = val;
        consumedFieldIds.add(id);
      }
    } else if (/^\d{13,}$/.test(val.replace(/\s|-/g, ""))) {

      cardNumber = val.replace(/\D/g, "");
      consumedFieldIds.add(id);
    }
  }


  const rawUrls = overview.urls ?? [];
  const urls = rawUrls.
  map((u) => typeof u === "string" ? u : u?.url ?? "").
  filter((u) => u);
  const url = urls[0] ?? "";
  const extraUrls = urls.slice(1);


  let totpSecret: string | undefined;
  let totpAlgorithm: string | undefined;
  const customFields: CustomField[] = [];
  const sections = details.sections ?? [];
  for (const section of sections) {
    for (const sf of section.fields ?? []) {
      const label = (sf.title ?? sf.t ?? "").toLowerCase();
      const kind = (sf.kind ?? sf.k ?? "").toUpperCase();
      const val = sf.value ?? sf.v ?? "";
      if (!val) continue;
      const isTotp =
      kind === "TOTP" ||
      label.includes("one-time") ||
      label.includes("totp") ||
      label.includes("2fa") ||
      label.includes("otp");
      if (isTotp && !totpSecret) {
        const t = extractTotp(val);
        if (t) {
          totpSecret = t.secret;
          totpAlgorithm = t.algorithm;
          continue;
        }
      }
      customFields.push({
        name: (sf.title ?? sf.t ?? "").trim() || `field${customFields.length}`,
        value: val,
        type: kind === "CONCEALED" || kind === "PASSWORD" ? "hidden" : "text"
      });
    }
  }


  for (const lf of loginFields) {
    const id = lf.id ?? lf.name ?? "";
    if (consumedFieldIds.has(id)) continue;
    const name = (lf.name ?? "").trim();
    const val = lf.value ?? "";
    if (!name && !val) continue;
    const ft = (lf.fieldType ?? "").toUpperCase();
    customFields.push({
      name: name || `field${customFields.length}`,
      value: val,
      type: ft === "P" ? "hidden" : "text"
    });
  }


  for (const u of extraUrls) {
    customFields.push({ name: "url", value: u, type: "url" });
  }



  if (cardNumber && cardNumber.length >= 13 && !password) {
    const brand = getCardBrand(cardNumber);
    const last4 = getLast4(cardNumber);
    const brandLabel = brand ? CARD_BRAND_LABELS[brand] : "Card";
    vault.entries.push(
      createEntry({
        url: "",
        username: `${brandLabel} •••• ${last4}`,
        password: cardNumber,
        notes: JSON.stringify({ brand, last4 }),
        notesMasked: true,
        folder: "cartes",
        title: title || undefined,
        favorite: fav || undefined,
        customFields: customFields.length ? customFields : undefined
      })
    );
    return;
  }


  if (!password && !urls.length && notes) {
    vault.entries.push(
      createEntry({
        url: "",
        username: "",
        password: "",
        title: title || undefined,
        notes: notes || undefined,
        folder: "notes",
        favorite: fav || undefined,
        customFields: customFields.length ? customFields : undefined
      })
    );
    return;
  }


  if (!title && !notes && !url && !username && !password) {
    skipped?.push({
      source: "1Password 1PUX",
      type: item.categoryUuid ?? "unknown",
      name: title,
      reason: "Empty item (no usable fields)"
    });
    return;
  }

  vault.entries.push(
    createEntry({
      url,
      username,
      password,
      notes: notes || undefined,
      totpSecret,
      totpAlgorithm,
      title: title || undefined,
      folder: "identifiants",
      favorite: fav || undefined,
      customFields: customFields.length ? customFields : undefined
    })
  );
}