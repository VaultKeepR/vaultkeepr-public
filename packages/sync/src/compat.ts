









import type { Vault } from "@vault-keeper/core";
import type { VaultDoc } from "./schema";
import { fromLegacyVault, importBinary, isAutomergeBinary } from "./crdtVault";





export type PayloadFormat = "crdt" | "json";







export function detectPayloadFormat(plaintext: string | Uint8Array): PayloadFormat {
  if (typeof plaintext === "string") {


    if (plaintext.startsWith("{")) return "json";

    try {
      const bytes = base64ToUint8Array(plaintext);
      if (isAutomergeBinary(bytes)) return "crdt";
    } catch {

    }
    return "json";
  }


  return isAutomergeBinary(plaintext) ? "crdt" : "json";
}
















export function migrateLegacyPayload(
plaintext: string,
deviceId: string)
: VaultDoc {
  const parsed = JSON.parse(plaintext) as Vault;


  if (Array.isArray(parsed.entries)) {
    for (const entry of parsed.entries) {
      const e = entry as unknown as Record<string, unknown>;
      if (e.notes === null) entry.notes = undefined;
      if (e.folder === null) entry.folder = undefined;
      if (e.totpSecret === null) entry.totpSecret = undefined;
      if (e.url === null) entry.url = "";
      if (e.username === null) entry.username = "";
      if (e.password === null) entry.password = "";
    }
  }

  return fromLegacyVault(parsed, deviceId);
}





function base64ToUint8Array(base64: string): Uint8Array {

  const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}