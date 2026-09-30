















export type LogLevel = "debug" | "info" | "warn" | "error" | "none";

declare const __DEV__: boolean | undefined;






export const isDev: boolean =
typeof __DEV__ !== "undefined" && Boolean(__DEV__) ||
typeof process !== "undefined" &&
process?.env?.NODE_ENV !== "production";





let _level: LogLevel = isDev ? "debug" : "error";

export function setLogLevel(level: LogLevel): void {
  _level = level;
}

export function getLogLevel(): LogLevel {
  return _level;
}

function enabled(target: LogLevel): boolean {
  const order: Record<LogLevel, number> = {
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  };
  return order[_level] >= order[target];
}



const ETHEREUM_ADDRESS_RE = /0x[0-9a-fA-F]{40}\b/g;
const CID_V0_RE = /Qm[1-9A-HJ-NP-Za-km-z]{44}\b/g;
const CID_V1_RE = /b[a-z2-7]{58,}\b/g;
const TX_HASH_RE = /0x[0-9a-fA-F]{64}\b/g;
const BASE64_LONG_RE = /[A-Za-z0-9+/=]{200,}/g;
const MNEMONIC_RE = /\b([a-z]{3,}\s+){11,23}[a-z]{3,}\b/g;





export function redactCid(cid: string | null | undefined, keep = 6): string {
  if (!cid) return "<none>";
  if (cid.length <= keep + 4) return "<cid:redacted>";
  return `${cid.slice(0, keep)}…${cid.slice(-4)}`;
}




export function redactAddress(addr: string | null | undefined): string {
  if (!addr) return "<none>";
  if (addr.length < 10) return "<addr:redacted>";
  return `***${addr.slice(-4)}`;
}





export function redact<T>(value: T, maxDepth = 4): T {
  if (value == null) return value;
  if (typeof value === "string") {
    return redactString(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    if (maxDepth <= 0) return value;
    return value.map((v) => redact(v, maxDepth - 1)) as unknown as T;
  }
  if (typeof value === "object") {
    if (maxDepth <= 0) return value;
    const out: Record<string, unknown> = {};
    let i = 0;
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (i++ > 50) break;
      out[k] = redact(v, maxDepth - 1);
    }
    return out as unknown as T;
  }
  return value;
}

export function redactString(s: string): string {
  return s.
  replace(ETHEREUM_ADDRESS_RE, (m) => redactAddress(m)).
  replace(CID_V0_RE, (m) => redactCid(m)).
  replace(CID_V1_RE, (m) => redactCid(m)).
  replace(TX_HASH_RE, (m) => `0x…${m.slice(-6)}`).
  replace(BASE64_LONG_RE, "<base64:redacted>").
  replace(MNEMONIC_RE, "<mnemonic:redacted>");
}



export type ErrorHook = (error: Error, ...args: unknown[]) => void;

let _errorHooks: ErrorHook[] = [];






export function addErrorHook(hook: ErrorHook): void {
  _errorHooks.push(hook);
}




export function removeErrorHook(hook: ErrorHook): void {
  _errorHooks = _errorHooks.filter((h) => h !== hook);
}




export function clearErrorHooks(): void {
  _errorHooks = [];
}



export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

function stringify(...args: unknown[]): unknown[] {
  return args.map((a) => {
    if (typeof a === "string") return redactString(a);
    return redact(a);
  });
}

export const logger: Logger = {
  debug: (...args) => {
    if (enabled("debug")) console.debug("[VK]", ...stringify(...args));
  },
  info: (...args) => {
    if (enabled("info")) console.info("[VK]", ...stringify(...args));
  },
  warn: (...args) => {
    if (enabled("warn")) console.warn("[VK]", ...stringify(...args));
  },
  error: (...args) => {
    if (!enabled("error")) return;
    const redacted = stringify(...args);

    if (isDev) {
      console.error("[VK]", ...redacted);
    }

    const firstError = args.find((a) => a instanceof Error) as Error | undefined;
    for (const hook of _errorHooks) {
      try {
        hook(firstError ?? new Error(String(args[0])), ...redacted);
      } catch {

      }
    }
  }
};

export default logger;