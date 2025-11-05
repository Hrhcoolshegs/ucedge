import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border-t-[3px] border-primary p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-accent">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
