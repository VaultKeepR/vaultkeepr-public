import { describe, it, expect } from "vitest";
import { getChecksumAddress } from "./address";

describe("getChecksumAddress", () => {
  const vectors = [
    "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    "0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB",
    "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb"
  ];

  it.each(vectors)("produces the canonical EIP-55 form for %s", (expected) => {
    expect(getChecksumAddress(expected.toLowerCase())).toBe(expected);
    expect(getChecksumAddress(expected.toUpperCase())).toBe(expected);
  });

  it("keeps 0x prefix handling symmetric", () => {
    expect(getChecksumAddress("5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed")).toBe(
      getChecksumAddress("0x5AAEB6053F3E94C9B9A09F33669435E7EF1BEAED")
    );
  });

  it("returns non-40-hex-length input unchanged", () => {
    expect(getChecksumAddress("0x123")).toBe("0x123");
    expect(getChecksumAddress("0x")).toBe("0x");
    expect(getChecksumAddress("not-an-address")).toBe("not-an-address");
  });
});
