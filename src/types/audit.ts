export interface CommunicationAuditLog {
  auditId: string;
  timestamp: Date;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  segmentIds: string[];
  messageContent: string;
  templateId?: string;
  templateVersion?: string;
  personalizationData: Record<string, any>;
  subject?: string;
  scheduledTime: Date;
  sentTime: Date;
  deliveredTime?: Date;
  openedTime?: Date;
  clickedTime?: Date;
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app' | 'rm_assisted';
  triggerType: 'manual' | 'automated' | 'event_based' | 'journey';
  journeyId?: string;
  journeyName?: string;
  campaignId?: string;
  campaignName?: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced' | 'opted_out';
  failureReason?: string;
  consentStatus: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
    marketing: boolean;
    transactional: boolean;
  };
  gdprCompliant: boolean;
  dataResidency: string;
  initiatedBy: string;
  approvedBy?: string;
  contentHash: string;
}

export interface ConsentRecord {
  customerId: string;
  channels: {
    email: {
      marketing: ConsentDetail;
      transactional: ConsentDetail;
    };
    sms: {
      marketing: ConsentDetail;
      transactional: ConsentDetail;
    };
    push: {
      marketing: ConsentDetail;
      transactional: ConsentDetail;
    };
    whatsapp: {
      marketing: ConsentDetail;
      transactional: ConsentDetail;
    };
  };
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    topics: string[];
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  history: ConsentHistoryEntry[];
}

export interface ConsentDetail {
  consented: boolean;
  timestamp: Date;
  source: 'app' | 'web' | 'email_link' | 'customer_service' | 'onboarding';
  ipAddress?: string;
  method: 'opt_in' | 'opt_out' | 'implicit' | 'explicit';
}

export interface ConsentHistoryEntry {
  timestamp: Date;
  action: 'opt_in' | 'opt_out' | 'preference_update';
  channel: string;
  source: string;
  previousState?: boolean;
  newState: boolean;
}
