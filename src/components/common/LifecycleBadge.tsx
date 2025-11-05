import { User, UserCheck, Star, AlertTriangle, UserX, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifecycleBadgeProps {
  stage: "new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const LifecycleBadge = ({ 
  stage, 
  size = "md", 
  showIcon = true,
  className 
}: LifecycleBadgeProps) => {
  const configs = {
    new: {
      label: 'New',
      icon: User,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300'
    },
    active: {
      label: 'Active',
      icon: UserCheck,
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/30'
    },
    loyal: {
      label: 'Loyal',
      icon: Star,
      bgColor: 'bg-secondary/20',
      textColor: 'text-accent',
      borderColor: 'border-secondary'
    },
    'at-risk': {
      label: 'At-Risk',
      icon: AlertTriangle,
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/30'
    },
    churned: {
      label: 'Churned',
      icon: UserX,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-300'
    },
    reactivated: {
      label: 'Reactivated',
      icon: RefreshCw,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-300'
    }
  };

  const config = configs[stage];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
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
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
};