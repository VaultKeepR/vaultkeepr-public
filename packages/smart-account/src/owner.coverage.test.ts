// Coverage-round: the owner-derivation wrappers (core hidden-wallet helpers
// mocked — no crypto work needed here).
import { describe, it, expect, vi } from "vitest";

vi.mock("@vaultkeepr/core", () => ({
  getHiddenWalletFromPassword: vi.fn(() => ({ address: "0xaaa0000000000000000000000000000000000001" })),
  getHiddenWalletFromSecretKey: vi.fn(() => ({ address: "0xbbb0000000000000000000000000000000000002" })),
  getHiddenWalletLegacy: vi.fn(() => ({ address: "0xccc0000000000000000000000000000000000003" }))
}));

import { getOwnerFromPassword, getOwnerFromPasswordLegacy } from "./owner";

describe("owner derivation wrappers", () => {
  it("uses the secret key when provided", async () => {
    const acct = await getOwnerFromPassword("pw", "sk");
    expect((acct as { address: string }).address).toBe("0xbbb0000000000000000000000000000000000002");
  });

  it("falls back to the password derivation", async () => {
    const acct = await getOwnerFromPassword("pw");
    expect((acct as { address: string }).address).toBe("0xaaa0000000000000000000000000000000000001");
  });

  it("exposes the legacy derivation", () => {
    const acct = getOwnerFromPasswordLegacy("pw");
    expect((acct as { address: string }).address).toBe("0xccc0000000000000000000000000000000000003");
  });
});
