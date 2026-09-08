import { describe, it } from "vitest";
import fc from "fast-check";
import { importBinary } from "./crdtVault";

describe("untrusted-input parser oracles (property-based)", () => {
  it("importBinary never throws TypeError/RangeError on arbitrary bytes", () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 4096 }), (bytes) => {
        try {
          importBinary(bytes);
        } catch (e) {
          if (e instanceof TypeError || e instanceof RangeError) {
            throw new Error(`parser crash on malformed input: ${String(e)}`);
          }
        }
      }),
      { numRuns: 300 }
    );
  });
});
