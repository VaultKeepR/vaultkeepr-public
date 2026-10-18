/**
 * Client side of the passage to a key: the requests to the server, with the signatures and the
 * storage supplied by each app. The order and the failure rules are in keyPassage.ts.
 *
 * Off in production: PASSAGE_ENABLED stays false until the server move route and the Smart
 * Account namespace are deployed.
 */
import {
  identityState,
  runPassage,
  type IdentityState,
  type LegacyPointer,
  type PassageIO,
  type PassageResult,
  type PointerState
} from "./keyPassage";

/** Off until the server side (move route, Smart Account namespace) is deployed. */
export const PASSAGE_ENABLED = false;

/** Lifetime of a delegation sent with a passage request, in seconds. */
const DELEGATION_TTL_SECONDS = 300;

export interface PassageEnv {
  /** API origin, without trailing slash. */
  apiBase: string;
  fetch: typeof fetch;
  /** EOA of the password identity (the legacy owner). */
  legacyAddress: string;
  /** Signs a message with the legacy owner. */
  signLegacy(message: string): Promise<string>;
  /** Signs a message with the owner of a secret key. */
  signWithKey(secretKey: string, message: string): Promise<string>;
  /** Smart Account of a secret key's owner. */
  smartAccountOf(secretKey: string): Promise<string>;
  /** The autosave delegation message the server verifies (wallet-messages). */
  formatDelegation(sessionId: string, expiryTimestamp: number): string;
  /** A new random secret key (client RNG). */
  newSecretKey(): string;
  /** A new random session id. */
  newSessionId(): string;
  /** Current time, in milliseconds. */
  now(): number;
  /** Pending key storage: encrypted at rest, never logged. */
  pending: {
    read(): Promise<string | null>;
    write(secretKey: string): Promise<void>;
    clear(): Promise<void>;
  };
  /** Stores the committed account key and updates this device's identity. */
  activate(secretKey: string): Promise<void>;
}

async function postJson(env: PassageEnv, path: string, body: unknown): Promise<unknown> {
  const res = await env.fetch(`${env.apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`passage ${path} failed (${res.status})`);
  return res.json();
}

export function createPassageIO(env: PassageEnv): PassageIO {
  const legacyAddress = env.legacyAddress.toLowerCase();

  const delegation = async (sign: (message: string) => Promise<string>) => {
    const sessionId = env.newSessionId();
    const expiryTimestamp = Math.floor(env.now() / 1000) + DELEGATION_TTL_SECONDS;
    const delegationSignature = await sign(env.formatDelegation(sessionId, expiryTimestamp));
    return { sessionId, expiryTimestamp, delegationSignature };
  };

  return {
    async readLegacyPointer(): Promise<LegacyPointer> {
      const d = await delegation((m) => env.signLegacy(m));
      const query = [
        `wallet=${encodeURIComponent(legacyAddress)}`,
        `delegationSignature=${encodeURIComponent(d.delegationSignature)}`,
        `sessionId=${encodeURIComponent(d.sessionId)}`,
        `expiryTimestamp=${d.expiryTimestamp}`
      ].join("&");
      const res = await env.fetch(`${env.apiBase}/api/vault-cid?${query}`);
      if (!res.ok) throw new Error(`passage read failed (${res.status})`);
      const json = (await res.json()) as { cid?: string | null; moved?: boolean; movedTo?: string };
      return { cid: json.cid ?? null, moved: !!json.moved, movedTo: json.movedTo ?? undefined };
    },
    peekPendingKey: () => env.pending.read(),
    async getOrCreatePendingKey() {
      const existing = await env.pending.read();
      if (existing) return existing;
      const secretKey = env.newSecretKey();
      await env.pending.write(secretKey);
      return secretKey;
    },
    smartAccountOf: (secretKey) => env.smartAccountOf(secretKey),
    async writeSmartAccountPointer(smartAccount, cid) {
      const pendingKey = await env.pending.read();
      if (!pendingKey) throw new Error("passage: no pending key");
      const d = await delegation((m) => env.signWithKey(pendingKey, m));
      await postJson(env, "/api/vault-cid", {
        walletAddress: smartAccount,
        cid,
        delegationSignature: d.delegationSignature,
        sessionId: d.sessionId,
        expiryTimestamp: d.expiryTimestamp
      });
    },
    async markLegacyMoved(smartAccount) {
      const d = await delegation((m) => env.signLegacy(m));
      await postJson(env, "/api/vault-cid/move", {
        walletAddress: legacyAddress,
        targetSmartAccount: smartAccount,
        delegationSignature: d.delegationSignature,
        sessionId: d.sessionId,
        expiryTimestamp: d.expiryTimestamp
      });
    },
    async activatePendingKey() {
      const pendingKey = await env.pending.read();
      if (!pendingKey) throw new Error("passage: no pending key");
      await env.activate(pendingKey);
      await env.pending.clear();
    },
    discardPendingKey: () => env.pending.clear()
  };
}

/** The account's state on this device, for the UI. Changes nothing. */
export async function readPassageState(env: PassageEnv, hasSecretKey: boolean): Promise<IdentityState> {
  const legacy = await createPassageIO(env).readLegacyPointer();
  const pointer: PointerState = legacy.moved ? "moved" : legacy.cid ? "active" : "none";
  return identityState({ hasSecretKey, pointer });
}

/** Runs the one-time passage. On a failed step it throws, and the pending key is kept for a retry. */
export function runPassageWith(env: PassageEnv, hasSecretKey: boolean): Promise<PassageResult> {
  return runPassage(createPassageIO(env), { hasSecretKey });
}
