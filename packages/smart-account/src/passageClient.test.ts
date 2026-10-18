import { describe, it, expect } from "vitest";
import { PASSAGE_ENABLED, readPassageState, runPassageWith, type PassageEnv } from "./passageClient";

const LEGACY = "0x1111111111111111111111111111111111111111";

function makeEnv(init: { cid?: string | null; movedTo?: string; failMove?: boolean } = {}) {
  const log: { method: string; path: string; body?: any }[] = [];
  const st = {
    cid: init.cid === undefined ? "QmLegacy" : init.cid,
    movedTo: init.movedTo as string | undefined,
    failMove: !!init.failMove,
    pending: null as string | null,
    committed: null as string | null,
    n: 0,
  };
  const json = (status: number, data: unknown) => ({ ok: status < 400, status, json: async () => data }) as unknown as Response;
  const fetchImpl = (async (url: string, reqInit?: RequestInit) => {
    const u = new URL(url);
    const method = reqInit?.method ?? "GET";
    const body = reqInit?.body ? JSON.parse(String(reqInit.body)) : undefined;
    log.push({ method, path: u.pathname + u.search, body });
    if (method === "GET") return json(200, { cid: st.cid, moved: !!st.movedTo, movedTo: st.movedTo });
    if (u.pathname === "/api/vault-cid") return json(200, { cid: body.cid });
    if (u.pathname === "/api/vault-cid/move") {
      if (st.failMove) return json(500, {});
      if (st.movedTo && st.movedTo !== body.targetSmartAccount) return json(409, { error: "identity moved" });
      st.movedTo = body.targetSmartAccount;
      return json(200, { moved: "sa" });
    }
    return json(404, {});
  }) as unknown as typeof fetch;
  const env: PassageEnv = {
    apiBase: "https://api.test",
    fetch: fetchImpl,
    legacyAddress: LEGACY,
    signLegacy: async (m) => "legacy-sig|" + m,
    signWithKey: async (sk, m) => "key-sig|" + sk.slice(0, 8) + "|" + m,
    smartAccountOf: async (sk) => "0xsa" + sk.slice(3, 9),
    formatDelegation: (sid, exp) => `DELEG|${sid}|${exp}`,
    newSecretKey: () => "sk-" + ++st.n,
    newSessionId: () => "sid-" + ++st.n,
    now: () => 1_700_000_000_000,
    pending: {
      read: async () => st.pending,
      write: async (sk) => { st.pending = sk; },
      clear: async () => { st.pending = null; },
    },
    activate: async (sk) => { st.committed = sk; },
  };
  return { env, log, st };
}

describe("passage client", () => {
  it("stays off until the server side is deployed", () => {
    expect(PASSAGE_ENABLED).toBe(false);
  });

  it("reads the state of the account without changing it", async () => {
    expect(await readPassageState(makeEnv().env, false)).toEqual({ kind: "pass_to_key" });
    expect(await readPassageState(makeEnv({ movedTo: "0xsaother" }).env, false)).toEqual({ kind: "pair_required" });
    expect(await readPassageState(makeEnv({ cid: null }).env, false)).toEqual({ kind: "join_or_create" });
    expect(await readPassageState(makeEnv().env, true)).toEqual({ kind: "ready" });
  });

  it("reads the legacy pointer with a delegation signed by the legacy owner", async () => {
    const { env, log } = makeEnv();
    await readPassageState(env, false);
    expect(log[0].method).toBe("GET");
    expect(log[0].path).toContain("wallet=" + LEGACY);
    expect(log[0].path).toContain("delegationSignature=");
  });

  it("moves the account, signing the copy with the pending key, then activates that key", async () => {
    const { env, log, st } = makeEnv();
    const r = await runPassageWith(env, false);
    expect(r.status).toBe("moved");
    const sa = (r as { smartAccount: string }).smartAccount;
    const copy = log.find((l) => l.method === "POST" && l.path === "/api/vault-cid");
    expect(copy?.body.walletAddress).toBe(sa);
    expect(String(copy?.body.delegationSignature).startsWith("key-sig|" + st.committed!.slice(0, 8))).toBe(true);
    const move = log.find((l) => l.path === "/api/vault-cid/move");
    expect(move?.body.walletAddress).toBe(LEGACY.toLowerCase());
    expect(move?.body.targetSmartAccount).toBe(sa);
    expect(String(move?.body.delegationSignature).startsWith("legacy-sig|")).toBe(true);
    expect(st.committed).not.toBeNull();
    expect(st.pending).toBeNull();
  });

  it("keeps the device unchanged and the key pending when the move fails, then completes on retry", async () => {
    const { env, st } = makeEnv({ failMove: true });
    await expect(runPassageWith(env, false)).rejects.toThrow("failed (500)");
    expect(st.committed).toBeNull();
    expect(st.pending).not.toBeNull();
    const firstPending = st.pending;
    st.failMove = false;
    expect((await runPassageWith(env, false)).status).toBe("moved");
    expect(st.committed).toBe(firstPending);
  });
});
