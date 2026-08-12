















import { logger, redactAddress } from "@vault-keeper/logger";

import type { Address, LocalAccount } from "viem";
import { getOwnerFromPassword } from "./owner";
import {
  createVaultSmartAccount,
  clearSmartAccountCache,
  type VaultSmartAccount } from
"./kernel";
import { isSmartAccountConfigured } from "./config";



export interface IdentityState {

  owner: LocalAccount | null;

  smartAccount: VaultSmartAccount | null;

  mode: "password" | "passkey" | "biometric" | null;

  initialized: boolean;
}

let _state: IdentityState = {
  owner: null,
  smartAccount: null,
  mode: null,
  initialized: false
};


type IdentityListener = (state: IdentityState) => void;
const _listeners = new Set<IdentityListener>();

function _notify() {
  for (const fn of _listeners) {
    try {
      fn(_state);
    } catch {}
  }
}











export async function initIdentityFromPassword(
password: string,
secretKey?: string)
: Promise<{address: Address;smartAccountAddress: Address | null;}> {
  const owner = await getOwnerFromPassword(password, secretKey);

  let sa: VaultSmartAccount | null = null;
  if (isSmartAccountConfigured()) {
    try {
      sa = await createVaultSmartAccount({
        ownerAccount: owner,
        mode: "password"
      });
    } catch (e) {
      logger.warn("[Identity] SA init failed (non-blocking):", (e as Error).message);
    }
  }

  _state = {
    owner,
    smartAccount: sa,
    mode: "password",
    initialized: true
  };
  _notify();

  logger.debug(
    `[Identity] Connecté (password) — adresse: ${redactAddress(owner.address)}` + (
    sa ? ` | SA: ${redactAddress(sa.address)}` : "") + (
    secretKey ? ` | SK: ✓` : " | no secretKey")
  );

  return {
    address: owner.address,
    smartAccountAddress: sa?.address ?? null
  };
}





export async function initIdentityFromSigner(
signer: LocalAccount,
mode: "passkey" | "biometric" = "passkey")
: Promise<{address: Address;smartAccountAddress: Address | null;}> {
  let sa: VaultSmartAccount | null = null;
  if (isSmartAccountConfigured()) {
    try {
      sa = await createVaultSmartAccount({ ownerAccount: signer, mode });
    } catch (e) {
      logger.warn("[Identity] SA init failed (non-blocking):", (e as Error).message);
    }
  }

  _state = {
    owner: signer,
    smartAccount: sa,
    mode,
    initialized: true
  };
  _notify();

  logger.info(
    `[Identity] Connected (${mode}) — address: ${signer.address}` + (
    sa ? ` | SA: ${sa.address}` : "")
  );

  return {
    address: signer.address,
    smartAccountAddress: sa?.address ?? null
  };
}




export function clearIdentity(): void {
  _state = {
    owner: null,
    smartAccount: null,
    mode: null,
    initialized: false
  };
  clearSmartAccountCache();
  _notify();
  logger.info("[Identity] Disconnected");
}




export function getIdentityAddress(): Address | null {
  return _state.owner?.address ?? null;
}


export function isIdentityConnected(): boolean {
  return _state.initialized && _state.owner !== null;
}


export function getIdentityOwner(): LocalAccount | null {
  return _state.owner;
}


export function getIdentitySmartAccount(): VaultSmartAccount | null {
  return _state.smartAccount;
}


export function getIdentityMode(): IdentityState["mode"] {
  return _state.mode;
}









export async function signMessageWithIdentity(
message: string)
: Promise<`0x${string}`> {
  if (!_state.owner) {
    throw new Error("[Identity] Pas connecté — impossible de signer");
  }
  return _state.owner.signMessage({ message });
}







export function subscribeIdentity(listener: IdentityListener): () => void {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}




export function getIdentitySnapshot(): IdentityState {
  return _state;
}