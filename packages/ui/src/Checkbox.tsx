import { cn } from "./cn";

export function checkboxTargetChecked(e: { target: { checked: boolean } }): boolean {
  return e.target.checked;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer select-none items-center gap-2", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(checkboxTargetChecked(e))}
        className="h-4 w-4 accent-vk-accent" />
      {label ? <span className="text-sm text-vk-text">{label}</span> : null}
    </label>
  );
}
