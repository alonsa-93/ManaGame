import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const styles = {
    info: "bg-mg-blue border-[#cfe0ee] text-[#2c5f8a]",
    success: "bg-mg-mint border-[#bfe9df] text-[#0f6a5f]",
    warning: "bg-mg-sand border-[#e8d4ad] text-[#7a5c26]",
    error: "bg-mg-coral border-[#f0c9c3] text-[#9a4340]",
  }[variant];

  const Icon = variant === "success" ? CheckCircle2 : variant === "info" ? Info : AlertTriangle;

  return (
    <div className={cn("flex gap-3 rounded-mg-md border p-4 text-sm leading-relaxed", styles, className)} role="status">
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
      <div>
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-mg-text-secondary">{children}</div>
      </div>
    </div>
  );
}
