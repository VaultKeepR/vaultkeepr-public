








export function calculateMrzChecksum(str: string): number {
  const weights = [7, 3, 1];
  let sum = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i].toUpperCase();
    let val = 0;

    if (char >= "0" && char <= "9") {
      val = parseInt(char, 10);
    } else if (char >= "A" && char <= "Z") {
      val = char.charCodeAt(0) - 55;
    } else if (char === "<") {
      val = 0;
    }

    sum += val * weights[i % 3];
  }

  return sum % 10;
}




export function cleanMrzField(str: string): string {
  return str.replace(/<+$/g, "").replace(/</g, " ").trim();
}





export function parseMrzDate(str: string): string {
  if (str.length !== 6) return "";
  const yy = parseInt(str.substring(0, 2), 10);
  const mm = str.substring(2, 4);
  const dd = str.substring(4, 6);

  const yearPrefix = yy > 50 ? "19" : "20";
  return `${yearPrefix}${yy}-${mm}-${dd}`;
}