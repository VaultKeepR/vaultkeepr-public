




export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | null;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function getCardBrand(number: string): CardBrand {
  const d = digitsOnly(number);
  if (d.length < 2) return null;
  if (d.startsWith("4")) return "visa";
  if (d.startsWith("34") || d.startsWith("37")) return "amex";
  if (d.startsWith("51") || d.startsWith("52") || d.startsWith("53") || d.startsWith("54") || d.startsWith("55")) return "mastercard";
  const n = parseInt(d.slice(0, 4), 10);
  if (n >= 2221 && n <= 2720) return "mastercard";
  if (d.startsWith("6011") || d.startsWith("65")) return "discover";
  const n3 = parseInt(d.slice(0, 3), 10);
  if (n3 >= 644 && n3 <= 649) return "discover";
  return null;
}

export function getLast4(number: string): string {
  const d = digitsOnly(number);
  return d.slice(-4);
}


export function maskCardNumber(number: string): string {
  const d = digitsOnly(number);
  const last4 = d.slice(-4);
  if (d.length <= 4) return last4 ? "•••• " + last4 : "••••";
  return "•••• •••• •••• " + last4;
}


export function formatCardNumber(number: string, brand?: CardBrand | null): string {
  const d = digitsOnly(number);
  if (brand === "amex") {
    const g1 = d.slice(0, 4);
    const g2 = d.slice(4, 10);
    const g3 = d.slice(10, 15);
    return [g1, g2, g3].filter(Boolean).join(" ");
  }
  const groups = d.match(/.{1,4}/g) || [];
  return groups.join(" ");
}


export function formatCardDisplayMasked(rawDigits: string, brand?: CardBrand | null): string {
  const d = digitsOnly(rawDigits).slice(0, 19);
  if (!d) return "";
  if (brand === "amex") {
    if (d.length <= 4) return d;
    if (d.length <= 10) return "•••• " + d.slice(4);
    return "•••• •••••• " + d.slice(10);
  }
  if (d.length <= 4) return d;
  if (d.length <= 8) return "•••• " + d.slice(4);
  if (d.length <= 12) return "•••• •••• " + d.slice(8);
  return "•••• •••• •••• " + d.slice(12);
}

export const CARD_BRAND_LABELS: Record<NonNullable<CardBrand>, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover"
};