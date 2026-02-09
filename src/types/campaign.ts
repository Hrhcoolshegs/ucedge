export interface Campaign {
  id: string;
  name: string;
  type: "Email" | "SMS" | "WhatsApp" | "Push";
  status: "active" | "scheduled" | "completed" | "paused";
  targetAudience: string;
  lifecycleTarget: "new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated" | "all" | null;
  business_unit_id?: string;
  product_context?: Record<string, any>;
  objective?: "ONBOARDING" | "RETENTION" | "CROSS_SELL" | "COLLECTIONS" | "DEAL_NURTURE" | "ENGAGEMENT" | "REACTIVATION";
  segmentSize: number;
  subject: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  launchDate: string;
  endDate: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  roi: number;
  isWinBackCampaign: boolean;
  reactivationCount: number;
  goal?: "onboarding" | "activation" | "cross-sell" | "re-engagement" | "retention" | "win-back" | "reactivation-nurture" | "upsell";
  priority?: "low" | "medium" | "high" | "urgent";
  budget?: number;
}

export interface CampaignFormData {
  name: string;
  type: Campaign['type'];
  goal: Campaign['goal'];
  priority: Campaign['priority'];
  budget?: number;
  business_unit_id?: string;
  product_context?: Record<string, any>;
  objective?: Campaign['objective'];
  targetingMethod: 'sentiment' | 'lifecycle' | 'custom' | 'business';
  selectedBuckets: string[];
  selectedLifecycleStages: Array<"new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated">;
  lifecycleFilters?: {
    daysSinceChurn?: string;
    churnCount?: string;
    reactivationProbability?: string;
    daysSinceReactivation?: string;
    reactivationSource?: string[];
  };
  businessFilters?: {
    loan_status?: string[];
    fund_types?: string[];
    risk_profile?: string[];
    deal_stages?: string[];
  };
  subject: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  launchDate: string;
  endDate?: string;
}
