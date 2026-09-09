import { sha1 } from "@noble/hashes/legacy.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import { logger } from "@vaultkeepr/logger";









function calculateCheckDigit(str: string): string {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i].toUpperCase();
    let val = 0;
    if (char >= "0" && char <= "9") val = parseInt(char, 10);else
    if (char >= "A" && char <= "Z") val = char.charCodeAt(0) - 55;else
    if (char === "<") val = 0;
    sum += val * weights[i % 3];
  }
  return (sum % 10).toString();
}







export function deriveMrzKseed(
docNumber: string,
birthDate: string,
expiryDate: string)
: Uint8Array {

  const cleanDoc = docNumber.replace(/\s/g, "").toUpperCase().padEnd(9, "<");


  const getYYMMDD = (d: string) => {
    const clean = d.replace(/\D/g, "");
    return clean.length === 8 ?
    clean.substring(2) :
    clean.padEnd(6, "0").substring(0, 6);
  };

  const db = getYYMMDD(birthDate);
  const de = getYYMMDD(expiryDate);



  const mrzInfo =
  cleanDoc +
  calculateCheckDigit(cleanDoc) +
  db +
  calculateCheckDigit(db) +
  de +
  calculateCheckDigit(de);




  logger.debug("[MRZ-Crypto] Deriving Kseed");
  const hash = sha1(utf8ToBytes(mrzInfo));
  return hash.slice(0, 16);
}






export function deriveNfcKey(kseed: Uint8Array, counter: 1 | 2): Uint8Array {
  const d = new Uint8Array(20);
  d.set(kseed);
  d[16] = 0;
  d[17] = 0;
  d[18] = 0;
  d[19] = counter;

  const hash = sha1(d);
  const key = hash.slice(0, 16);


  return key;
}




export function buildMutualAuthData(
_s: Uint8Array,
_r: Uint8Array,
_k: Uint8Array)
: Uint8Array {



  return new Uint8Array();
}