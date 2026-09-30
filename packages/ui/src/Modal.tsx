import * as React from "react";
import { cn } from "./cn";

export function modalEscapeCloses(onClose: () => void): (e: { key: string }) => void {
  return (e) => { if (e.key === "Escape") onClose(); };
}

export function confirmBackdropCloses(onClose: () => void, isBackdrop: (target: string) => boolean): (target: string) => void {
  return (target) => { if (isBackdrop(target)) onClose(); };
}

export function focusTrapNext(index: number, count: number, shift: boolean): number {
  if (count <= 0) return 0;
  return (index + (shift ? -1 : 1) + count) % count;
}

export type ModalWidth = "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: ModalWidth;
}

const widthClasses: Record<ModalWidth, string> = {
  md: "max-w-md",
  lg: "max-w-lg"
};

export function Modal({ open, onClose, title, children, width = "md" }: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = modalEscapeCloses(onClose);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>("input, textarea, select");
    if (first) {
      first.focus();
    } else {
      panelRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.checkVisibility?.({ checkVisibilityCSS: true }) ?? true);
      if (focusables.length === 0) return;
      const current = focusables.indexOf(document.activeElement as HTMLElement);
      const next = focusTrapNext(
        current < 0 ? (e.shiftKey ? focusables.length - 1 : 0) : current,
        focusables.length,
        e.shiftKey
      );
      e.preventDefault();
      focusables[next].focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm ease-vk"
      onClick={(e) =>
        confirmBackdropCloses(onClose, (t) => t === "backdrop")(
          e.target === e.currentTarget ? "backdrop" : "content"
        )
      }>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "vk-panel p-6 w-full outline-none focus-visible:ring-2 focus-visible:ring-vk-accent",
          widthClasses[width]
        )}>
        {title ? (
          <h2 className="mb-4 text-lg font-semibold text-vk-text">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
