












const MAX_BUFFER_SIZE = 50;

export interface ErrorReport {

  ts: string;

  component: string;

  message: string;

  stack: string | null;

  runtime: "extension" | "ios" | "android" | "web";

  version: string | null;
}

const errorBuffer: ErrorReport[] = [];




function cleanStack(raw: string | undefined | null): string | null {
  if (!raw) return null;
  return raw.
  split("\n").
  slice(0, 15).
  map((line) =>
  line.
  replace(/https?:\/\/[^/]+/g, "").
  replace(/\?[^\s)]+/g, "").
  replace(/\/Users\/[^/]+\//g, "~/").
  trim()
  ).
  filter(Boolean).
  join("\n");
}





export function captureError(
error: Error | string,
component: string,
runtime: ErrorReport["runtime"],
options: {
  stack?: string | null;
  version?: string | null;
} = {})
: ErrorReport {
  const message =
  typeof error === "string" ? error : error?.message || "Unknown error";
  const rawStack =
  options.stack ?? (typeof error === "object" ? error?.stack : null);

  const report: ErrorReport = {
    ts: new Date().toISOString(),
    component,
    message: message.slice(0, 500),
    stack: cleanStack(rawStack),
    runtime,
    version: options.version ?? null
  };

  errorBuffer.push(report);
  if (errorBuffer.length > MAX_BUFFER_SIZE) {
    errorBuffer.shift();
  }

  return report;
}




export function getErrorBuffer(): readonly ErrorReport[] {
  return [...errorBuffer];
}




export function clearErrorBuffer(): void {
  errorBuffer.length = 0;
}





export function formatErrorReport(): string {
  if (errorBuffer.length === 0) return "No errors captured.";
  const header = `VaultKeepR Error Report — ${new Date().toISOString()}\n${"─".repeat(50)}\n`;
  const entries = errorBuffer.
  map(
    (e, i) =>
    `[${i + 1}] ${e.ts} | ${e.runtime} | ${e.component}\n    ${e.message}${
    e.stack ? "\n    " + e.stack.replace(/\n/g, "\n    ") : ""}`

  ).
  join("\n\n");
  return header + entries;
}






export async function sendErrorReport(
endpoint: string,
report?: ErrorReport)
: Promise<boolean> {
  try {
    const body = report ?
    [report] :
    errorBuffer.slice(-10);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errors: body }),

      credentials: "omit"
    });
    return res.ok;
  } catch {
    return false;
  }
}