









import type { Address } from "viem";
import type { LegacySetupParams, LegacyConfig, IncomingLegacy, LegacyEnvelopeBundle } from "./types";
import {
  createEnvelopeBundle,
  decryptFromBundle,
  hashEnvelopeBundle } from
"./envelope";
import {
  registerLegacyOnChain,
  readLegacyFromChain,
  claimLegacyOnChain,
  revokeLegacyOnChain,
  isClaimableOnChain,
  readBeneficiariesFromChain,
  readDeadlineFromChain } from
"./contract";
import { computeHeartbeatStatus } from "./heartbeat";
import { validateBeneficiaryList } from "./beneficiary";

import { logger } from "@vault-keeper/logger";



export interface IpfsAdapter {
  upload(data: string): Promise<string>;
  download(cid: string): Promise<string>;
}


interface SmartAccountClient {
  client: {
    sendUserOperation: (params: {
      calls: Array<{to: Address;data: `0x${string}`;value: bigint;}>;
    }) => Promise<`0x${string}`>;
    waitForUserOperationReceipt: (params: {
      hash: `0x${string}`;
    }) => Promise<{receipt: {transactionHash: `0x${string}`;};}>;
  };
  address: Address;
}



export interface SetupLegacyResult {

  envelopeCid: string;

  envelopeHash: string;

  txHash: string;
}














export async function setupLegacy(
smartAccount: SmartAccountClient,
ownerPrivateKey: string,
params: LegacySetupParams,
ipfs: IpfsAdapter)
: Promise<SetupLegacyResult> {

  const validation = validateBeneficiaryList(params.beneficiaries);
  if (!validation.valid) {
    throw new Error(`Invalid beneficiaries: ${validation.error}`);
  }

  const delaySeconds = params.delayDays * 86400;
  const gracePeriodSeconds = params.gracePeriodDays * 86400;


  const bundle = createEnvelopeBundle(
    ownerPrivateKey,
    params.beneficiaries,
    params.masterKey,
    params.vaultCid,
    smartAccount.address
  );
  const envelopeHash = hashEnvelopeBundle(bundle);


  const bundleJson = JSON.stringify(bundle);
  const envelopeCid = await ipfs.upload(bundleJson);
  logger.debug(`[Legacy] Enveloppe uploadee sur IPFS : ${envelopeCid}`);


  const beneficiaryAddresses = params.beneficiaries.map((b) => b.address);
  const txHash = await registerLegacyOnChain(
    smartAccount,
    envelopeCid,
    delaySeconds,
    gracePeriodSeconds,
    beneficiaryAddresses
  );

  if (!txHash) {
    throw new Error("Failed to register legacy on-chain");
  }

  logger.debug(`[Legacy] Heritage enregistre on-chain : ${txHash}`);
  return { envelopeCid, envelopeHash, txHash };
}



export interface ClaimLegacyResult {

  masterKey: string;

  vaultCid: string;

  txHash: string;
}














export async function claimLegacy(
smartAccount: SmartAccountClient,
beneficiaryPrivateKey: string,
ownerAddress: Address,
ipfs: IpfsAdapter)
: Promise<ClaimLegacyResult> {

  const claimable = await isClaimableOnChain(ownerAddress);
  if (!claimable) {
    throw new Error("Legacy is not claimable yet");
  }


  const config = await readLegacyFromChain(ownerAddress);
  if (!config || !config.active) {
    throw new Error("Legacy not found or not active");
  }


  const txHash = await claimLegacyOnChain(smartAccount, ownerAddress);
  if (!txHash) {
    throw new Error("Failed to claim legacy on-chain");
  }


  const bundleJson = await ipfs.download(config.envelopeCid);
  const bundle = JSON.parse(bundleJson) as LegacyEnvelopeBundle;


  const payload = decryptFromBundle(
    beneficiaryPrivateKey,
    smartAccount.address,
    bundle
  );

  logger.debug(`[Legacy] Heritage reclame avec succes — vault CID: ${payload.vaultCid.slice(0, 20)}...`);
  return {
    masterKey: payload.masterKey,
    vaultCid: payload.vaultCid,
    txHash
  };
}






export async function revokeLegacy(
smartAccount: SmartAccountClient)
: Promise<boolean> {
  const txHash = await revokeLegacyOnChain(smartAccount);
  if (!txHash) {
    throw new Error("Failed to revoke legacy on-chain");
  }
  logger.debug(`[Legacy] Heritage revoque : ${txHash}`);
  return true;
}






export async function getLegacyStatus(
ownerAddress: Address)
: Promise<(LegacyConfig & {heartbeatStatus: ReturnType<typeof computeHeartbeatStatus>;}) | null> {
  const config = await readLegacyFromChain(ownerAddress);
  if (!config || !config.active) return null;

  const heartbeatStatus = computeHeartbeatStatus(
    config.lastHeartbeat,
    config.delaySeconds,
    config.gracePeriodSeconds
  );

  return { ...config, heartbeatStatus };
}






export async function checkIncomingLegacy(
ownerAddress: Address,
beneficiaryAddress: Address)
: Promise<IncomingLegacy | null> {
  const config = await readLegacyFromChain(ownerAddress);
  if (!config || !config.active) return null;

  const beneficiaries = await readBeneficiariesFromChain(ownerAddress);
  const isBenef = beneficiaries.some(
    (b) => b.toLowerCase() === beneficiaryAddress.toLowerCase()
  );
  if (!isBenef) return null;

  const deadline = await readDeadlineFromChain(ownerAddress);
  const now = Math.floor(Date.now() / 1000);
  const daysRemaining = Math.ceil((deadline - now) / 86400);

  return {
    ownerAddress,
    isClaimable: now > deadline,
    isClaimed: config.claimed,
    deadline,
    daysRemaining
  };
}