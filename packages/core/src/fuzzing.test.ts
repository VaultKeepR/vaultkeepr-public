import { describe, it } from "vitest";
import fc from "fast-check";
import { parseMRZ } from "./mrz";
import {
  importCsv,
  importBitwardenJson,
  importProtonPassJson,
  isOnePasswordPif,
  isProtonPassExport
} from "./import";

function expectNoParserCrash(fn: () => unknown): void {
  try {
    fn();
  } catch (e) {
    if (e instanceof TypeError || e instanceof RangeError) {
      throw new Error(`parser crash on malformed input: ${String(e)}`);
    }
  }
}

describe("untrusted-input parser oracles (property-based)", () => {
  it("importCsv never throws TypeError/RangeError on arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 512 }), (s) => {
        expectNoParserCrash(() => importCsv(s));
      }),
      { numRuns: 500 }
    );
  });

  it("importBitwardenJson never throws TypeError/RangeError on arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 512 }), (s) => {
        expectNoParserCrash(() => importBitwardenJson(s));
      }),
      { numRuns: 500 }
    );
  });

  it("importProtonPassJson never throws TypeError/RangeError on arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 512 }), (s) => {
        expectNoParserCrash(() => importProtonPassJson(s));
      }),
      { numRuns: 500 }
    );
  });

  it("parseMRZ never throws TypeError/RangeError on arbitrary line arrays", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 64 }), { maxLength: 6 }),
        (lines) => {
          expectNoParserCrash(() => parseMRZ(lines));
        }
      ),
      { numRuns: 500 }
    );
  });

  it("isOnePasswordPif and isProtonPassExport never throw on arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 512 }), (s) => {
        expectNoParserCrash(() => isOnePasswordPif(s));
        expectNoParserCrash(() => isProtonPassExport(s));
      }),
      { numRuns: 500 }
    );
  });
});
