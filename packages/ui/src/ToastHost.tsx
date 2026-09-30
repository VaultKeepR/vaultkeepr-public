import * as React from "react";
import { Toast, type ToastProps } from "./Toast";

export type ToastTone = NonNullable<ToastProps["tone"]>;

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

export interface PushToast {
  push: (message: string, tone?: ToastTone) => void;
}

const maxVisibleToasts = 3;

const ToastsContext = React.createContext<PushToast>({ push: () => undefined });

export function useToasts(): PushToast {
  return React.useContext(ToastsContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const nextId = React.useRef(1);

  const remove = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = React.useCallback(
    (message: string, tone: ToastTone = "info") => {
      const id = nextId.current++;
      setItems((prev) => [...prev, { id, message, tone }].slice(-maxVisibleToasts));
    },
    []
  );

  const value = React.useMemo(() => ({ push }), [push]);

  return (
    <ToastsContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {items.map((item) => (
          <Toast
            key={item.id}
            message={item.message}
            tone={item.tone}
            className="pointer-events-auto static"
            onDismiss={() => remove(item.id)}
          />
        ))}
      </div>
    </ToastsContext.Provider>
  );
}
