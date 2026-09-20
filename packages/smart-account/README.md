# @vaultkeepr/smart-account

ERC-4337 account abstraction for VaultKeepR: Kernel smart account with Pimlico paymaster. Universal module for Web, Extension, iOS, and Android.

Identity can be derived from the master password (on-device, no seed phrase exposure) or from an existing signer.

## Install

```bash
npm install @vaultkeepr/smart-account
```

Requires `@vaultkeepr/core` and `@vaultkeepr/logger`.

> This package ships as TypeScript source (`main`/`exports` point at `src/index.ts`) — consume it through your bundler.

## Usage

```ts
import {
  getIdentityAddress,
  initIdentityFromPassword,
  isIdentityConnected,
} from "@vaultkeepr/smart-account";

await initIdentityFromPassword(password, salt);
if (isIdentityConnected()) {
  const address = getIdentityAddress(); // smart account address
}
```

Alternative: `initIdentityFromSigner(signer)` when a wallet is already connected; `clearIdentity()` wipes in-memory state.

Modules: `identity.ts` (identity lifecycle), `kernel.ts` (Kernel account), `owner.ts` + `secretKey.ts` (signer derivation), `onChainSync.ts` (vault pointer writes), `cidRegistry.ts` (`VaultKeeperCidRegistry` bindings).

## Security notes

The chain stores location pointers only — never keys. Signatures for on-chain writes go through the user's smart account.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.