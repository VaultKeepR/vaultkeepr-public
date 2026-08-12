





import type { VaultEntry } from "./types";
import { getPwnedPasswordCount } from "./pwnedPassword";

export interface BreachResult {
  entryId: string;
  url: string;
  username: string;
  breachCount: number;
  checked: boolean;
  error?: string;
}

export interface BreachReport {
  results: BreachResult[];
  breachedCount: number;
  checkedCount: number;
  totalCount: number;
}






export async function checkVaultBreaches(
entries: VaultEntry[],
opts?: {
  signal?: AbortSignal;
  onProgress?: (result: BreachResult, index: number, total: number) => void;
  delayMs?: number;
})
: Promise<BreachReport> {
  const loginEntries = entries.filter((e) => {
    return e.url?.trim() && e.password?.trim();
  });

  const results: BreachResult[] = [];
  const delay = opts?.delayMs ?? 1200;

  for (let i = 0; i < loginEntries.length; i++) {
    if (opts?.signal?.aborted) break;

    const entry = loginEntries[i];
    const result: BreachResult = {
      entryId: entry.id,
      url: entry.url ?? "",
      username: entry.username ?? "",
      breachCount: 0,
      checked: false
    };

    try {
      result.breachCount = await getPwnedPasswordCount(entry.password, {
        signal: opts?.signal
      });
      result.checked = true;
    } catch (err) {
      result.error = err instanceof Error ? err.message : "Unknown error";
      result.checked = false;
    }

    results.push(result);
    opts?.onProgress?.(result, i, loginEntries.length);


    if (i < loginEntries.length - 1 && !opts?.signal?.aborted) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    results,
    breachedCount: results.filter((r) => r.breachCount > 0).length,
    checkedCount: results.filter((r) => r.checked).length,
    totalCount: loginEntries.length
  };
}