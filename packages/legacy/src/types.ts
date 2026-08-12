






import type { Address, LocalAccount } from "viem";




export interface LegacyConfig {

  envelopeCid: string;

  delaySeconds: number;

  gracePeriodSeconds: number;

  lastHeartbeat: number;

  registeredAt: number;

  active: boolean;

  claimed: boolean;

  claimedBy: Address;

  beneficiaryCount: number;
}


export interface LegacyBeneficiaryList {
  beneficiaries: Address[];
}




export interface LegacyEnvelope {

  version: 1;

  ownerPublicKey: string;

  beneficiaryPublicKey: string;

  ciphertext: string;

  nonce: string;
}


export interface LegacyEnvelopeBundle {

  version: 1;

  owner: Address;

  envelopes: Record<string, LegacyEnvelope>;

  createdAt: number;
}




export interface LegacyPayload {

  masterKey: string;

  vaultCid: string;
}




export interface HeartbeatStatus {

  lastHeartbeat: number;

  deadline: number;

  daysRemaining: number;

  isExpired: boolean;

  isInGracePeriod: boolean;

  isClaimable: boolean;
}


export interface LegacySetupParams {

  delayDays: number;

  gracePeriodDays: number;

  beneficiaries: BeneficiaryInfo[];

  masterKey: string;

  vaultCid: string;
}


export interface BeneficiaryInfo {

  address: Address;

  publicKey: string;

  label?: string;
}







export interface BeneficiaryContact {

  label: string;

  email?: string;

  telegram?: string;

  address?: Address;

  publicKey?: string;

  status: "pending" | "confirmed";

  inviteToken?: string;
}


export function isValidBeneficiaryContact(b: BeneficiaryContact): boolean {
  return !!(b.email || b.telegram || b.address);
}


export interface IncomingLegacy {

  ownerAddress: Address;

  isClaimable: boolean;

  isClaimed: boolean;

  deadline: number;

  daysRemaining: number;
}



export const LEGACY_VERSION = 1;
export const MAX_BENEFICIARIES = 5;
export const MIN_DELAY_DAYS = 30;
export const MAX_DELAY_DAYS = 730;
export const MIN_GRACE_DAYS = 3;
export const MAX_GRACE_DAYS = 30;
export const HEARTBEAT_DEBOUNCE_MS = 24 * 60 * 60 * 1000;
export const HKDF_LEGACY_INFO = "vaultkeepr-legacy-v1";