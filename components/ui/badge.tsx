import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-black/[.04] text-mg-text-secondary",
        mint: "bg-mg-mint text-[#0f6a5f]",
        sand: "bg-mg-sand text-[#7a5c26]",
        blue: "bg-mg-blue text-[#2c5f8a]",
        coral: "bg-mg-coral text-[#9a4340]",
        review: "bg-mg-sand text-[#7a5c26] border border-[#e8d4ad]",
        illustrative: "bg-black/[.04] text-mg-text-secondary border border-dashed border-mg-border",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
