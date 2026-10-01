import { cn } from "./cn";

export function tabTestId(id: string, prefix = "tools-tab-"): string {
  return `${prefix}${id}`;
}

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
  testIdPrefix?: string;
  ariaLabel?: string;
}

export function Tabs({ tabs, active, onChange, className, testIdPrefix = "tools-tab-", ariaLabel }: TabsProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cn("flex gap-1", className)}>
      {tabs.map((tab) => {
        const activeTab = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab}
            data-testid={tabTestId(tab.id, testIdPrefix)}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 truncate rounded-vk-sm px-2 py-1.5 text-xs font-medium transition ease-vk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-accent",
              activeTab
                ? "bg-vk-accent font-semibold text-white hover:bg-vk-accent-hover"
                : "border border-vk-border text-vk-muted hover:bg-vk-surface-hover"
            )}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
