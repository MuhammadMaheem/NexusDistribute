import * as React from "react";
import { cn } from "@/lib/utils";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full items-stretch", className)}
    {...props}
  />
));
InputGroup.displayName = "InputGroup";

const InputGroupText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center rounded-l-lg border border-r-0 border-border/50 bg-surface-2/50 px-3 text-sm text-text-secondary",
      className
    )}
    {...props}
  />
));
InputGroupText.displayName = "InputGroupText";

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex items-center justify-center rounded-r-lg border border-l-0 border-border/50 bg-surface-2/50 px-3 text-sm text-text-secondary transition-colors hover:bg-surface-2/80 hover:text-foreground",
      className
    )}
    {...props}
  />
));
InputGroupButton.displayName = "InputGroupButton";

export { InputGroup, InputGroupText, InputGroupButton };
