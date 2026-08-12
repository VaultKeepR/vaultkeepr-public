







export const AUTOSAVE_DELEGATION_HUMAN_LINE =
"Authorize delegation to synchronize between your devices";


export function formatAutosaveDelegationMessage(sessionId: string, expiryTimestamp: number): string {
  return `${AUTOSAVE_DELEGATION_HUMAN_LINE}\n${sessionId}\n${expiryTimestamp}`;
}


export const AUTOSAVE_DELEGATION_LEGACY_LINE = "VaultKeepR délégation autosave";

export function formatAutosaveDelegationMessageLegacy(sessionId: string, expiryTimestamp: number): string {
  return `${AUTOSAVE_DELEGATION_LEGACY_LINE}\n${sessionId}\n${expiryTimestamp}`;
}


export function autosaveDelegationVerifyMessages(sessionId: string, expiryTimestamp: number): string[] {
  return [
  formatAutosaveDelegationMessage(sessionId, expiryTimestamp),
  formatAutosaveDelegationMessageLegacy(sessionId, expiryTimestamp)];

}