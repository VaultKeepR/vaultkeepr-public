












import { createEntry, createEmptyVault } from "./vault";
import type { Vault } from "./types";
import { importCsv } from "./import";

export function isEnpassCsv(text: string): boolean {
  if (!text || text.startsWith("{")) return false;
  const firstLine = text.split(/\r?\n/)[0];
  if (!firstLine) return false;

  const rawHeaders = firstLine.split(",");

  return (
    rawHeaders.some((h) => {
      const clean = h.replace(/^["']|["']$/g, "").trim();
      return clean === "Title";
    }) &&
    rawHeaders.some((h) => {
      const clean = h.replace(/^["']|["']$/g, "").trim();
      return clean === "Category";
    }));

}

export function isEnpassJson(text: string): boolean {
  try {
    const data = JSON.parse(text.trim());
    if (
    data === null ||
    typeof data !== "object" ||
    !Array.isArray(data.items) ||
    Array.isArray((data as Record<string, unknown>).records))
    {
      return false;
    }


    const items = data.items as unknown[];
    if (items.length === 0) return true;
    const first = items[0] as Record<string, unknown> | undefined;
    if (typeof first?.category === "string") return true;

    if (Array.isArray(first?.fields)) {
      const flds = first.fields as Record<string, unknown>[];
      if (flds.length > 0) {
        const f0 = flds[0];
        return typeof f0?.label === "string" && f0?.label !== undefined;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function importEnpassJson(text: string): Vault {
  const data = JSON.parse(text.trim()) as {items?: unknown[];};
  const vault = createEmptyVault();
  const items = data.items ?? [];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const i = item as Record<string, unknown>;
    const fields = Array.isArray(i.fields) ? i.fields as Record<string, unknown>[] : [];
    const category = String(i.category ?? "").trim();
    const title = String(i.title ?? "").trim();
    const notes = String(i.note ?? "").trim();
    const subtitle = String(i.subtitle ?? "").trim();


    let url = "";
    let username = "";
    let password = "";
    let totpSecret = "";

    for (const f of fields) {
      const label = String(f.label ?? "").toLowerCase();
      const value = String(f.value ?? "").trim();
      const type = String(f.type ?? "").toLowerCase();

      if (!value) continue;

      if (label === "url" || label === "website" || type === "url") {
        url = url || value;
      } else if (label === "username" || label === "email" || label === "login" || label === "user") {
        username = username || value;
      } else if (label === "password" || type === "password") {
        password = password || value;
      } else if (label === "totp" || label === "2fa" || type === "totp") {
        totpSecret = totpSecret || value;
      }
    }


    if (category === "login" || !category) {
      url = url || String(i.url ?? "").trim();
      username = username || String(i.username ?? "").trim();
      password = password || String(i.password ?? "").trim();
    }


    if (!username && subtitle) username = subtitle;


    if (!url && !username && !password && !notes && !title) continue;

    const folder = mapEnpassCategory(category);

    vault.entries.push(
      createEntry({
        url,
        username,
        password,
        title: title || undefined,
        notes: notes || undefined,
        totpSecret: totpSecret || undefined,
        folder
      })
    );
  }

  return vault;
}

function mapEnpassCategory(category: string): string {
  const c = category.toLowerCase();
  if (c === "creditcard" || c === "credit card" || c === "bank") return "cartes";
  if (c === "note" || c === "secure note") return "notes";
  if (c === "identity" || c === "personal") return "identites";
  return "identifiants";
}

export function importEnpassCsv(text: string): Vault {
  return importCsv(text);
}