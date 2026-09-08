// Jazzer.js fuzz target — third-party import parsers (core package).
// Covers importCsv, importBitwardenJson, importProtonPassJson (sync entry
// points). A TypeError/RangeError escaping on malformed input = bug (crash);
// clean Error rejections (e.g. "invalid JSON") are expected outcomes.
const core = require("../../packages/core/dist/index.js");

function fImportParsers(data) {
  const s = Buffer.from(data).toString("utf8");
  for (const fn of [core.importCsv, core.importBitwardenJson, core.importProtonPassJson]) {
    try {
      fn(s);
    } catch (e) {
      if (e instanceof TypeError || e instanceof RangeError) throw e;
    }
  }
}

module.exports = { fuzz: fImportParsers };
