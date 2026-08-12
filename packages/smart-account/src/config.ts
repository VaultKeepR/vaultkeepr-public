





import { type Chain } from "viem";
import { base } from "viem/chains";


export const TARGET_CHAIN: Chain = base;








export function getPimlicoApiKey(): string {


  let key = "";
  try {key = process.env.PIMLICO_API_KEY || "";} catch {}
  if (key) return key;
  try {key = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || "";} catch {}
  return key;
}












export function getPimlicoUrl(): string {
  let proxyUrl = "";
  try {proxyUrl = process.env.PIMLICO_PROXY_URL || "";} catch {}
  if (!proxyUrl) {
    try {proxyUrl = process.env.NEXT_PUBLIC_PIMLICO_PROXY_URL || "";} catch {}
  }
  if (!proxyUrl) {
    try {proxyUrl = process.env.EXPO_PUBLIC_PIMLICO_PROXY_URL || "";} catch {}
  }
  if (proxyUrl) {
    return proxyUrl;
  }
  throw new Error(
    "[SmartAccount] Aucun proxy bundler configure. " +
    "Configurez PIMLICO_PROXY_URL (le fallback direct api.pimlico.io a " +
    "ete supprime pour ne pas exposer la cle API dans le bundle client)."
  );
}




export function isSmartAccountConfigured(): boolean {
  let proxyUrl = "";
  try {proxyUrl = process.env.PIMLICO_PROXY_URL || "";} catch {}
  if (!proxyUrl) {try {proxyUrl = process.env.NEXT_PUBLIC_PIMLICO_PROXY_URL || "";} catch {}}
  if (!proxyUrl) {try {proxyUrl = process.env.EXPO_PUBLIC_PIMLICO_PROXY_URL || "";} catch {}}
  return !!proxyUrl;
}




export function getTargetChain(): Chain {
  return TARGET_CHAIN;
}