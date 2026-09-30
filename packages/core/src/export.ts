


















import type { Vault, VaultEntry, CustomField } from "./types";


export interface SkippedExport {
  id: string;
  title?: string;
  folder?: string;
  reason: string;
}

export interface ExportResult {

  content: string;

  baseName: string;

  mimeType: string;

  extension: string;

  skipped: SkippedExport[];
}

const today = () => new Date().toISOString().slice(0, 10);



interface ParsedCardMeta {
  brand: string | null;
  last4: string;
  expiry?: string;
  cvv?: string;
  cardholderName?: string;
}

function parseCardMeta(notes?: string): ParsedCardMeta | null {
  if (!notes) return null;
  try {
    const m = JSON.parse(notes);
    if (typeof m === "object" && m !== null && (m.last4 || m.brand)) {
      return m;
    }
  } catch {

  }
  return null;
}

interface ParsedIdentityMeta {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  [k: string]: unknown;
}

function parseIdentityMeta(notes?: string): ParsedIdentityMeta | null {
  if (!notes) return null;
  try {
    const m = JSON.parse(notes);
    if (typeof m === "object" && m !== null) return m as ParsedIdentityMeta;
  } catch {

  }
  return null;
}

function entryTitle(e: VaultEntry): string {
  return (
    e.title ||
    e.username ||
    e.url || (
    e.folder ? e.folder : ""));

}




function appendExtrasToNote(
notes: string | undefined,
totpSecret: string | undefined,
customFields: CustomField[] | undefined)
: string {
  const parts: string[] = [];
  if (notes) parts.push(notes);
  if (totpSecret) {
    parts.push(`TOTP: ${totpSecret}`);
  }
  if (customFields?.length) {
    const cf = customFields.
    map((f) => `${f.name}: ${f.value}`).
    join(" | ");
    parts.push(`Fields: ${cf}`);
  }
  return parts.join("\n");
}



function csvEscape(v: string): string {
  const s = v ?? "";
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}











export function exportCsv(
vault: Vault,
opts: {variant?: "chrome" | "bitwarden";} = {})
: ExportResult {
  const variant = opts.variant ?? "chrome";
  const skipped: SkippedExport[] = [];
  const rows: string[] = [];

  if (variant === "chrome") {
    rows.push("name,url,username,password,note");
    for (const e of vault.entries) {
      if (e.folder === "passkeys") {
        skipped.push({
          id: e.id,
          title: entryTitle(e),
          folder: e.folder,
          reason:
          "Passkeys cannot be exported to Chrome CSV (no portable passkey format). Kept in VaultKeepR."
        });
        continue;
      }



      const note = appendExtrasToNote(e.notes, e.totpSecret, e.customFields);
      rows.push(
        [
        csvEscape(entryTitle(e)),
        csvEscape(e.url),
        csvEscape(e.username),
        csvEscape(e.password),
        csvEscape(note)].
        join(",")
      );
    }
  } else {

    rows.push(
      "folder,favorite,type,name,notes,fields,reprompt,login_uri,login_username,login_password,login_totp"
    );
    for (const e of vault.entries) {
      const fav = e.favorite ? 1 : 0;
      const fieldsStr = (e.customFields ?? []).
      map((f) => `${f.name}:${f.value || ""}`).
      join("\n");

      if (e.folder === "passkeys") {
        skipped.push({
          id: e.id,
          title: entryTitle(e),
          folder: e.folder,
          reason: "Passkeys cannot be exported (no portable passkey format). Kept in VaultKeepR."
        });
        continue;
      }

      if (e.folder === "cartes") {
        rows.push(
          [
          csvEscape("cartes"),
          fav,
          3,
          csvEscape(entryTitle(e)),
          csvEscape(e.notes ?? ""),
          csvEscape(fieldsStr),
          0,
          csvEscape(""),
          csvEscape(e.username ?? ""),
          csvEscape(e.password ?? ""),
          csvEscape("")].
          join(",")
        );
        continue;
      }

      if (e.folder === "identites") {
        rows.push(
          [
          csvEscape("identites"),
          fav,
          4,
          csvEscape(entryTitle(e)),
          csvEscape(e.notes ?? ""),
          csvEscape(fieldsStr),
          0,
          csvEscape(""),
          csvEscape(e.username ?? ""),
          csvEscape(""),
          csvEscape("")].
          join(",")
        );
        continue;
      }

      if (e.folder === "notes") {
        rows.push(
          [
          csvEscape("notes"),
          fav,
          2,
          csvEscape(entryTitle(e)),
          csvEscape(e.notes ?? ""),
          csvEscape(fieldsStr),
          0,
          csvEscape(""),
          csvEscape(""),
          csvEscape(""),
          csvEscape("")].
          join(",")
        );
        continue;
      }



      rows.push(
        [
        csvEscape(e.folder ?? "identifiants"),
        fav,
        1,
        csvEscape(entryTitle(e)),
        csvEscape(e.notes ?? ""),
        csvEscape(fieldsStr),
        0,
        csvEscape(e.url ?? ""),
        csvEscape(e.username ?? ""),
        csvEscape(e.password ?? ""),
        csvEscape(e.totpSecret ?? "")].
        join(",")
      );
    }
  }

  return {
    content: rows.join("\r\n"),
    baseName: `vaultkeepr-export-${variant}-${today()}`,
    mimeType: "text/csv",
    extension: ".csv",
    skipped
  };
}



interface BwField {
  name: string;
  value: string;
  type: number;
}

function toBwFields(customFields?: CustomField[]): BwField[] {
  if (!customFields) return [];
  return customFields.map((f) => ({
    name: f.name,
    value: f.value,
    type: f.type === "hidden" ? 1 : 0
  }));
}





function matchTypeToBitwardenCode(matchType?: string): number | undefined {
  switch (matchType) {
    case "baseDomain":return 0;
    case "hostname":return 1;
    case "exact":return 3;
    case "never":return 5;
    default:return undefined;
  }
}






export function exportBitwardenJson(vault: Vault): ExportResult {
  const skipped: SkippedExport[] = [];
  const items: Record<string, unknown>[] = [];

  for (const e of vault.entries) {
    if (e.folder === "passkeys") {
      skipped.push({
        id: e.id,
        title: entryTitle(e),
        folder: e.folder,
        reason: "Passkeys cannot be exported (no portable passkey format). Kept in VaultKeepR."
      });
      continue;
    }

    const name = entryTitle(e);
    const fields = toBwFields(e.customFields);

    if (e.folder === "cartes") {
      const m = parseCardMeta(e.notes);
      const expiry = m?.expiry ?? "";
      const [expMonth, expYear] = expiry.includes("/") ?
      [expiry.slice(0, 2), expiry.slice(3, 5)] :
      ["", ""];
      items.push({
        type: 3,
        name,
        notes: e.notes ?? "",
        favorite: !!e.favorite,
        fields,
        card: {
          cardholderName: m?.cardholderName ?? "",
          number: e.password ?? "",
          brand: m?.brand ?? "",
          expMonth,
          expYear,
          code: m?.cvv ?? ""
        }
      });
      continue;
    }

    if (e.folder === "identites") {
      const m = parseIdentityMeta(e.notes);
      items.push({
        type: 4,
        name,
        notes: e.notes ?? "",
        favorite: !!e.favorite,
        fields,
        identity: {
          firstName: m?.firstName ?? "",
          lastName: m?.lastName ?? "",
          username: m?.username ?? e.username ?? "",
          email: m?.email ?? "",
          phone: m?.phone ?? "",
          address1: m?.address ?? "",
          city: m?.city ?? "",
          state: m?.state ?? "",
          postalCode: m?.postalCode ?? "",
          country: m?.country ?? "",
          company: m?.company ?? ""
        }
      });
      continue;
    }

    if (e.folder === "notes") {
      items.push({
        type: 2,
        name,
        notes: e.notes ?? "",
        favorite: !!e.favorite,
        fields
      });
      continue;
    }


    items.push({
      type: 1,
      name,
      notes: e.notes ?? "",
      favorite: !!e.favorite,
      fields,
      login: {
        username: e.username ?? "",
        password: e.password ?? "",
        totp: e.totpSecret ?? "",
        uris: e.urls && e.urls.length > 0 ?
        e.urls.map((u) => ({ uri: u.uri, match: matchTypeToBitwardenCode(u.matchType) })) :
        e.url ?
        [{ uri: e.url }] :
        []
      }
    });
  }

  const payload = {
    encrypted: false,
    version: 1,
    items
  };

  return {
    content: JSON.stringify(payload, null, 2),
    baseName: `vaultkeepr-export-bitwarden-${today()}`,
    mimeType: "application/json",
    extension: ".json",
    skipped
  };
}



interface PpExtraField {
  fieldName: string;
  type: "text" | "hidden" | "totp";
  data: {content: string;totpUri?: string;};
}

function toPpExtraFields(
customFields?: CustomField[],
totpSecret?: string)
: PpExtraField[] {
  const out: PpExtraField[] = [];
  if (totpSecret) {
    out.push({
      fieldName: "totp",
      type: "totp",
      data: {
        content: "",
        totpUri: `otpauth://totp/VaultKeepR?secret=${totpSecret}&issuer=VaultKeepR`
      }
    });
  }
  for (const f of customFields ?? []) {
    out.push({
      fieldName: f.name,
      type: f.type === "hidden" ? "hidden" : "text",
      data: { content: f.value }
    });
  }
  return out;
}






export function exportProtonPassJson(vault: Vault): ExportResult {
  const skipped: SkippedExport[] = [];
  const items: Record<string, unknown>[] = [];

  for (const e of vault.entries) {
    if (e.folder === "passkeys") {
      skipped.push({
        id: e.id,
        title: entryTitle(e),
        folder: e.folder,
        reason: "Passkeys cannot be exported (no portable passkey format). Kept in VaultKeepR."
      });
      continue;
    }

    const name = entryTitle(e);
    const note = e.notes ?? "";
    const extraFields = toPpExtraFields(e.customFields, e.totpSecret);

    if (e.folder === "cartes") {
      const m = parseCardMeta(e.notes);
      items.push({
        type: "creditCard",
        data: {
          content: {
            cardholderName: m?.cardholderName ?? "",
            number: e.password ?? "",
            expirationDate: m?.expiry ?? "",
            verificationNumber: m?.cvv ?? ""
          },
          metadata: { name, note: "", itemUuid: e.id },
          extraFields
        }
      });
      continue;
    }

    if (e.folder === "identites") {
      const m = parseIdentityMeta(e.notes);
      items.push({
        type: "identity",
        data: {
          content: {
            firstName: m?.firstName ?? "",
            lastName: m?.lastName ?? "",
            email: m?.email ?? "",
            phoneNumber: m?.phone ?? "",
            streetAddress: m?.address ?? "",
            city: m?.city ?? "",
            zipOrPostalCode: m?.postalCode ?? "",
            countryOrRegion: m?.country ?? ""
          },
          metadata: { name, note: "", itemUuid: e.id },
          extraFields
        }
      });
      continue;
    }

    if (e.folder === "notes") {
      items.push({
        type: "note",
        data: {
          content: { note },
          metadata: { name, note: "", itemUuid: e.id },
          extraFields
        }
      });
      continue;
    }


    const urls: string[] = [];

    if (e.url) urls.push(e.url);

    if (e.urls) {
      for (const u of e.urls) {
        if (u.uri && u.matchType !== "never" && !urls.includes(u.uri)) {
          urls.push(u.uri);
        }
      }
    }

    for (const f of e.customFields ?? []) {
      if (f.type === "url" && f.value && !urls.includes(f.value)) urls.push(f.value);
    }
    items.push({
      type: "login",
      data: {
        content: {
          itemUsername: e.username ?? "",
          password: e.password ?? "",
          urls,
          totpUri: e.totpSecret ?
          `otpauth://totp/VaultKeepR?secret=${e.totpSecret}&issuer=VaultKeepR` :
          ""
        },
        metadata: { name, note, itemUuid: e.id },
        extraFields: toPpExtraFields(
          (e.customFields ?? []).filter((f) => f.type !== "url"),
          undefined
        )
      }
    });
  }

  const payload = {
    version: "1.0.0",
    vaults: {
      Default: {
        name: "VaultKeepR",
        description: "Exported from VaultKeepR",
        items
      }
    }
  };

  return {
    content: JSON.stringify(payload, null, 2),
    baseName: `vaultkeepr-export-protonpass-${today()}`,
    mimeType: "application/json",
    extension: ".json",
    skipped
  };
}