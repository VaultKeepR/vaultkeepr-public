



import { init, type ReactNativeOptions } from "@sentry/react-native";
import { createBeforeSend, stripUrlQuery, type SentryInitOptions } from "./index";

export function initReactNativeSentry(options: SentryInitOptions): void {
  const config: ReactNativeOptions = {
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

    enableNative: true
  };

  init(config);
}