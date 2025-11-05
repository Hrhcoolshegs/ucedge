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
  
  // Demographics
  age: number;
  gender: "Male" | "Female";
  location: string;
  occupation: string;
  incomeRange: string;
  
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
