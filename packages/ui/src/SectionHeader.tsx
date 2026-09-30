import * as React from "react";
import { cn } from "./cn";

export interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <h3 className="text-xs uppercase tracking-wider text-vk-muted">{title}</h3>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
