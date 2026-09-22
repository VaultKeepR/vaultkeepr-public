import {
  openSync,
  writeSync,
  closeSync,
  constants as fsConstants,
} from "fs";

export const LOG = "/tmp/vaultkeeper-forward.log";
export const ERR_LOG = "/tmp/vaultkeeper-forward-err.log";

// These paths sit in the world-writable /tmp, where a symlink planted by
// another local user must not redirect writes (SonarCloud S5443, CWE-377).
// String flags ("a") do NOT set O_NOFOLLOW — numeric flags do. On ELOOP
// (symlink where a regular file is required) the write is dropped.
export function safeAppend(path: string, msg: string): void {
  let fd: number | null = null;
  try {
    fd = openSync(
      path,
      fsConstants.O_WRONLY |
        fsConstants.O_CREAT |
        fsConstants.O_APPEND |
        fsConstants.O_NOFOLLOW,
      0o600
    );
    writeSync(fd, msg);
  } catch {
    // ELOOP = planted symlink; other errors (EACCES...) mean the log write
    // must not happen anyway. Never fall back to a symlink-following open.
  } finally {
    if (fd !== null) {
      try {
        closeSync(fd);
      } catch {}
    }
  }
}

export function errLog(msg: string, path: string = ERR_LOG): void {
  safeAppend(path, `[${new Date().toISOString()}] ${msg}\n`);
}

export function log(msg: string, path: string = LOG): void {
  if (process.env.VAULTKEEPER_FORWARD_DEBUG !== "1") return;
  safeAppend(path, `[${new Date().toISOString()}] ${msg}\n`);
}