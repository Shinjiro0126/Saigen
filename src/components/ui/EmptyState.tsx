import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-gray-700 mb-4">{icon}</div>
      <h3 className="text-base font-medium text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs">{description}</p>
      {action}
    </div>
  );
}
