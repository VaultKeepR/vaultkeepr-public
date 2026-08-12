












import { createEntry, createEmptyVault } from "./vault";
import type { Vault } from "./types";
import { importCsv } from "./import";

export function isKeeperCsv(text: string): boolean {
  if (!text || text.startsWith("{")) return false;
  const firstLine = text.split(/\r?\n/)[0];
  if (!firstLine) return false;
  const headers = firstLine.split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
  return headers.includes("login_url") && headers.includes("custom_fields");
}

export function isKeeperJson(text: string): boolean {
  try {
    const data = JSON.parse(text.trim());
    return data !== null && typeof data === "object" && Array.isArray(data.records);
  } catch {
    return false;
  }
}

export function importKeeperJson(text: string): Vault {
  const data = JSON.parse(text.trim()) as {records?: unknown[];};
  const vault = createEmptyVault();
  const records = data.records ?? [];

  for (const rec of records) {
    if (!rec || typeof rec !== "object") continue;
    const r = rec as Record<string, unknown>;
    const url = String(r.login_url ?? "").trim();
    const username = String(r.login ?? "").trim();
    const password = String(r.password ?? "").trim();
    const title = String(r.title ?? "").trim();
    const notes = String(r.notes ?? "").trim();
    const totp = String(r.totp ?? "").trim();
    const folder = String(r.folder ?? "").trim();
    const customFieldsStr = String(r.custom_fields ?? "").trim();

    if (!url && !username && !password) continue;

    const entry = createEntry({
      url,
      username,
      password,
      title: title || undefined,
      notes: notes || undefined,
      totpSecret: totp || undefined,
      folder: folder || "identifiants"
    });


    if (customFieldsStr) {
      const fields = parseKeeperCustomFields(customFieldsStr);
      if (fields.length > 0) entry.customFields = fields;
    }

    vault.entries.push(entry);
  }

  return vault;
}

function parseKeeperCustomFields(
raw: string)
: {name: string;value: string;type: "text";}[] {

  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return arr.
      filter(
        (f: unknown) =>
        f && typeof f === "object" && typeof (f as Record<string, unknown>).name === "string"
      ).
      map((f: Record<string, unknown>) => ({
        name: String(f.name),
        value: String(f.value ?? ""),
        type: "text" as const
      }));
    }
  } catch {

    if (raw.includes("=")) {
      return raw.split("\n").filter(Boolean).map((line) => {
        const eq = line.indexOf("=");
        return {
          name: eq > 0 ? line.slice(0, eq).trim() : line.trim(),
          value: eq > 0 ? line.slice(eq + 1).trim() : "",
          type: "text" as const
        };
      });
    }
  }
  return [];
}

export function importKeeperCsv(text: string): Vault {
  return importCsv(text);
}