





const GATEWAY_ARIO = "https://gateway.ar.io";

const IPFS_GATEWAYS_DEFAULT = ["https://ipfs.io/ipfs", "https://dweb.link/ipfs"];
const FETCH_TIMEOUT_MS = 30_000;

const IPFS_GATEWAY_TIMEOUT_MS = 15_000;


let customIpfsGateways: string[] = [];


export function setIpfsGateways(gateways: string[]): void {
  customIpfsGateways = (gateways || []).filter(Boolean).map((g) => g.replace(/\/$/, ""));
}


export function isIpfsCid(id: string): boolean {
  const s = (id || "").trim();
  return s.startsWith("Qm") || s.startsWith("bafy") || s.startsWith("ba");
}




export function isS3Cid(id: string): boolean {
  return (id || "").trim().startsWith("s3_");
}

export interface TurboClient {
  upload(opts: {data: Uint8Array;dataItemOpts?: {tags?: Array<{name: string;value: string;}>;};}): Promise<{id?: string;dataItemId?: string;}>;
}





export function normalizeVaultLocation(input: string): string {
  const s = (input || "").trim();
  if (!s) throw new Error("Identifiant vide.");
  return s;
}


export function normalizeCid(input: string): string {
  return normalizeVaultLocation(input);
}

function fetchIpfsFromGateway(base: string, id: string): Promise<string> {
  const url = `${base.replace(/\/$/, "")}/${id}`;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), IPFS_GATEWAY_TIMEOUT_MS) : null;
  return fetch(url, { signal: controller?.signal }).
  then((res) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }).
  catch((e) => {
    if (timeoutId) clearTimeout(timeoutId);
    throw e;
  });
}


async function fetchFromIpfsGateways(cid: string): Promise<string> {
  const id = normalizeVaultLocation(cid);
  const gateways = [...customIpfsGateways, ...IPFS_GATEWAYS_DEFAULT].filter(Boolean);
  if (gateways.length === 0) {
    throw new Error("Impossible de récupérer le contenu depuis IPFS.");
  }
  const attempts = gateways.map((base) => fetchIpfsFromGateway(base, id));
  try {
    return await Promise.any(attempts);
  } catch {
    throw new Error("Impossible de récupérer le contenu depuis IPFS.");
  }
}


let cloudApiBase = "";




export function setCloudApiBase(base: string): void {
  cloudApiBase = (base || "").replace(/\/$/, "");
}




async function fetchFromS3(contentId: string, walletAddress?: string): Promise<string> {
  const base = cloudApiBase ||
  typeof process !== "undefined" && (process as {env?: Record<string, string>;}).env?.NEXT_PUBLIC_APP_URL ||
  typeof process !== "undefined" && (process as {env?: Record<string, string>;}).env?.EXPO_PUBLIC_API_URL ||
  "https://app.vaultkeepr.xyz";

  const params = new URLSearchParams({ cid: contentId });
  if (walletAddress) params.set("wallet", walletAddress.toLowerCase());

  const url = `${base}/api/cloud/download?${params.toString()}`;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;

  try {
    const res = await fetch(url, { signal: controller?.signal });
    if (timeoutId) clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`S3 fetch: ${res.status}`);
    return res.text();
  } catch (e) {
    if (timeoutId) clearTimeout(timeoutId);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("AbortError") || msg.includes("abort")) {
      throw new Error("Delai de connexion depasse (30 s).");
    }
    throw e;
  }
}


export async function fetchFromStorage(txId: string, walletAddress?: string): Promise<string> {
  const id = normalizeVaultLocation(txId);


  if (isS3Cid(id)) {
    return fetchFromS3(id, walletAddress);
  }

  if (isIpfsCid(id)) {
    return fetchFromIpfsGateways(id);
  }
  const url = `${GATEWAY_ARIO}/${id}`;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;
  try {
    const res = await fetch(url, { signal: controller?.signal });
    if (timeoutId) clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Arweave fetch: ${res.status}`);
    return res.text();
  } catch (e) {
    if (timeoutId) clearTimeout(timeoutId);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("AbortError") || msg.includes("abort")) {
      throw new Error("Délai de connexion dépassé (30 s).");
    }
    throw e;
  }
}


export async function fetchFromIpfs(txId: string): Promise<string> {
  return fetchFromStorage(txId);
}

export type UploadResult = {
  cid: string;
  provider: "turbo";
};


export async function uploadToStorage(
content: string,
turbo: TurboClient)
: Promise<UploadResult> {
  const data = new TextEncoder().encode(content);
  if (data.length > 102_400) {
    throw new Error("Vault > 100 KiB : top-up Turbo requis (turbo.ar.io).");
  }
  const result = await turbo.upload({
    data,
    dataItemOpts: {
      tags: [
      { name: "Content-Type", value: "application/json" },
      { name: "App-Name", value: "VaultKeeper" }]

    }
  });
  const id = result?.id ?? result?.dataItemId;
  if (!id) throw new Error("Pas de transaction ID retournée par Turbo.");
  return { cid: id, provider: "turbo" };
}

export function getGatewayUrl(txId: string): string {
  return `${GATEWAY_ARIO}/${normalizeVaultLocation(txId)}`;
}


const envGateway =
typeof process !== "undefined" && (process as {env?: Record<string, string>;}).env?.EXPO_PUBLIC_IPFS_GATEWAY ||
typeof process !== "undefined" && (process as {env?: Record<string, string>;}).env?.NEXT_PUBLIC_IPFS_GATEWAY;
if (envGateway) {
  setIpfsGateways([envGateway]);
}