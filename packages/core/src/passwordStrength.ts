




export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export interface PasswordStrengthResult {
  score: number;
  feedback: string[];
  strength: PasswordStrengthLevel;
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;


  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
  } else if (password.length >= 6) {
    score += 5;
  } else {
    feedback.push("passwordFeedback.tooShort");
  }


  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("passwordFeedback.addUppercase");
  }


  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("passwordFeedback.addLowercase");
  }


  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push("passwordFeedback.addNumbers");
  }


  if (/[^A-Za-z0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push("passwordFeedback.addSpecialChars");
  }


  if (!/(.)\\1{2,}/.test(password)) {
    score += 10;
  } else {
    feedback.push("passwordFeedback.avoidRepeated");
  }


  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const types = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (types >= 3) {
    score += 10;
  } else {
    feedback.push("passwordFeedback.useMultipleTypes");
  }


  let strength: PasswordStrengthLevel = "weak";
  if (score >= 80) {
    strength = "strong";
  } else if (score >= 50) {
    strength = "medium";
  }


  if (score < 30) {
    feedback.length = 0;
    feedback.push("passwordFeedback.veryWeak");
  }

  return { score: Math.min(score, 100), feedback, strength };
}