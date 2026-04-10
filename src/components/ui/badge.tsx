import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        // Glowing dot badges — the new standard
        success:
          "border-success/20 bg-success-soft text-success",
        warning:
          "border-warning/20 bg-warning-soft text-warning",
        error:
          "border-error/20 bg-error-soft text-error",
        info:
          "border-info/20 bg-info-soft text-info",
        // Role badges
        admin:
          "border-admin/20 bg-admin-soft text-admin",
        shop:
          "border-shop/20 bg-shop-soft text-shop",
        delivery:
          "border-delivery/20 bg-delivery-soft text-delivery",
        // Standard
        default:
          "border-border/50 bg-surface-2/50 text-text-secondary",
        secondary:
          "border-border/30 bg-surface-2/30 text-text-tertiary",
        outline:
          "border-border/50 bg-transparent text-text-secondary",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot = true, ...props }: BadgeProps) {
  const hasDot = dot && ["success", "warning", "error", "info", "admin", "shop", "delivery"].includes(variant || "");

  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {hasDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success shadow-[0_0_6px_hsl(var(--success-glow)/0.6)]",
            variant === "warning" && "bg-warning shadow-[0_0_6px_hsl(var(--warning-glow)/0.6)]",
            variant === "error" && "bg-error shadow-[0_0_6px_hsl(var(--error-glow)/0.6)]",
            variant === "info" && "bg-info shadow-[0_0_6px_hsl(var(--info-glow)/0.6)]",
            variant === "admin" && "bg-admin shadow-[0_0_6px_hsl(var(--admin-glow)/0.6)]",
            variant === "shop" && "bg-shop shadow-[0_0_6px_hsl(var(--shop-glow)/0.6)]",
            variant === "delivery" && "bg-delivery shadow-[0_0_6px_hsl(var(--delivery-glow)/0.6)]"
          )}
        />
      )}
      {props.children}
    </span>
  );
}

export { Badge, badgeVariants };
