export interface ChurnStage {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  severity: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChurnMetric {
  id: string;
  name: string;
  description: string;
  customer_field: string;
  operator: string;
  threshold_value: number;
  threshold_value_max: number | null;
  unit: string;
  weight: number;
  churn_stage_id: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChurnMetricWithStage extends ChurnMetric {
  churn_stage?: ChurnStage;
}

export const CUSTOMER_FIELD_OPTIONS = [
  { value: 'daysInactive', label: 'Days Inactive', unit: 'days' },
  { value: 'accountBalance', label: 'Account Balance', unit: 'NGN' },
  { value: 'sentimentScore', label: 'Sentiment Score', unit: 'score' },
  { value: 'transactionFrequency', label: 'Transaction Frequency', unit: 'count' },
  { value: 'campaignsEngaged', label: 'Campaigns Engaged', unit: 'count' },
  { value: 'supportTickets', label: 'Support Tickets', unit: 'count' },
  { value: 'satisfactionScore', label: 'Satisfaction Score', unit: 'score' },
  { value: 'lifetimeValue', label: 'Lifetime Value', unit: 'NGN' },
  { value: 'conversationCount', label: 'Conversation Count', unit: 'count' },
  { value: 'conversionRate', label: 'Conversion Rate', unit: 'percent' },
  { value: 'churnCount', label: 'Previous Churns', unit: 'count' },
] as const;

export const OPERATOR_OPTIONS = [
  { value: 'gt', label: 'Greater than', symbol: '>' },
  { value: 'gte', label: 'Greater than or equal', symbol: '>=' },
  { value: 'lt', label: 'Less than', symbol: '<' },
  { value: 'lte', label: 'Less than or equal', symbol: '<=' },
  { value: 'eq', label: 'Equal to', symbol: '=' },
  { value: 'between', label: 'Between', symbol: '<->' },
] as const;
