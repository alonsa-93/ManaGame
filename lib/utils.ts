import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number for LTR-isolated display inside RTL text. */
export function ltrNumber(value: number | string): string {
  return String(value);
}
