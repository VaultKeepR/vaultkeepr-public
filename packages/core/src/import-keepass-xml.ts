import { createEmptyVault, createEntry } from "./vault";
import type { CustomField, Vault } from "./types";
import type { SkippedItem } from "./import";
import { getCardBrand, getLast4, CARD_BRAND_LABELS } from "./cards";


export function isKeePassXml(text: string): boolean {
  const t = text.trim();
  if (!t.startsWith("<")) return false;
  return /<KeePassFile\b/i.test(t);
}

interface KpString {
  key: string;
  value: string;

  protected: boolean;
}

interface KpEntry {
  strings: KpString[];

  groupPath: string;
}















function tokenizeKpXml(xml: string): string[] {

  const stripped = xml.
  replace(/<\?xml[^>]*\?>/g, "").
  replace(/<!--[\s\S]*?-->/g, "").
  replace(/<!DOCTYPE[^>]*>/g, "");
  const tokens: string[] = [];
  const re = /<(\/?)([A-Za-z_][\w.:-]*)((?:\s[^>]*)?)(\/?)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(stripped)) !== null) {
    if (m.index > last) {
      const text = stripped.slice(last, m.index);
      if (text.trim()) tokens.push("#text:" + text);
    }
    const [, closing, name, attrs, selfClose] = m;
    tokens.push(`${closing ? "/" : ""}${name}${attrs ? ` ${attrs.trim()}` : ""}${selfClose ? " /" : ""}`);
    last = re.lastIndex;
  }
  return tokens;
}

function parseKeePassTree(tokens: string[]): KpEntry[] {
  const entries: KpEntry[] = [];
  const groupStack: string[] = [];
  let i = 0;

  const currentGroupPath = () =>
  groupStack.filter(Boolean).join(" / ").trim();

  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok === "Group /" || tok === "Group") {

      i++;
      continue;
    }
    if (tok === "Group") {
      i++;
      continue;
    }
    if (tok === "/Group") {
      groupStack.pop();
      i++;
      continue;
    }
    if (tok.startsWith("Group")) {
      i++;
      continue;
    }


    if (tok === "Name") {
      const next = tokens[i + 1];
      const after = tokens[i + 2];
      if (next?.startsWith("#text:") && after === "/Name") {
        groupStack.push(next.slice(6).trim());
        i += 3;
        continue;
      }
      groupStack.push("");
      i++;
      continue;
    }
    if (tok === "/Name") {
      i++;
      continue;
    }


    if (tok === "Entry" || tok === "Entry /") {
      if (tok === "Entry /") {
        i++;
        continue;
      }
      i++;
      const strings: KpString[] = [];

      while (i < tokens.length && tokens[i] !== "/Entry") {
        if (tokens[i] === "String" || tokens[i] === "String /") {
          if (tokens[i] === "String /") {
            i++;
            continue;
          }
          i++;
          let key = "";
          let value = "";
          let isProtected = false;
          while (i < tokens.length && tokens[i] !== "/String") {
            if (tokens[i] === "Key") {
              const v = tokens[i + 1];
              if (v?.startsWith("#text:")) {
                key = v.slice(6).trim();
                i += 2;
                if (tokens[i] === "/Key") i++;
                continue;
              }
              i++;
              continue;
            }
            if (tokens[i] === "/Key") {
              i++;
              continue;
            }
            if (tokens[i].startsWith("Value")) {
              const valueTok = tokens[i];
              isProtected = /\bProtected\s*=\s*"True"/i.test(valueTok);
              if (valueTok.endsWith("/")) {

                i++;
                continue;
              }
              i++;
              const v = tokens[i];
              if (v?.startsWith("#text:")) {
                value = v.slice(6);
                i++;
              }
              if (tokens[i] === "/Value") i++;
              continue;
            }
            if (tokens[i] === "/Value") {
              i++;
              continue;
            }

            i++;
          }
          if (tokens[i] === "/String") i++;
          strings.push({ key, value, protected: isProtected });
          continue;
        }

        i++;
      }
      if (tokens[i] === "/Entry") i++;
      entries.push({ strings, groupPath: currentGroupPath() });
      continue;
    }


    i++;
  }

  return entries;
}

function extractTotp(raw: string): {secret: string;algorithm?: string;} | undefined {
  const v = (raw ?? "").trim();
  if (!v) return undefined;
  if (v.includes("secret=")) {
    const m = v.match(/secret=([A-Z2-7]+)/i);
    if (m?.[1]) {
      let algorithm: string | undefined;
      try {
        const u = new URL(v);
        const a = (u.searchParams.get("algorithm") ?? "SHA1").toUpperCase().replace(/[^A-Z0-9]/g, "");
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


export function importKeePassXml(
xml: string,
skipped?: SkippedItem[])
: Vault {
  if (!isKeePassXml(xml)) {
    throw new Error("Format KeePass XML invalide : balise <KeePassFile> absente.");
  }
  const tokens = tokenizeKpXml(xml);
  const entries = parseKeePassTree(tokens);

  const vault = createEmptyVault();

  for (const entry of entries) {
    const byKey = new Map<string, KpString>();
    for (const s of entry.strings) {
      if (s.key) byKey.set(s.key.toLowerCase(), s);
    }

    const title = byKey.get("title")?.value ?? "";
    const username = byKey.get("username")?.value ?? "";
    const password = byKey.get("password")?.value ?? "";
    const url = byKey.get("url")?.value ?? "";
    const notes = byKey.get("notes")?.value ?? "";


    let totpSecret: string | undefined;
    let totpAlgorithm: string | undefined;
    for (const k of ["otp", "totp", "timeotp", "one-time password"]) {
      const v = byKey.get(k)?.value;
      if (v) {
        const r = extractTotp(v);
        if (r) {
          totpSecret = r.secret;
          totpAlgorithm = r.algorithm;
          break;
        }
      }
    }


    const STANDARD_KP_KEYS = new Set([
    "title",
    "username",
    "user",
    "password",
    "url",
    "notes",
    "otp",
    "totp",
    "timeotp",
    "one-time password"]
    );
    const customFields: CustomField[] = [];
    for (const s of entry.strings) {
      const k = s.key.toLowerCase();
      if (!s.key || STANDARD_KP_KEYS.has(k)) continue;
      if (!s.value) continue;
      customFields.push({
        name: s.key.trim(),
        value: s.value,
        type: s.protected ? "hidden" : "text"
      });
    }


    const cardCandidate = customFields.find((f) =>
    /^\d{13,}$/.test(f.value.replace(/\s|-/g, ""))
    );
    if (cardCandidate && !password) {
      const cardNum = cardCandidate.value.replace(/\D/g, "");
      const brand = getCardBrand(cardNum);
      const last4 = getLast4(cardNum);
      const brandLabel = brand ? CARD_BRAND_LABELS[brand] : "Card";

      const remainingCf = customFields.filter((f) => f !== cardCandidate);
      vault.entries.push(
        createEntry({
          url: "",
          username: `${brandLabel} •••• ${last4}`,
          password: cardNum,
          notes: JSON.stringify({ brand, last4 }),
          notesMasked: true,
          folder: "cartes",
          title: title || undefined,
          customGroup: entry.groupPath || undefined,
          customFields: remainingCf.length ? remainingCf : undefined
        })
      );
      continue;
    }


    if (!password && !url && notes) {
      vault.entries.push(
        createEntry({
          url: "",
          username: "",
          password: "",
          title: title || undefined,
          notes: notes || undefined,
          folder: "notes",
          customGroup: entry.groupPath || undefined,
          customFields: customFields.length ? customFields : undefined
        })
      );
      continue;
    }

    if (!title && !username && !password && !url && !notes && !customFields.length) {
      skipped?.push({
        source: "KeePass",
        type: "entry",
        name: title,
        reason: "Empty entry (no usable fields)"
      });
      continue;
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
        customGroup: entry.groupPath || undefined,
        customFields: customFields.length ? customFields : undefined
      })
    );
  }

  return vault;
}