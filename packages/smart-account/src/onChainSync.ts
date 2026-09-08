



















import { publishCidOnChain, isCidRegistryConfigured } from "./cidRegistry";
import type { VaultSmartAccount } from "./kernel";

import { logger } from "@vault-keeper/logger";



const DEFAULT_DEBOUNCE_MS = 5 * 60 * 1000;



let _pendingCid: string | null = null;
let _pendingSmartAccount: VaultSmartAccount | null = null;
let _debounceTimer: ReturnType<typeof setTimeout> | null = null;
let _lastPublishedCid: string | null = null;
let _lastPublishTime: number = 0;
let _isPublishing: boolean = false;












export function scheduleCidOnChainSync(
smartAccount: VaultSmartAccount | null,
cid: string,
debounceMs: number = DEFAULT_DEBOUNCE_MS)
: void {
  if (!isCidRegistryConfigured()) return;


  if (cid === _lastPublishedCid) {
    logger.debug("[OnChainSync] CID identique, skip");
    return;
  }


  const sa = smartAccount ?? _pendingSmartAccount;
  if (!sa) {
    logger.warn("[OnChainSync] Pas de Smart Account disponible, skip");
    return;
  }


  _pendingCid = cid;
  _pendingSmartAccount = sa;


  if (_debounceTimer) {
    clearTimeout(_debounceTimer);
  }


  _debounceTimer = setTimeout(() => {
    _executeSync();
  }, debounceMs);

  logger.debug(
    `[OnChainSync] CID planifié dans ${(debounceMs / 1000).toFixed(0)}s : ${cid.slice(0, 20)}...`
  );
}







export async function flushCidOnChainSync(): Promise<boolean> {
  logger.debug(
    "[OnChainSync] flush demandé — pending:",
    _pendingCid?.slice(0, 20),
    "SA:",
    !!_pendingSmartAccount
  );
  if (!_pendingCid || !_pendingSmartAccount) {
    logger.debug("[OnChainSync] Rien à flush");
    return true;
  }


  if (_debounceTimer) {
    clearTimeout(_debounceTimer);
    _debounceTimer = null;
  }

  logger.debug("[OnChainSync] Flush immédiat...");
  return _executeSync();
}




export function getOnChainSyncStatus(): {
  hasPending: boolean;
  pendingCid: string | null;
  lastPublishedCid: string | null;
  lastPublishTime: number;
  isPublishing: boolean;
} {
  return {
    hasPending: _pendingCid !== null && _pendingCid !== _lastPublishedCid,
    pendingCid: _pendingCid,
    lastPublishedCid: _lastPublishedCid,
    lastPublishTime: _lastPublishTime,
    isPublishing: _isPublishing
  };
}




export function resetOnChainSync(): void {
  if (_debounceTimer) {
    clearTimeout(_debounceTimer);
    _debounceTimer = null;
  }
  _pendingCid = null;
  _pendingSmartAccount = null;
  _lastPublishedCid = null;
  _lastPublishTime = 0;
  _isPublishing = false;
}



async function _executeSync(): Promise<boolean> {
  if (!_pendingCid || !_pendingSmartAccount || _isPublishing) return false;


  if (_pendingCid === _lastPublishedCid) {
    _pendingCid = null;
    return true;
  }

  _isPublishing = true;
  const cid = _pendingCid;
  const sa = _pendingSmartAccount;

  try {
    logger.debug(`[OnChainSync] Publication on-chain: ${cid.slice(0, 20)}...`);
    const txHash = await publishCidOnChain(sa, cid);

    if (txHash) {
      _lastPublishedCid = cid;
      _lastPublishTime = Date.now();
      _pendingCid = null;
      logger.debug(
        `[OnChainSync] ✅ CID publié on-chain : ${cid.slice(0, 20)}...`
      );
      return true;
    }

    logger.warn("[OnChainSync] Publication échouée (null txHash)");
    return false;
  } catch (error) {
    logger.error("[OnChainSync] Erreur publication:", error instanceof Error ? error.message : error);
    return false;
  } finally {
    _isPublishing = false;
  }
}