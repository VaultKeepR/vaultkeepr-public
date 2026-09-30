















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

/*
 * Mnemonic redaction — hand-rolled single-pass scanner (SonarCloud S8786 fix).
 *
 * This used to be MNEMONIC_RE = /\b([a-z]{3,}\s+){11,23}[a-z]{3,}\b/g applied
 * inside redactString(). Its nested quantifiers ([a-z]{3,}\s+ repeated 11..23
 * times) give the regexp super-linear (quadratic) worst-case backtracking,
 * which SonarCloud reports as typescript:S8786. Atomic groups (?>...) and
 * possessive quantifiers (++) would fix that at the regex level but are NOT
 * supported by the Hermes (React Native) RegExp engine, so the match is
 * reproduced programmatically in one left-to-right pass (O(n) total) with the
 * exact semantics of the original regex:
 *   1. a match may only start at index i when a word boundary (\b, w.r.t.
 *      [A-Za-z0-9_]) holds at i and the character at i is an ASCII lowercase
 *      letter (the first group word);
 *   2. one group iteration consumes a maximal run of >= 3 ASCII lowercase
 *      letters followed by a maximal run of >= 1 JS-whitespace character
 *      (exact ECMAScript \s set, incl. \u00a0, \u2028, \u2029, \ufeff);
 *      greedy [a-z]{3,} and \s+ have only one viable length each (a shorter
 *      match would be followed by a letter or whitespace character, which the
 *      next element cannot consume), so every iteration is deterministic;
 *   3. up to 23 iterations are consumed greedily, stopping at the first
 *      failure (m = number of successful iterations);
 *   4. the match is closed by a final word: a maximal run of >= 3 lowercase
 *      letters followed by a non-word character or end of string. Like the
 *      greedy quantifier, closing positions are tried from after m group
 *      words down to after 11 (k = m .. 11); for k < m the closing word
 *      always succeeds because group word k+1 proved a >= 3-letter run
 *      followed by whitespace at that position, so at most two trials run;
 *   5. on success "<mnemonic:redacted>" replaces [start, end) and scanning
 *      resumes right after the match (global, non-overlapping, like the g
 *      flag); on failure scanning resumes one character later.
 * Character classification uses codePointAt (surrogate-pair safe per
 * SonarCloud S7758; surrogate halves and astral chars fall outside every
 * classified range, exactly matching \b's code-unit semantics).
 * Equivalence with the original regex is proven differentially in
 * index.test.ts (suite "redactString mnemonic redaction (S8786 linear
 * scanner)"), which keeps a verbatim copy of the original regex as the
 * oracle over an adversarial corpus — keep the two in sync.
 */
function isAsciiLower(cp: number): boolean {
  return cp >= 0x61 && cp <= 0x7a;
}

// Exact ECMAScript \s set (WhiteSpace + LineTerminator characters).
function isJsWhitespace(cp: number): boolean {
  return (
    cp === 0x09 || // \t
    cp === 0x0a || // \n
    cp === 0x0b || // \v
    cp === 0x0c || // \f
    cp === 0x0d || // \r
    cp === 0x20 || // space
    cp === 0x00a0 || // \u00a0 NO-BREAK SPACE
    cp === 0x1680 ||
    (cp >= 0x2000 && cp <= 0x200a) ||
    cp === 0x2028 || // \u2028 LINE SEPARATOR
    cp === 0x2029 || // \u2029 PARAGRAPH SEPARATOR
    cp === 0x202f || // \u202f NARROW NO-BREAK SPACE
    cp === 0x205f ||
    cp === 0x3000 || // \u3000 IDEOGRAPHIC SPACE
    cp === 0xfeff // \ufeff ZERO WIDTH NO-BREAK SPACE (BOM)
  );
}

// Regex word character: [A-Za-z0-9_] (what \b is defined against).
function isRegexWordChar(cp: number): boolean {
  return (
    (cp >= 0x30 && cp <= 0x39) || // 0-9
    (cp >= 0x41 && cp <= 0x5a) || // A-Z
    cp === 0x5f || // _
    (cp >= 0x61 && cp <= 0x7a) // a-z
  );
}

function redactMnemonics(input: string): string {
  const n = input.length;
  if (n === 0) return input;
  const groupEnds = new Array<number>(23); // scratch reused across attempts
  const parts: string[] = [];
  let copied = 0; // index up to which input is already copied into parts
  let i = 0;
  while (i < n) {
    const cp = input.codePointAt(i)!;
    if (
      !isAsciiLower(cp) ||
      (i > 0 && isRegexWordChar(input.codePointAt(i - 1)!))
    ) {
      i += 1;
      continue;
    }
    // Greedy group iterations: maximal [a-z]{3,} run + maximal \s+ run.
    let m = 0;
    let pos = i;
    while (m < 23) {
      let runEnd = pos;
      while (runEnd < n && isAsciiLower(input.codePointAt(runEnd)!)) runEnd += 1;
      if (
        runEnd - pos < 3 ||
        runEnd >= n ||
        !isJsWhitespace(input.codePointAt(runEnd)!)
      ) {
        break;
      }
      let wsEnd = runEnd;
      while (wsEnd < n && isJsWhitespace(input.codePointAt(wsEnd)!)) wsEnd += 1;
      pos = wsEnd;
      groupEnds[m] = pos;
      m += 1;
    }
    if (m >= 11) {
      // Greedy {11,23} backtracking order: try the closing word after m
      // group words, then m-1, ... down to after 11 group words.
      let matchEnd = -1;
      for (let k = m; k >= 11; k -= 1) {
        const start = groupEnds[k - 1];
        let end = start;
        while (end < n && isAsciiLower(input.codePointAt(end)!)) end += 1;
        if (
          end - start >= 3 &&
          (end === n || !isRegexWordChar(input.codePointAt(end)!))
        ) {
          matchEnd = end;
          break;
        }
      }
      if (matchEnd !== -1) {
        parts.push(input.slice(copied, i), "<mnemonic:redacted>");
        copied = matchEnd;
        i = matchEnd; // resume right after the match, like a g-flag replace
        continue;
      }
    }
    i += 1;
  }
  parts.push(input.slice(copied));
  return parts.join("");
}

export function redactString(s: string): string {
  return redactMnemonics(
    s.
    replace(ETHEREUM_ADDRESS_RE, (m) => redactAddress(m)).
    replace(CID_V0_RE, (m) => redactCid(m)).
    replace(CID_V1_RE, (m) => redactCid(m)).
    replace(TX_HASH_RE, (m) => `0x…${m.slice(-6)}`).
    replace(BASE64_LONG_RE, "<base64:redacted>")
  );
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