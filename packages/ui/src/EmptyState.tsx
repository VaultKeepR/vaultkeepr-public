import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action, className, children, ...rest }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-vk-sm border border-dashed border-vk-border px-4 py-8 text-center",
        className
      )}
      {...rest}>
      {icon ? <span className="text-vk-muted">{icon}</span> : null}
      <p className="text-sm font-medium text-vk-text">{title}</p>
      {description ? <p className="text-xs text-vk-muted">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
