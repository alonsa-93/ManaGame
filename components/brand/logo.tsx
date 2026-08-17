import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Official ManaGame logo lockup. Source asset only — never recreated with
 * CSS, never recolored, never distorted. See Master Spec §04.
 */
export function Logo({
  className,
  height = 32,
  href = "/",
  withTagline = false,
}: {
  className?: string;
  height?: number;
  href?: string | null;
  withTagline?: boolean;
}) {
  const width = Math.round(height * (2172 / 724));
  const img = (
    <Image
      src="/brand/logo.png"
      alt="ManaGame"
      width={width}
      height={height}
      style={{ height, width: "auto" }}
      priority
      className={cn("select-none", className)}
    />
  );

  const content = withTagline ? (
    <span className="flex flex-col items-start gap-1">{img}</span>
  ) : (
    img
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label="ManaGame — לעמוד הבית" className="inline-flex">
      {content}
    </Link>
  );
}

export function LogoMark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/brand/mark.png"
      alt="ManaGame"
      width={size}
      height={size}
      style={{ height: size, width: "auto" }}
      className={cn("select-none", className)}
    />
  );
}
