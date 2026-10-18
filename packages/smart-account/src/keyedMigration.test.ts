import { describe, it, expect } from "vitest";
import { migrateKeyedPointer, KEYED_MIGRATION_ENABLED, type KeyedMigrationEnv } from "./keyedMigration";

const OWNER = "0x3b32000000000000000000000000000000000321";
const SA = "0xc8eb00000000000000000000000000000000a544";

function respond(status: number, json: unknown): Response {
  return { ok: status >= 200 && status < 300, status, json: async () => json } as unknown as Response;
}

/** In-memory server with the rules of the real routes that the migration relies on. */
class FakeServer {
  legacy = new Map<string, string>(); // owner EOA -> CID
  moved = new Map<string, string>(); // owner EOA -> Smart Account it moved to
  sa = new Map<string, string>(); // Smart Account -> CID
  posts: string[] = [];
  afterCopy?: () => void;
  failCopy = false;
  failMove = false;

  fetch = async (url: string, init?: RequestInit): Promise<Response> => {
    const u = new URL(url);
    if (init?.method === "POST") {
      const body = JSON.parse(String(init.body));
      if (u.pathname === "/api/vault-cid") {
        this.posts.push("copy");
        if (this.failCopy) return respond(500, {});
        this.sa.set(String(body.walletAddress).toLowerCase(), body.cid);
        this.afterCopy?.();
        return respond(200, { ok: true });
      }
      if (u.pathname === "/api/vault-cid/move") {
        this.posts.push("move");
        if (this.failMove) return respond(500, {});
        const owner = String(body.walletAddress).toLowerCase();
        const target = String(body.targetSmartAccount).toLowerCase();
        const previous = this.moved.get(owner);
        if (previous && previous !== target) return respond(409, { error: "identity moved to another smart account" });
        if (!this.sa.has(target)) return respond(409, { error: "smart account copy missing" });
        this.moved.set(owner, target);
        return respond(200, { ok: true, movedTo: target });
      }
      return respond(404, {});
    }
    const wallet = (u.searchParams.get("wallet") ?? "").toLowerCase();
    if (wallet === OWNER.toLowerCase()) {
      const movedTo = this.moved.get(wallet);
      return respond(200, { cid: this.legacy.get(wallet) ?? null, ...(movedTo ? { moved: true, movedTo } : {}) });
    }
    if (wallet === SA.toLowerCase()) return respond(200, { cid: this.sa.get(wallet) ?? null });
    return respond(404, {});
  };
}

function makeEnv(server: FakeServer) {
  const signed: string[] = [];
  let counter = 0;
  const env: KeyedMigrationEnv = {
    apiBase: "https://app.test",
    fetch: server.fetch as unknown as typeof fetch,
    ownerAddress: OWNER,
    smartAccount: SA,
    signWithKey: async (message: string) => {
      signed.push(message);
      return `sig-${message.length}`;
    },
    formatDelegation: (sessionId, expiry) => `delegation:${sessionId}:${expiry}`,
    newSessionId: () => `session-${++counter}`,
    now: () => 1_700_000_000_000
  };
  return { env, signed };
}

describe("keyed account migration", () => {
  it("stays off until the server side is deployed", () => {
    expect(KEYED_MIGRATION_ENABLED).toBe(false);
  });

  it("copies the legacy CID under the SA, then moves the legacy pointer", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    const { env } = makeEnv(server);

    expect(await migrateKeyedPointer(env)).toBe("moved");
    expect(server.sa.get(SA.toLowerCase())).toBe("c1");
    expect(server.moved.get(OWNER.toLowerCase())).toBe(SA.toLowerCase());
    expect(server.posts).toEqual(["copy", "move"]);
  });

  it("does nothing on a second run", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    const { env } = makeEnv(server);
    await migrateKeyedPointer(env);
    server.posts = [];

    expect(await migrateKeyedPointer(env)).toBe("already_moved");
    expect(server.posts).toEqual([]);
  });

  it("signs every request with the owner key", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    const { env, signed } = makeEnv(server);
    await migrateKeyedPointer(env);

    expect(signed.length).toBeGreaterThan(0);
    expect(signed.every((message) => message.startsWith("delegation:"))).toBe(true);
  });

  it("returns no_pointer when the account has no legacy pointer", async () => {
    const server = new FakeServer();
    const { env } = makeEnv(server);

    expect(await migrateKeyedPointer(env)).toBe("no_pointer");
    expect(server.posts).toEqual([]);
  });

  it("keeps the legacy pointer when the SA holds a different CID", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    server.sa.set(SA.toLowerCase(), "other");
    const { env } = makeEnv(server);

    expect(await migrateKeyedPointer(env)).toBe("conflict");
    expect(server.moved.has(OWNER.toLowerCase())).toBe(false);
    expect(server.posts).toEqual([]);
  });

  it("refuses a pointer already moved to another smart account", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    server.moved.set(OWNER.toLowerCase(), "0x0000000000000000000000000000000000000001");
    const { env } = makeEnv(server);

    await expect(migrateKeyedPointer(env)).rejects.toThrow("moved to another smart account");
    expect(server.posts).toEqual([]);
  });

  it("does not move anything when the SA copy fails", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    server.failCopy = true;
    const { env } = makeEnv(server);

    await expect(migrateKeyedPointer(env)).rejects.toThrow("SA copy failed");
    expect(server.moved.has(OWNER.toLowerCase())).toBe(false);
    expect(server.posts).toEqual(["copy"]);
  });

  it("does not lose a legacy write made between the copy and the move", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    let once = true;
    server.afterCopy = () => {
      if (once) {
        once = false;
        server.legacy.set(OWNER.toLowerCase(), "c2");
      }
    };
    const { env } = makeEnv(server);

    expect(await migrateKeyedPointer(env)).toBe("moved");
    expect(server.sa.get(SA.toLowerCase())).toBe("c2");
    expect(server.posts).toEqual(["copy", "move", "copy"]);
  });

  it("completes on the next run when the move failed after the copy", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    server.failMove = true;
    const { env } = makeEnv(server);

    await expect(migrateKeyedPointer(env)).rejects.toThrow("move failed");
    expect(server.sa.get(SA.toLowerCase())).toBe("c1");
    expect(server.moved.has(OWNER.toLowerCase())).toBe(false);

    server.failMove = false;
    expect(await migrateKeyedPointer(env)).toBe("moved");
    expect(server.posts).toEqual(["copy", "move", "move"]);
  });

  it("repairs a stale SA copy of an already moved pointer", async () => {
    const server = new FakeServer();
    server.legacy.set(OWNER.toLowerCase(), "c1");
    server.moved.set(OWNER.toLowerCase(), SA.toLowerCase());
    server.sa.set(SA.toLowerCase(), "old");
    const { env } = makeEnv(server);

    expect(await migrateKeyedPointer(env)).toBe("already_moved");
    expect(server.sa.get(SA.toLowerCase())).toBe("c1");
    expect(server.posts).toEqual(["copy"]);
  });
});
