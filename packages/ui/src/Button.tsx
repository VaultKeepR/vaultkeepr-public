import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-vk-sm text-sm font-medium transition duration-200 ease-vk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-accent disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-vk-accent font-semibold text-white hover:bg-vk-accent-hover",
        destructive: "bg-vk-destructive font-semibold text-white hover:opacity-90",
        "danger-outline":
          "border border-vk-destructive bg-vk-destructive-soft font-semibold text-vk-destructive hover:opacity-90",
        secondary: "border border-vk-border bg-vk-surface text-vk-text hover:bg-vk-surface-hover",
        outline: "border border-vk-border bg-transparent text-vk-text hover:bg-vk-surface-hover",
        ghost: "text-vk-muted hover:bg-vk-surface-hover hover:text-vk-text",
        link: "text-vk-accent underline-offset-4 hover:underline"
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        xs: "px-2 py-1 text-xs",
        icon: "p-1"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props} />);


  }
);
Button.displayName = "Button";

export { Button, buttonVariants };