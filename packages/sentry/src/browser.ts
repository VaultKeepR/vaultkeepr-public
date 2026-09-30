



import { init, type BrowserOptions } from "@sentry/browser";
import { createBeforeSend, stripUrlQuery, type SentryInitOptions } from "./index";

export function initBrowserSentry(options: SentryInitOptions): void {
  const config: BrowserOptions = {
    dsn: options.dsn,
    environment: options.environment,
    release: options.release,
    sampleRate: options.sampleRate ?? 1.0,
    beforeSend: createBeforeSend({
      extraStripKeys: options.extraStripKeys
    }),

    beforeBreadcrumb(breadcrumb) {

      if (breadcrumb.category === "console") return null;

      if (breadcrumb.category === "navigation" && breadcrumb.data?.from) {
        breadcrumb.data.from = stripUrlQuery(String(breadcrumb.data.from));
      }
      if (breadcrumb.category === "navigation" && breadcrumb.data?.to) {
        breadcrumb.data.to = stripUrlQuery(String(breadcrumb.data.to));
      }
      return breadcrumb;
    },

    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,

    profilesSampleRate: 0.0,

    tracesSampleRate: 0.0,

    integrations: (integrations) =>
    integrations.filter(
      (i) => i.name !== "Console" && i.name !== "Breadcrumbs"
    )
  };

  init(config);
}