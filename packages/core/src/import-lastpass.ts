








import type { Vault } from "./types";
import { importCsv } from "./import";




export function isLastPassExport(text: string): boolean {
  if (!text || text.startsWith("{")) return false;
  const firstLine = text.split(/\r?\n/)[0];
  if (!firstLine) return false;
  const headers = firstLine.split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
  return headers.includes("grouping");
}





export function importLastPass(text: string): Vault {
  return importCsv(text);
}