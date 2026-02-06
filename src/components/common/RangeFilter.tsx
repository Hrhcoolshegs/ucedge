import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export interface NumericRange {
  min: number | undefined;
  max: number | undefined;
}

interface RangeFilterProps {
  value: NumericRange;
  onChange: (range: NumericRange) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export function RangeFilter({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  prefix = '',
  suffix = ''
}: RangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(value.min?.toString() ?? '');
  const [localMax, setLocalMax] = useState(value.max?.toString() ?? '');

  const handleApply = () => {
    onChange({
      min: localMin ? parseFloat(localMin) : undefined,
      max: localMax ? parseFloat(localMax) : undefined,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    onChange({ min: undefined, max: undefined });
    setIsOpen(false);
  };

  const displayText = value.min !== undefined || value.max !== undefined
    ? `${prefix}${value.min ?? min} - ${prefix}${value.max ?? max}${suffix}`
    : label;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{label}</h4>
            <p className="text-sm text-muted-foreground">
              Set the range for filtering
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum</Label>
                <Input
                  id="min"
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  placeholder={min.toString()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum</Label>
                <Input
                  id="max"
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  placeholder={max.toString()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1">
                Apply
              </Button>
              <Button onClick={handleClear} variant="outline" className="flex-1">
                Clear
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
