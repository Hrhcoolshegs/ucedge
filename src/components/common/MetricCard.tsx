import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10'
}: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border-t-[3px] border-primary p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-accent mb-1">{value}</h3>
          {change && (
            <div className="flex items-center gap-1">
              <span className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className={cn('p-3 rounded-full', iconBgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </div>
  );
};
