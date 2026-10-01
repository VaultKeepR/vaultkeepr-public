// Coverage-round: glue paths of the sentry package (init wrappers with the
// SDK mocked, scrubber edge branches, url-query stripping).
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@sentry/browser", () => ({ init: vi.fn() }));
vi.mock("@sentry/react-native", () => ({ init: vi.fn() }));

import { init as browserInit } from "@sentry/browser";
import { init as rnInit } from "@sentry/react-native";
import { createBeforeSend, scrubEventValue, stripUrlQuery } from "./index";
import { initBrowserSentry } from "./browser";
import { initReactNativeSentry } from "./react-native";

afterEach(() => {
  vi.clearAllMocks();
});

describe("stripUrlQuery", () => {
  it("removes the query string", () => {
    expect(stripUrlQuery("https://x.tld/p?a=1")).toBe("https://x.tld/p");
  });

  it("returns the url untouched when there is no query", () => {
    expect(stripUrlQuery("https://x.tld/p")).toBe("https://x.tld/p");
  });

  it("only strips after the last line terminator", () => {
    expect(stripUrlQuery("https://x.tld/old?a\nhttps://x.tld/new?b")).toBe(
      "https://x.tld/old?a\nhttps://x.tld/new"
    );
  });
});

describe("scrubEventValue", () => {
  it("redacts secrets-shaped strings and hidden keys recursively", () => {
    const input = {
      note: "0x" + "a".repeat(64),
      nested: { password: "p", keep: ["ok", "0x" + "b".repeat(40)] },
      flag: true,
      n: 3,
      nil: null
    };
    const out = scrubEventValue(input) as Record<string, unknown>;
    expect(out.note).toBe("[REDACTED]");
    const nested = out.nested as Record<string, unknown>;
    expect(nested.password).toBe("[REDACTED]");
    expect((nested.keep as unknown[])[1]).toBe("[REDACTED]");
    expect(out.flag).toBe(true);
    expect(out.n).toBe(3);
  });

  it("stops at depth 6", () => {
    let v: unknown = "0x" + "c".repeat(64);
    for (let i = 0; i < 7; i++) v = { v };
    expect(() => scrubEventValue(v)).not.toThrow();
  });
});

describe("createBeforeSend", () => {
  it("scrubs extra, tags, request and user in one pass", () => {
    const beforeSend = createBeforeSend({ extraStripKeys: ["customKey"] });
    const event = {
      extra: { customKey: "x", plain: "ok", nested: { mnemonic: "m" } },
      tags: { session: "s1", env: "prod" },
      request: {
        data: "body",
        query_string: "?a=1",
        cookies: "c=1",
        headers: { Authorization: "Bearer x", "X-Api-Key": "k", Accept: "json" }
      },
      user: { id: "u", ip_address: "1.2.3.4" }
    };
    const out = beforeSend(event) as typeof event;
    expect(out.extra.customKey).toBe("[REDACTED]");
    expect(out.extra.plain).toBe("ok");
    expect((out.extra.nested as Record<string, unknown>).mnemonic).toBe("[REDACTED]");
    expect(out.tags.session).toBe("[REDACTED]");
    expect(out.tags.env).toBe("prod");
    expect(out.request.data).toBe("[REDACTED]");
    expect(out.request.query_string).toBe("[REDACTED]");
    expect(out.request.cookies).toBe("[REDACTED]");
    expect(out.request.headers.Authorization).toBe("[REDACTED]");
    expect(out.request.headers["X-Api-Key"]).toBe("[REDACTED]");
    expect(out.request.headers.Accept).toBe("json");
    expect(out.user).toEqual({ id: undefined, ip_address: undefined });
  });

  it("tolerates events without the optional sections", () => {
    const beforeSend = createBeforeSend();
    expect(beforeSend({})).toEqual({});
  });
});

describe("init wrappers", () => {
  const options = {
    dsn: "https://dsn@example/1",
    environment: "production" as const,
    release: "1.8.10"
  };

  it("initBrowserSentry builds the browser config and keeps navigation breadcrumbs", () => {
    initBrowserSentry(options);
    expect(browserInit).toHaveBeenCalledTimes(1);
    const cfg = vi.mocked(browserInit).mock.calls[0][0] as {
      beforeBreadcrumb: (b: { category?: string; data?: Record<string, string> }) => unknown;
      integrations: (i: { name: string }[]) => { name: string }[];
      sampleRate: number;
    };
    expect(cfg.sampleRate).toBe(1);
    expect(cfg.beforeBreadcrumb({ category: "console" })).toBeNull();
    const bc = { category: "navigation", data: { from: "https://a.tld/x?q=1", to: "https://b.tld/y?z" } };
    const out = cfg.beforeBreadcrumb(bc) as typeof bc;
    expect(out.data.from).toBe("https://a.tld/x");
    expect(out.data.to).toBe("https://b.tld/y");
    const kept = cfg.integrations([{ name: "Console" }, { name: "Breadcrumbs" }, { name: "HTTP" }]);
    expect(kept).toEqual([{ name: "HTTP" }]);
  });

  it("initReactNativeSentry builds the RN config", () => {
    initReactNativeSentry(options);
    expect(rnInit).toHaveBeenCalledTimes(1);
    const cfg = vi.mocked(rnInit).mock.calls[0][0] as {
      beforeBreadcrumb: (b: { category?: string; data?: Record<string, string> }) => unknown;
      enableNative: boolean;
    };
    expect(cfg.enableNative).toBe(true);
    expect(cfg.beforeBreadcrumb({ category: "console" })).toBeNull();
    const bc = { category: "navigation", data: { from: "https://a.tld/x?q=1" } };
    const out = cfg.beforeBreadcrumb(bc) as typeof bc;
    expect(out.data.from).toBe("https://a.tld/x");
  });
});
