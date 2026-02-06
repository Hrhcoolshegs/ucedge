import { CustomerEvent, EventType } from '../types/events';
import { Customer } from '../types';

const eventTypes: EventType[] = [
  'app_opened', 'screen_viewed', 'transfer_completed',
  'bill_payment_completed', 'deposit_made', 'account_funded',
  'loan_application_started', 'investment_viewed',
  'airtime_purchase', 'withdrawal_made', 'email_opened',
  'push_notification_opened', 'feature_clicked', 'help_article_viewed'
];

const channels = ['mobile_app', 'web', 'ussd', 'branch'] as const;
const platforms = ['ios', 'android', 'web'] as const;

export function generateEventsForCustomer(
  customer: Customer,
  count: number = 50
): CustomerEvent[] {
  const events: CustomerEvent[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursOffset = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - daysAgo * 86400000 - hoursOffset * 3600000);

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];

    events.push({
      eventId: `evt_${customer.id}_${i}`,
      customerId: customer.id,
      eventType,
      timestamp,
      channel,
      sessionId: `session_${Math.random().toString(36).substring(2, 11)}`,
      properties: generateEventProperties(eventType),
      deviceInfo: channel === 'mobile_app' ? {
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.0`,
        deviceId: `device_${Math.random().toString(36).substring(2, 11)}`
      } : undefined
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generateEventProperties(eventType: EventType): Record<string, any> {
  switch (eventType) {
    case 'transfer_completed':
      return {
        amount: Math.floor(Math.random() * 50000) + 1000,
        recipient: `0${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        type: ['bank_transfer', 'wallet_transfer'][Math.floor(Math.random() * 2)]
      };
    case 'bill_payment_completed':
      return {
        amount: Math.floor(Math.random() * 10000) + 500,
        biller: ['EKEDC', 'DSTV', 'Airtel', 'MTN', 'IKEDC', 'StarTimes'][Math.floor(Math.random() * 6)]
      };
    case 'screen_viewed':
      return {
        screenName: ['Home', 'Transfer', 'Bills', 'Investments', 'Savings', 'Profile'][Math.floor(Math.random() * 6)],
        duration: Math.floor(Math.random() * 120) + 10
      };
    case 'deposit_made':
    case 'account_funded':
      return {
        amount: Math.floor(Math.random() * 200000) + 5000,
        method: ['card', 'bank_transfer', 'ussd'][Math.floor(Math.random() * 3)]
      };
    case 'withdrawal_made':
      return {
        amount: Math.floor(Math.random() * 30000) + 1000,
        method: ['atm', 'bank_transfer'][Math.floor(Math.random() * 2)]
      };
    case 'airtime_purchase':
      return {
        amount: [100, 200, 500, 1000, 2000, 5000][Math.floor(Math.random() * 6)],
        network: ['MTN', 'Airtel', 'Glo', '9mobile'][Math.floor(Math.random() * 4)]
      };
    case 'loan_application_started':
      return {
        loanType: ['personal', 'business', 'salary_advance'][Math.floor(Math.random() * 3)],
        requestedAmount: Math.floor(Math.random() * 500000) + 50000
      };
    case 'investment_viewed':
      return {
        productName: ['Fixed Deposit', 'Mutual Fund', 'Treasury Bills', 'Eurobond'][Math.floor(Math.random() * 4)],
        expectedReturn: `${(Math.random() * 15 + 5).toFixed(1)}%`
      };
    default:
      return {};
  }
}

export function generateEvents(customers: Customer[], eventsPerCustomer: number = 50): CustomerEvent[] {
  const allEvents: CustomerEvent[] = [];

  customers.forEach(customer => {
    const events = generateEventsForCustomer(customer, eventsPerCustomer);
    allEvents.push(...events);
  });

  return allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
