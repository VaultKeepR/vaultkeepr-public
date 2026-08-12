



import { init, type ReactNativeOptions } from "@sentry/react-native";
import { createBeforeSend, type SentryInitOptions } from "./index";

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
        breadcrumb.data.from = String(breadcrumb.data.from).replace(/\?.*$/, "");
      }
      if (breadcrumb.category === "navigation" && breadcrumb.data?.to) {
        breadcrumb.data.to = String(breadcrumb.data.to).replace(/\?.*$/, "");
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