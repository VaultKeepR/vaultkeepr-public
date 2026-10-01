import * as React from "react";
import { cn } from "./cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-vk-sm border border-vk-border bg-vk-surface px-3 py-2.5 text-sm text-vk-text transition ease-vk placeholder:text-vk-muted focus-visible:border-vk-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-accent disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        ref={ref}
        {...props} />
    );
  }
);
Input.displayName = "Input";

export { Input };