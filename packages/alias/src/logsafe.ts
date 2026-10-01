// Extracted from forward.ts so the log-write hardening is unit-testable
// (forward.ts is a stdin-driven mail daemon entry point and self-executes on
// import). S5443/CWE-59: /tmp is world-writable; O_NOFOLLOW makes open() fail
// with ELOOP when the path is a planted symlink, and the write is dropped.
import { closeSync, constants, openSync, writeSync } from "fs";

const DEBUG = process.env.VAULTKEEPER_FORWARD_DEBUG === "1";
export const LOG = "/tmp/vaultkeeper-forward.log";
export const ERR_LOG = "/tmp/vaultkeeper-forward-err.log";

export function safeAppend(path: string, data: string): void {
  try {
    const fd = openSync(
      path,
      constants.O_WRONLY | constants.O_CREAT | constants.O_APPEND | constants.O_NOFOLLOW,
      0o600
    );
    try {
      writeSync(fd, data);
    } finally {
      closeSync(fd);
    }
  } catch {}
}

export function errLog(msg: string): void {
  safeAppend(ERR_LOG, `[${new Date().toISOString()}] ${msg}\n`);
}

export function log(msg: string): void {
  if (!DEBUG) return;
  safeAppend(LOG, `[${new Date().toISOString()}] ${msg}\n`);
}
