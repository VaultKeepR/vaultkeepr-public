





import type { VaultEntry } from "./types";



export type PasswordStrength = "critical" | "weak" | "fair" | "strong";

export interface PasswordHealthEntry {
  entryId: string;
  url: string;
  username: string;
  strength: PasswordStrength;
  score: number;
  issues: string[];
  reusedWith: string[];
  ageMonths: number | null;
  expired: boolean;
  twoFactorMissing: boolean;
  unsecureUrl: boolean;
}

export interface PasswordHealthReport {
  entries: PasswordHealthEntry[];
  overallScore: number;
  stats: {
    total: number;
    critical: number;
    weak: number;
    fair: number;
    strong: number;
    reused: number;
    empty: number;
    expired: number;
    twoFactorMissing: number;
    unsecureWebsites: number;
  };
}

const COMMON_PASSWORDS = new Set([
"password",
"123456",
"12345678",
"qwerty",
"abc123",
"monkey",
"1234567",
"letmein",
"trustno1",
"dragon",
"baseball",
"iloveyou",
"master",
"sunshine",
"ashley",
"michael",
"shadow",
"123123",
"654321",
"superman",
"qazwsx",
"access",
"password1",
"admin",
"pass123",
"welcome",
"welcome1",
"p@ssword",
"p@ssw0rd"]
);

function hasLowercase(s: string): boolean {
  return /[a-z]/.test(s);
}
function hasUppercase(s: string): boolean {
  return /[A-Z]/.test(s);
}
function hasDigit(s: string): boolean {
  return /\d/.test(s);
}
function hasSymbol(s: string): boolean {
  return /[^a-zA-Z0-9]/.test(s);
}




export function scorePassword(password: string): {
  score: number;
  strength: PasswordStrength;
  issues: string[];
} {
  if (!password)
  return { score: 0, strength: "critical", issues: ["Empty password"] };

  const issues: string[] = [];
  let score = 0;


  if (password.length >= 16) score += 35;else
  if (password.length >= 12) score += 25;else
  if (password.length >= 8) score += 15;else
  {
    score += 5;
    issues.push("Too short (< 8 characters)");
  }


  const charsets = [
  hasLowercase(password),
  hasUppercase(password),
  hasDigit(password),
  hasSymbol(password)];

  const diversity = charsets.filter(Boolean).length;
  score += diversity * 7.5;
  if (diversity <= 1) issues.push("Not enough character types");
  if (!hasSymbol(password) && !hasDigit(password))
  issues.push("No digit or symbol");


  const uniqueChars = new Set(password).size;
  const entropyRatio = uniqueChars / password.length;
  score += Math.min(20, Math.round(entropyRatio * 25));
  if (entropyRatio < 0.5) issues.push("Too many repeated characters");


  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    score = Math.max(5, score - 50);
    issues.push("Common password (known leak)");
  }
  if (/^(.)\1+$/.test(password)) {
    score = Math.max(5, score - 30);
    issues.push("Single repeated character");
  }
  if (
  /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg)/i.test(password))
  {
    score -= 10;
    issues.push("Predictable sequence");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let strength: PasswordStrength;
  if (score >= 75) strength = "strong";else
  if (score >= 50) strength = "fair";else
  if (score >= 25) strength = "weak";else
  strength = "critical";

  return { score, strength, issues };
}




export function analyzeVaultHealth(
entries: VaultEntry[])
: PasswordHealthReport {

  const loginEntries = entries.filter((e) => {
    return e.url?.trim();
  });


  const passwordMap = new Map<string, string[]>();
  for (const entry of loginEntries) {
    if (!entry.password?.trim()) continue;
    const existing = passwordMap.get(entry.password) ?? [];
    existing.push(entry.id);
    passwordMap.set(entry.password, existing);
  }

  const reusedPasswords = new Map<string, string[]>();
  for (const [, ids] of passwordMap) {
    if (ids.length > 1) {
      for (const id of ids) {
        reusedPasswords.set(
          id,
          ids.filter((i) => i !== id)
        );
      }
    }
  }

  const healthEntries: PasswordHealthEntry[] = loginEntries.map((entry) => {
    const { score, strength, issues } = scorePassword(entry.password ?? "");
    const reusedWith = reusedPasswords.get(entry.id) ?? [];
    if (reusedWith.length > 0)
    issues.push(`Reused on ${reusedWith.length} other site(s)`);


    const DEFAULT_MAX_AGE_DAYS = 365;
    const maxAgeDays = entry.passwordMaxAgeDays ?? DEFAULT_MAX_AGE_DAYS;
    let ageMonths: number | null = null;
    let expired = false;

    const referenceDate = entry.passwordChangedAt ?
    new Date(entry.passwordChangedAt) :
    (entry as {createdAt?: string;}).createdAt ?
    new Date((entry as {createdAt?: string;}).createdAt!) :
    null;

    if (referenceDate) {
      const now = new Date();
      const ageMs = now.getTime() - referenceDate.getTime();
      ageMonths = Math.round(ageMs / (1000 * 60 * 60 * 24 * 30));
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      if (ageDays > maxAgeDays) {
        expired = true;
        issues.push(
          `Password expired (${ageMonths} months old, max ${maxAgeDays} days)`
        );
      } else if (ageMonths > 12) {
        issues.push(`Old password (${ageMonths} months)`);
      }
    }

    return {
      entryId: entry.id,
      url: entry.url ?? "",
      username: entry.username ?? "",
      strength,
      score,
      issues,
      reusedWith,
      ageMonths,
      expired,
      twoFactorMissing: !!(entry.url?.trim() && !entry.totpSecret?.trim()),
      unsecureUrl: !!(entry.url?.trim() && !entry.url.startsWith("https://"))
    };
  });


  for (const he of healthEntries) {
    if (he.twoFactorMissing) he.issues.push("Two-factor authentication not set up");
    if (he.unsecureUrl) he.issues.push("Site does not use HTTPS");
  }


  const stats = {
    total: healthEntries.length,
    critical: healthEntries.filter((e) => e.strength === "critical").length,
    weak: healthEntries.filter((e) => e.strength === "weak").length,
    fair: healthEntries.filter((e) => e.strength === "fair").length,
    strong: healthEntries.filter((e) => e.strength === "strong").length,
    reused: healthEntries.filter((e) => e.reusedWith.length > 0).length,
    empty: loginEntries.filter((e) => !e.password?.trim()).length,
    expired: healthEntries.filter((e) => e.expired).length,
    twoFactorMissing: healthEntries.filter((e) => e.twoFactorMissing).length,
    unsecureWebsites: healthEntries.filter((e) => e.unsecureUrl).length
  };

  const overallScore =
  healthEntries.length > 0 ?
  Math.round(
    healthEntries.reduce((sum, e) => sum + e.score, 0) /
    healthEntries.length
  ) :
  100;

  return { entries: healthEntries, overallScore, stats };
}