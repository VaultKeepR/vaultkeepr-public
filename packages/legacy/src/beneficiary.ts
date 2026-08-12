








import type { Address } from "viem";
import { getAddress, isAddress } from "viem";
import type { BeneficiaryInfo } from "./types";
import { MAX_BENEFICIARIES } from "./types";
import { isValidPublicKey } from "./envelope";




interface InviteLinkData {

  ownerAddress: Address;

  ownerPublicKey: string;

  version: number;
}











export function generateInviteLink(
baseUrl: string,
ownerAddress: Address,
ownerPublicKey: string)
: string {
  const data: InviteLinkData = {
    ownerAddress,
    ownerPublicKey: ownerPublicKey.replace(/^0x/, ""),
    version: 1
  };
  const encoded = btoa(JSON.stringify(data));
  return `${baseUrl}#${encoded}`;
}




export function parseInviteLink(url: string): InviteLinkData | null {
  try {
    const hash = url.split("#")[1];
    if (!hash) return null;
    const json = atob(hash);
    const data = JSON.parse(json) as InviteLinkData;
    if (!data.ownerAddress || !data.ownerPublicKey || !data.version) return null;
    if (!isAddress(data.ownerAddress)) return null;
    return data;
  } catch {
    return null;
  }
}




export interface LegacyQrData {
  type: "legacy-beneficiary";
  address: Address;
  publicKey: string;
  label?: string;
}




export function generateBeneficiaryQrPayload(
address: Address,
publicKey: string,
label?: string)
: string {
  const data: LegacyQrData = {
    type: "legacy-beneficiary",
    address,
    publicKey: publicKey.replace(/^0x/, ""),
    label
  };
  return JSON.stringify(data);
}




export function parseBeneficiaryQrPayload(raw: string): LegacyQrData | null {
  try {
    const data = JSON.parse(raw) as LegacyQrData;
    if (data.type !== "legacy-beneficiary") return null;
    if (!data.address || !data.publicKey) return null;
    if (!isAddress(data.address)) return null;
    return data;
  } catch {
    return null;
  }
}







export function validateBeneficiaryAddress(address: string): {
  valid: boolean;
  normalized?: Address;
  error?: string;
} {
  if (!address || typeof address !== "string") {
    return { valid: false, error: "Address is empty" };
  }
  if (!isAddress(address)) {
    return { valid: false, error: "Invalid Ethereum address format" };
  }
  try {
    const normalized = getAddress(address);
    return { valid: true, normalized };
  } catch {
    return { valid: false, error: "Invalid checksum" };
  }
}




export function validateBeneficiary(info: BeneficiaryInfo): {
  valid: boolean;
  error?: string;
} {
  const addrResult = validateBeneficiaryAddress(info.address);
  if (!addrResult.valid) return { valid: false, error: addrResult.error };

  if (!info.publicKey) {
    return { valid: false, error: "Public key is required" };
  }
  if (!isValidPublicKey(info.publicKey)) {
    return { valid: false, error: "Invalid secp256k1 public key" };
  }

  return { valid: true };
}




export function validateBeneficiaryList(beneficiaries: BeneficiaryInfo[]): {
  valid: boolean;
  error?: string;
} {
  if (beneficiaries.length === 0) {
    return { valid: false, error: "At least 1 beneficiary required" };
  }
  if (beneficiaries.length > MAX_BENEFICIARIES) {
    return { valid: false, error: `Maximum ${MAX_BENEFICIARIES} beneficiaries` };
  }


  const seen = new Set<string>();
  for (const b of beneficiaries) {
    const addr = b.address.toLowerCase();
    if (seen.has(addr)) {
      return { valid: false, error: `Duplicate address: ${b.address}` };
    }
    seen.add(addr);

    const result = validateBeneficiary(b);
    if (!result.valid) return result;
  }

  return { valid: true };
}






export function formatAddressShort(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}