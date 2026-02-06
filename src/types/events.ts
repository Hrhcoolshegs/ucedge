export interface CustomerEvent {
  eventId: string;
  customerId: string;
  eventType: EventType;
  timestamp: Date;
  properties: Record<string, any>;
  channel: 'mobile_app' | 'web' | 'ussd' | 'branch' | 'atm';
  sessionId: string;
  deviceInfo?: {
    platform: 'ios' | 'android' | 'web';
    version: string;
    deviceId: string;
  };
}

export type EventType =
  | 'account_created' | 'account_funded' | 'pin_setup_completed'
  | 'bvn_linked' | 'kyc_completed'
  | 'transfer_initiated' | 'transfer_completed' | 'transfer_failed'
  | 'bill_payment_completed' | 'airtime_purchase'
  | 'deposit_made' | 'withdrawal_made'
  | 'app_opened' | 'app_closed' | 'screen_viewed'
  | 'feature_clicked' | 'tutorial_completed'
  | 'push_notification_opened' | 'email_opened' | 'email_clicked'
  | 'sms_clicked'
  | 'loan_application_started' | 'loan_application_submitted'
  | 'loan_application_abandoned' | 'investment_viewed'
  | 'savings_product_opened'
  | 'support_chat_started' | 'help_article_viewed'
  | 'feedback_submitted';

export interface EventAnalytics {
  totalEvents: number;
  eventsByType: Record<EventType, number>;
  eventsByChannel: Record<string, number>;
  recentEvents: CustomerEvent[];
  topEvents: { eventType: EventType; count: number }[];
}
