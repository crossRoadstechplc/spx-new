/* Phase 7: Empty state component */
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="max-w-md mx-auto">
        {icon && (
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        )}
        <p className="text-lg font-medium mb-2">{title}</p>
        {description && <p className="text-muted-foreground mb-6">{description}</p>}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
