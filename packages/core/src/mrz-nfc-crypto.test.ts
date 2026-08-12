import { describe, it, expect } from "vitest";
import { deriveMrzKseed, deriveNfcKey } from "./mrz-nfc-crypto";

describe("MRZ NFC crypto (ICAO 9303 BAC)", () => {
  describe("deriveMrzKseed", () => {
    it("derives a 16-byte Kseed from MRZ info", () => {
      const kseed = deriveMrzKseed(
        "L898902C3",
        "740812",
        "120415"
      );
      expect(kseed.length).toBe(16);
    });

    it("derives deterministic Kseed (same input = same output)", () => {
      const k1 = deriveMrzKseed("L898902C3", "740812", "120415");
      const k2 = deriveMrzKseed("L898902C3", "740812", "120415");
      expect(k1).toEqual(k2);
    });

    it("different doc numbers produce different Kseeds", () => {
      const k1 = deriveMrzKseed("L898902C3", "740812", "120415");
      const k2 = deriveMrzKseed("L898902C4", "740812", "120415");
      expect(k1).not.toEqual(k2);
    });

    it("handles YYYY-MM-DD format dates", () => {
      const k1 = deriveMrzKseed("L898902C3", "1974-08-12", "2012-04-15");
      const k2 = deriveMrzKseed("L898902C3", "740812", "120415");
      expect(k1).toEqual(k2);
    });

    it("pads doc number to 9 chars with <", () => {

      const k1 = deriveMrzKseed("L89890", "740812", "120415");
      expect(k1.length).toBe(16);
    });
  });

  describe("deriveNfcKey", () => {
    it("derives Kenc (counter=1) and Kmac (counter=2)", () => {
      const kseed = deriveMrzKseed("L898902C3", "740812", "120415");
      const kenc = deriveNfcKey(kseed, 1);
      const kmac = deriveNfcKey(kseed, 2);

      expect(kenc.length).toBe(16);
      expect(kmac.length).toBe(16);
      expect(kenc).not.toEqual(kmac);
    });

    it("derives deterministic keys", () => {
      const kseed = deriveMrzKseed("L898902C3", "740812", "120415");
      const k1 = deriveNfcKey(kseed, 1);
      const k2 = deriveNfcKey(kseed, 1);
      expect(k1).toEqual(k2);
    });
  });
});