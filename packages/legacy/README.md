# @vaultkeepr/legacy

Digital inheritance for VaultKeepR: time-locked legacy to named beneficiaries, backed by the `VaultKeeperLegacy` contract on Base L2. The master key travels only inside ECIES envelopes encrypted to each beneficiary's public key — the chain stores pointers and timing, never keys.

## Install

```bash
npm install @vaultkeepr/legacy
```

Requires `@vaultkeepr/core`, `@vaultkeepr/ipfs`, `@vaultkeepr/logger`, `@vaultkeepr/premium`.

## Usage

```ts
import { checkIncomingLegacy, claimLegacy, getLegacyStatus, revokeLegacy, setupLegacy } from "@vaultkeepr/legacy";

// Owner: register time-locked inheritance (delay + grace period in days)
const { envelopeCid, txHash } = await setupLegacy(smartAccount, ownerPrivateKey, {
  beneficiaries,      // validated list (validateBeneficiaryList)
  masterKey,          // sealed into per-beneficiary encrypted envelopes
  vaultCid,           // encrypted vault location
  delayDays: 30,
  gracePeriodDays: 7,
}, ipfsAdapter);

// Owner: heartbeat keeps it dormant; status shows remaining time
const status = await getLegacyStatus(ownerAddress);
await revokeLegacy(smartAccount);

// Beneficiary: check, then claim after the deadline
const incoming = await checkIncomingLegacy(ownerAddress, beneficiaryAddress);
if (incoming?.isClaimable) {
  const { masterKey, vaultCid } = await claimLegacy(
    beneficiarySmartAccount, beneficiaryPrivateKey, ownerAddress, ipfsAdapter,
  );
}
```

Modules: `legacy.ts` (contract actions), `beneficiary.ts` / `beneficiaryMeta.ts` (beneficiary records), `heartbeat.ts` (`computeHeartbeatStatus`, proof-of-life that resets the timer), `envelope.ts` + `contract.ts` (ECIES envelope bindings).

## Security notes

The deadline is time-locked on-chain; owner heartbeats push it forward. The envelope bundle lives on IPFS and is ECIES-encrypted to beneficiaries only; the chain stores pointers, beneficiary list, and timing. Plaintext never crosses a network boundary.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.