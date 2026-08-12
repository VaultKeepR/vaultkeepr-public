import { split, combine } from "shamir-secret-sharing";

export * from "./fragmented-vault";
export * from "./contract-fragment";

export async function splitSecret(
secret: Uint8Array,
threshold: number,
totalShares: number)
: Promise<Uint8Array[]> {
  return split(secret, totalShares, threshold);
}

export async function combineShares(shares: Uint8Array[]): Promise<Uint8Array> {
  return combine(shares);
}