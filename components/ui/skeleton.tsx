import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-mg-md bg-black/[.06]", className)} aria-hidden />;
}
