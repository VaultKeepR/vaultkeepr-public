import { cn } from "./cn";

export function selectTargetValue(e: { target: { value: string } }): string {
  return e.target.value;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  id?: string;
  ariaLabel?: string;
  className?: string;
}

export function Select({ value, onChange, options, label, id, ariaLabel, className }: SelectProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      {label ? <span className="text-xs text-vk-muted">{label}</span> : null}
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(selectTargetValue(e))}
        className="h-9 w-full rounded-vk-sm border border-vk-border bg-vk-surface px-2.5 text-sm text-vk-text transition ease-vk focus:border-vk-border-focus focus:outline-none focus:ring-2 focus:ring-vk-accent">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
