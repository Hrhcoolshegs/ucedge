import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ExplainButtonProps {
  explanation: string;
}

export const ExplainButton = ({ explanation }: ExplainButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Explain this metric"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">What does this mean?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
