














import { useSyncExternalStore, useCallback } from "react";
import type { Address } from "viem";
import {
  subscribeIdentity,
  getIdentitySnapshot,
  signMessageWithIdentity,
  clearIdentity,
  getIdentitySmartAccount,
  type IdentityState } from
"./identity";
import {
  scheduleCidOnChainSync,
  flushCidOnChainSync,
  resetOnChainSync } from
"./onChainSync";
import { clearSmartAccountCache } from "./kernel";


const _emptyState: IdentityState = {
  owner: null,
  smartAccount: null,
  mode: null,
  initialized: false
};
function getServerSnapshot() {
  return _emptyState;
}

export interface UseIdentityReturn {

  address: Address | null;

  isConnected: boolean;

  mode: "password" | "passkey" | "biometric" | null;

  smartAccountAddress: Address | null;




  signMessage: (message: string) => Promise<`0x${string}`>;

  disconnect: () => void;




  notifyOnChainSync: (cid: string) => void;



  cleanupOnLock: () => Promise<void>;



  flushOnChainSync: () => Promise<void>;
}







export function useIdentity(): UseIdentityReturn {
  const state = useSyncExternalStore(
    subscribeIdentity,
    getIdentitySnapshot,
    getServerSnapshot
  );

  const signMessage = useCallback(
    async (message: string) => {
      return signMessageWithIdentity(message);
    },
    []
  );

  const disconnect = useCallback(() => {
    clearIdentity();
  }, []);

  const notifyOnChainSync = useCallback(
    (cid: string) => {
      const sa = getIdentitySmartAccount();
      if (!sa) return;
      scheduleCidOnChainSync(sa, cid);
    },
    []
  );

  const cleanupOnLock = useCallback(async () => {
    await flushCidOnChainSync().catch(() => {});
    clearSmartAccountCache();
    resetOnChainSync();
    clearIdentity();
  }, []);

  const flushOnChainSync = useCallback(async () => {
    await flushCidOnChainSync().catch(() => {});
  }, []);

  return {
    address: state.owner?.address ?? null,
    isConnected: state.initialized && state.owner !== null,
    mode: state.mode,
    smartAccountAddress: state.smartAccount?.address ?? null,
    signMessage,
    disconnect,
    notifyOnChainSync,
    cleanupOnLock,
    flushOnChainSync
  };
}