import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  showIcon?: boolean;
  showValue?: boolean;
  reverseColor?: boolean; // For metrics where decrease is good (e.g., churn rate)
  className?: string;
}

export const TrendIndicator = ({ 
  value, 
  showIcon = true,
  showValue = true,
  reverseColor = false,
  className 
}: TrendIndicatorProps) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const color = isNeutral 
    ? 'text-gray-500'
    : (reverseColor ? !isPositive : isPositive)
    ? 'text-success'
    : 'text-destructive';

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-sm font-medium",
      color,
      className
    )}>
      {showIcon && <Icon className="h-4 w-4" />}
      {showValue && (
        <span>{isPositive && '+'}{Math.abs(value).toFixed(1)}%</span>
      )}
    </span>
  );
};