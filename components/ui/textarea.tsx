import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[160px] w-full rounded-mg-md border border-mg-border bg-white px-3.5 py-3 text-[15px] leading-relaxed text-mg-text placeholder:text-mg-text-secondary/70",
        "focus-visible:outline-none focus-visible:border-mg-teal focus-visible:ring-2 focus-visible:ring-mg-teal/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
