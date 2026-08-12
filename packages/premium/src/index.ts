



const CLOUD_QUOTA_FREE = 10 * 1024 * 1024;
const CLOUD_QUOTA_PREMIUM = 1 * 1024 * 1024 * 1024;
const CLOUD_QUOTA_CLOUD_PRO = 50 * 1024 * 1024 * 1024;
const CLOUD_QUOTA_ULTIMATE = 500 * 1024 * 1024 * 1024;
const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json"
};


export type PremiumTier = "free" | "premium" | "cloud_pro" | "ultimate";

export type DeviceInfo = {
  deviceId: string;
  platform: "web" | "extension" | "ios" | "android";
  activatedAt: string;
  lastSeenAt: string;
  label?: string;
};

export type LicenseStatus = {
  ok: boolean;
  premiumUntil: string | null;
  tier: PremiumTier;

  isCloudPro: boolean;
  devices: DeviceInfo[];
  error?: string;














  httpStatus: number;
};


export function getCloudQuotaForTier(tier: PremiumTier): number {
  switch (tier) {
    case "free":return CLOUD_QUOTA_FREE;
    case "premium":return CLOUD_QUOTA_PREMIUM;
    case "cloud_pro":return CLOUD_QUOTA_CLOUD_PRO;
    case "ultimate":return CLOUD_QUOTA_ULTIMATE;
  }
}

export function getMaxFileSizeForTier(tier: PremiumTier): number {
  if (tier === "free") return 5 * 1024 * 1024;
  if (tier === "premium") return 25 * 1024 * 1024;
  if (tier === "cloud_pro") return 25 * 1024 * 1024;
  return 50 * 1024 * 1024;
}


export function getMaxSecureDocumentsForTier(tier: PremiumTier): number {
  switch (tier) {
    case "free":return 1;
    case "premium":return 2;
    case "cloud_pro":return 5;
    case "ultimate":return 99999;
  }
}


export function tierHasCloud(_tier: PremiumTier): boolean {
  return true;
}


export function parseTier(raw: string | null | undefined): PremiumTier {
  if (raw === "premium" || raw === "cloud_pro" || raw === "ultimate") return raw;
  return "free";
}

export function isPremiumUntilValid(until: string | null | undefined): boolean {
  if (!until) return false;
  try {
    return new Date() < new Date(until);
  } catch {
    return false;
  }
}




export async function activateLicense(
apiBaseUrl: string,
key: string,
deviceId: string,
platform: "web" | "extension" | "ios" | "android",
label?: string,
walletAddress?: string)
: Promise<LicenseStatus> {
  const url = `${apiBaseUrl.replace(/\/$/, "")}/api/premium/activate`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ key, deviceId, platform, label, walletAddress })
    });
  } catch {
    return {
      ok: false,
      premiumUntil: null,
      tier: "free",
      isCloudPro: false,
      devices: [],
      error: "network",
      httpStatus: 0
    };
  }
  let data: {ok?: boolean;premiumUntil?: string | null;tier?: string;devices?: DeviceInfo[];error?: string;} = {};
  try {data = await res.json();} catch {
    return {
      ok: false,
      premiumUntil: null,
      tier: "free",
      isCloudPro: false,
      devices: [],
      error: "non-json",
      httpStatus: res.status
    };
  }
  const tier = parseTier(data.tier);
  return {
    ok: res.ok && (data.ok ?? true),
    premiumUntil: data.premiumUntil || null,
    tier,
    isCloudPro: tier === "cloud_pro" || tier === "ultimate",
    devices: data.devices || [],
    error: data.error,
    httpStatus: res.status
  };
}




export async function getLicenseStatus(
apiBaseUrl: string,
key: string,
deviceId?: string)
: Promise<LicenseStatus> {
  const url = new URL(`${apiBaseUrl.replace(/\/$/, "")}/api/premium`);
  url.searchParams.set("key", key.trim().toUpperCase());
  if (deviceId) url.searchParams.set("deviceId", deviceId);

  let res: Response;
  try {
    res = await fetch(url.toString(), { method: "GET", headers: defaultHeaders });
  } catch {

    return {
      ok: false,
      premiumUntil: null,
      tier: "free",
      isCloudPro: false,
      devices: [],
      error: "network",
      httpStatus: 0
    };
  }

  let data: {premiumUntil?: string | null;tier?: string;devices?: DeviceInfo[];error?: string;} = {};
  try {
    data = await res.json();
  } catch {


    return {
      ok: false,
      premiumUntil: null,
      tier: "free",
      isCloudPro: false,
      devices: [],
      error: "non-json",
      httpStatus: res.status
    };
  }
  const tier = parseTier(data.tier);
  return {
    ok: res.ok,
    premiumUntil: data.premiumUntil || null,
    tier,
    isCloudPro: tier === "cloud_pro" || tier === "ultimate",
    devices: data.devices || [],
    error: data.error,
    httpStatus: res.status
  };
}





export async function activateIAP(
apiBaseUrl: string,
receipt: string,
deviceId: string,
label?: string,
platform?: "ios" | "android",
productId?: string)
: Promise<{ok: boolean;licenseKey?: string;premiumUntil?: string;error?: string;}> {
  const url = `${apiBaseUrl.replace(/\/$/, "")}/api/premium/activate-iap`;
  const res = await fetch(url, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ receipt, deviceId, label, platform, productId })
  });
  return res.json();
}




export async function removeDevice(
apiBaseUrl: string,
key: string,
deviceId: string)
: Promise<{ok: boolean;error?: string;}> {
  const url = `${apiBaseUrl.replace(/\/$/, "")}/api/premium/device`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: defaultHeaders,
    body: JSON.stringify({ key, deviceId })
  });
  return res.json();
}




export async function getPremiumStatus(
apiBaseUrl: string,
userId: string)
: Promise<{premiumUntil: string | null;tier: PremiumTier;isCloudPro: boolean;licenseKey?: string;devices?: DeviceInfo[];}> {
  const normalized = normalizeUserId(userId);
  if (!normalized) return { premiumUntil: null, tier: "free", isCloudPro: false };
  const url = `${apiBaseUrl.replace(/\/$/, "")}/api/premium?userId=${encodeURIComponent(normalized)}`;
  const res = await fetch(url, { method: "GET", headers: defaultHeaders });
  if (!res.ok) return { premiumUntil: null, tier: "free", isCloudPro: false };
  const data = (await res.json()) as {premiumUntil?: string | null;tier?: string;licenseKey?: string;devices?: DeviceInfo[];};
  const tier = parseTier(data.tier);
  return {
    premiumUntil: data.premiumUntil || null,
    tier,
    isCloudPro: tier === "cloud_pro" || tier === "ultimate",
    licenseKey: data.licenseKey,
    devices: data.devices
  };
}




export async function syncPremium(
apiBaseUrl: string,
userId: string,
premiumUntil: string,
apiKey?: string)
: Promise<{ok: boolean;error?: string;}> {
  const normalized = normalizeUserId(userId);
  if (!normalized) return { ok: false, error: "Identifiant invalide." };
  const url = `${apiBaseUrl.replace(/\/$/, "")}/api/premium`;
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
  };
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId: normalized, premiumUntil })
  });
  return { ok: res.ok, error: res.ok ? undefined : await res.text() };
}

function normalizeUserId(userId: string): string {
  return userId.trim().toLowerCase();
}