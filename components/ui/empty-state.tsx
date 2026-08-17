import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center gap-2 py-16 px-6", className)}>
      <p className="text-mg-text font-medium">{title}</p>
      {description && <p className="text-sm text-mg-text-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "משהו השתבש.",
  description,
  details,
  action,
}: {
  title?: string;
  description?: string;
  details?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-16 px-6">
      <p className="text-mg-text font-medium">{title}</p>
      {description && <p className="text-sm text-mg-text-secondary max-w-sm">{description}</p>}
      {details && (
        <details className="mt-3 text-xs text-mg-text-secondary max-w-md text-start">
          <summary className="cursor-pointer">פרטים טכניים</summary>
          <pre className="whitespace-pre-wrap mt-2 rounded-mg-sm bg-black/[.03] p-3 text-start">{details}</pre>
        </details>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
