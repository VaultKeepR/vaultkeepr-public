# @vaultkeepr/premium

License key validation and tier limits for VaultKeepR: activation (license keys and in-app purchases), device management, and per-tier quotas (cloud storage, file size, secure documents).

## Install

```bash
npm install @vaultkeepr/premium
```

## Usage

```ts
import {
  activateLicense,
  getCloudQuotaForTier,
  getMaxFileSizeForTier,
  parseTier,
} from "@vaultkeepr/premium";

await activateLicense(licenseKey, deviceId);

const tier = parseTier(storedTier);
const cloudQuota = getCloudQuotaForTier(tier); // bytes
const maxUpload = getMaxFileSizeForTier(tier);
```

Also: `activateIAP`, `removeDevice`, `getLicenseStatus`, `getPremiumStatus`, `syncPremium`, `isPremiumUntilValid`, `tierHasCloud`.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.