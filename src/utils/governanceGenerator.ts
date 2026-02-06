import { PendingApproval, ContentApproval, ActivityLog } from '@/types/governance';
import { CommunicationAuditLog } from '@/types/audit';
import { DEMO_USERS } from '@/types/user';
import { Customer } from '@/types';

const channels = ['email', 'sms', 'push', 'whatsapp', 'in_app'] as const;
const triggerTypes = ['manual', 'automated', 'event_based', 'journey'] as const;
const deliveryStatuses = ['sent', 'delivered', 'failed', 'bounced', 'opted_out'] as const;

const journeyNames = [
  'New Customer Onboarding',
  'Win-Back Inactive Customers',
  'Product Cross-Sell: Savings to Investment',
  'Churn Prevention - Critical Risk',
  'High Value Customer Nurture',
];

const journeyIds = [
  'journey_onboarding_v2',
  'journey_winback_v1',
  'journey_product_crosssell',
  'journey_churn_prevention',
  'journey_high_value_nurture',
];

const campaignNames = [
  'Q1 Savings Drive',
  'Investment Portfolio Launch',
  'Year-End Customer Rewards',
  'Loyalty Tier Upgrade',
  'Digital Banking Adoption',
];

const messageTemplates = [
  'Welcome to United Capital! Complete your profile to unlock premium features.',
  'We miss you! Come back and enjoy a special N500 bonus on your next transaction.',
  'Your savings have grown! Consider our new investment plan with 12% returns.',
  'Exclusive offer: Upgrade to Premium and get 3 months free.',
  'Your account activity summary for this month is ready.',
  'Important: Your KYC documents need updating. Please log in to update.',
  'Congratulations! You qualify for our High Value Customer benefits.',
  'Special weekend rates on all transfers. Valid 48 hours only.',
  'New feature alert: Track your investments in real-time with our updated app.',
  'Action required: Confirm your email preferences to continue receiving updates.',
];

function randomDate(daysBack: number): Date {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) - hash) + content.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function generateAuditLogs(customers: Customer[], count: number): CommunicationAuditLog[] {
  const logs: CommunicationAuditLog[] = [];
  const subset = customers.slice(0, Math.min(500, customers.length));

  for (let i = 0; i < count; i++) {
    const c = pick(subset);
    const ch = pick(channels);
    const jIdx = Math.floor(Math.random() * journeyNames.length);
    const sentTime = randomDate(30);
    const deliveredTime = new Date(sentTime.getTime() + Math.random() * 300000);
    const msg = pick(messageTemplates);
    const status = pick(deliveryStatuses);

    logs.push({
      auditId: `audit_gen_${i}_${Date.now()}`,
      timestamp: sentTime,
      customerId: c.id,
      customerName: c.name,
      customerEmail: c.email,
      customerPhone: c.phone,
      segmentIds: [`seg_${Math.floor(Math.random() * 10)}`],
      messageContent: msg,
      templateId: `tpl_${ch}_${Math.floor(Math.random() * 20)}`,
      templateVersion: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
      personalizationData: { name: c.name, balance: c.accountBalance },
      subject: ch === 'email' ? msg.substring(0, 40) + '...' : undefined,
      scheduledTime: new Date(sentTime.getTime() - 3600000),
      sentTime,
      deliveredTime: status !== 'failed' && status !== 'bounced' ? deliveredTime : undefined,
      openedTime: status === 'delivered' && Math.random() > 0.4 ? new Date(deliveredTime.getTime() + Math.random() * 7200000) : undefined,
      clickedTime: status === 'delivered' && Math.random() > 0.7 ? new Date(deliveredTime.getTime() + Math.random() * 14400000) : undefined,
      channel: ch,
      triggerType: pick(triggerTypes),
      journeyId: Math.random() > 0.3 ? journeyIds[jIdx] : undefined,
      journeyName: Math.random() > 0.3 ? journeyNames[jIdx] : undefined,
      campaignId: Math.random() > 0.5 ? `camp_${Math.floor(Math.random() * 10)}` : undefined,
      campaignName: Math.random() > 0.5 ? pick(campaignNames) : undefined,
      deliveryStatus: status,
      failureReason: status === 'failed' ? 'Network timeout' : status === 'bounced' ? 'Invalid address' : undefined,
      consentStatus: {
        email: true, sms: Math.random() > 0.2, push: Math.random() > 0.5,
        whatsapp: Math.random() > 0.6, marketing: true, transactional: true,
      },
      gdprCompliant: true,
      dataResidency: 'NG-Lagos',
      initiatedBy: pick(DEMO_USERS).name,
      approvedBy: Math.random() > 0.5 ? DEMO_USERS[0].name : undefined,
      contentHash: generateHash(msg),
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generatePendingApprovals(customers: Customer[]): PendingApproval[] {
  const subset = customers.slice(0, 50);
  const approvals: PendingApproval[] = [];

  const templates: Array<{ type: PendingApproval['type']; action: string; content: string }> = [
    { type: 'journey_action', action: 'Send Win-Back SMS', content: 'Come back for a N500 bonus!' },
    { type: 'journey_action', action: 'Send Premium Upgrade Email', content: 'Upgrade to our premium tier today' },
    { type: 'campaign_launch', action: 'Launch Q1 Savings Drive', content: 'Earn up to 15% on your savings this quarter' },
    { type: 'journey_action', action: 'Trigger Retention Webhook', content: 'Escalate to relationship manager' },
    { type: 'data_export', action: 'Export Customer PII Data', content: '2,000 customer records with contact info' },
    { type: 'journey_action', action: 'Send Investment Offer', content: 'New fixed deposit rates available' },
    { type: 'campaign_launch', action: 'Launch Loyalty Campaign', content: 'Reward tier upgrades for active users' },
    { type: 'journey_action', action: 'Send Churn Alert SMS', content: 'We noticed you havent logged in recently' },
    { type: 'data_export', action: 'Export Analytics Report', content: 'Monthly performance report with PII' },
    { type: 'journey_action', action: 'Send Welcome Push', content: 'Welcome aboard! Complete your profile' },
  ];

  templates.forEach((tpl, i) => {
    const c = subset[i % subset.length];
    const jIdx = i % journeyNames.length;
    approvals.push({
      id: `approval_${i}_${Date.now()}`,
      type: tpl.type,
      customerName: c.name,
      customerId: c.id,
      journeyName: tpl.type === 'journey_action' ? journeyNames[jIdx] : undefined,
      journeyId: tpl.type === 'journey_action' ? journeyIds[jIdx] : undefined,
      campaignName: tpl.type === 'campaign_launch' ? pick(campaignNames) : undefined,
      proposedAction: tpl.action,
      channel: pick(['email', 'sms', 'push']),
      contentPreview: tpl.content,
      scheduledTime: new Date(Date.now() + Math.random() * 86400000),
      requestedBy: pick([DEMO_USERS[1].name, DEMO_USERS[2].name]),
      requestedAt: randomDate(3),
      status: 'pending',
    });
  });

  return approvals;
}

export function generateContentApprovals(): ContentApproval[] {
  const statuses: ContentApproval['status'][] = ['pending', 'approved', 'approved', 'rejected', 'approved', 'pending', 'approved', 'approved', 'rejected', 'approved', 'pending', 'approved', 'approved', 'approved', 'approved', 'rejected', 'pending', 'approved'];

  const items: ContentApproval[] = [];
  const contents = [
    { content: 'Welcome email template v3 with updated branding', channel: 'email', journey: 'New Customer Onboarding' },
    { content: 'Win-back SMS with N500 bonus offer', channel: 'sms', journey: 'Win-Back Inactive Customers' },
    { content: 'Investment recommendation push notification', channel: 'push', journey: 'Product Cross-Sell' },
    { content: 'Churn prevention alert with discount code', channel: 'sms', journey: 'Churn Prevention' },
    { content: 'Premium tier congratulations email', channel: 'email', journey: 'High Value Nurture' },
    { content: 'KYC reminder WhatsApp message', channel: 'whatsapp', campaign: 'Digital Banking Adoption' },
    { content: 'Year-end rewards announcement', channel: 'email', campaign: 'Year-End Rewards' },
    { content: 'Feature update in-app notification', channel: 'in_app', campaign: 'Digital Banking Adoption' },
    { content: 'Loan pre-approval SMS notification', channel: 'sms', campaign: 'Q1 Savings Drive' },
    { content: 'Account activity summary email', channel: 'email', journey: 'New Customer Onboarding' },
    { content: 'Transfer fee waiver promotion', channel: 'push', campaign: 'Loyalty Tier Upgrade' },
    { content: 'Monthly savings tips newsletter', channel: 'email', campaign: 'Investment Portfolio Launch' },
    { content: 'App rating request push', channel: 'push' },
    { content: 'Birthday reward SMS', channel: 'sms', campaign: 'Year-End Rewards' },
    { content: 'Security alert email template', channel: 'email' },
    { content: 'Referral program WhatsApp invite', channel: 'whatsapp', campaign: 'Digital Banking Adoption' },
    { content: 'Portfolio performance update', channel: 'email', journey: 'High Value Nurture' },
    { content: 'Feedback survey in-app message', channel: 'in_app' },
  ];

  contents.forEach((c, i) => {
    const submitter = pick([DEMO_USERS[1], DEMO_USERS[2]]);
    const status = statuses[i % statuses.length];
    const submitted = randomDate(14);
    items.push({
      id: `content_${i}_${Date.now()}`,
      submitter: submitter.name,
      submitterId: submitter.id,
      contentPreview: c.content,
      channel: c.channel,
      journeyName: 'journey' in c ? c.journey : undefined,
      campaignName: 'campaign' in c ? c.campaign : undefined,
      submittedAt: submitted,
      reviewer: status !== 'pending' ? DEMO_USERS[0].name : undefined,
      status,
      reviewedAt: status !== 'pending' ? new Date(submitted.getTime() + Math.random() * 86400000) : undefined,
      comments: status === 'rejected' ? 'Content does not meet brand guidelines. Please revise tone and call-to-action.' : undefined,
    });
  });

  return items.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}

export function generateActivityLogs(): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const actions: Array<{ type: ActivityLog['actionType']; resource: string; details: string; userIdx: number }> = [
    { type: 'login', resource: 'Platform', details: 'Logged in from Lagos, Nigeria', userIdx: 0 },
    { type: 'campaign_launch', resource: 'Q1 Savings Drive', details: 'Launched campaign targeting 850 customers', userIdx: 1 },
    { type: 'journey_update', resource: 'Churn Prevention', details: 'Updated wait duration from 24h to 6h', userIdx: 0 },
    { type: 'data_export', resource: 'Customer Analytics', details: 'Exported 1,200 records to CSV', userIdx: 2 },
    { type: 'segment_modify', resource: 'High Value Segment', details: 'Updated balance threshold to N500k', userIdx: 1 },
    { type: 'approval', resource: 'Win-Back SMS Content', details: 'Approved content for production', userIdx: 0 },
    { type: 'settings_change', resource: 'Email Templates', details: 'Updated welcome email template v3', userIdx: 0 },
    { type: 'login', resource: 'Platform', details: 'Logged in from Abuja, Nigeria', userIdx: 1 },
    { type: 'campaign_launch', resource: 'Investment Portfolio Launch', details: 'Launched to Premium segment', userIdx: 1 },
    { type: 'journey_update', resource: 'New Customer Onboarding', details: 'Added push notification step', userIdx: 0 },
    { type: 'data_export', resource: 'Audit Trail', details: 'Exported 30-day audit logs', userIdx: 0 },
    { type: 'segment_modify', resource: 'At-Risk Customers', details: 'Added inactivity > 14 days filter', userIdx: 1 },
    { type: 'approval', resource: 'Churn Prevention SMS', details: 'Rejected - needs revised CTA', userIdx: 0 },
    { type: 'login', resource: 'Platform', details: 'Logged in from Port Harcourt, Nigeria', userIdx: 2 },
    { type: 'user_action', resource: 'Customer 360', details: 'Viewed detailed profile for customer #1042', userIdx: 2 },
    { type: 'campaign_launch', resource: 'Year-End Rewards', details: 'Launched loyalty reward distribution', userIdx: 1 },
    { type: 'settings_change', resource: 'Notification Preferences', details: 'Enabled WhatsApp channel for campaigns', userIdx: 0 },
    { type: 'journey_update', resource: 'Product Cross-Sell', details: 'Modified A/B test split to 60/40', userIdx: 1 },
    { type: 'data_export', resource: 'Sentiment Analysis', details: 'Exported sentiment grid data', userIdx: 2 },
    { type: 'approval', resource: 'Premium Email Template', details: 'Approved with minor edits', userIdx: 0 },
  ];

  for (let round = 0; round < 3; round++) {
    actions.forEach((a, i) => {
      const u = DEMO_USERS[a.userIdx];
      logs.push({
        id: `activity_${round}_${i}_${Date.now()}`,
        timestamp: randomDate(14 - round * 4),
        userId: u.id,
        userName: u.name,
        userRole: u.role,
        actionType: a.type,
        resource: a.resource,
        details: a.details,
      });
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
