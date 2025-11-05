import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary',
  borderColor = 'border-t-primary'
}: MetricCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg shadow-sm border-t-4 p-6", borderColor)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      {change !== undefined && (
        <p className={cn("text-sm mt-1", change >= 0 ? "text-success" : "text-destructive")}>
          {change > 0 ? "+" : ""}{change}% vs last month
        </p>
      )}
    </div>
  );
};
