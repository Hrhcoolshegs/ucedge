import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { formatDate } from '@/utils/formatters';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
}

export function DateRangeFilter({ value, onChange, placeholder = "Select date range" }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayText = value.from
    ? value.to
      ? `${formatDate(value.from)} - ${formatDate(value.to)}`
      : formatDate(value.from)
    : placeholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-2">
          <div className="grid gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                onChange({ from: today, to: today });
                setIsOpen(false);
              }}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                onChange({ from: weekAgo, to: today });
                setIsOpen(false);
              }}
            >
              Last 7 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                onChange({ from: monthAgo, to: today });
                setIsOpen(false);
              }}
            >
              Last 30 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                onChange({ from: threeMonthsAgo, to: today });
                setIsOpen(false);
              }}
            >
              Last 3 months
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange({ from: undefined, to: undefined });
                setIsOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
