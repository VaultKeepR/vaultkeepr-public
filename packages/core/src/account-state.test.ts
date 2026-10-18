import { describe, it, expect } from "vitest";
import { accountKeyState, pointerWalletFor, passageNext, passageIdentity, type PassageStep } from "./account-state";

const EOA = "0x1111111111111111111111111111111111111111";
const SA = "0x2222222222222222222222222222222222222222";

describe("accountKeyState", () => {
  it("is ready whenever the key is on the device, whatever the remote pointer says", () => {
    expect(accountKeyState({ hasSecretKey: true, hasLocalVault: true, remote: { exists: true, moved: true } })).toEqual({ kind: "ready" });
    expect(accountKeyState({ hasSecretKey: true, hasLocalVault: false, remote: null })).toEqual({ kind: "ready" });
  });
  it("is read-only and asks for pairing once the legacy pointer has moved", () => {
    expect(accountKeyState({ hasSecretKey: false, hasLocalVault: true, remote: { exists: true, moved: true } })).toEqual({ kind: "read_only_pair" });
  });
  it("offers the passage while the legacy pointer is open", () => {
    expect(accountKeyState({ hasSecretKey: false, hasLocalVault: true, remote: { exists: true, moved: false } })).toEqual({ kind: "passage" });
  });
  it("offers the passage to a local vault that was never synced", () => {
    expect(accountKeyState({ hasSecretKey: false, hasLocalVault: true, remote: null })).toEqual({ kind: "passage" });
  });
  it("asks the user to create or join when nothing exists", () => {
    expect(accountKeyState({ hasSecretKey: false, hasLocalVault: false, remote: null })).toEqual({ kind: "choose" });
  });
});

describe("pointerWalletFor", () => {
  it("writes under the Smart Account only once moved and the key is here", () => {
    expect(pointerWalletFor({ hasSecretKey: true, remoteMoved: true, eoa: EOA, smartAccount: SA })).toBe(SA);
    expect(pointerWalletFor({ hasSecretKey: true, remoteMoved: false, eoa: EOA, smartAccount: SA })).toBe(EOA);
    expect(pointerWalletFor({ hasSecretKey: false, remoteMoved: true, eoa: EOA, smartAccount: SA })).toBe(EOA);
  });
});

describe("passage", () => {
  it("runs key, copy, move, promote in that order", () => {
    let step: PassageStep = "idle";
    const trace: PassageStep[] = [];
    for (const event of ["key_generated", "copy_ok", "move_ok", "promote_ok"] as const) {
      const t = passageNext(step, event);
      if ("error" in t) throw new Error(t.error);
      step = t.step;
      trace.push(step);
    }
    expect(trace).toEqual(["key_pending", "copied", "moved", "done"]);
  });
  it("keeps the legacy identity until the passage is done", () => {
    for (const s of ["idle", "key_pending", "copied", "moved"] as const) expect(passageIdentity(s)).toBe("legacy");
    expect(passageIdentity("done")).toBe("smart_account");
  });
  it("discards the pending key when the copy fails", () => {
    expect(passageNext("key_pending", "copy_failed")).toEqual({ step: "idle", discardPendingKey: true });
  });
  it("keeps the copy and retries the move when the move fails", () => {
    expect(passageNext("copied", "move_failed")).toEqual({ step: "copied", discardPendingKey: false });
  });
  it("discards the pending key on a move conflict", () => {
    expect(passageNext("copied", "move_conflict")).toEqual({ step: "idle", discardPendingKey: true });
  });
  it("refuses to promote before the move", () => {
    expect("error" in passageNext("copied", "promote_ok")).toBe(true);
    expect("error" in passageNext("idle", "promote_ok")).toBe(true);
  });
});
