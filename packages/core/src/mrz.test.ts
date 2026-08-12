import { describe, it, expect } from "vitest";
import { parseMRZ } from "./mrz";
import { calculateMrzChecksum, cleanMrzField, parseMrzDate } from "./mrz-utils";

describe("calculateMrzChecksum", () => {
  it("returns correct checksum for pure digits", () => {
    expect(calculateMrzChecksum("000000")).toBe(0);
  });

  it("returns correct checksum for string with letters", () => {
    const result = calculateMrzChecksum("ABC");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(9);
    expect(result).toBe(5);
  });

  it("treats chevrons as value 0", () => {
    expect(calculateMrzChecksum("<<")).toBe(0);
  });
});

describe("cleanMrzField", () => {
  it("removes trailing chevrons", () => {
    expect(cleanMrzField("SMITH<<")).toBe("SMITH");
  });

  it("converts internal chevrons to spaces", () => {
    expect(cleanMrzField("JOHN<<DOE")).toBe("JOHN  DOE");
  });

  it("handles mixed chevrons", () => {
    expect(cleanMrzField("A<<B<C<<")).toBe("A  B C");
  });
});

describe("parseMrzDate", () => {
  it("converts 900101 to 1990-01-01 (yy > 50 => 19xx)", () => {
    expect(parseMrzDate("900101")).toBe("1990-01-01");
  });

  it("converts 200101 to 2020-01-01 (yy <= 50 => 20xx)", () => {
    expect(parseMrzDate("200101")).toBe("2020-01-01");
  });

  it("returns empty string for invalid length", () => {
    expect(parseMrzDate("123")).toBe("");
    expect(parseMrzDate("1234567")).toBe("");
  });
});

describe("parseMRZ", () => {
  it("parses TD3 passport format (44 chars x 2 lines)", () => {
    const lines = [
    "P<FRADUPONT<<JEAN<ALBERT<<<<<<<<<<<<<<<<<<<<",
    "L898902C36FRA8001014M2707152<<<<<<<<<<<<<<<<"];

    const result = parseMRZ(lines);

    expect(result).toBeDefined();
    expect(result!.type).toBe("TD3");
    expect(result!.surname).toBe("DUPONT");
    expect(result!.givenNames).toBe("JEAN ALBERT");
    expect(result!.documentNumber).toBe("L898902C3");
    expect(result!.birthDate).toBe("1980-01-01");
    expect(result!.sex).toBe("M");
    expect(result!.issuer).toBe("FRA");
  });

  it("parses TD2 as FRENCH_CNI when starting with IDFRA", () => {
    const lines = [
    "IDFRADUPONT<<JEAN<<<<<<<<<<<<<<<<<<<",
    "1234567890122JEAN<<<<<<<<<<8501019M<"];

    const result = parseMRZ(lines);

    expect(result).toBeDefined();
    expect(result!.type).toBe("FRENCH_CNI");
    expect(result!.issuer).toBe("FRA");
  });

  it("parses non-French TD2 format", () => {
    const lines = [
    "IDEUTMUSTERMANN<<ERIKA<<<<<<<<<<<<<<",
    "L01X00T470012ERIKA<<<<<<<<8501019F<<"];

    const result = parseMRZ(lines);

    expect(result).toBeDefined();
    expect(result!.type).toBe("TD2");
    expect(result!.surname).toBe("MUSTERMANN  ERIKA");
  });

  it("parses TD1 format (30 chars x 3 lines)", () => {
    const lines = [
    "IDFRA123456788<<<<<<<<<<<<<<<<",
    "8001014M3001019<<<<<<<<<<<<<<<",
    "DUPONT<<JEAN<ALBERT<<<<<<<<<<<"];

    const result = parseMRZ(lines);

    expect(result).toBeDefined();
    expect(result!.type).toBe("TD1");
    expect(result!.surname).toBe("DUPONT");
    expect(result!.givenNames).toBe("JEAN ALBERT");
    expect(result!.sex).toBe("M");
    expect(result!.issuer).toBe("FRA");
  });

  it("returns undefined for invalid input", () => {
    expect(parseMRZ([])).toBeUndefined();
    expect(parseMRZ(["not", "mrz"])).toBeUndefined();
    expect(parseMRZ(["too", "few", "lines", "but", "wrong"])).toBeUndefined();
  });
});