export interface Campaign {
  id: string;
  name: string;
  type: "Email" | "SMS" | "WhatsApp" | "Push";
  status: "active" | "scheduled" | "completed" | "paused";
  targetAudience: string;
  lifecycleTarget: "new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated" | "all" | null;
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
  targetingMethod: 'sentiment' | 'lifecycle' | 'custom';
  selectedBuckets: string[];
  selectedLifecycleStages: Array<"new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated">;
  lifecycleFilters?: {
    daysSinceChurn?: string;
    churnCount?: string;
    reactivationProbability?: string;
    daysSinceReactivation?: string;
    reactivationSource?: string[];
  };
  subject: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  launchDate: string;
  endDate?: string;
}
