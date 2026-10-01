// Property tests (fast-check) for the untrusted-input parsing surfaces the
// jazzer harnesses also cover: CRDT binary import (sync), MRZ parsing and the
// third-party import parsers (core).
//
// Run by .github/workflows/fuzz.yml (nightly + on demand).
// Locally: pnpm build && node fuzz/properties/run.js
//
// Oracle (same as the jazzer harnesses): a TypeError or RangeError escaping a
// parser on malformed input is a crash (bug); clean Error rejections and
// undefined returns are expected outcomes.
const fc = require("fast-check");

const { importBinary } = require("../../packages/sync/dist/index.js");
const core = require("../../packages/core/dist/index.js");

function noCrash(name, fn, input) {
  try {
    fn(input);
  } catch (e) {
    if (e instanceof TypeError || e instanceof RangeError) {
      throw new Error(
        `${name} crashed on input ${JSON.stringify(input).slice(0, 160)}: ${e && e.message}`
      );
    }
    // Clean Error rejection = expected outcome; swallow.
  }
}

const checks = [
  [
    "sync.importBinary",
    (bytes) => noCrash("importBinary", (b) => importBinary(new Uint8Array(b)), bytes),
    fc.uint8Array({ maxLength: 4096 }),
  ],
  [
    "core.parseMRZ",
    (bytes) => {
      const s = Buffer.from(bytes).toString("latin1");
      noCrash("parseMRZ", (v) => core.parseMRZ(v.split(/[\r\n]+/)), s);
    },
    fc.uint8Array({ maxLength: 512 }),
  ],
  [
    "core.importCsv",
    (s) => noCrash("importCsv", (v) => core.importCsv(v), s),
    fc.string({ maxLength: 2048 }),
  ],
  [
    "core.importBitwardenJson",
    (s) => noCrash("importBitwardenJson", (v) => core.importBitwardenJson(v), s),
    fc.string({ maxLength: 2048 }),
  ],
  [
    "core.importProtonPassJson",
    (s) => noCrash("importProtonPassJson", (v) => core.importProtonPassJson(v), s),
    fc.string({ maxLength: 2048 }),
  ],
];

let failed = 0;
for (const [name, fn, arb] of checks) {
  const result = fc.check(
    fc.property(arb, (v) => {
      fn(v);
      return true;
    }),
    { numRuns: 300 }
  );
  if (result.failed) {
    failed++;
    console.error(`FAIL ${name}: ${(result.error && result.error.message) || "counterexample found"}`);
    if (result.counterexample) {
      console.error("  counterexample:", JSON.stringify(result.counterexample).slice(0, 300));
    }
  } else {
    console.log(`PASS ${name} (300 runs)`);
  }
}

if (failed > 0) {
  console.error(`${failed} property check(s) failed`);
  process.exit(1);
}
console.log("all property checks passed");
