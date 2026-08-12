










const STRIPPED_KEYS = new Set([
"localStorage",
"chrome.storage",
"chrome.cookies",
"sessionStorage",
"indexedDB",
"vault",
"vaultEntries",
"password",
"secret",
"key",
"seed",
"mnemonic",
"passphrase",
"masterPassword",
"derivedKey",
"privateKey",
"secretKey",
"recoveryShare",
"totpSeed",
"cvc",
"pin",
"token",
"authorization",
"cookie",
"session",
"accessToken",
"refreshToken",
"apiKey",
"idToken",
"authToken",
"jwt",
"walletPrivateKey",
"mnemonicPhrase",
"bip39",
"entropy",
"salt"]
);

const STRIPPED_VALUE_PATTERNS = [
/^0x[a-fA-F0-9]{64}$/,
/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
/^0x[a-fA-F0-9]{40}$/,
/^[A-Z2-7]{32,}$/,
/^[A-Za-z0-9+/=]{40,}$/,
/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/,
/^b[A-Za-z2-7]{58,}$/];






export function scrubEventValue(value: unknown, depth = 0): unknown {
  if (depth > 6) return value;
  if (value == null) return value;

  if (typeof value === "string") {
    for (const pattern of STRIPPED_VALUE_PATTERNS) {
      if (pattern.test(value)) return "[REDACTED]";
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => scrubEventValue(v, depth + 1));
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (STRIPPED_KEYS.has(k.toLowerCase())) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = scrubEventValue(v, depth + 1);
      }
    }
    return out;
  }

  return value;
}

export interface SentryScrubberOptions {

  extraStripKeys?: string[];
}




export function createBeforeSend(options: SentryScrubberOptions = {}) {
  const extraKeys = new Set(
    (options.extraStripKeys ?? []).map((k) => k.toLowerCase())
  );

  return function beforeSend(event: any, hint?: any): any | null {
    if (event?.extra) {
      const mergedStrip = new Set([...STRIPPED_KEYS, ...extraKeys]);
      const scrubbed: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(event.extra as Record<string, unknown>)) {
        if (mergedStrip.has(k.toLowerCase())) {
          scrubbed[k] = "[REDACTED]";
        } else {
          scrubbed[k] = scrubEventValue(v);
        }
      }
      event.extra = scrubbed;
    }

    if (event?.tags) {

      const scrubbed: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(event.tags as Record<string, unknown>)) {
        if (STRIPPED_KEYS.has(k.toLowerCase())) {
          scrubbed[k] = "[REDACTED]";
        } else {
          scrubbed[k] = typeof v === "string" ? scrubEventValue(v) : v;
        }
      }
      event.tags = scrubbed;
    }


    if (event?.request) {
      if (event.request.data) {
        event.request.data = "[REDACTED]";
      }
      if (event.request.query_string) {
        event.request.query_string = "[REDACTED]";
      }
      if (event.request.cookies) {
        event.request.cookies = "[REDACTED]";
      }
      if (event.request.headers) {
        const safeHeaders: Record<string, string> = {};
        for (const [k, v] of Object.entries(event.request.headers as Record<string, string>)) {
          const lk = k.toLowerCase();
          if (lk === "authorization" || lk === "cookie" || lk === "set-cookie" || lk === "x-api-key") {
            safeHeaders[k] = "[REDACTED]";
          } else {
            safeHeaders[k] = v;
          }
        }
        event.request.headers = safeHeaders;
      }
    }


    if (event?.user) {
      event.user = {
        id: undefined,
        ip_address: undefined
      };
    }

    return event;
  };
}




export interface SentryInitOptions {
  dsn: string;
  environment: "development" | "staging" | "production";
  release: string;
  extraStripKeys?: string[];

  sampleRate?: number;
}