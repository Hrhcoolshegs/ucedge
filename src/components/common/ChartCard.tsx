import { ReactNode } from 'react';
import { ExplainButton } from './ExplainButton';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  explanation?: string;
}

export const ChartCard = ({ title, subtitle, children, explanation }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border-t-[3px] border-primary p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-accent">{title}</h3>
          {explanation && <ExplainButton explanation={explanation} />}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
