import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes safely with clsx and tailwind-merge.
 * Resolves class conflicts by letting the last class win.
 *
 * @param inputs - Conditional class values from clsx
 * @returns A clean, deduplicated class string
 *
 * @example
 * cn("px-4 py-2", isPrimary && "bg-[#F5C453] text-black")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
