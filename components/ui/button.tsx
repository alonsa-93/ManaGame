import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-mg-md text-[15px] font-medium transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-mg-teal text-white hover:bg-[#149385] active:bg-[#0f7a6f] shadow-[0_1px_2px_rgba(24,184,166,.25)]",
        secondary:
          "bg-white text-mg-text border border-mg-border hover:border-mg-teal hover:text-mg-teal",
        ghost: "text-mg-text hover:bg-black/[.04]",
        gradient: "mg-gradient-bg text-white hover:opacity-90",
        destructive: "bg-mg-error text-white hover:opacity-90",
        lab: "bg-mg-teal/90 text-mg-lab-bg hover:bg-mg-teal border border-mg-teal/40",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5",
        lg: "h-[52px] px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
