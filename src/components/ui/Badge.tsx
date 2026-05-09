import { ReactNode } from "react";

type BadgeVariant = "default" | "high" | "medium" | "low" | "passed" | "failed" | "running" | "aborted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-700 text-gray-300",
  high: "bg-red-900/50 text-red-300",
  medium: "bg-yellow-900/50 text-yellow-300",
  low: "bg-green-900/50 text-green-300",
  passed: "bg-green-900/50 text-green-300",
  failed: "bg-red-900/50 text-red-300",
  running: "bg-blue-900/50 text-blue-300",
  aborted: "bg-gray-700 text-gray-400",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
