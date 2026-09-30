



import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { deriveKeyFromPasswordArgon2, generateSaltArgon2 } from "./kdf-argon2";
import { secureCompare } from "./secure";

import type { Vault } from "./types";
import { createEmptyVault, createEntry } from "./vault";
import { isEncryptedExport, importEncryptedVault } from "./encrypted-export";
import { getCardBrand, getLast4, CARD_BRAND_LABELS } from "./cards";
import { isOnePassword1Pux, import1Pux } from "./import-1pux";
import { isKeePassXml, importKeePassXml } from "./import-keepass-xml";
import { isLastPassExport, importLastPass } from "./import-lastpass";
import { isDashlaneCsv, isDashlaneJson, importDashlaneCsv, importDashlaneJson } from "./import-dashlane";
import { isRoboFormExport, importRoboForm } from "./import-roboform";
import { isKeeperCsv, isKeeperJson, importKeeperCsv, importKeeperJson } from "./import-keeper";
import { isEnpassCsv, isEnpassJson, importEnpassCsv, importEnpassJson } from "./import-enpass";


export interface SkippedItem {
  source: string;
  type: string;
  name: string;
  reason: string;
}

interface BitwardenField {
  name?: string;
  value?: string;
  type?: number;
}

interface BitwardenLogin {
  type?: number;
  name?: string;
  notes?: string;
  favorite?: boolean;
  login?: {
    username?: string;
    password?: string;
    uris?: Array<{uri?: string;}>;
    totp?: string;
  };
  card?: {
    cardholderName?: string;
    number?: string;
    expMonth?: string;
    expYear?: string;
    code?: string;
    brand?: string;
  };
  identity?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phone?: string;
    address1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    company?: string;
  };
  fields?: BitwardenField[];
}

interface BitwardenExport {
  encrypted?: boolean;
  items?: BitwardenLogin[];
}

interface ProtonPassVault {
  name?: string;
  items?: ProtonPassItem[];
}

interface ProtonPassItemContent {
  itemUsername?: string;
  itemEmail?: string;
  item_username?: string;
  item_email?: string;
  login_email?: string;
  username?: string;
  email?: string;
  password?: string;
  urls?: string[] | string;
  totpUri?: string;
  totp_uri?: string;
  note?: string;
}

interface ProtonPassExtraField {
  field_name?: string;
  fieldName?: string;
  content?: {text?: {content?: string;};hidden?: {content?: string;};};
}

interface ProtonPassItem {
  type?: string | number;

  aliasEmail?: string;
  data?: {
    type?: string | number;
    content?: ProtonPassItemContent;
    metadata?: {name?: string;note?: string;itemUuid?: string;};
    extra_fields?: ProtonPassExtraField[];
    extraFields?: ProtonPassExtraField[];
  };
  content?: ProtonPassItemContent;
  extra_fields?: ProtonPassExtraField[];
  extraFields?: ProtonPassExtraField[];
}

interface ProtonPassExport {
  vaults?: Record<string, ProtonPassVault>;
}

export function isOnePasswordPif(content: string): boolean {
  const t = content.trim();
  if (t.includes('"items"') && t.includes('"login"') && t.includes('"type"'))
  return false;
  if (t.includes('"vaults"') && /^\s*\{\s*"vaults"\s*:/.test(t)) return false;
  return /"typeName"\s*:\s*"(?:webforms\.WebForm|passwords\.Password)"/i.test(
    t
  );
}

export function import1PasswordPif(content: string): Vault {
  const vault = createEmptyVault();
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.startsWith("{")) continue;
    let obj: Record<string, unknown>;
    try {
      obj = JSON.parse(line) as Record<string, unknown>;
    } catch {
      continue;
    }
    const typeName = String(obj.typeName ?? "");
    const location =
    typeof obj.location === "string" ? obj.location.trim() : "";
    const sc = obj.secureContents as Record<string, unknown> | undefined;

    if (/webforms\.WebForm/i.test(typeName)) {
      let url =
      typeof obj.overviewURL === "string" ?
      obj.overviewURL.trim() :
      location;

      const urls = Array.isArray(sc?.URLs) ?
      sc.URLs as Array<{url?: string;label?: string;}> :
      [];
      if (!url && urls.length > 0) {
        url = urls[0].url ?? "";
      }
      let username = "";
      let password = "";
      let totpSecret: string | undefined;
      let notes =
      typeof sc?.notesPlain === "string" ? sc.notesPlain.trim() : "";
      const fields = Array.isArray(sc?.fields) ?
      sc.fields as Record<string, unknown>[] :
      [];
      for (const f of fields) {
        const des = String(f.designation ?? f.name ?? "").toLowerCase();
        const val = typeof f.value === "string" ? f.value : "";
        if (
        des === "username" ||
        des === "email" ||
        des === "user" ||
        des === "login")
        {
          if (val) username = val;
        } else if (des === "password" || des === "passwd") {
          if (val) password = val;
        } else if (
        des === "url" ||
        des === "website" ||
        des === "hostname" ||
        String(f.name) === "URL")
        {
          if (val) url = val;
        }
      }

      const sections = Array.isArray(sc?.sections) ?
      sc.sections as Record<string, unknown>[] :
      [];
      for (const section of sections) {
        const sFields = Array.isArray(section?.fields) ?
        section.fields as Record<string, unknown>[] :
        [];
        for (const sf of sFields) {
          const sfKind = String(sf?.k ?? sf?.inputType ?? "").toUpperCase();
          const sfLabel = String(sf?.t ?? sf?.n ?? "").toLowerCase();
          const sfVal = typeof sf?.v === "string" ? sf.v : "";
          if (
          sfKind === "TOTP" ||
          sfLabel.includes("one-time") ||
          sfLabel.includes("totp") ||
          sfLabel.includes("2fa") ||
          sfLabel.includes("otp"))
          {
            const extracted = extractTotpSecret(sfVal);
            if (extracted) {
              totpSecret = extracted.secret;
              break;
            }

            if (/^[A-Z2-7]{16,}$/i.test(sfVal.trim())) {
              totpSecret = sfVal.trim().toUpperCase();
              break;
            }
          }
        }
        if (totpSecret) break;
      }
      if (!url && !username && !password) continue;

      const entryUrls = urls.
      filter((u) => u.url?.trim()).
      map((u) => ({ uri: u.url!.trim() }));
      vault.entries.push(
        createEntry({
          url,
          username,
          password,
          notes: notes || undefined,
          totpSecret,
          folder: "identifiants",
          ...(entryUrls.length > 0 ? { urls: entryUrls } : {})
        })
      );
    } else if (/passwords\.Password/i.test(typeName)) {
      const password =
      typeof sc?.password === "string" ?
      sc.password :
      typeof (sc as {fields?: {value?: string;}[];})?.fields?.[0]?.
      value === "string" ?
      String(
        (sc as {fields: {value?: string;}[];}).fields[0]?.value ?? ""
      ) :
      "";
      const username =
      typeof sc?.username === "string" ?
      sc.username :
      typeof sc?.account === "string" ?
      sc.account :
      "";
      const url = location || (typeof sc?.url === "string" ? sc.url : "");
      const notes =
      typeof sc?.notesPlain === "string" ? sc.notesPlain.trim() : "";
      if (!url && !username && !password) continue;
      vault.entries.push(
        createEntry({
          url,
          username,
          password,
          notes: notes || undefined
        })
      );
    } else if (/securenotes\.SecureNote/i.test(typeName)) {

      const title = (typeof obj.title === "string" ? obj.title : "").trim();
      const noteText =
      typeof sc?.notesPlain === "string" ? sc.notesPlain.trim() : "";
      if (!title && !noteText) continue;
      vault.entries.push(
        createEntry({
          url: "",
          username: title,
          password: "",
          title: title || undefined,
          notes: noteText || undefined,
          folder: "notes"
        })
      );
    } else if (/identities\.Identity/i.test(typeName)) {

      const title = (typeof obj.title === "string" ? obj.title : "").trim();
      const firstName = String(sc?.firstname ?? "").trim();
      const lastName = String(sc?.lastname ?? "").trim();
      const fullName = [firstName, lastName].filter(Boolean).join(" ") || title;
      if (!fullName) continue;
      const identityData: Record<string, string> = {
        firstName,
        lastName,
        email: String(sc?.email ?? "").trim(),
        phone: String(sc?.homephone ?? sc?.phone ?? "").trim()
      };
      const addr = sc?.address as Record<string, unknown> | undefined;
      if (addr) {
        identityData.address = String(addr.street ?? "").trim();
        identityData.city = String(addr.city ?? "").trim();
        identityData.postalCode = String(addr.zip ?? "").trim();
        identityData.country = String(addr.country ?? "").trim();
      }
      vault.entries.push(
        createEntry({
          url: "",
          username: fullName,
          password: "",
          title: title || undefined,
          notes: JSON.stringify(identityData),
          folder: "identites"
        })
      );
    } else if (/wallet\.(?:financial\.)?(?:Credit)?Card/i.test(typeName)) {

      const title = (typeof obj.title === "string" ? obj.title : "").trim();
      const ccnum = String(sc?.ccnum ?? "").replace(/\D/g, "");
      if (ccnum.length < 13) continue;
      const brand = getCardBrand(ccnum);
      const last4 = getLast4(ccnum);
      const brandLabel = brand ? CARD_BRAND_LABELS[brand] : "Card";
      const rawExpiry = String(sc?.expiry ?? "");
      const expiry = /^(\d{2})(\d{2})$/.test(rawExpiry) ?
      rawExpiry.slice(0, 2) + "/" + rawExpiry.slice(2) :
      rawExpiry;
      vault.entries.push(
        createEntry({
          url: "",
          username: `${brandLabel} •••• ${last4}`,
          password: ccnum,
          title: title || undefined,
          notes: JSON.stringify({
            brand,
            last4,
            expiry,
            cvv: String(sc?.cvv ?? "").trim(),
            cardholderName: String(sc?.cardholder ?? "").trim()
          }),
          notesMasked: true,
          folder: "cartes"
        })
      );
    }
  }
  return vault;
}

export function importBitwardenJson(json: string): Vault {
  const data = JSON.parse(json) as BitwardenExport;
  if (data.encrypted) {
    throw new Error(
      "Encrypted Bitwarden export not supported. Please export unencrypted JSON."
    );
  }

  const vault = createEmptyVault();
  const items = data.items ?? [];

  for (const item of items) {
    const favorite = !!item.favorite;
    const title = item.name || undefined;


    const customFields: {name: string;value: string;type: "text" | "hidden";}[] = [];
    if (item.fields?.length) {
      for (const f of item.fields) {
        if (f?.name && f?.value !== undefined) {
          customFields.push({
            name: f.name,
            value: String(f.value ?? ""),
            type: f.type === 1 ? "hidden" : "text"
          });
        }
      }
    }


    if (item.card && item.card.number) {
      const cardNum = item.card.number.replace(/\D/g, "");
      if (cardNum.length < 13) continue;
      const brand = getCardBrand(cardNum);
      const last4 = getLast4(cardNum);
      const brandLabel = brand ? CARD_BRAND_LABELS[brand] : "Card";
      const expMonth = String(item.card.expMonth ?? "").padStart(2, "0");
      const expYear = String(item.card.expYear ?? "").slice(-2);
      const expiry = expMonth && expYear ? `${expMonth}/${expYear}` : "";
      vault.entries.push(
        createEntry({
          url: "",
          username: `${brandLabel} •••• ${last4}`,
          password: cardNum,
          title,
          notes: JSON.stringify({
            brand,
            last4,
            expiry,
            cvv: (item.card.code ?? "").trim(),
            cardholderName: (item.card.cardholderName ?? "").trim()
          }),
          notesMasked: true,
          folder: "cartes",
          favorite,
          ...(customFields.length > 0 ? { customFields } : {})
        })
      );
      continue;
    }


    if (item.identity) {
      const ident = item.identity;
      const fullName = [ident.firstName, ident.lastName].filter(Boolean).join(" ") || ident.username || title || "";
      vault.entries.push(
        createEntry({
          url: "",
          username: fullName,
          password: "",
          title: title ?? fullName,
          notes: JSON.stringify({
            firstName: ident.firstName ?? "",
            lastName: ident.lastName ?? "",
            email: ident.email ?? "",
            phone: ident.phone ?? "",
            address: ident.address1 ?? "",
            city: ident.city ?? "",
            state: ident.state ?? "",
            postalCode: ident.postalCode ?? "",
            country: ident.country ?? "",
            company: ident.company ?? ""
          }),
          folder: "identites",
          favorite,
          ...(customFields.length > 0 ? { customFields } : {})
        })
      );
      continue;
    }


    if (!item.login) {
      if (title || item.notes) {
        vault.entries.push(
          createEntry({
            url: "",
            username: "",
            password: "",
            title,
            notes: item.notes || undefined,
            folder: "notes",
            favorite,
            ...(customFields.length > 0 ? { customFields } : {})
          })
        );
      }
      continue;
    }


    const url = item.login.uris?.[0]?.uri ?? "";

    const urls = (item.login.uris ?? []).
    filter((u) => u.uri?.trim()).
    map((u) => {
      const result: {uri: string;matchType?: "exact" | "hostname" | "baseDomain" | "never";} = { uri: u.uri!.trim() };


      const mt = (u as Record<string, unknown>).match;
      if (mt === 0 || mt === undefined) result.matchType = "baseDomain";else
      if (mt === 1) result.matchType = "hostname";else
      if (mt === 3) result.matchType = "exact";else
      if (mt === 5) result.matchType = "never";

      return result;
    });
    let username = item.login.username ?? "";
    if (!username && item.fields?.length) {
      const fieldNames = [
      "username",
      "email",
      "login",
      "user",
      "identifiant",
      "mail"];

      for (const f of item.fields) {
        const n = (f?.name ?? "").toLowerCase();
        if (fieldNames.some((fn) => n === fn || n.includes(fn))) {
          const v = f?.value?.trim();
          if (v) {
            username = v;
            break;
          }
        }
      }
    }
    if (!username && item.name?.includes("@")) username = item.name.trim();
    const password = item.login.password ?? "";


    let totpSecret: string | undefined;
    let totpAlgorithm: string | undefined;
    if (item.login.totp) {
      const raw = item.login.totp.trim();

      const fromUri = extractTotpSecret(raw);
      if (fromUri) {
        totpSecret = fromUri.secret;
        totpAlgorithm = fromUri.algorithm;
      } else if (/^[A-Z2-7]{16,}$/i.test(raw)) {
        totpSecret = raw.toUpperCase();
      }
    }

    if (!url && !username && !password) continue;

    vault.entries.push(
      createEntry({
        url,
        username,
        password,
        title,
        notes: item.notes || undefined,
        totpSecret,
        totpAlgorithm,
        favorite,
        folder: "identifiants",
        ...(urls.length > 0 ? { urls } : {}),
        ...(customFields.length > 0 ? { customFields } : {})
      })
    );
  }

  return vault;
}

function normalizeCsvHeaderCell(h: string): string {
  return h.
  replace(/^\ufeff/, "").
  replace(/^["']|["']$/g, "").
  trim().
  toLowerCase();
}

function detectCsvDelimiter(headerLine: string): "," | ";" | "\t" {
  const tabs = (headerLine.match(/\t/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  const semis = (headerLine.match(/;/g) || []).length;
  if (tabs >= Math.max(commas, semis) && tabs > 0) return "\t";
  if (semis > commas) return ";";
  return ",";
}

function parseDelimitedLine(
line: string,
delimiter: "," | ";" | "\t")
: string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (!inQuotes && c === "\r") {
      continue;
    } else if (
    !inQuotes && (
    delimiter === "\t" ? c === "\t" : c === delimiter))
    {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

function headerMatchesUrl(n: string): boolean {
  if (
  n === "url" ||
  n === "website" ||
  n === "websites" ||
  n === "site" ||
  n === "domain" ||
  n === "hostname" ||
  n === "host" ||
  n === "login_uri" ||
  n === "login_url")

  return true;
  if (n.includes("url") && !n.includes("username")) return true;
  if (
  n.includes("website") ||
  n.includes("web address") ||
  n.includes("primary url") ||
  n.includes("primary_url"))

  return true;
  return false;
}

function headerMatchesUser(n: string): boolean {
  if (
  n === "username" ||
  n === "user" ||
  n === "login" ||
  n === "email" ||
  n === "e-mail" ||
  n === "e mail" ||
  n === "userid" ||
  n === "account")

  return true;
  if (n.includes("user name") || n.includes("username")) return true;
  if (n.includes("login") && n.includes("user")) return true;
  if (n.includes("email") && !n.includes("password")) return true;
  return false;
}

function headerMatchesPassword(n: string): boolean {
  if (
  n === "password" ||
  n === "passwd" ||
  n === "pass" ||
  n === "mot de passe")

  return true;
  if (
  n.includes("password") &&
  !n.includes("username") &&
  !n.includes("strength") &&
  !n.includes("history"))

  return true;
  return false;
}

function headerMatchesTotp(n: string): boolean {
  if (
  n === "totp" ||
  n === "totp_secret" ||
  n === "totpsecret" ||
  n === "otp" ||
  n === "2fa" ||
  n === "otpauth" ||
  n === "authenticator" ||
  n === "otpsecret")

  return true;
  if (
  n.includes("totp") ||
  n.includes("one-time") ||
  n.includes("otp") ||
  n.includes("2fa") ||
  n.includes("authenticator"))

  return true;
  return false;
}

function headerMatchesName(n: string): boolean {
  return n === "name" || n === "title" || n === "treasure_name";
}



function parseCsvRows(
raw: string,
delimiter: "," | ";" | "\t")
: string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {

        currentCell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        currentCell += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === "\r") {

        if (next === "\n") continue;
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else if (c === "\n") {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else if (delimiter === "\t" ? c === "\t" : c === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else {
        currentCell += c;
      }
    }
  }


  currentRow.push(currentCell.trim());
  if (currentRow.length > 1 || currentRow.length === 1 && currentRow[0] !== "") {
    rows.push(currentRow);
  }

  return rows;
}

function findCsvColumnIndices(headers: string[]): {
  urlIdx: number;
  userIdx: number;
  passIdx: number;
  totpIdx: number;
  notesIdx: number;
  nameIdx: number;
  folderIdx: number;
} {
  const normalized = headers.map(normalizeCsvHeaderCell);
  const urlIdx = normalized.findIndex(headerMatchesUrl);
  const userIdx = normalized.findIndex(headerMatchesUser);
  const passIdx = normalized.findIndex(headerMatchesPassword);
  const totpIdx = normalized.findIndex(headerMatchesTotp);
  const notesIdx = normalized.findIndex(
    (n) =>
    n === "notes" ||
    n === "note" ||
    n === "extra" ||
    n === "comments" ||
    n === "comment" ||
    n === "remarques" ||
    n === "rf_note"
  );
  const nameIdx = normalized.findIndex(headerMatchesName);
  const folderIdx = normalized.findIndex(
    (n) =>
    n === "folder" ||
    n === "grouping"
  );
  return { urlIdx, userIdx, passIdx, totpIdx, notesIdx, nameIdx, folderIdx };
}




function parseCsvNoteExtras(
rawNote: string | undefined)
: {totpSecret: string | undefined;customFields: {name: string;value: string;type: "text";}[];} {
  if (!rawNote) return { totpSecret: undefined, customFields: [] };
  const lines = rawNote.split("\n");
  let totpSecret: string | undefined;
  const customFields: {name: string;value: string;type: "text";}[] = [];

  for (const line of lines) {
    const to = line.match(/^TOTP:\s+(.+)$/);
    if (to) {
      totpSecret = to[1].trim();
      continue;
    }
    const fieldsMatch = line.match(/^Fields:\s+(.+)$/);
    if (fieldsMatch) {
      const entries = fieldsMatch[1].split("|");
      for (const entry of entries) {
        const colonIdx = entry.indexOf(":");
        if (colonIdx > 0) {
          customFields.push({
            name: entry.slice(0, colonIdx).trim(),
            value: entry.slice(colonIdx + 1).trim(),
            type: "text"
          });
        }
      }
    }
  }

  return { totpSecret, customFields };
}

export function importCsv(csv: string): Vault {
  const vault = createEmptyVault();
  const raw = csv.trim();
  if (!raw) return vault;

  const delimiter = detectCsvDelimiter(raw.includes("\n") ? raw.split(/\r?\n/)[0] : raw);


  const rows = parseCsvRows(raw, delimiter);
  if (rows.length < 2) return vault;




  const headerCells = rows[0];
  const headerColCount = headerCells.length;
  const mergedRows = rows.filter((row, i) => i === 0 || row.length >= headerColCount);
  const { urlIdx, userIdx, passIdx, totpIdx, notesIdx, nameIdx, folderIdx } =
  findCsvColumnIndices(headerCells);

  for (let i = 1; i < mergedRows.length; i++) {
    const values = mergedRows[i];
    const url = urlIdx >= 0 ? values[urlIdx] ?? "" : "";
    const username = userIdx >= 0 ? values[userIdx] ?? "" : "";
    const password = passIdx >= 0 ? values[passIdx] ?? "" : "";
    const notes = notesIdx >= 0 ? values[notesIdx] ?? "" : "";
    const title = nameIdx >= 0 ? values[nameIdx] ?? "" : "";
    const folder = folderIdx >= 0 ? (values[folderIdx] ?? "").trim() : "";


    const { totpSecret: noteTotp, customFields: noteFields } =
    parseCsvNoteExtras(notes);


    let totpSecret = noteTotp;
    let totpAlgorithm: string | undefined;
    if (totpIdx >= 0) {
      const rawTotp = (values[totpIdx] ?? "").trim();
      if (rawTotp) {
        const fromUri = extractTotpSecret(rawTotp);
        if (fromUri) {
          totpSecret = fromUri.secret;
          totpAlgorithm = fromUri.algorithm;
        } else if (/^[A-Z2-7]{16,}$/i.test(rawTotp)) {
          totpSecret = rawTotp.toUpperCase();
        }
      }
    }

    const hasData = url || username || password;
    if (!hasData) continue;

    vault.entries.push(
      createEntry({
        url,
        username,
        password,
        title: title || undefined,
        notes: notes || undefined,
        totpSecret,
        totpAlgorithm,
        folder: folder || "identifiants",
        ...(noteFields.length > 0 ? { customFields: noteFields } : {})
      })
    );
  }

  return vault;
}

export function isProtonPassExport(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr.trim()) as {vaults?: unknown;};
    return typeof data?.vaults === "object" && data.vaults !== null;
  } catch {
    return false;
  }
}

function extractFromExtraFields(
item: ProtonPassItem,
fieldNames: string[])
: string | undefined {
  const fields =
  item?.data?.extraFields ??
  item?.data?.extra_fields ??
  item?.extraFields ??
  item?.extra_fields ??
  [];
  for (const f of fields) {
    const name = (f?.fieldName ?? f?.field_name ?? "").toLowerCase();
    if (fieldNames.some((n) => name === n || name.includes(n))) {
      const text = f?.content?.text?.content ?? f?.content?.hidden?.content;
      if (typeof text === "string" && text.trim()) return text.trim();
    }
  }
  return undefined;
}

function firstNonEmpty(...values: (string | undefined)[]): string {
  for (const v of values) {
    const s = typeof v === "string" ? v.trim() : "";
    if (s) return s;
  }
  return "";
}

function extractTotpSecret(
uri: string | undefined)
: {secret: string;algorithm?: string;} | undefined {
  if (!uri || !uri.includes("secret=")) return undefined;
  const secretMatch = uri.match(/secret=([A-Z2-7]+)/i);
  if (!secretMatch?.[1]) return undefined;
  const secret = secretMatch[1];

  let algorithm: string | undefined;
  try {
    const url = new URL(uri);
    const rawAlgo = (url.searchParams.get("algorithm") ?? "SHA1").
    toUpperCase().
    replace(/[^A-Z0-9]/g, "");
    if (rawAlgo === "SHA256" || rawAlgo === "SHA2256") algorithm = "SHA-256";else
    if (rawAlgo === "SHA512" || rawAlgo === "SHA2512")
    algorithm = "SHA-512";

  } catch {

  }
  return { secret, algorithm };
}

export function importProtonPassJson(json: string): Vault {
  const data = JSON.parse(json) as ProtonPassExport;
  const vault = createEmptyVault();
  const vaults = data.vaults ?? {};

  for (const v of Object.values(vaults)) {
    if (v?.name === "Recycle Bin") continue;
    const items = v?.items ?? [];
    for (const item of items) {
      const content = item?.data?.content ?? item?.content;
      const metadata = item?.data?.metadata;
      const rawType = item?.type ?? item?.data?.type ?? "";

      const NUMERIC_TYPE_MAP: Record<number, string> = {
        1: "login",
        2: "note",
        3: "alias",
        4: "creditcard"
      };
      const type =
      typeof rawType === "number" ?
      NUMERIC_TYPE_MAP[rawType] ?? String(rawType) :
      String(rawType).toLowerCase().replace(/_/g, "");

      if (type === "login" || type === "alias") {
        const dataAsContent = item?.data as ProtonPassItemContent | undefined;
        const c = content ?? dataAsContent;
        let username = firstNonEmpty(
          c?.itemUsername,
          c?.item_username,
          c?.itemEmail,
          c?.item_email,
          c?.login_email,
          c?.username,
          c?.email,
          extractFromExtraFields(item, [
          "username",
          "email",
          "login",
          "user",
          "identifiant",
          "mail"]
          )
        );

        if (!username && type === "alias" && item.aliasEmail) {
          username = item.aliasEmail.trim();
        }
        if (!username && metadata?.name?.includes("@"))
        username = metadata.name.trim();
        const password = c?.password ?? "";
        const urls = c?.urls;
        const url = Array.isArray(urls) ?
        urls[0] ?? "" :
        typeof urls === "string" ?
        urls :
        "";

        let entryUrls: {uri: string;}[] | undefined;
        if (Array.isArray(urls) && urls.length > 1) {
          entryUrls = urls.slice(1).map((u) => ({ uri: typeof u === "string" ? u : String(u) }));
        }
        const notes = metadata?.note ?? "";
        const totpResult = extractTotpSecret(c?.totpUri ?? c?.totp_uri);
        const totpSecret = totpResult?.secret;
        const totpAlgorithm = totpResult?.algorithm;


        if (!url && !username && metadata?.name) {
          username = metadata.name.trim();
        }

        if (!url && !username && !password) continue;

        vault.entries.push(
          createEntry({
            url: typeof url === "string" ? url : "",
            username: typeof username === "string" ? username : "",
            password: typeof password === "string" ? password : "",
            title: metadata?.name || undefined,
            notes: notes || undefined,
            totpSecret: totpSecret ?? undefined,
            totpAlgorithm: totpAlgorithm ?? undefined,
            folder: "identifiants",
            ...(entryUrls && entryUrls.length > 0 ? { urls: entryUrls } : {})
          })
        );
      } else if (type === "note") {
        const title = (metadata?.name ?? "").trim();
        const note = (content?.note ?? metadata?.note ?? "").trim();

        if (!title && !note) continue;
        vault.entries.push(
          createEntry({
            url: "",
            username: title,
            password: "",
            title: title || undefined,
            notes: note || undefined,
            folder: "notes"
          })
        );
      } else if (type === "identity") {
        const c = content as Record<string, unknown> | undefined;
        const firstName = String(c?.firstName ?? "").trim();
        const lastName = String(c?.lastName ?? "").trim();
        const fullName =
        [firstName, lastName].filter(Boolean).join(" ") ||
        (metadata?.name ?? "").trim();
        if (!fullName) continue;
        const identityData = {
          firstName,
          lastName,
          email: String(c?.email ?? "").trim(),
          phone: String(c?.phoneNumber ?? c?.phone ?? "").trim(),
          address: String(c?.streetAddress ?? c?.address ?? "").trim(),
          postalCode: String(c?.zipOrPostalCode ?? c?.postalCode ?? "").trim(),
          city: String(c?.city ?? "").trim(),
          country: String(c?.countryOrRegion ?? c?.country ?? "").trim()
        };
        vault.entries.push(
          createEntry({
            url: "",
            username: fullName,
            password: "",
            notes: JSON.stringify(identityData),
            folder: "identites"
          })
        );
      } else if (type === "creditcard" || type === "credit_card") {

        const c = content as Record<string, unknown> | undefined;
        const cardNum = String(
          c?.number ?? c?.cardNumber ?? c?.card_number ?? ""
        ).replace(/\D/g, "");
        if (cardNum.length < 13) continue;
        const brand = getCardBrand(cardNum);
        const last4 = getLast4(cardNum);
        const brandLabel = brand ? CARD_BRAND_LABELS[brand] : "Card";
        const holderName = String(
          c?.cardholderName ??
          c?.cardholder_name ??
          c?.name ??
          metadata?.name ??
          ""
        ).trim();

        const rawExp = String(
          c?.expirationDate ?? c?.expiration_date ?? c?.expiry ?? ""
        );
        let expiry = "";
        if (/^\d{4}-\d{2}$/.test(rawExp)) {

          expiry = rawExp.slice(5, 7) + "/" + rawExp.slice(2, 4);
        } else if (/^\d{2}\/\d{2}$/.test(rawExp)) {
          expiry = rawExp;
        } else if (/^\d{4}$/.test(rawExp)) {
          expiry = rawExp.slice(0, 2) + "/" + rawExp.slice(2, 4);
        }
        const cvv = String(
          c?.verificationNumber ??
          c?.verification_number ??
          c?.cvv ??
          c?.code ??
          ""
        ).trim();
        vault.entries.push(
          createEntry({
            url: "",
            username: `${brandLabel} •••• ${last4}`,
            password: cardNum,
            title: metadata?.name || undefined,
            notes: JSON.stringify({
              brand,
              last4,
              expiry,
              cvv,
              cardholderName: holderName
            }),
            notesMasked: true,
            folder: "cartes"
          })
        );
      }
    }
  }

  return vault;
}




const ENVELOPE_FORMAT = "vault-keeper-envelope";
const ENVELOPE_NONCE_LENGTH = 24;

interface PgpEnvelope {
  version: number;
  format: string;
  salt: string;
  nonce: string;
  ciphertext: string;
  commitment: string;
}

export async function encryptPgpContent(
plaintext: string,
passphrase: string)
: Promise<string> {
  const salt = generateSaltArgon2();
  const key = deriveKeyFromPasswordArgon2(passphrase, salt);
  const nonce = randomBytes(ENVELOPE_NONCE_LENGTH);
  const chacha = xchacha20poly1305(key, nonce);
  const ciphertext = chacha.encrypt(utf8ToBytes(plaintext));
  const commitment = hmac(sha256, key, ciphertext);
  const envelope: PgpEnvelope = {
    version: 1,
    format: ENVELOPE_FORMAT,
    salt: bytesToHex(salt),
    nonce: bytesToHex(nonce),
    ciphertext: bytesToHex(ciphertext),
    commitment: bytesToHex(commitment)
  };
  return JSON.stringify(envelope);
}

export async function decryptPgpContent(
encryptedContent: string | Uint8Array,
passphrase: string)
: Promise<string> {
  let json: string;
  if (typeof encryptedContent === "string") {
    json = encryptedContent;
  } else {
    json = new TextDecoder().decode(encryptedContent);
  }
  let payload: PgpEnvelope;
  try {
    payload = JSON.parse(json) as PgpEnvelope;
  } catch {
    throw new Error(
      "Format d'enveloppe chiffrée invalide (OpenPGP n'est plus supporté — réexportez depuis VaultKeepR)."
    );
  }
  if (payload?.format !== ENVELOPE_FORMAT || !payload.salt || !payload.nonce || !payload.ciphertext) {
    throw new Error("Format d'enveloppe chiffrée invalide.");
  }
  const salt = hexToBytes(payload.salt);
  const key = deriveKeyFromPasswordArgon2(passphrase, salt);

  const ciphertext = hexToBytes(payload.ciphertext);
  const computed = hmac(sha256, key, ciphertext);
  const stored = hexToBytes(payload.commitment);
  const valid = secureCompare(computed, stored);
  if (!valid) {
    throw new Error("Mot de passe incorrect ou données altérées.");
  }
  const nonce = hexToBytes(payload.nonce);
  const chacha = xchacha20poly1305(key, nonce);
  const plaintext = chacha.decrypt(ciphertext);
  return new TextDecoder().decode(plaintext);
}

export interface PgpImportResult {
  vault: Vault;

  secretKey?: string;
}

export async function importFromPgp(
encryptedContent: string | Uint8Array,
passphrase: string,
vaultKeeperPassword?: string)
: Promise<PgpImportResult> {
  const text = await decryptPgpContent(encryptedContent, passphrase);

  if (isEncryptedExport(text)) {
    if (!vaultKeeperPassword) {
      throw new Error(
        "Export chiffré Vault Keeper détecté. Indiquez le mot de passe maître Vault Keeper."
      );
    }
    const result = await importEncryptedVault(text, vaultKeeperPassword);
    return { vault: result.vault, secretKey: result.secretKey };
  }

  const trimmed = text.trim();
  if (isOnePasswordPif(text)) return { vault: import1PasswordPif(text) };


  if (isLastPassExport(trimmed)) return { vault: importLastPass(trimmed) };
  if (isDashlaneCsv(trimmed)) return { vault: importDashlaneCsv(trimmed) };
  if (isRoboFormExport(trimmed)) return { vault: importRoboForm(trimmed) };
  if (isKeeperCsv(trimmed)) return { vault: importKeeperCsv(trimmed) };
  if (isEnpassCsv(trimmed)) return { vault: importEnpassCsv(trimmed) };

  if (trimmed.startsWith("{")) {


    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed.entries)) {
        const vault = createEmptyVault();
        vault.entries = parsed.entries.map((e: any) =>
        createEntry({
          ...e,
          url: e.url ?? "",
          username: e.username ?? "",
          password: e.password ?? ""
        })
        );
        const secretKey =
        parsed.secretKey && typeof parsed.secretKey === "string" ?
        parsed.secretKey :
        undefined;
        return { vault, secretKey };
      }
    } catch {}

    if (isDashlaneJson(trimmed)) return { vault: importDashlaneJson(trimmed) };
    if (isKeeperJson(trimmed)) return { vault: importKeeperJson(trimmed) };
    if (isEnpassJson(trimmed)) return { vault: importEnpassJson(trimmed) };
    if (isProtonPassExport(text)) return { vault: importProtonPassJson(text) };
    return { vault: importBitwardenJson(text) };
  }
  return { vault: importCsv(text) };
}

export interface ImportVaultTextResult {
  vault: Vault;
  skipped?: SkippedItem[];
}






export async function importVaultText(
content: string | Uint8Array)
: Promise<ImportVaultTextResult> {
  const skipped: SkippedItem[] = [];


  if (content instanceof Uint8Array) {
    if (isOnePassword1Pux(content)) {
      return { vault: import1Pux(content, skipped), skipped };
    }
    throw new Error("Format binaire non reconnu (1PUX attendu).");
  }

  const text = content.trim();


  if (isKeePassXml(text)) {
    return { vault: importKeePassXml(text, skipped), skipped };
  }


  if (isOnePasswordPif(text)) {
    return { vault: import1PasswordPif(text), skipped: [] };
  }



  if (isLastPassExport(text)) {
    return { vault: importLastPass(text), skipped: [] };
  }

  if (isDashlaneCsv(text)) {
    return { vault: importDashlaneCsv(text), skipped: [] };
  }

  if (isRoboFormExport(text)) {
    return { vault: importRoboForm(text), skipped: [] };
  }

  if (isKeeperCsv(text)) {
    return { vault: importKeeperCsv(text), skipped: [] };
  }

  if (isEnpassCsv(text)) {
    return { vault: importEnpassCsv(text), skipped: [] };
  }


  if (text.startsWith("{")) {

    try {
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.entries)) {
        const vault = createEmptyVault();
        vault.entries = parsed.entries.map((e: any) =>
        createEntry({
          ...e,
          url: e.url ?? "",
          username: e.username ?? "",
          password: e.password ?? ""
        })
        );
        return { vault, skipped: [] };
      }
    } catch {}


    if (isDashlaneJson(text)) return { vault: importDashlaneJson(text), skipped: [] };
    if (isKeeperJson(text)) return { vault: importKeeperJson(text), skipped: [] };
    if (isEnpassJson(text)) return { vault: importEnpassJson(text), skipped: [] };

    if (isProtonPassExport(text)) return { vault: importProtonPassJson(text), skipped: [] };
    return { vault: importBitwardenJson(text), skipped: [] };
  }


  return { vault: importCsv(text), skipped: [] };
}