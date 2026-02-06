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
