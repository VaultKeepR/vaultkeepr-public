







import type { Vault } from "./types";
import { importCsv } from "./import";

export function isRoboFormExport(text: string): boolean {
  if (!text || text.startsWith("{")) return false;
  const firstLine = text.split(/\r?\n/)[0];
  if (!firstLine) return false;
  const headers = firstLine.split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
  return headers.includes("rf_note");
}

export function importRoboForm(text: string): Vault {
  return importCsv(text);
}