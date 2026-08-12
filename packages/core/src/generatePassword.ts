














function getCrypto(): Crypto {

  if (typeof globalThis !== "undefined" && globalThis.crypto) {
    return globalThis.crypto as Crypto;
  }

  if (typeof crypto !== "undefined") {
    return crypto;
  }
  throw new Error("No crypto implementation found in this environment.");
}


export function uniformRandom(max: number): number {
  if (max <= 0) return 0;
  if (max === 1) return 0;
  const cr = getCrypto();




  const arr = new Uint32Array(1);
  const range = 0x100000000;
  const limit = range - range % max;
  let val: number;
  do {
    cr.getRandomValues(arr);
    val = arr[0];
  } while (val >= limit);
  return val % max;
}

function pickOne(s: string): string {
  return s[uniformRandom(s.length)];
}

export interface GeneratePasswordOptions {
  length?: number;
  upper?: boolean;
  lower?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}

export function generatePassword(opts?: GeneratePasswordOptions): string {
  const {
    length = 20,
    upper = true,
    lower = true,
    numbers = true,
    symbols = true
  } = opts ?? {};

  const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const L = "abcdefghijklmnopqrstuvwxyz";
  const N = "0123456789";
  const S = "!@#$%&*+-=?";

  let pool = "";
  if (upper) pool += U;
  if (lower) pool += L;
  if (numbers) pool += N;
  if (symbols) pool += S;
  if (!pool) pool = L + N;


  const guaranteed: string[] = [];
  if (upper) guaranteed.push(pickOne(U));
  if (lower) guaranteed.push(pickOne(L));
  if (numbers) guaranteed.push(pickOne(N));
  if (symbols) guaranteed.push(pickOne(S));

  const remaining = length - guaranteed.length;
  const rest: string[] = [];
  for (let i = 0; i < Math.max(0, remaining); i++) {
    rest.push(pool[uniformRandom(pool.length)]);
  }

  const combined = [...guaranteed, ...rest];


  for (let i = combined.length - 1; i > 0; i--) {
    const j = uniformRandom(i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join("");
}



import { EFF_WORDLIST } from "./wordlist";

export interface GeneratePassphraseOptions {

  wordCount?: number;

  separator?: string;

  capitalize?: boolean;
}






export function generatePassphrase(opts?: GeneratePassphraseOptions): string {
  const {
    wordCount = 5,
    separator = "-",
    capitalize = false
  } = opts ?? {};

  const count = Math.max(3, Math.min(10, wordCount));
  const words: string[] = [];

  for (let i = 0; i < count; i++) {
    let word = EFF_WORDLIST[uniformRandom(EFF_WORDLIST.length)];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  return words.join(separator);
}