import { describe, it, expect } from "vitest";
import { redactCid, redactAddress, redact, redactString, isDev, logger } from "./index";

describe("redactCid", () => {
  it("returns <none> for null/undefined", () => {
    expect(redactCid(null)).toBe("<none>");
    expect(redactCid(undefined)).toBe("<none>");
  });
  it("redacts long CIDs", () => {
    const cid = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    expect(redactCid(cid)).toBe("QmYwAP…PbdG");
  });
  it("fully redacts short CIDs", () => {
    expect(redactCid("short")).toBe("<cid:redacted>");
  });
});

describe("redactAddress", () => {
  it("returns <none> for null/undefined", () => {
    expect(redactAddress(null)).toBe("<none>");
    expect(redactAddress(undefined)).toBe("<none>");
  });
  it("redacts Ethereum addresses", () => {
    expect(redactAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "***5678"
    );
  });
});

describe("redactString", () => {
  it("redacts Ethereum addresses in text", () => {
    expect(redactString("from 0x1234567890abcdef1234567890abcdef12345678 to 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")).toContain("***5678");
  });
  it("redacts tx hashes", () => {
    expect(redactString("tx 0x" + "a".repeat(64))).toContain("0x…aaaaaa");
  });
  it("redacts long base64 blobs", () => {
    const blob = "A".repeat(300);
    expect(redactString(`payload=${blob}`)).toContain("<base64:redacted>");
  });
  it("does not crash on empty string", () => {
    expect(redactString("")).toBe("");
  });
});

describe("redact", () => {
  it("redacts addresses in nested objects", () => {
    const input = { wallet: { address: "0x1234567890abcdef1234567890abcdef12345678" } };
    const out = redact(input) as {wallet: {address: string;};};
    expect(out.wallet.address).toBe("***5678");
  });
  it("respects maxDepth", () => {
    const input = { a: { b: { c: { d: "0x1234567890abcdef1234567890abcdef12345678" } } } };
    const out = redact(input, 1) as {a: {b: {c: {d: string;};};};};
    expect(out.a.b.c.d).toBe("0x1234567890abcdef1234567890abcdef12345678");
  });
});

describe("logger API", () => {
  it("exposes debug/info/warn/error", () => {
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });
  it("isDev is a boolean", () => {
    expect(typeof isDev).toBe("boolean");
  });
});

describe("redactString mnemonic redaction (S8786 linear scanner)", () => {
  // Oracle: verbatim copy of the ORIGINAL regex that used to live in index.ts
  // as MNEMONIC_RE (removed by the SonarCloud typescript:S8786 fix, which
  // replaced it with a linear scanner). Every corpus input must be redacted
  // byte-identically by redactString() and by this regex — this differential
  // test is the equivalence proof for the hand-rolled scanner. Corpus inputs
  // deliberately avoid characters that trigger redactString()'s other
  // redaction regexes (0x+40-hex, Qm+44, 0x+64-hex, 200+ base64 runs), so the
  // only difference between the two pipelines is the mnemonic step.
  const MNEMONIC_ORACLE_RE = /\b([a-z]{3,}\s+){11,23}[a-z]{3,}\b/g;
  const oracleReplace = (s: string): string => {
    MNEMONIC_ORACLE_RE.lastIndex = 0;
    return s.replace(MNEMONIC_ORACLE_RE, "<mnemonic:redacted>");
  };

  const WORDS = ["abc", "defg", "hijk", "lmno", "pqr", "stuv", "wxyz"] as const;
  const word = (k: number): string => WORDS[k % WORDS.length];
  const chain = (count: number, sep = " "): string =>
    Array.from({ length: count }, (_, k) => word(k)).join(sep);

  const corpus: ReadonlyArray<readonly [string, string]> = [
    ["empty string", ""],
    ["single three-letter word", "abc"],
    ["single long lowercase word", "abcdefghijklmno"],
    ["plain text without mnemonic", "hello world this is plain text"],
    ["digits and punctuation only", "123 456 789 012 345 678 901.234,567:890"],
    ["two-letter words only", "ab cd ef gh ij kl mn op qr st uv wx yz"],
    ["chain of exactly 10 words (below threshold)", chain(10)],
    ["chain of exactly 11 words ending at EOS (no closing word)", chain(11)],
    ["chain of 11 words plus eligible final word", chain(11) + " pqr"],
    ["chain of exactly 12 words", chain(12)],
    ["chain of exactly 23 words", chain(23)],
    ["chain of exactly 24 words", chain(24)],
    ["chain of exactly 25 words", chain(25)],
    ["chain of exactly 48 words (two matches)", chain(48)],
    ["chain of exactly 60 words (three matches)", chain(60)],
    ["chain of exactly 70 words", chain(70)],
    ["chain of 24 words with trailing spaces", chain(24) + "   "],
    ["chain of 23 words then digit-suffixed word then final word", chain(23) + " ab1 pqr"],
    ["chain of 11 words then digit-suffixed word (no match)", chain(11) + " ab1"],
    ["chain of 11 words then underscore-suffixed word (no match)", chain(11) + " abc_"],
    ["chain of 11 words then lowercase run followed by uppercase (no match)", chain(11) + " abcDef"],
    ["chain of 11 words then hyphenated word (final word stops at hyphen)", chain(11) + " foo-bar"],
    ["chain of 11 words then hyphenated word then another word", chain(11) + " foo-bar pqr"],
    ["hyphenated word breaks mid-chain", chain(5) + " foo-bar " + chain(11) + " pqr"],
    ["underscore-suffixed word breaks mid-chain", chain(5) + " def_ " + chain(11) + " pqr"],
    ["digit-suffixed word breaks mid-chain", chain(5) + " abc1 " + chain(11) + " pqr"],
    ["two-letter word breaks mid-chain", chain(5) + " ab " + chain(11) + " pqr"],
    ["uppercase word breaks mid-chain", chain(5) + " ABC " + chain(11) + " pqr"],
    ["uppercase first word", "ABC " + chain(12) + " pqr"],
    ["leading digit glued to first word", "1abc " + chain(12) + " pqr"],
    ["leading digit with only 11 words after (no match)", "1abc " + chain(11)],
    ["word character glued before first word", "x" + chain(12) + " pqr"],
    ["two-letter and three-letter words mixed", "ab abc abcd ab abcde ab abc abcd ab abc abcd ab abc ab"],
    ["three-letter and four-letter words alternating", Array.from({ length: 13 }, (_, k) => (k % 2 === 0 ? "efg" : "abcd")).join(" ")],
    ["accented letter terminates final run", chain(11) + " café"],
    ["accented letter breaks mid-chain", chain(5) + " café " + chain(11) + " pqr"],
    ["12-word mnemonic ending with period", chain(12) + "."],
    ["12-word mnemonic followed by exclamation and text", chain(12) + "! More text here."],
    ["12-word mnemonic mid-sentence", "some prefix words " + chain(12) + " and suffix words"],
    ["two mnemonics separated by text", chain(12) + " tail text " + chain(12)],
    ["three mnemonics with short separators", chain(12) + " x " + chain(12) + " y " + chain(13)],
    ["36-word chain (24 then 12)", chain(24) + " " + chain(12)],
    ["words separated by two spaces", chain(12, "  ")],
    ["words separated by three spaces", chain(12, "   ")],
    ["words separated by tabs", chain(12, "\t")],
    ["words separated by newlines", chain(12, "\n")],
    ["words separated by CRLF", chain(12, "\r\n")],
    ["words separated by vertical tab and form feed", chain(12, "\v\f")],
    ["words separated by non-breaking spaces", chain(12, "\u00a0")],
    ["words separated by U+2028 line separators", chain(12, "\u2028")],
    ["words separated by U+2029 paragraph separators", chain(12, "\u2029")],
    ["words separated by U+202F narrow no-break spaces", chain(12, "\u202f")],
    ["words separated by U+3000 ideographic spaces", chain(12, "\u3000")],
    ["words separated by U+FEFF BOM characters", chain(12, "\ufeff")],
    ["words separated by mixed whitespace", chain(12, " \t\n\u00a0 ")],
    ["whitespace before the first word", " \t\n" + chain(12)],
    ["whitespace run between two mnemonics", chain(24) + "\n\n" + chain(12)],
    ["mnemonic inside double quotes", '"' + chain(12) + '"'],
    ["digits glued after the final word (no match)", chain(12) + "42"],
    ["leading digit before 12-word chain (no match)", "9" + chain(12)],
    ["trailing underscore after 11th word (no match)", chain(11) + "_"],
    ["chain with mid punctuation", chain(12) + ", " + chain(12) + ". " + chain(24)],
    ["U+200B zero-width space is not whitespace", chain(5) + "\u200b " + chain(11) + " pqr"],
    ["U+0085 NEL is not whitespace", chain(5) + "\u0085 " + chain(11) + " pqr"],
  ];

  it.each(corpus.map(([name, input]) => ({ name, input })))(
    "differential vs oracle: $name",
    ({ input }) => {
      expect(redactString(input), `input: ${JSON.stringify(input)}`).toBe(
        oracleReplace(input)
      );
    }
  );

  it("redacts a 12-word mnemonic entirely", () => {
    expect(redactString(chain(12))).toBe("<mnemonic:redacted>");
  });

  it("leaves an 11-word chain without closing word untouched", () => {
    expect(redactString(chain(11))).toBe(chain(11));
  });

  it("keeps the trailing period of a 12-word mnemonic", () => {
    expect(redactString(chain(12) + ".")).toBe("<mnemonic:redacted>.");
  });

  it("consumes 24 of 25 chained words", () => {
    expect(redactString(chain(25))).toBe(`<mnemonic:redacted> ${word(24)}`);
  });

  it("splits a 48-word chain into two redactions", () => {
    expect(redactString(chain(48))).toBe("<mnemonic:redacted> <mnemonic:redacted>");
  });

  it("stops a hyphenated closing word at the hyphen", () => {
    expect(redactString(chain(11) + " foo-bar")).toBe("<mnemonic:redacted>-bar");
  });

  it("redacts mnemonics alongside other secret types", () => {
    const addr = "0x1234567890abcdef1234567890abcdef12345678";
    expect(redactString(`${chain(12)} ${addr}`)).toBe("<mnemonic:redacted> ***5678");
  });

  it("handles very long chains (3000 words = 125 redactions)", () => {
    const s = chain(3000); // 3000 = 24 * 125
    const expected = Array.from({ length: 125 }, () => "<mnemonic:redacted>").join(" ");
    expect(redactString(s)).toBe(expected);
  });

  it("matches the oracle on 200 randomized adversarial strings", () => {
    // Deterministic LCG so any failure reproduces exactly. Pieces and forced
    // "_" separators every 4 pieces keep every non-space run far below the
    // lengths that could trigger redactString()'s other redaction regexes
    // (e.g. the 200+ base64 rule), and no piece contains "0x" or "Qm".
    let seed = 987654321;
    const rnd = (max: number): number => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed % max;
    };
    const chunks = [
      "abc", "de", "fgh", "ijkl", "mnopq", "rs", "tuv", "wxyz",
      "ab1", "cd_2", "ABC", "Def", "9xyz", "a", "bcdefghij",
    ];
    const seps = [
      " ", "  ", "\t", "\n", "\u00a0", "\u2028", " \t ", "", ".", "-",
      "_", "1", ", ", "\r\n", "\u3000", "\u200b",
    ];
    for (let t = 0; t < 200; t += 1) {
      const pieceCount = 8 + rnd(13);
      let s = "";
      for (let p = 0; p < pieceCount; p += 1) {
        s += chunks[rnd(chunks.length)];
        if (p + 1 < pieceCount) {
          s += p % 4 === 3 ? "_" : seps[rnd(seps.length)];
        }
      }
      expect(redactString(s), `random case #${t}: ${JSON.stringify(s)}`).toBe(
        oracleReplace(s)
      );
    }
  });
});

describe("redactString CIDv1 redaction (S8786 linear scanner)", () => {
  // Oracle: verbatim copy of the ORIGINAL regex that used to live in index.ts
  // as CID_V1_RE (removed by the SonarCloud typescript:S8786 fix, which
  // replaced it with a linear scanner). Every corpus input must be redacted
  // byte-identically by redactString() and by this regex — this differential
  // test is the equivalence proof for the hand-rolled scanner. Corpus inputs
  // avoid characters that trigger redactString()'s other redaction steps
  // (0x+40-hex, Qm+44, 0x+64-hex, 200+ base64 runs, 11+ word mnemonics), so
  // the only difference between the two pipelines is the CIDv1 step.
  const CID_V1_ORACLE_RE = /b[a-z2-7]{58,}\b/g;
  const oracleReplace = (s: string): string => {
    CID_V1_ORACLE_RE.lastIndex = 0;
    return s.replace(CID_V1_ORACLE_RE, (m) => redactCid(m));
  };

  const inner = "a2b3c4".repeat(10);
  const corpus: ReadonlyArray<readonly [string, string]> = [
    ["empty string", ""],
    ["lone b", "b"],
    ["run of exactly 57 before EOS", "b" + "a".repeat(57)],
    ["run of exactly 58 at EOS", "b" + "a".repeat(58)],
    ["run of exactly 58 before punctuation", "!b" + "a".repeat(58) + "!"],
    ["run of exactly 59 before punctuation", "!b" + "a".repeat(59) + "!"],
    ["run of 100 before punctuation", "!b" + "a".repeat(100) + "!"],
    ["run blocked by digit 8", "b" + "a".repeat(60) + "8!"],
    ["run blocked by digit 9", "b" + "a".repeat(60) + "9!"],
    ["run blocked by digit 0", "b" + "a".repeat(60) + "0!"],
    ["run blocked by digit 1", "b" + "a".repeat(60) + "1!"],
    ["run blocked by uppercase A", "b" + "a".repeat(60) + "A!"],
    ["run blocked by underscore", "b" + "a".repeat(60) + "_!"],
    ["blocked run then valid run", "b" + "a".repeat(60) + "Z" + "b" + "a".repeat(60) + "!"],
    ["digits 2-7 are run characters", "b" + inner + "7!"],
    ["run reaches digit bound 7 then blocker 8", "b" + "a".repeat(57) + "78!"],
    ["run reaches digit bound 7 then boundary", "b" + "a".repeat(57) + "7!"],
    ["b inside a longer class run", "a" + "b" + "a".repeat(100) + "!"],
    ["two matches separated by punctuation", "b" + "a".repeat(60) + "!b" + "a".repeat(58) + "!"],
    ["two b starts inside one long class run", "b" + "a".repeat(60) + "b" + "a".repeat(60) + "!"],
    ["short run then long run in one class run", "b" + "a".repeat(57) + "b" + "a".repeat(60) + "!"],
    ["uppercase before b", "Zb" + "a".repeat(58) + "!"],
    ["accented char as boundary", "b" + "a".repeat(58) + "é"],
    ["euro sign as boundary", "b" + "a".repeat(58) + "€"],
    ["emoji (surrogate pair) as boundary", "b" + "a".repeat(58) + "\u{1F600}"],
    ["period and comma separators", "x.b" + "a".repeat(59) + ",y"],
    ["hash and dash separators", "#b" + "a".repeat(60) + "-"],
    ["no b at all", "qwerty" + "2".repeat(80) + "!"],
    ["only run characters", "2a7b3c".repeat(30)],
    ["run of 198 (below base64 threshold)", "b" + "a".repeat(197)],
    ["V1 hit longer than base64 threshold (order-sensitive)", "b" + "a".repeat(300) + "!"],
    ["two matches with text between", "pre b" + "a".repeat(60) + " mid b" + "a".repeat(58) + " post"],
    ["CRLF as boundary", "b" + "a".repeat(58) + "\r\n"],
    ["b followed by digits only", "b" + "7".repeat(60) + "!"],
  ];
  for (const [label, input] of corpus) {
    it(`matches the oracle: ${label}`, () => {
      expect(redactString(input)).toBe(oracleReplace(input));
    });
  }

  // Deterministic randomized differential pass (seeded PRNG; no extra deps).
  it("matches the oracle on seeded random strings", () => {
    let seed = 0x9e3779b9;
    const rnd = (): number => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const ALPHABET = ["b", "a", "z", "2", "7", "8", "9", "0", "1", "A", "Z", "_", "!", ".", "#", "-", "x", "q"];
    for (let iter = 0; iter < 1500; iter++) {
      const len = Math.floor(rnd() * 400);
      let s = "";
      for (let k = 0; k < len; k++) s += ALPHABET[Math.floor(rnd() * ALPHABET.length)];
      // Skip strings that could engage other redaction steps (0x pairs, Qm,
      // long base64 runs); no whitespace in the alphabet, so the mnemonic
      // step can never fire.
      if (s.includes("0x") || s.includes("Qm") || /[A-Za-z0-9]{200,}/.test(s)) continue;
      expect(redactString(s)).toBe(oracleReplace(s));
    }
  });

  // Guard against the quadratic blow-up the fix removed: the old regex
  // consumed the whole run at EVERY 'b' position before failing the \b check
  // (n² work), so this input used to take minutes; the scanner is one pass.
  // The trailing '8' blocks the CIDv1 boundary (its regex can never match),
  // after which the base64 step masks the long alphanumeric run.
  it("stays fast on adversarial many-b blocked runs", () => {
    const adversarial = "b".repeat(100_000) + "a".repeat(100_000) + "8";
    expect(redactString(adversarial)).toBe("<base64:redacted>");
    const hit = "b" + "a".repeat(200_000) + "!";
    // the match ends before the '!' boundary char, so it stays as-is
    expect(redactString(hit)).toBe(redactCid(hit.slice(0, -1)) + "!");
  });
});
