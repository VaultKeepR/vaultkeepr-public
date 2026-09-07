import { calculateMrzChecksum, cleanMrzField, parseMrzDate } from "./mrz-utils";

export interface MRZResult {
  type: "TD1" | "TD2" | "TD3" | "FRENCH_CNI";
  fullName: string;
  surname: string;
  givenNames: string;
  documentNumber: string;
  birthDate: string;
  expiryDate?: string;
  sex: "M" | "F" | "X";
  nationality: string;
  issuer: string;
  valid: boolean;
}




export function parseMRZ(lines: string[]): MRZResult | undefined {

  const mrzLines = lines.
  map((l) => l.toUpperCase().replace(/\s/g, "")).
  filter(
    (l) => l.includes("<<") || l.length >= 30 && /[A-Z0-9<]{30,}/.test(l)
  );

  if (mrzLines.length === 2) {
    const l1 = mrzLines[0];
    const l2 = mrzLines[1];


    if (l1.length === 44 && l2.length === 44) {
      return parseTD3(l1, l2);
    }


    if (l1.length === 36 && l2.length === 36) {
      return parseTD2(l1, l2);
    }
  }

  if (mrzLines.length === 3) {

    if (mrzLines.every((l) => l.length === 30)) {
      return parseTD1(mrzLines[0], mrzLines[1], mrzLines[2]);
    }
  }

  return undefined;
}




function parseTD2(l1: string, l2: string): MRZResult {
  const isFrench = l1.startsWith("IDFRA");

  const issuer = l1.substring(2, 5);
  const surname = cleanMrzField(l1.substring(5, 30));


  const docNum = l2.substring(0, 12);
  const docNumCheck = parseInt(l2[12], 10);
  const docNumValid = calculateMrzChecksum(docNum) === docNumCheck;

  const givenNames = cleanMrzField(l2.substring(13, 27));
  const dob = l2.substring(27, 33);
  const dobCheck = parseInt(l2[33], 10);
  const dobValid = calculateMrzChecksum(dob) === dobCheck;

  const sexChar = l2[34];
  const sex =
  sexChar === "H" || sexChar === "M" ? "M" : sexChar === "F" ? "F" : "X";

  return {
    type: isFrench ? "FRENCH_CNI" : "TD2",
    fullName: `${givenNames} ${surname}`.trim(),
    surname,
    givenNames,
    documentNumber: docNum,
    birthDate: parseMrzDate(dob),
    sex: sex,
    issuer,
    nationality: issuer,
    valid: docNumValid && dobValid
  };
}




function parseTD3(l1: string, l2: string): MRZResult {
  const issuer = l1.substring(2, 5);

  const namePart = l1.substring(5);
  const firstSep = namePart.indexOf("<<");
  const surname = cleanMrzField(namePart.substring(0, firstSep));
  const givenNames = cleanMrzField(namePart.substring(firstSep + 2));

  const docNum = l2.substring(0, 9);
  const docNumCheck = parseInt(l2[9], 10);
  const nationality = l2.substring(10, 13);
  const dob = l2.substring(13, 19);
  const dobCheck = parseInt(l2[19], 10);
  const sexChar = l2[20];
  const expiry = l2.substring(21, 27);
  void parseInt(l2[27], 10);

  return {
    type: "TD3",
    fullName: `${givenNames} ${surname}`.trim(),
    surname,
    givenNames,
    documentNumber: docNum,
    birthDate: parseMrzDate(dob),
    expiryDate: parseMrzDate(expiry),
    sex: sexChar === "M" ? "M" : sexChar === "F" ? "F" : "X",
    issuer,
    nationality,
    valid:
    calculateMrzChecksum(docNum) === docNumCheck &&
    calculateMrzChecksum(dob) === dobCheck
  };
}




function parseTD1(l1: string, l2: string, l3: string): MRZResult {
  const issuer = l1.substring(2, 5);
  const docNum = l1.substring(5, 14);
  const dob = l2.substring(0, 6);
  const sexChar = l2[7];
  const expiry = l2.substring(8, 14);
  const nationality = l2.substring(15, 18);


  const firstSep = l3.indexOf("<<");
  const surname = cleanMrzField(l3.substring(0, firstSep));
  const givenNames = cleanMrzField(l3.substring(firstSep + 2));

  return {
    type: "TD1",
    fullName: `${givenNames} ${surname}`.trim(),
    surname,
    givenNames,
    documentNumber: docNum,
    birthDate: parseMrzDate(dob),
    expiryDate: parseMrzDate(expiry),
    sex: sexChar === "M" ? "M" : sexChar === "F" ? "F" : "X",
    issuer,
    nationality,
    valid: true
  };
}