import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ChurnRiskIndicatorProps {
  risk: "low" | "medium" | "high";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ChurnRiskIndicator = ({ 
  risk, 
  showLabel = true,
  animated = false,
  className 
}: ChurnRiskIndicatorProps) => {
  const configs = {
    low: {
      label: 'Low Risk',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    medium: {
      label: 'Medium Risk',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30'
    },
    high: {
      label: 'High Risk',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30'
    }
  };

  const config = configs[risk];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border",
      config.bgColor,
      config.color,
      config.borderColor,
      className
    )}>
      <AlertCircle className={cn(
        "h-3.5 w-3.5",
        animated && risk === 'high' && 'animate-pulse'
      )} />
      {showLabel && config.label}
    </div>
  );
};