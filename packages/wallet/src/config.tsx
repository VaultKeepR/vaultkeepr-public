"use client";

import { createConfig, http } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId =
(typeof process !== "undefined" &&
(process as {env?: {NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?: string;};}).env?.
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) ??
"";

export const wagmiConfig = createConfig({
  ssr: true,
  chains: [mainnet, base],
  connectors: [
  injected(),
  ...(projectId ? [walletConnect({ projectId })] : [])],

  transports: {
    [mainnet.id]: http(),
    [base.id]: http()
  }
});