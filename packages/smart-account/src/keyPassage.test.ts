import { describe, it, expect } from "vitest";
import { identityState, canWritePointer, runPassage, type PassageIO } from "./keyPassage";

function world(init: { cid?: string | null; movedTo?: string } = {}) {
  const calls: string[] = [];
  const flags = { failWrite: false, failMark: false, failActivate: false };
  const st = {
    cid: init.cid === undefined ? "QmLegacy" : init.cid,
    movedTo: init.movedTo as string | undefined,
    pending: null as string | null,
    active: null as string | null,
    copies: [] as string[],
  };
  const saOf = (sk: string) => "0xsa" + sk.slice(3, 9);
  const io: PassageIO = {
    async readLegacyPointer() {
      calls.push("read");
      return { cid: st.cid, moved: st.movedTo !== undefined, movedTo: st.movedTo };
    },
    async peekPendingKey() {
      calls.push("peek");
      return st.pending;
    },
    async getOrCreatePendingKey() {
      calls.push("pending");
      if (!st.pending) st.pending = "sk-" + Math.random().toString(16).slice(2);
      return st.pending;
    },
    async smartAccountOf(sk) {
      calls.push("sa");
      return saOf(sk);
    },
    async writeSmartAccountPointer(sa, cid) {
      calls.push("write");
      if (flags.failWrite) throw new Error("network");
      st.copies.push(sa + ":" + cid);
    },
    async markLegacyMoved(sa) {
      calls.push("mark");
      if (flags.failMark) throw new Error("network");
      st.movedTo = sa;
    },
    async activatePendingKey() {
      calls.push("activate");
      if (flags.failActivate) throw new Error("storage");
      st.active = st.pending;
      st.pending = null;
    },
    async discardPendingKey() {
      calls.push("discard");
      st.pending = null;
    },
  };
  return { io, calls, flags, st };
}

describe("identity state", () => {
  it("is ready whenever the device holds the key, whatever the pointer", () => {
    for (const pointer of ["none", "active", "moved"] as const) {
      expect(identityState({ hasSecretKey: true, pointer })).toEqual({ kind: "ready" });
    }
  });
  it("requires pairing once the key-less account has moved", () => {
    expect(identityState({ hasSecretKey: false, pointer: "moved" })).toEqual({ kind: "pair_required" });
  });
  it("offers the passage to a key-less account that has not moved", () => {
    expect(identityState({ hasSecretKey: false, pointer: "active" })).toEqual({ kind: "pass_to_key" });
  });
  it("never silently creates an account when no pointer exists", () => {
    expect(identityState({ hasSecretKey: false, pointer: "none" })).toEqual({ kind: "join_or_create" });
  });
  it("allows writes while the account has not moved, and refuses the rest", () => {
    expect(canWritePointer({ kind: "ready" })).toBe(true);
    expect(canWritePointer({ kind: "pass_to_key" })).toBe(true);
    expect(canWritePointer({ kind: "pair_required" })).toBe(false);
    expect(canWritePointer({ kind: "join_or_create" })).toBe(false);
  });
});

describe("passage to a key", () => {
  it("runs pending key, copy, mark, activation, in that order", async () => {
    const w = world();
    const r = await runPassage(w.io, { hasSecretKey: false });
    expect(w.calls.map((c) => c.split(":")[0])).toEqual(["read", "pending", "sa", "write", "mark", "activate"]);
    expect(r.status).toBe("moved");
    expect(w.st.active).not.toBeNull();
    expect(w.st.pending).toBeNull();
  });
  it("creates no key when there is no legacy pointer", async () => {
    const w = world({ cid: null });
    expect(await runPassage(w.io, { hasSecretKey: false })).toEqual({ status: "nothing_to_pass" });
    expect(w.calls).toEqual(["read"]);
  });
  it("does nothing on a device that already has a key", async () => {
    const w = world();
    expect(await runPassage(w.io, { hasSecretKey: true })).toEqual({ status: "already_keyed" });
    expect(w.calls).toEqual([]);
  });
  it("stops at a pointer moved to another key, with no pending key", async () => {
    const w = world({ movedTo: "0xsaother" });
    expect(await runPassage(w.io, { hasSecretKey: false })).toEqual({ status: "already_moved" });
    expect(w.calls).toEqual(["read", "peek"]);
    expect(w.st.active).toBeNull();
  });
  it("never marks or activates when the copy fails, and keeps the pending key", async () => {
    const w = world();
    w.flags.failWrite = true;
    await expect(runPassage(w.io, { hasSecretKey: false })).rejects.toThrow("network");
    expect(w.calls).not.toContain("mark");
    expect(w.calls).not.toContain("activate");
    expect(w.st.pending).not.toBeNull();
  });
  it("retries after a failed copy with the same pending key", async () => {
    const w = world();
    w.flags.failWrite = true;
    await expect(runPassage(w.io, { hasSecretKey: false })).rejects.toThrow();
    const first = w.st.pending;
    w.flags.failWrite = false;
    expect((await runPassage(w.io, { hasSecretKey: false })).status).toBe("moved");
    expect(w.st.active).toBe(first);
  });
  it("does not activate when the mark fails, then completes on retry", async () => {
    const w = world();
    w.flags.failMark = true;
    await expect(runPassage(w.io, { hasSecretKey: false })).rejects.toThrow("network");
    expect(w.calls).not.toContain("activate");
    w.flags.failMark = false;
    expect((await runPassage(w.io, { hasSecretKey: false })).status).toBe("moved");
  });
  it("finishes an interrupted activation on retry", async () => {
    const w = world();
    w.flags.failActivate = true;
    await expect(runPassage(w.io, { hasSecretKey: false })).rejects.toThrow("storage");
    expect(w.st.movedTo).toBeDefined();
    w.flags.failActivate = false;
    const r = await runPassage(w.io, { hasSecretKey: false });
    expect(r.status).toBe("moved");
    expect(w.st.active).not.toBeNull();
  });
  it("drops its pending key when the account moved to another key", async () => {
    const w = world({ movedTo: "0xsaother" });
    w.st.pending = "sk-leftover";
    expect(await runPassage(w.io, { hasSecretKey: false })).toEqual({ status: "already_moved" });
    expect(w.calls).toContain("discard");
    expect(w.calls).not.toContain("activate");
    expect(w.st.pending).toBeNull();
  });
});
