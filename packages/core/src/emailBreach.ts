














export interface EmailBreach {
  name: string;
  date: string;
  description?: string;
  logoPath?: string;
  dataClasses?: string[];
}

export interface EmailBreachResult {
  email: string;
  found: boolean;
  breachCount: number;
  breaches: EmailBreach[];
  checked: boolean;
  error?: string;
}

export interface EmailBreachReport {
  results: EmailBreachResult[];
  breachedCount: number;
  checkedCount: number;
  totalCount: number;
}

const LEAKCHECK_URL = "https://leakcheck.io/api/public";
const HIBP_BREACHES_URL = "https://haveibeenpwned.com/api/v3/breaches";

interface LeakCheckResponse {
  success: boolean;
  found?: number;
  error?: string;
  sources?: Array<{name: string;date: string;}>;
}

interface HIBPBreachMeta {
  Name: string;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
}

let _breachesCache: EmailBreach[] | null = null;
let _breachesCacheTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;




async function getBreachMetadata(): Promise<EmailBreach[]> {
  const now = Date.now();
  if (_breachesCache && now - _breachesCacheTime < CACHE_TTL_MS) {
    return _breachesCache;
  }

  try {
    const res = await fetch(HIBP_BREACHES_URL, {
      headers: { "User-Agent": "VaultKeeper/1.0" }
    });
    if (!res.ok) return [];

    const data = (await res.json()) as HIBPBreachMeta[];
    _breachesCache = data.map((b) => ({
      name: b.Name,
      date: "",
      description: b.Description,
      logoPath: b.LogoPath,
      dataClasses: b.DataClasses
    }));
    _breachesCacheTime = now;
    return _breachesCache;
  } catch {
    return _breachesCache ?? [];
  }
}




function enrichBreaches(
sources: Array<{name: string;date: string;}>,
metadata: EmailBreach[])
: EmailBreach[] {
  return sources.map((s) => {
    const meta = metadata.find(
      (m) => m.name.toLowerCase() === s.name.toLowerCase() ||
      m.name.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(m.name.toLowerCase())
    );
    return {
      name: s.name,
      date: s.date,
      description: meta?.description,
      logoPath: meta?.logoPath,
      dataClasses: meta?.dataClasses
    };
  });
}






export async function checkEmailBreaches(
emails: string[],
opts?: {
  signal?: AbortSignal;
  onProgress?: (result: EmailBreachResult, index: number, total: number) => void;
})
: Promise<EmailBreachReport> {
  const metadata = await getBreachMetadata();
  const results: EmailBreachResult[] = [];

  for (let i = 0; i < emails.length; i++) {
    if (opts?.signal?.aborted) break;

    const email = emails[i];
    const result: EmailBreachResult = {
      email,
      found: false,
      breachCount: 0,
      breaches: [],
      checked: false
    };

    try {
      const url = `${LEAKCHECK_URL}?check=${encodeURIComponent(email)}`;
      const res = await fetch(url, {
        signal: opts?.signal
      });

      if (!res.ok) {
        throw new Error(`LeakCheck API: ${res.status}`);
      }

      const data = (await res.json()) as LeakCheckResponse;

      if (data.success) {
        result.found = true;
        result.breachCount = data.found ?? data.sources?.length ?? 0;
        result.breaches = enrichBreaches(
          data.sources ?? [],
          metadata
        );
      } else if (data.error === "Not found") {

        result.found = false;
        result.breachCount = 0;
      }
      result.checked = true;
    } catch (err) {
      if (opts?.signal?.aborted) break;
      result.error = err instanceof Error ? err.message : "Unknown error";
      result.checked = false;
    }

    results.push(result);
    opts?.onProgress?.(result, i, emails.length);
  }

  return {
    results,
    breachedCount: results.filter((r) => r.found).length,
    checkedCount: results.filter((r) => r.checked).length,
    totalCount: emails.length
  };
}