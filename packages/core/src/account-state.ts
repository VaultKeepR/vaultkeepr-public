/**
 * Account key rules shared by every client (extension, iOS, Android).
 *
 * One secret key per account, not per device. The unlock method (password, PRF, passkey,
 * biometrics) only releases that key on the device: it never creates an identity.
 * A device without the key must not write to a pointer.
 */

export interface RemotePointer {
  exists: boolean;
  moved: boolean;
}

export type KeyAccountState =
  | { kind: "ready" } // the key is on this device
  | { kind: "passage" } // no key, legacy pointer open or local-only vault: offer the one-time passage
  | { kind: "read_only_pair" } // no key, pointer moved: read only until the device is paired
  | { kind: "choose" }; // no key, nothing remote, no local vault: create or join, explicitly

export function accountKeyState(input: {
  hasSecretKey: boolean;
  hasLocalVault: boolean;
  remote: RemotePointer | null;
}): KeyAccountState {
  if (input.hasSecretKey) return { kind: "ready" };
  if (input.remote?.moved) return { kind: "read_only_pair" };
  if (input.remote?.exists || input.hasLocalVault) return { kind: "passage" };
  return { kind: "choose" };
}

/** Address a device writes pointers under: the Smart Account only once moved and the key is here. */
export function pointerWalletFor(input: {
  hasSecretKey: boolean;
  remoteMoved: boolean;
  eoa: string;
  smartAccount: string;
}): string {
  return input.hasSecretKey && input.remoteMoved ? input.smartAccount : input.eoa;
}

export type PassageStep = "idle" | "key_pending" | "copied" | "moved" | "done";
export type PassageEvent =
  | "key_generated"
  | "copy_ok"
  | "copy_failed"
  | "move_ok"
  | "move_failed"
  | "move_conflict"
  | "promote_ok";
export type PassageTransition = { step: PassageStep; discardPendingKey: boolean } | { error: string };

/**
 * Passage of a legacy account to a key. The pending key is never the identity before "done":
 * a failed copy discards it, a failed move keeps the copy and retries, a move conflict discards it.
 */
export function passageNext(step: PassageStep, event: PassageEvent): PassageTransition {
  switch (`${step}:${event}`) {
    case "idle:key_generated": return { step: "key_pending", discardPendingKey: false };
    case "key_pending:copy_ok": return { step: "copied", discardPendingKey: false };
    case "key_pending:copy_failed": return { step: "idle", discardPendingKey: true };
    case "copied:move_ok": return { step: "moved", discardPendingKey: false };
    case "copied:move_failed": return { step: "copied", discardPendingKey: false };
    case "copied:move_conflict": return { step: "idle", discardPendingKey: true };
    case "moved:promote_ok": return { step: "done", discardPendingKey: false };
    default: return { error: `invalid passage transition: ${step} + ${event}` };
  }
}

/** Identity used for writes during the passage. The key only takes over at "done". */
export function passageIdentity(step: PassageStep): "legacy" | "smart_account" {
  return step === "done" ? "smart_account" : "legacy";
}
