import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface BusinessUnitFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const BusinessUnitFilter = ({ value, onChange }: BusinessUnitFilterProps) => {
  const businessUnits = [
    { code: 'all', name: 'All Business Units' },
    { code: 'MICROFIN', name: 'Microfinance Bank' },
    { code: 'ASSETMGT', name: 'Asset Management' },
    { code: 'INVBANK', name: 'Investment Banking' },
    { code: 'WEALTH', name: 'Wealth Management' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Business Unit" />
        </SelectTrigger>
        <SelectContent>
          {businessUnits.map((unit) => (
            <SelectItem key={unit.code} value={unit.code}>
              {unit.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
