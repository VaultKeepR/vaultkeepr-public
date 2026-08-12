export function getDomain(): string {
  const d = process.env.ALIAS_DOMAIN || process.env.MAIL_DOMAIN || "vaultkeepr.xyz";
  return d.toLowerCase().replace(/^www\./, "");
}