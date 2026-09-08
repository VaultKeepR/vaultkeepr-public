// Jazzer.js fuzz target — CRDT binary import (sync package).
// Oracle: any TypeError escaping importBinary() = memory-unsafe/parse bug (crash).
// Expected failures are plain Errors with a message (clean rejection).
const { importBinary } = require("../../packages/sync/dist/index.js");

function fCrdtImport(data) {
  try {
    importBinary(new Uint8Array(data));
  } catch (e) {
    if (e instanceof TypeError) throw e;
  }
}

module.exports = { fuzz: fCrdtImport };
