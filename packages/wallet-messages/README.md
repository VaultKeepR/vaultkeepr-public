# @vaultkeepr/wallet-messages

Message schemas for signed VaultKeepR sessions: EIP-4361 (Sign-In With Ethereum) and autosave delegation messages.

## Install

```bash
npm install @vaultkeepr/wallet-messages
```

## Usage

```ts
import {
  autosaveDelegationVerifyMessages,
  formatAutosaveDelegationMessage,
} from "@vaultkeepr/wallet-messages";

// Build the message the user signs in their wallet
const message = formatAutosaveDelegationMessage(sessionId, expiryTimestamp);

// Verify the signature covers both expected variants
const expected = autosaveDelegationVerifyMessages(sessionId, expiryTimestamp);
```

Exports `formatAutosaveDelegationMessage` / `formatAutosaveDelegationMessageLegacy` (legacy French line) plus the human-readable line constants, so clients can render and verify exactly what was signed.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.