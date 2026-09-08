// Jazzer.js fuzz target — MRZ parser (core package).
// The parser may return undefined for undecodable input (valid outcome) but
// must never throw a TypeError/RangeError on malformed input.
const { parseMRZ } = require("../../packages/core/dist/index.js");

function fParseMRZ(data) {
  const s = Buffer.from(data).toString("latin1");
  const lines = s.split(/[\r\n]+/);
  try {
    parseMRZ(lines);
  } catch (e) {
    if (e instanceof TypeError || e instanceof RangeError) throw e;
  }
}

module.exports = { fuzz: fParseMRZ };
