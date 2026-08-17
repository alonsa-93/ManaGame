import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-mg-md border border-mg-border bg-white px-3.5 text-[15px] text-mg-text placeholder:text-mg-text-secondary/70",
        "focus-visible:outline-none focus-visible:border-mg-teal focus-visible:ring-2 focus-visible:ring-mg-teal/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "aria-[invalid=true]:border-mg-error aria-[invalid=true]:ring-mg-error/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
