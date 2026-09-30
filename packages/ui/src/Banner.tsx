import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";
import { bannerRoles, type BannerTone } from "./Badge";

const bannerVariants = cva(
  "flex items-start gap-3 rounded-vk-sm border px-4 py-3 text-sm",
  {
    variants: {
      tone: {
        danger: "border-vk-destructive-soft bg-vk-destructive-soft text-vk-destructive",
        warning: "border-vk-warning-soft bg-vk-warning-soft text-vk-warning",
        info: "border-vk-accent-soft bg-vk-accent-soft text-vk-accent"
      }
    }
  }
);

export interface BannerProps extends VariantProps<typeof bannerVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Banner({ tone = "info", className, children }: BannerProps) {
  return (
    <div role={bannerRoles[tone as BannerTone]} className={cn(bannerVariants({ tone, className }))}>
      {children}
    </div>
  );
}

export { bannerVariants };
