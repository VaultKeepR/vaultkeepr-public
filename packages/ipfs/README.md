# @vaultkeepr/ipfs

Content-addressed vault storage helpers for VaultKeepR: CID validation and normalization, plus multi-gateway fetching with failover.

## Install

```bash
npm install @vaultkeepr/ipfs
```

## Usage

```ts
import {
  fetchFromIpfs,
  fetchFromStorage,
  isIpfsCid,
  normalizeVaultLocation,
  setIpfsGateways,
} from "@vaultkeepr/ipfs";

// Pick your own gateway priority (failover order)
setIpfsGateways(["https://ipfs.io", "https://cloudflare-ipfs.com", "https://gateway.pinata.cloud"]);

if (isIpfsCid(location)) {
  const blob = await fetchFromIpfs(location);
}

// Or fetch from either storage backend by location
const content = await fetchFromStorage(normalizeVaultLocation(location));
```

## Security notes

IPFS stores encrypted blobs only — the vault is encrypted client-side by `@vaultkeepr/core` before anything is pinned. Gateways can never read content.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.