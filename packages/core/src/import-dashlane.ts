












import { createEntry, createEmptyVault } from "./vault";
import type { Vault, VaultEntry } from "./types";
import { importCsv } from "./import";

export function isDashlaneCsv(text: string): boolean {
  if (!text || text.startsWith("{")) return false;
  const firstLine = text.split(/\r?\n/)[0];
  if (!firstLine) return false;
  const headers = firstLine.split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
  return headers.includes("otpsecret");
}

export function isDashlaneJson(text: string): boolean {
  try {
    const data = JSON.parse(text.trim());
    return data !== null && typeof data === "object" && Array.isArray(data.AUTHENTIFIANT);
  } catch {
    return false;
  }
}

export function importDashlaneJson(text: string): Vault {
  const data = JSON.parse(text.trim()) as {AUTHENTIFIANT?: unknown[];};
  const vault = createEmptyVault();
  const items = data.AUTHENTIFIANT ?? [];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const i = item as Record<string, unknown>;
    const url = String(i.url ?? i.domain ?? "").trim();
    const username = String(i.login ?? i.email ?? i.username ?? "").trim();
    const password = String(i.password ?? "").trim();
    const title = String(i.title ?? i.name ?? "").trim();
    const notes = String(i.note ?? "").trim();
    const otpSecret = String(i.otpSecret ?? i.otp ?? "").trim();
    const category = String(i.category ?? "").trim();

    if (!url && !username && !password) continue;

    vault.entries.push(
      createEntry({
        url,
        username,
        password,
        title: title || undefined,
        notes: notes || undefined,
        totpSecret: otpSecret || undefined,
        folder: category || "identifiants"
      })
    );
  }

  return vault;
}

export function importDashlaneCsv(text: string): Vault {
  return importCsv(text);
}