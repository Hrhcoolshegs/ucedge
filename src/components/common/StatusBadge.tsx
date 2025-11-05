import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string | any;
  variant?: 'status' | 'type';
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge = ({ status, variant = 'status', size = "md", className }: StatusBadgeProps) => {
  // Type badges (campaigns, transactions)
  if (variant === 'type') {
    const typeConfig: Record<string, { color: string; label: string }> = {
      Email: { color: 'bg-blue-100 text-blue-700', label: '📧 Email' },
      SMS: { color: 'bg-green-100 text-green-700', label: '📱 SMS' },
      WhatsApp: { color: 'bg-teal-100 text-teal-700', label: '💬 WhatsApp' },
      Push: { color: 'bg-purple-100 text-purple-700', label: '🔔 Push' },
      deposit: { color: 'bg-green-100 text-green-700', label: 'Deposit' },
      withdrawal: { color: 'bg-orange-100 text-orange-700', label: 'Withdrawal' },
      transfer: { color: 'bg-blue-100 text-blue-700', label: 'Transfer' },
      investment: { color: 'bg-purple-100 text-purple-700', label: 'Investment' }
    };
    const config = typeConfig[status];
    if (!config) return <Badge>{status}</Badge>;
    return <Badge className={cn(config.color, className)}>{config.label}</Badge>;
  }

  // Campaign status badges
  if (status === 'scheduled' || status === 'paused') {
    const campaignConfig: Record<string, { color: string; label: string }> = {
      scheduled: { color: 'bg-blue-100 text-blue-700', label: '⏰ Scheduled' },
      paused: { color: 'bg-yellow-100 text-yellow-700', label: '⏸️ Paused' }
    };
    const config = campaignConfig[status];
    return <Badge className={cn(config.color, className)}>{config.label}</Badge>;
  }

  // Transaction/default status badges
  const configs: Record<string, { label: string; icon: any; bgColor: string; textColor: string; borderColor: string }> = {
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

  const config = configs[status] || configs.active;
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