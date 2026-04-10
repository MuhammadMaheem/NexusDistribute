import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "success" | "warning" | "error" | "info" | "admin" | "shop" | "delivery";
  }
>(({ className, value, variant = "default", ...props }, ref) => {
  const colorMap = {
    default: "from-primary to-primary/60",
    success: "from-success to-success/60",
    warning: "from-warning to-warning/60",
    error: "from-error to-error/60",
    info: "from-info to-info/60",
    admin: "from-admin to-admin/60",
    shop: "from-shop to-shop/60",
    delivery: "from-delivery to-delivery/60",
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-surface-2",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 bg-gradient-to-r ${colorMap[variant]} transition-all duration-500 ease-out`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
