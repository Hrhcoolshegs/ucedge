import { Button } from '@/components/ui/button';
import { X, Send, Tag, UserPlus, Download, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  totalCustomers?: number;
  totalLTV?: number;
  onClearSelection: () => void;
  onCreateCampaign?: () => void;
  onMessage?: () => void;
  onTag?: () => void;
  onAssign?: () => void;
  onExport?: () => void;
  className?: string;
}

export const BulkActionBar = ({
  selectedCount,
  totalCustomers,
  totalLTV,
  onClearSelection,
  onCreateCampaign,
  onMessage,
  onTag,
  onAssign,
  onExport,
  className
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
      "bg-card border shadow-lg rounded-lg px-4 py-3",
      "animate-in slide-in-from-bottom-5 duration-300",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pr-4 border-r">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {selectedCount.toLocaleString()} selected
            </p>
            {totalCustomers !== undefined && (
              <p className="text-xs text-muted-foreground">
                {totalCustomers.toLocaleString()} customers
                {totalLTV && ` • ₦${(totalLTV / 1000000).toFixed(1)}M LTV`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCreateCampaign && (
            <Button
              variant="default"
              size="sm"
              onClick={onCreateCampaign}
              className="h-8"
            >
              <Target className="h-3.5 w-3.5 mr-1.5" />
              Create Campaign
            </Button>
          )}
          {onMessage && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onMessage}
              className="h-8"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Message
            </Button>
          )}
          {onTag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTag}
              className="h-8"
            >
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              Tag
            </Button>
          )}
          {onAssign && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAssign}
              className="h-8"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Assign
            </Button>
          )}
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="h-8"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
