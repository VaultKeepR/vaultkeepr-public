






export interface AutoTagResult {

  tags: Record<string, string[]>;
}


export interface BreachSummaryResult {
  severity: "low" | "medium" | "high" | "critical";
  riskType: string;
  summary: string;
  dataAtRisk: string[];
  actions: string[];
  contextNote: string;
}

export const VALID_TAGS = [
"banking", "social", "email", "shopping", "dev", "gaming",
"streaming", "cloud", "education", "health", "travel",
"government", "crypto", "news", "work", "other"] as
const;

export type ValidTag = typeof VALID_TAGS[number];


export const TAG_COLORS: Record<string, string> = {
  banking: "#f59e0b",
  social: "#3b82f6",
  email: "#8b5cf6",
  shopping: "#ec4899",
  dev: "#10b981",
  gaming: "#ef4444",
  streaming: "#f97316",
  cloud: "#06b6d4",
  education: "#6366f1",
  health: "#22c55e",
  travel: "#14b8a6",
  government: "#64748b",
  crypto: "#a855f7",
  news: "#78716c",
  work: "#0ea5e9",
  other: "#94a3b8"
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] || "#94a3b8";
}

export class VaultKeepR_SLM {
  constructor(_proxyUrl?: string) {}

  private classifyDomain(url: string, username: string): string[] {
    let domain = "";
    try {
      domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
    } catch {
      domain = (url || "").toLowerCase();
    }
    const u = `${domain} ${username || ""}`.toLowerCase();
    const rules: Array<[RegExp, string]> = [
      [/bank|paypal|stripe|revolut|n26|bnp|societe|credit|hsbc|amex|visa|mastercard/i, "banking"],
      [/gmail|outlook|yahoo|proton|mail|zoho|icloud/i, "email"],
      [/facebook|twitter|x\.com|instagram|tiktok|linkedin|discord|snapchat|reddit|mastodon/i, "social"],
      [/netflix|spotify|youtube|twitch|disney|hulu|hbo|prime\.video|deezer|applemusic/i, "streaming"],
      [/github|gitlab|bitbucket|stackoverflow|vercel|netlify|cloudflare|docker|npm|dev\.to/i, "dev"],
      [/aws|azure|gcp|google.*cloud|digitalocean|linode|heroku|scaleway|ovh/i, "cloud"],
      [/binance|coinbase|kraken|metamask|ledger|trezor|kucoin|bybit|uniswap|sushi/i, "crypto"],
      [/amazon|ebay|aliexpress|shopify|etsy|zalando|asos|shein/i, "shopping"],
      [/steampowered|epicgames|playstation|xbox|nintendo|riot|blizzard|battlenet/i, "gaming"],
      [/udemy|coursera|khanacademy|edx|duolingo|memrise|school|univ|edu\b/i, "education"],
      [/doctolib|doctors|health|medical|pharma|mayoclinic|webmd|hospital/i, "health"],
      [/booking|airbnb|expedia|skyscanner|tripadvisor|airfrance|ryanair/i, "travel"],
      [/gov\.|gouv\.|service-public|usa\.gov|irs|admin/i, "government"],
      [/nytimes|guardian|lemonde|cnn|bbc|reuters|bloomberg|mediapart|figaro/i, "news"],
      [/notion|slack|trello|asana|jira|confluence|office365|zoom|google.*workspace|teams/i, "work"],
    ];
    const tags: string[] = [];
    for (const [re, tag] of rules) {
      if (re.test(u) && tags.length < 2) tags.push(tag);
    }
    if (tags.length === 0) tags.push("other");
    return tags.slice(0, 2);
  }

  async categorizeEntries(
    entries: { id: string; url: string; username: string }[],
    _lang: string = "en",
    onProgress?: (done: number, total: number) => void,
  ): Promise<AutoTagResult> {
    const BATCH_SIZE = 30;
    const allTags: Record<string, string[]> = {};
    const totalBatches = Math.ceil(entries.length / BATCH_SIZE);
    for (let b = 0; b < totalBatches; b++) {
      const batch = entries.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
      for (const entry of batch) {
        allTags[entry.id] = this.classifyDomain(entry.url, entry.username);
      }
      if (onProgress) {
        onProgress(Math.min((b + 1) * BATCH_SIZE, entries.length), entries.length);
      }
    }
    return { tags: allTags };
  }

  async summarizeBreach(
    breachCount: number,
    siteUrl: string,
    lang: string = "en",
  ): Promise<BreachSummaryResult> {
    const isFr = lang === "fr";
    const severity = breachCount > 500 ? "critical" : breachCount > 50 ? "high" : breachCount > 5 ? "medium" : "low";
    const domain = siteUrl ? (() => { try { return new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).hostname; } catch { return siteUrl; } })() : "";
    const isBanking = /bank|paypal|stripe|revolut|n26/i.test(domain);
    const isEmail = /gmail|outlook|yahoo|proton|mail/i.test(domain);
    const isCrypto = /binance|coinbase|kraken|metamask|ledger|changelly/i.test(domain);
    const isSocial = /facebook|twitter|instagram|tiktok|linkedin|discord/i.test(domain);

    const data = isFr ? {
      riskType: isBanking ? "Fraude bancaire" : isEmail ? "Prise de contrôle" : isCrypto ? "Vol de crypto" : isSocial ? "Usurpation d'identité" : "Accès non autorisé",
      summary: `Ce mot de passe a été trouvé ${breachCount.toLocaleString()} fois dans des fuites de données publiques. Des attaquants utilisent ces listes pour tenter de se connecter automatiquement à vos comptes (credential stuffing).`,
      dataAtRisk: isBanking ? ["Coordonnées bancaires", "Historique de transactions", "Informations personnelles"] :
      isEmail ? ["Emails et contacts", "Comptes liés (récupération)", "Documents personnels"] :
      isCrypto ? ["Portefeuille crypto", "Historique de transactions", "Clés API"] :
      isSocial ? ["Données personnelles", "Messages privés", "Photos et contacts"] :
      ["Identifiants de connexion", "Informations personnelles", "Données du compte"],
      actions: ["Changer ce mot de passe immédiatement", "Activer l'authentification à deux facteurs (2FA)", "Vérifier l'activité récente du compte", "Utiliser un mot de passe unique pour chaque site"],
      contextNote: `Un mot de passe exposé ${breachCount.toLocaleString()} fois est activement exploité par des bots de credential stuffing. Le risque d'accès non autorisé est ${severity === "critical" ? "imminent" : "élevé"}.`
    } : {
      riskType: isBanking ? "Financial fraud" : isEmail ? "Account takeover" : isCrypto ? "Crypto theft" : isSocial ? "Identity theft" : "Unauthorized access",
      summary: `This password was found ${breachCount.toLocaleString()} times in public data breaches. Attackers use these lists to automatically attempt logins across services (credential stuffing).`,
      dataAtRisk: isBanking ? ["Banking credentials", "Transaction history", "Personal information"] :
      isEmail ? ["Emails and contacts", "Linked accounts (recovery)", "Personal documents"] :
      isCrypto ? ["Crypto wallet", "Transaction history", "API keys"] :
      isSocial ? ["Personal data", "Private messages", "Photos and contacts"] :
      ["Login credentials", "Personal information", "Account data"],
      actions: ["Change this password immediately", "Enable two-factor authentication (2FA)", "Review recent account activity", "Use a unique password for each site"],
      contextNote: `A password exposed ${breachCount.toLocaleString()} times is actively exploited by credential stuffing bots. The risk of unauthorized access is ${severity === "critical" ? "imminent" : "high"}.`
    };

    return { severity, ...data };
  }
}
