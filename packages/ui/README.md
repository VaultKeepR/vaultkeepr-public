# @vaultkeepr/ui

Shared React components for VaultKeepR clients: Button, Card, Input, plus the `cn` classname utility (clsx + tailwind-merge). Tailwind + shadcn conventions.

## Install

```bash
npm install @vaultkeepr/ui
```

## Usage

```tsx
import { Button, Card, Input, cn } from "@vaultkeepr/ui";
import "@vaultkeepr/ui/theme.css";

<Card className={cn("p-4", isActive && "border-primary")}>
  <Input placeholder="Master password" />
  <Button variant="outline">Unlock</Button>
</Card>
```

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon` (shadcn/cva conventions).
```

Import `@vaultkeepr/ui/theme.css` once in your app entry to load the design tokens.

Repository: [VaultKeepR/vaultkeepr-public](https://github.com/VaultKeepR/vaultkeepr-public) · Site: [vaultkeepr.xyz](https://vaultkeepr.xyz)

MIT licensed.