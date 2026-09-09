










import { sendHeartbeatOnChain, readLegacyFromChain } from "./contract";
import type { HeartbeatStatus } from "./types";
import { HEARTBEAT_DEBOUNCE_MS } from "./types";
import type { Address } from "viem";

import { logger } from "@vaultkeepr/logger";


let _debounceTimer: ReturnType<typeof setTimeout> | null = null;
let _lastSentTimestamp: number = 0;
let _isPublishing: boolean = false;
let _pendingSmartAccount: any | null = null;












export function scheduleLegacyHeartbeat(smartAccount: any): void {
  const now = Date.now();


  if (now - _lastSentTimestamp < HEARTBEAT_DEBOUNCE_MS) {
    return;
  }

  _pendingSmartAccount = smartAccount;


  if (_debounceTimer) {
    clearTimeout(_debounceTimer);
  }


  _debounceTimer = setTimeout(() => {
    _executeHeartbeat();
  }, 5000);
}




export async function flushLegacyHeartbeat(): Promise<boolean> {
  if (!_pendingSmartAccount || _isPublishing) return true;

  if (_debounceTimer) {
    clearTimeout(_debounceTimer);
    _debounceTimer = null;
  }

  return _executeHeartbeat();
}




export function computeHeartbeatStatus(
lastHeartbeat: number,
delaySeconds: number,
gracePeriodSeconds: number)
: HeartbeatStatus {
  const now = Math.floor(Date.now() / 1000);
  const deadline = lastHeartbeat + delaySeconds + gracePeriodSeconds;
  const delayEnd = lastHeartbeat + delaySeconds;
  const secondsRemaining = deadline - now;
  const daysRemaining = Math.ceil(secondsRemaining / 86400);

  return {
    lastHeartbeat,
    deadline,
    daysRemaining,
    isExpired: now > delayEnd,
    isInGracePeriod: now > delayEnd && now <= deadline,
    isClaimable: now > deadline
  };
}




export async function getLegacyHeartbeatStatus(
ownerAddress: Address)
: Promise<HeartbeatStatus | null> {
  const config = await readLegacyFromChain(ownerAddress);
  if (!config || !config.active) return null;

  return computeHeartbeatStatus(
    config.lastHeartbeat,
    config.delaySeconds,
    config.gracePeriodSeconds
  );
}




export function resetLegacyHeartbeat(): void {
  if (_debounceTimer) {
    clearTimeout(_debounceTimer);
    _debounceTimer = null;
  }
  _pendingSmartAccount = null;
  _lastSentTimestamp = 0;
  _isPublishing = false;
}



async function _executeHeartbeat(): Promise<boolean> {
  if (!_pendingSmartAccount || _isPublishing) return false;

  _isPublishing = true;
  try {
    const txHash = await sendHeartbeatOnChain(_pendingSmartAccount);
    if (txHash) {
      _lastSentTimestamp = Date.now();
      logger.debug(`[Legacy] Heartbeat on-chain OK : ${txHash}`);
      return true;
    }
    return false;
  } catch (error: any) {

    if (error.message?.includes("HeartbeatCooldown")) {
      _lastSentTimestamp = Date.now();
      return true;
    }
    logger.error("[Legacy] Heartbeat erreur:", error.message);
    return false;
  } finally {
    _isPublishing = false;
  }
}