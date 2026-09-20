# @vaultkeepr/recovery

Fragmented vault recovery for VaultKeepR: Shamir secret sharing with encrypted fragments and on-chain contract reads on Base L2 (`VaultKeeperFragments`).

## Install

```bash
npm install @vaultkeepr/recovery
```

Requires `@vaultkeepr/core`.

## Usage

```ts
import {
  combineFragmentsAndDecrypt,
  createFragmentedVault,
  generateRecoveryId,
} from "@vaultkeepr/recovery";

const recoveryId = generateRecoveryId();

// Split the master key into encrypted fragments (defaults: threshold 2 of 3)
const { encryptedVault, fragments, lookupIdHash } = await createFragmentedVault(vault, recoveryId);

// Later: reassemble from a threshold of fragments and decrypt
const restored = await combineFragmentsAndDecrypt(fragments.slice(0, 2), encryptedVault, 2);
```

`computeLookupIdHash` produces the hash used to locate fragments on-chain without revealing identity; `encryptFragmentsForStorage` wraps fragments for upload; `contract-fragment.ts` binds the on-chain reads.

## Security notes

Recovery re-derives the master key on-device (user password + wallet signature). The chain stores fragments/pointers only — never derived keys.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.