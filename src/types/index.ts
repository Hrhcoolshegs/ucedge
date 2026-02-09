export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  workspace_preferences: {
    default_landing?: string;
    pinned_widgets?: string[];
    default_filters?: Record<string, any>;
  };
  created_at: string;
  updated_at: string;
}

export interface BusinessUnit {
  id: string;
  code: 'MICROFIN' | 'ASSETMGT' | 'INVBANK' | 'WEALTH';
  name: string;
  description: string;
  created_at: string;
}

export interface CustomerBusinessProfile {
  id: string;
  customer_id: string;
  business_unit_id: string;
  business_unit?: BusinessUnit;
  profile_status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  kyc_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  relationship_owner_user_id?: string;
  relationship_owner?: User;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerTimelineEvent {
  id: string;
  customer_id: string;
  business_unit_id?: string;
  business_unit?: BusinessUnit;
  event_type: 'ENGAGEMENT' | 'TRANSACTION' | 'LOAN' | 'PORTFOLIO' | 'DEAL' | 'CONSENT' | 'NOTE' | 'SUPPORT' | 'KYC' | 'RISK_REVIEW' | 'LIFECYCLE';
  title: string;
  description?: string;
  metadata: Record<string, any>;
  occurred_at: string;
  created_by_user_id?: string;
  created_by?: User;
  created_at: string;
}

export interface LifecycleEvent {
  id: string;
  customerId: string;
  eventType: "joined" | "activated" | "became_loyal" | "went_at_risk" | "churned" | "reactivated" | "upgraded" | "downgraded";
  eventDate: string;
  previousStage: string | null;
  newStage: string;
  trigger: string;
  details: string;
  daysInPreviousStage: number | null;
  associatedCampaignId: string | null;
  associatedTransactionId: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateJoined: string;
  status: "active" | "inactive" | "at-risk";

  customer_number?: string;
  entity_type?: 'INDIVIDUAL' | 'CORPORATE' | 'GOVT';
  unique_identifiers?: Record<string, string>;
  risk_rating?: 'LOW' | 'MEDIUM' | 'HIGH';
  primary_relationship_owner_user_id?: string;
  primary_relationship_owner?: User;
  business_profiles?: CustomerBusinessProfile[];

  // Demographics & Biodata
  age: number;
  dateOfBirth: string;
  gender: "Male" | "Female";
  nationality: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  dependents: number;
  education: string;

  // Contact & Location
  location: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  alternatePhone?: string;
  emergencyContact: string;
  emergencyPhone: string;

  // Employment
  occupation: string;
  employer: string;
  employmentType: "Full-time" | "Part-time" | "Self-employed" | "Unemployed" | "Retired";
  yearsAtCurrentJob: number;
  incomeRange: string;
  monthlyIncome: number;
  
  // Financial Profile
  accountBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  productsOwned: string[];
  lastTransactionDate: string;
  transactionFrequency: number;
  
  // Sentiment & Behavior
  sentimentScore: number;
  sentimentBucket: string;
  engagementLevel: "high" | "medium" | "low";
  churnRisk: "low" | "medium" | "high";
  lifetimeValue: number;
  
  // Support History
  supportTickets: number;
  lastContactDate: string;
  satisfactionScore: number;
  conversationCount: number;
  
  // Campaign History
  campaignsReceived: number;
  campaignsEngaged: number;
  lastCampaignDate: string;
  conversionRate: number;
  
  // Lifecycle Tracking
  lifecycleStage: "new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated";
  lifecycleHistory: LifecycleEvent[];
  churnDate: string | null;
  reactivationDate: string | null;
  churnCount: number;
  reactivationCount: number;
  daysInactive: number;
  daysSinceChurn: number | null;
  reactivationSource: string | null;
  winbackCampaignId: string | null;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: "deposit" | "withdrawal" | "transfer" | "investment";
  amount: number;
  date: string;
  description: string;
  status: "completed" | "pending" | "failed";
  channel: "mobile" | "web" | "branch" | "atm";
  balanceAfter: number;
  isReactivationTransaction: boolean;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  type: 'lifecycle' | 'sentiment' | 'custom' | 'auto' | 'business';
  customerCount: number;
  business_unit_id?: string;
  business_unit?: BusinessUnit;
  criteria: {
    lifecycleStages?: Array<"new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated">;
    sentimentBuckets?: string[];
    customFilters?: Record<string, any>;
  };
  business_filters?: {
    loan_status?: string[];
    loan_risk_band?: string[];
    fund_types?: string[];
    aum_range?: { min?: number; max?: number };
    risk_profile?: string[];
    portfolio_aum_range?: { min?: number; max?: number };
    deal_stages?: string[];
    deal_probability_min?: number;
  };
  metrics: {
    totalLTV: number;
    avgLTV: number;
    churnRate: number;
    trend: 'up' | 'down' | 'stable';
  };
  lastUpdated: string;
  createdBy: string;
  isAutoGenerated: boolean;
}
