import { describe, it, expect } from "vitest";
import {
  formatAutosaveDelegationMessage,
  formatAutosaveDelegationMessageLegacy,
  autosaveDelegationVerifyMessages,
  AUTOSAVE_DELEGATION_HUMAN_LINE,
  AUTOSAVE_DELEGATION_LEGACY_LINE } from
"./index";

describe("wallet-messages — formatAutosaveDelegationMessage", () => {
  it("formats message with session ID and timestamp", () => {
    const msg = formatAutosaveDelegationMessage("session-abc", 1700000000);
    expect(msg).toContain("session-abc");
    expect(msg).toContain("1700000000");
    expect(msg).toContain(AUTOSAVE_DELEGATION_HUMAN_LINE);
  });

  it("produces a 3-line message", () => {
    const msg = formatAutosaveDelegationMessage("s1", 123);
    const lines = msg.split("\n");
    expect(lines.length).toBe(3);
  });
});

describe("wallet-messages — formatAutosaveDelegationMessageLegacy", () => {
  it("formats legacy message with correct prefix", () => {
    const msg = formatAutosaveDelegationMessageLegacy("session-xyz", 9999);
    expect(msg).toContain(AUTOSAVE_DELEGATION_LEGACY_LINE);
    expect(msg).toContain("session-xyz");
    expect(msg).toContain("9999");
  });
});

describe("wallet-messages — autosaveDelegationVerifyMessages", () => {
  it("returns exactly 2 messages (current + legacy)", () => {
    const msgs = autosaveDelegationVerifyMessages("s1", 100);
    expect(msgs).toHaveLength(2);
  });

  it("first message is current format, second is legacy", () => {
    const msgs = autosaveDelegationVerifyMessages("s1", 100);
    expect(msgs[0]).toContain(AUTOSAVE_DELEGATION_HUMAN_LINE);
    expect(msgs[1]).toContain(AUTOSAVE_DELEGATION_LEGACY_LINE);
  });
});