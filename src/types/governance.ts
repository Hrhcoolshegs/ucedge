import { BusinessUnit, User } from './index';

export interface RiskSignal {
  id: string;
  customer_id: string;
  business_unit_id?: string;
  business_unit?: BusinessUnit;
  signal_type: 'CHURN' | 'CREDIT' | 'DEAL' | 'COMPLIANCE';
  score: number;
  band: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  created_at: string;
}

export interface Approval {
  id: string;
  request_type: 'BULK_EXPORT' | 'PII_EXPORT' | 'CAMPAIGN_LAUNCH' | 'JOURNEY_PUBLISH' | 'LOAN_DISBURSE' | 'DEAL_STAGE_ADVANCE';
  customer_id?: string;
  business_unit_id?: string;
  business_unit?: BusinessUnit;
  payload: Record<string, any>;
  requested_by_user_id: string;
  requested_by?: User;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decided_by_user_id?: string;
  decided_by?: User;
  decision_reason?: string;
  created_at: string;
  decided_at?: string;
}

export interface ComplianceSettings {
  id: string;
  compliance_mode_enabled: boolean;
  approval_rules: {
    pii_export_requires_justification?: boolean;
    bulk_export_threshold?: number;
    loan_disburse_min_amount?: number;
    deal_stage_advance_requires_approval?: string[];
    campaign_launch_requires_approval?: boolean;
    journey_publish_requires_approval?: boolean;
    admin_override_users?: string[];
  };
  updated_at: string;
  updated_by_user_id?: string;
  updated_by?: User;
}

export interface PendingApproval {
  id: string;
  type: 'journey_action' | 'campaign_launch' | 'data_export';
  customerName: string;
  customerId: string;
  journeyName?: string;
  journeyId?: string;
  campaignName?: string;
  proposedAction: string;
  channel: string;
  contentPreview: string;
  scheduledTime: Date;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface ContentApproval {
  id: string;
  submitter: string;
  submitterId: string;
  contentPreview: string;
  channel: string;
  journeyName?: string;
  campaignName?: string;
  submittedAt: Date;
  reviewer?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
  comments?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  actionType: 'login' | 'campaign_launch' | 'journey_update' | 'segment_modify' | 'data_export' | 'settings_change' | 'approval' | 'user_action';
  resource: string;
  details: string;
}
