import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--surface-subtle)] text-[var(--text-secondary)]",
  success: "bg-success-50 text-success-700 dark:bg-[rgba(34,197,94,0.12)] dark:text-[#4ADE80]",
  warning: "bg-warning-50 text-warning-700 dark:bg-[rgba(245,158,11,0.12)] dark:text-[#FCD34D]",
  danger:  "bg-danger-50  text-danger-700  dark:bg-[rgba(239,68,68,0.12)]  dark:text-[#F87171]",
  info:    "bg-info-50    text-info-700    dark:bg-[rgba(59,130,246,0.12)]  dark:text-[#93C5FD]",
  brand:   "bg-[var(--brand-50)] text-[var(--brand-700)]",
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5",
        "text-xs font-medium uppercase tracking-wide",
        "rounded-full",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
