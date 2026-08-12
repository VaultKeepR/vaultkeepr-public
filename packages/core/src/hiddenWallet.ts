import { keccak256, toHex, toBytes, bytesToHex } from "viem";
import { privateKeyToAccount, type LocalAccount } from "viem/accounts";
import { argon2id } from "@noble/hashes/argon2.js";





const HW_ARGON2_OPTS = { t: 3, m: 65536, p: 4, dkLen: 32 };


const _hwCache = new Map<string, LocalAccount>();




type Argon2ProviderFn = (
input: Uint8Array,
salt: Uint8Array,
opts: {t: number;m: number;p: number;dkLen: number;})
=> Promise<Uint8Array> | Uint8Array;

let _argon2Provider: Argon2ProviderFn | null = null;





export function setArgon2Provider(fn: Argon2ProviderFn): void {
  _argon2Provider = fn;
}






function deriveHwSalt(secretKey: string): Uint8Array {
  const hash = keccak256(toHex(secretKey));
  return toBytes(hash).slice(0, 16);
}





export function getHiddenWalletLegacy(masterPassword: string, secretKey?: string): LocalAccount {
  const input = secretKey ? `${secretKey}:${masterPassword}` : masterPassword;
  const privateKey = keccak256(toHex(input));
  return privateKeyToAccount(privateKey);
}





async function _derivePrivateKey(masterPassword: string, secretKey?: string): Promise<`0x${string}`> {
  if (!secretKey) {
    const input = secretKey ? `${secretKey}:${masterPassword}` : masterPassword;
    return keccak256(toHex(input));
  }
  const salt = deriveHwSalt(secretKey);
  const input = `${secretKey}:${masterPassword}`;
  const inputBytes = new TextEncoder().encode(input);
  let derived: Uint8Array;
  if (_argon2Provider) {
    derived = await _argon2Provider(inputBytes, salt, HW_ARGON2_OPTS);
  } else {
    derived = argon2id(inputBytes, salt, HW_ARGON2_OPTS);
  }
  return bytesToHex(derived) as `0x${string}`;
}







export async function getHiddenWalletPrivateKey(
masterPassword: string,
secretKey?: string)
: Promise<`0x${string}`> {
  return _derivePrivateKey(masterPassword, secretKey);
}



















export async function getHiddenWalletFromPassword(
masterPassword: string,
secretKey?: string)
: Promise<LocalAccount> {

  if (!secretKey) {
    return getHiddenWalletLegacy(masterPassword);
  }


  const cacheKey = keccak256(toHex(`${secretKey}:${masterPassword}:v2`));
  const cached = _hwCache.get(cacheKey);
  if (cached) return cached;

  const privateKey = await _derivePrivateKey(masterPassword, secretKey);
  const account = privateKeyToAccount(privateKey);


  _hwCache.set(cacheKey, account);
  return account;
}




export function clearHiddenWalletCache(): void {
  _hwCache.clear();
}



const FRAGMENT_DOMAIN = {
  name: "VaultKeeperFragments",
  version: "1",
  chainId: 8453
} as const;

const FRAGMENT_TYPES = {
  StoreFragmentMeta: [
  { name: "lookupIdHash", type: "bytes32" },
  { name: "encryptedPayload", type: "bytes" },
  { name: "owner", type: "address" }]

};





export async function signStoreFragmentMeta(
masterPassword: string,
lookupIdHash: string,
encryptedPayload: string,
secretKey?: string)
: Promise<{signature: string;owner: string;}> {
  const account = await getHiddenWalletFromPassword(masterPassword, secretKey);

  const message = {
    lookupIdHash: lookupIdHash.startsWith("0x") ? lookupIdHash : `0x${lookupIdHash}`,
    encryptedPayload: encryptedPayload.startsWith("0x") ? encryptedPayload : `0x${encryptedPayload}`,
    owner: account.address
  };

  const signature = await account.signTypedData({
    domain: FRAGMENT_DOMAIN,
    types: FRAGMENT_TYPES,
    primaryType: "StoreFragmentMeta",
    message
  });

  return { signature, owner: account.address };
}




export async function signStoreFragmentMetaWithSigner(
signer: {
  signTypedData: (params: {
    domain: typeof FRAGMENT_DOMAIN;
    types: typeof FRAGMENT_TYPES;
    primaryType: "StoreFragmentMeta";
    message: Record<string, unknown>;
  }) => Promise<`0x${string}`>;
  address: `0x${string}`;
},
lookupIdHash: string,
encryptedPayload: string)
: Promise<{signature: string;owner: string;}> {
  const message = {
    lookupIdHash: lookupIdHash.startsWith("0x") ? lookupIdHash : `0x${lookupIdHash}`,
    encryptedPayload: encryptedPayload.startsWith("0x") ? encryptedPayload : `0x${encryptedPayload}`,
    owner: signer.address
  };

  const signature = await signer.signTypedData({
    domain: FRAGMENT_DOMAIN,
    types: FRAGMENT_TYPES,
    primaryType: "StoreFragmentMeta",
    message
  });

  return { signature, owner: signer.address };
}