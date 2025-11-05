export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `₦${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}k`;
  }
  return `₦${amount.toLocaleString()}`;
};

export const formatCurrencyFull = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatPercentage = (value: number, showSign: boolean = true): string => {
  const sign = value >= 0 ? '+' : '';
  return `${showSign ? sign : ''}${value.toFixed(1)}%`;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateDaysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getLifecycleStageColor = (stage: string): string => {
  const colors: Record<string, string> = {
    new: '#3B82F6', // Blue
    active: '#10B981', // Green
    loyal: '#FFE47D', // Gold
    'at-risk': '#F59E0B', // Orange
    churned: '#DC2626', // Red
    reactivated: '#8B5CF6' // Purple
  };
  return colors[stage] || '#6B7280';
};

export const getChurnRiskColor = (risk: string): string => {
  const colors: Record<string, string> = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#DC2626'
  };
  return colors[risk] || '#6B7280';
};
