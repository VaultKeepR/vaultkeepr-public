import * as React from "react";
import { cn } from "./cn";

export type ListItemState = "vk-list-item-selected" | "vk-list-item";

export function listItemState(selected: boolean): ListItemState {
  return selected ? "vk-list-item-selected" : "vk-list-item";
}

const listItemStateClasses: Record<ListItemState, string> = {
  "vk-list-item": "hover:bg-vk-surface-hover",
  "vk-list-item-selected": "bg-vk-surface-active"
};

export interface ListItemProps {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

export function ListItem({ selected = false, onClick, children, trailing, className }: ListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-vk-sm px-3 py-2 text-left text-sm text-vk-text transition ease-vk",
        listItemStateClasses[listItemState(selected)],
        className
      )}>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </button>
  );
}
