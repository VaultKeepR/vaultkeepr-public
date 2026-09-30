import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

export const toastAutoDismissDelay = 4000;

export function toastTimerResetKey(message: string, prevMessage?: string): boolean {
  return prevMessage !== undefined && message === prevMessage;
}

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 vk-panel flex items-center gap-2.5 px-4 py-3 text-sm shadow-lg",
  {
    variants: {
      tone: {
        success: "text-vk-success",
        danger: "text-vk-destructive",
        info: "text-vk-text"
      }
    },
    defaultVariants: {
      tone: "info"
    }
  }
);

const toastDotVariants = cva("h-2 w-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      success: "bg-vk-success",
      danger: "bg-vk-destructive",
      info: "bg-vk-accent"
    }
  },
  defaultVariants: {
    tone: "info"
  }
});

export interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  onDismiss: () => void;
  className?: string;
}

export function Toast({ message, tone = "info", onDismiss, className }: ToastProps) {
  const prevMessageRef = React.useRef<string | undefined>(undefined);
  const resetKey = toastTimerResetKey(message, prevMessageRef.current);
  React.useEffect(() => {
    prevMessageRef.current = message;
  }, [message]);

  React.useEffect(() => {
    const id = window.setTimeout(onDismiss, toastAutoDismissDelay);
    return () => window.clearTimeout(id);
  }, [onDismiss, message, resetKey]);

  return (
    <div role="status" className={cn(toastVariants({ tone, className }))}>
      <span aria-hidden="true" className={cn(toastDotVariants({ tone }))} />
      <span className="text-vk-text">{message}</span>
    </div>
  );
}

export { toastVariants };
