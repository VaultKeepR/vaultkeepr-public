import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

export const badgeTones = ["accent", "success", "warning", "danger", "muted"] as const;
export type BadgeTone = (typeof badgeTones)[number];

export const bannerRoles = { danger: "alert", warning: "status", info: "status" } as const;
export type BannerTone = keyof typeof bannerRoles;

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-vk-sm px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        accent: "bg-vk-accent-soft text-vk-accent",
        success: "bg-vk-success-soft text-vk-success",
        warning: "bg-vk-warning-soft text-vk-warning",
        danger: "bg-vk-destructive-soft text-vk-destructive",
        muted: "bg-vk-surface-hover text-vk-muted"
      }
    },
    defaultVariants: {
      tone: "accent"
    }
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ tone = "accent", className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, className }))}>{children}</span>;
}

export { badgeVariants };
