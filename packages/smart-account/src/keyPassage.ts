/**
 * Accounts without a secret key, and their one-time passage to a key.
 *
 * Rule: one secret key per account. A key-less account has the password identity as owner.
 * Passing it to a key is a one-time move, in this order:
 *   1. create the key as a pending key (this device keeps its identity);
 *   2. copy the pointer under the key's Smart Account;
 *   3. mark the legacy pointer as moved to that Smart Account;
 *   4. activate the pending key on this device.
 * Nothing is deleted. Devices that do not hold the key become read-only.
 *
 * A failure stops the sequence. A retry reuses the same pending key. A device never uses the
 * new key before the legacy pointer has moved to its Smart Account.
 *
 * Pure logic. Network and storage are injected, so the order and the failure behaviour are
 * tested without a device.
 */

/** Server view of the legacy (password identity) pointer. */
export type PointerState = "none" | "active" | "moved";

export type IdentityState =
  | { kind: "ready" } // this device holds the account key
  | { kind: "pass_to_key" } // no key, a key-less account exists and has not moved: offer the passage
  | { kind: "pair_required" } // no key, the account has moved: read-only, pair this device
  | { kind: "join_or_create" }; // no key, no key-less account: the user must choose join or create

export function identityState(input: { hasSecretKey: boolean; pointer: PointerState }): IdentityState {
  if (input.hasSecretKey) return { kind: "ready" };
  if (input.pointer === "moved") return { kind: "pair_required" };
  if (input.pointer === "active") return { kind: "pass_to_key" };
  return { kind: "join_or_create" };
}

/**
 * Writes are allowed while the account has not moved: a key-less account keeps writing to its
 * legacy pointer until its passage ("nothing changes"). A moved pointer, or no pointer and no
 * key, cannot be written from this device.
 */
export function canWritePointer(state: IdentityState): boolean {
  return state.kind === "ready" || state.kind === "pass_to_key";
}

export interface LegacyPointer {
  cid: string | null;
  moved: boolean;
  /** Smart Account the pointer moved to, when moved. */
  movedTo?: string;
}

export interface PassageIO {
  /** Reads the legacy (password identity) pointer. */
  readLegacyPointer(): Promise<LegacyPointer>;
  /** The pending key left by a passage on this device, or null. Never creates a key. */
  peekPendingKey(): Promise<string | null>;
  /** The pending key: created and kept in pending storage if absent. Same key on every retry. Does not change the identity. */
  getOrCreatePendingKey(): Promise<string>;
  /** Smart Account of the key's owner. */
  smartAccountOf(secretKey: string): Promise<string>;
  /** Writes the copy under the Smart Account, signed with the pending key. Idempotent. */
  writeSmartAccountPointer(smartAccount: string, cid: string): Promise<void>;
  /** Marks the legacy pointer as moved to the Smart Account, signed with the legacy owner. Idempotent for the same target. */
  markLegacyMoved(smartAccount: string): Promise<void>;
  /** Makes the pending key this device's account key. Called only once the legacy pointer has moved to its Smart Account. */
  activatePendingKey(): Promise<void>;
  /** Removes the pending key. Used when the account has moved to another key. */
  discardPendingKey(): Promise<void>;
}

export type PassageResult =
  | { status: "moved"; smartAccount: string }
  | { status: "nothing_to_pass" } // no legacy pointer: nothing to copy, no key is created
  | { status: "already_moved" } // moved to another key: pair this device instead
  | { status: "already_keyed" }; // this device has a key: the passage does not concern it

function sameAddress(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export async function runPassage(io: PassageIO, opts: { hasSecretKey: boolean }): Promise<PassageResult> {
  if (opts.hasSecretKey) return { status: "already_keyed" };
  const legacy = await io.readLegacyPointer();

  if (legacy.moved) {
    // Finish an interrupted passage of this device: the pointer already moved to its pending key.
    // Any other pending key is dropped: the account belongs to another key.
    const pending = await io.peekPendingKey();
    if (pending && legacy.movedTo && sameAddress(await io.smartAccountOf(pending), legacy.movedTo)) {
      await io.activatePendingKey();
      return { status: "moved", smartAccount: legacy.movedTo };
    }
    if (pending) await io.discardPendingKey();
    return { status: "already_moved" };
  }

  if (!legacy.cid) return { status: "nothing_to_pass" };
  const secretKey = await io.getOrCreatePendingKey();
  const smartAccount = await io.smartAccountOf(secretKey);
  await io.writeSmartAccountPointer(smartAccount, legacy.cid);
  await io.markLegacyMoved(smartAccount);
  await io.activatePendingKey();
  return { status: "moved", smartAccount };
}
