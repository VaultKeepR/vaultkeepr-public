import { EFF_WORDLIST } from "./wordlist";

export interface PasswordEntropyResult {
  entropyBits: number;
  poolSize: number;
  charsetEntropyBits: number;
  dictionaryPenaltyBits: number;
  patternPenaltyBits: number;
  effectiveBits: number;
  crackTimeDisplay: string;
  strength: PasswordEntropyLevel;
}

export type PasswordEntropyLevel = "critical" | "weak" | "fair" | "strong" | "excellent";

const DICTIONARY = new Set<string>(
  [...EFF_WORDLIST, "password", "motdepasse", "azerty", "qwerty", "admin", "administrator", "welcome", "iloveyou", "letmein", "monkey", "dragon", "sunshine", "princess", "football", "baseball", "master", "hello", "freedom", "whatever", "qwertyuiop", "asdfghjkl", "zxcvbnm", "societe", "security", "chaque", "ordinateur", "internet", "vaultkeep", "vaultkeeper"]
  .map((w) => w.toLowerCase())
);

const COMMON_SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/0/g, "o"],
  [/1/g, "i"],
  [/3/g, "e"],
  [/4/g, "a"],
  [/5/g, "s"],
  [/7/g, "t"],
  [/8/g, "b"],
  [/@/g, "a"],
  [/\$/g, "s"],
  [/!/g, "i"],
];

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "azertyuiop", "qsdfghjklm", "wxcvbn", "1234567890"];

const YEAR_RE = /(19[0-9]{2}|20[0-9]{2})/;

function leetNormalize(input: string): string {
  let out = input.toLowerCase();
  for (const [re, ch] of COMMON_SUBSTITUTIONS) {
    out = out.replace(re, ch);
  }
  return out;
}

function charsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^A-Za-z0-9]/.test(password)) size += 33;
  return size;
}

function charsetEntropyBits(password: string): number {
  const size = charsetSize(password);
  if (size <= 1) return 0;
  return password.length * Math.log2(size);
}

function dictionaryPenaltyBits(password: string): number {
  const lower = password.toLowerCase();
  const normalized = leetNormalize(password);
  let penalty = 0;

  for (const candidate of [lower, normalized]) {
    const stripped = candidate.replace(/[^a-z]/g, "");
    if (DICTIONARY.has(stripped)) {
      penalty = Math.max(penalty, stripped.length * 4.5);
    }
    for (let i = 3; i <= stripped.length - 3; i++) {
      for (let start = 0; start + i <= stripped.length; start++) {
        const sub = stripped.slice(start, start + i);
        if (DICTIONARY.has(sub)) {
          penalty = Math.max(penalty, i * 3.5);
        }
      }
    }
  }

  for (const word of ["vaultkeepr", "vaultkeeper", "password1", "password123", "azerty123", "qwerty123", "motdepasse"]) {
    if (lower.includes(word) || normalized.includes(word)) {
      penalty = Math.max(penalty, word.length * 4);
    }
  }

  return Math.min(penalty, 45);
}

function sequencePenaltyBits(password: string): number {
  let penalty = 0;
  const lower = password.toLowerCase();

  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i < row.length - 2; i++) {
      const tri = row.slice(i, i + 3);
      if (lower.includes(tri)) {
        penalty = Math.max(penalty, (row.length - i) * 2);
      }
    }
  }

  for (let i = 0; i < lower.length - 2; i++) {
    const a = lower.charCodeAt(i);
    const b = lower.charCodeAt(i + 1);
    const c = lower.charCodeAt(i + 2);
    if ((b === a + 1 && c === a + 2) || (b === a - 1 && c === a - 2)) {
      penalty = Math.max(penalty, (lower.length - i) * 2.5);
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    const run = password.match(/(.)\1+/);
    penalty = Math.max(penalty, Math.min((run ? run[0].length : 3) * 6, 45));
  }

  if (YEAR_RE.test(password)) {
    penalty = Math.max(penalty, 8);
  }

  const repeats = password.match(/(.{1,4})\1{1,}/);
  if (repeats) {
    penalty = Math.max(penalty, repeats[1].length * 5);
  }

  return Math.min(penalty, 40);
}

function formatCrackTime(effectiveBits: number): string {
  const guesses = Math.pow(2, effectiveBits - 1);
  const guessesPerSecond = 1e11;
  const seconds = guesses / guessesPerSecond;

  if (seconds < 1) return "instant";
  const units: Array<[number, string]> = [
    [60, "seconds"],
    [60, "minutes"],
    [24, "hours"],
    [365, "days"],
    [100, "years"],
    [100, "centuries"],
  ];

  let value = seconds;
  let unit = "seconds";
  for (const [factor, nextUnit] of units) {
    if (value < factor) break;
    value /= factor;
    unit = nextUnit;
  }

  if (unit === "centuries" || (unit === "years" && value > 1e9)) {
    return "beyond practical cracking";
  }
  if (value >= 100) {
    return `${Math.round(value).toExponential(0)} ${unit}`;
  }
  return `${Math.round(value)} ${unit}`;
}

export function estimatePasswordEntropy(password: string): PasswordEntropyResult {
  const csBits = charsetEntropyBits(password);
  const dictPenalty = dictionaryPenaltyBits(password);
  const patternPenalty = sequencePenaltyBits(password);
  const effectiveBits = Math.max(0, Math.round((csBits - dictPenalty - patternPenalty) * 10) / 10);

  let strength: PasswordEntropyLevel;
  if (effectiveBits < 28) strength = "critical";
  else if (effectiveBits < 40) strength = "weak";
  else if (effectiveBits < 60) strength = "fair";
  else if (effectiveBits < 80) strength = "strong";
  else strength = "excellent";

  return {
    entropyBits: Math.round(csBits * 10) / 10,
    poolSize: charsetSize(password),
    charsetEntropyBits: Math.round(csBits * 10) / 10,
    dictionaryPenaltyBits: Math.round(dictPenalty * 10) / 10,
    patternPenaltyBits: Math.round(patternPenalty * 10) / 10,
    effectiveBits,
    crackTimeDisplay: formatCrackTime(effectiveBits),
    strength,
  };
}
