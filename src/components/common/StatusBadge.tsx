import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: "completed" | "pending" | "failed" | "active" | "inactive";
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge = ({ status, size = "md", className }: StatusBadgeProps) => {
  const configs = {
    completed: {
      label: 'Completed',
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/30'
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/30'
    },
    failed: {
      label: 'Failed',
      icon: XCircle,
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/30'
    },
    active: {
      label: 'Active',
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/30'
    },
    inactive: {
      label: 'Inactive',
      icon: XCircle,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-300'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium border",
      config.bgColor,
      config.textColor,
      config.borderColor,
      sizeClasses[size],
      className
    )}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
};