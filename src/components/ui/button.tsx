import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Electric glow — primary action
        glow:
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0",
        // Glass — secondary, outline feel
        glass:
          "border border-border/50 bg-surface-2/50 text-foreground hover:bg-surface-2/80 hover:border-border-glow/60 hover:-translate-y-0.5",
        // Ghost — minimal
        ghost:
          "text-text-secondary hover:bg-surface-2/50 hover:text-foreground",
        // Destructive — error actions
        destructive:
          "bg-gradient-to-br from-error to-error/80 text-white shadow-[0_0_12px_hsl(var(--error-glow)/0.2)] hover:shadow-[0_0_20px_hsl(var(--error-glow)/0.4)] hover:-translate-y-0.5",
        // Success — confirm actions
        success:
          "bg-gradient-to-br from-success to-success/80 text-white shadow-[0_0_12px_hsl(var(--success-glow)/0.2)] hover:shadow-[0_0_20px_hsl(var(--success-glow)/0.4)] hover:-translate-y-0.5",
        // Link — text-only
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "glow",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        <span className={loading ? "invisible" : ""}>{children}</span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
