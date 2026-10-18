/**
 * Migration of an account that already has a secret key: its pointer moves from the legacy
 * namespace (the owner EOA of the key) to the Smart Account namespace (SA of that EOA).
 *
 * Steps, with the device key as the owner signer (same routes as the one-time passage):
 *   1. read the legacy pointer of the owner EOA;
 *   2. if the SA has no pointer, copy the legacy CID under the SA (the server infers the SA namespace
 *      from the owner signature);
 *   3. mark the legacy pointer moved to the SA (the server refuses it without the SA copy);
 *   4. after the move the legacy pointer is frozen: read it again and make the SA equal to it.
 *      This closes the race where an old client wrote the legacy pointer between steps 1 and 3.
 *
 * Nothing is deleted. A failed step throws; the next unlock runs the same steps again.
 * A conflict (the SA already holds a different CID) changes nothing: the device keeps the legacy pointer.
 *
 * Off until the server side is deployed: KEYED_MIGRATION_ENABLED stays false.
 */

/** Off until the Smart Account namespace and the move route are deployed. */
export const KEYED_MIGRATION_ENABLED = false;

/** Same lifetime as the passage delegations. */
const DELEGATION_TTL_SECONDS = 300;

export interface KeyedMigrationEnv {
  apiBase: string;
  fetch: typeof fetch;
  /** Owner EOA derived from the device secret key. The legacy pointer lives under it. */
  ownerAddress: string;
  /** Smart Account of the owner EOA, computed on the device. Never taken from the server. */
  smartAccount: string;
  /** Signs with the device key (the owner EOA). */
  signWithKey(message: string): Promise<string>;
  formatDelegation(sessionId: string, expiryTimestamp: number): string;
  newSessionId(): string;
  now(): number;
}

/**
 * - moved: the legacy pointer is now moved to the SA, and the SA holds its CID.
 * - already_moved: a previous run (or another device) already moved it to this SA.
 * - no_pointer: no legacy pointer. Nothing to move: the device keeps the legacy namespace.
 * - conflict: the SA holds a different CID. Nothing changed; to be reported, not resolved here.
 */
export type KeyedMigrationStatus = "moved" | "already_moved" | "no_pointer" | "conflict";

interface PointerRead {
  cid: string | null;
  moved: boolean;
  movedTo?: string;
}

async function delegation(env: KeyedMigrationEnv) {
  const sessionId = env.newSessionId();
  const expiryTimestamp = Math.floor(env.now() / 1000) + DELEGATION_TTL_SECONDS;
  const delegationSignature = await env.signWithKey(env.formatDelegation(sessionId, expiryTimestamp));
  return { sessionId, expiryTimestamp, delegationSignature };
}

/** Reads a pointer. For the SA, the server answers from the Smart Account namespace. */
async function readPointer(env: KeyedMigrationEnv, wallet: string): Promise<PointerRead> {
  const d = await delegation(env);
  const query = [
    `wallet=${encodeURIComponent(wallet)}`,
    `delegationSignature=${encodeURIComponent(d.delegationSignature)}`,
    `sessionId=${encodeURIComponent(d.sessionId)}`,
    `expiryTimestamp=${d.expiryTimestamp}`
  ].join("&");
  const res = await env.fetch(`${env.apiBase}/api/vault-cid?${query}`);
  if (!res.ok) throw new Error(`keyed migration: read failed (${res.status})`);
  const json = (await res.json()) as { cid?: string | null; moved?: boolean; movedTo?: string };
  return { cid: json.cid ?? null, moved: !!json.moved, movedTo: json.movedTo ?? undefined };
}

/** Writes a CID under the SA. The server infers the SA namespace from the owner signature. */
async function copyPointer(env: KeyedMigrationEnv, smartAccount: string, cid: string): Promise<void> {
  const d = await delegation(env);
  const res = await env.fetch(`${env.apiBase}/api/vault-cid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: smartAccount,
      cid,
      delegationSignature: d.delegationSignature,
      sessionId: d.sessionId,
      expiryTimestamp: d.expiryTimestamp
    })
  });
  if (!res.ok) throw new Error(`keyed migration: SA copy failed (${res.status})`);
}

/** Marks the legacy pointer moved to the SA. The server refuses it without the SA copy. */
async function markMoved(env: KeyedMigrationEnv, owner: string, smartAccount: string): Promise<void> {
  const d = await delegation(env);
  const res = await env.fetch(`${env.apiBase}/api/vault-cid/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: owner,
      targetSmartAccount: smartAccount,
      delegationSignature: d.delegationSignature,
      sessionId: d.sessionId,
      expiryTimestamp: d.expiryTimestamp
    })
  });
  if (!res.ok) throw new Error(`keyed migration: move failed (${res.status})`);
}

/** After the move the legacy CID is final. Makes the SA equal to it, copying again if needed. */
async function reconcileAfterMove(env: KeyedMigrationEnv, owner: string, smartAccount: string): Promise<void> {
  const frozen = await readPointer(env, owner);
  if (!frozen.cid) throw new Error("keyed migration: legacy pointer empty after the move");
  const copied = await readPointer(env, smartAccount);
  if (copied.cid === frozen.cid) return;
  await copyPointer(env, smartAccount, frozen.cid);
  const check = await readPointer(env, smartAccount);
  if (check.cid !== frozen.cid) throw new Error("keyed migration: SA copy differs after the move");
}

/**
 * Runs the migration for the device's account. Throws on any failed step: the caller keeps the legacy
 * namespace and retries at the next unlock. Switches the device to the SA only on moved / already_moved.
 */
export async function migrateKeyedPointer(env: KeyedMigrationEnv): Promise<KeyedMigrationStatus> {
  const owner = env.ownerAddress.toLowerCase();
  const smartAccount = env.smartAccount.toLowerCase();

  const legacy = await readPointer(env, owner);
  if (legacy.moved) {
    if ((legacy.movedTo ?? "").toLowerCase() !== smartAccount) {
      throw new Error("keyed migration: legacy pointer moved to another smart account");
    }
    await reconcileAfterMove(env, owner, smartAccount);
    return "already_moved";
  }
  if (!legacy.cid) return "no_pointer";

  const target = await readPointer(env, smartAccount);
  if (target.cid !== null && target.cid !== legacy.cid) return "conflict";
  if (target.cid === null) await copyPointer(env, smartAccount, legacy.cid);

  await markMoved(env, owner, smartAccount);
  await reconcileAfterMove(env, owner, smartAccount);
  return "moved";
}
