import { Customer, Transaction, LifecycleEvent } from '@/types';
import {
  NIGERIAN_FIRST_NAMES,
  NIGERIAN_LAST_NAMES,
  LAGOS_LOCATIONS,
  OCCUPATIONS,
  INCOME_RANGES,
  BANK_PRODUCTS,
  TRANSACTION_DESCRIPTIONS
} from './constants';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = <T,>(arr: T[]): T => arr[random(0, arr.length - 1)];
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateNigerianName = (gender: "Male" | "Female"): string => {
  const firstName = randomChoice(NIGERIAN_FIRST_NAMES[gender]);
  const lastName = randomChoice(NIGERIAN_LAST_NAMES);
  return `${firstName} ${lastName}`;
};

export const generatePhoneNumber = (): string => {
  const prefix = randomChoice(['801', '803', '805', '807', '809', '810', '811', '813', '814', '815']);
  const number = random(1000000, 9999999);
  return `+234-${prefix}-${number.toString().substring(0, 3)}-${number.toString().substring(3)}`;
};

const generateLifecycleHistory = (
  customerId: string,
  lifecycleStage: string,
  dateJoined: Date,
  isChurned: boolean,
  isReactivated: boolean
): LifecycleEvent[] => {
  const events: LifecycleEvent[] = [];
  let currentDate = new Date(dateJoined);
  let eventCount = 1;

  // Joined event
  events.push({
    id: `EVT-${customerId}-${eventCount++}`,
    customerId,
    eventType: 'joined',
    eventDate: currentDate.toISOString(),
    previousStage: null,
    newStage: 'new',
    trigger: 'Customer Registration',
    details: 'New customer account created',
    daysInPreviousStage: null,
    associatedCampaignId: null,
    associatedTransactionId: null
  });

  // Active event
  if (lifecycleStage !== 'new') {
    const daysToActive = random(1, 30);
    currentDate = new Date(currentDate.getTime() + daysToActive * 24 * 60 * 60 * 1000);
    events.push({
      id: `EVT-${customerId}-${eventCount++}`,
      customerId,
      eventType: 'activated',
      eventDate: currentDate.toISOString(),
      previousStage: 'new',
      newStage: 'active',
      trigger: 'First Transaction',
      details: 'Customer made first transaction',
      daysInPreviousStage: daysToActive,
      associatedCampaignId: null,
      associatedTransactionId: `TXN-${random(1, 9999)}`
    });
  }

  // Loyal event
  if (lifecycleStage === 'loyal') {
    const daysToLoyal = random(365, 500);
    currentDate = new Date(currentDate.getTime() + daysToLoyal * 24 * 60 * 60 * 1000);
    events.push({
      id: `EVT-${customerId}-${eventCount++}`,
      customerId,
      eventType: 'became_loyal',
      eventDate: currentDate.toISOString(),
      previousStage: 'active',
      newStage: 'loyal',
      trigger: '12+ months active',
      details: 'Customer achieved loyal status',
      daysInPreviousStage: daysToLoyal,
      associatedCampaignId: null,
      associatedTransactionId: null
    });
  }

  // At-risk event
  if (lifecycleStage === 'at-risk' || isChurned) {
    const daysToRisk = random(30, 60);
    currentDate = new Date(currentDate.getTime() + daysToRisk * 24 * 60 * 60 * 1000);
    events.push({
      id: `EVT-${customerId}-${eventCount++}`,
      customerId,
      eventType: 'went_at_risk',
      eventDate: currentDate.toISOString(),
      previousStage: 'active',
      newStage: 'at-risk',
      trigger: 'Reduced Activity',
      details: 'No transactions for 30+ days',
      daysInPreviousStage: daysToRisk,
      associatedCampaignId: null,
      associatedTransactionId: null
    });
  }

  // Churned event
  if (isChurned) {
    const daysToChurn = random(60, 90);
    currentDate = new Date(currentDate.getTime() + daysToChurn * 24 * 60 * 60 * 1000);
    events.push({
      id: `EVT-${customerId}-${eventCount++}`,
      customerId,
      eventType: 'churned',
      eventDate: currentDate.toISOString(),
      previousStage: 'at-risk',
      newStage: 'churned',
      trigger: 'No Activity for 90 days',
      details: 'Customer churned due to inactivity',
      daysInPreviousStage: daysToChurn,
      associatedCampaignId: null,
      associatedTransactionId: null
    });
  }

  // Reactivated event
  if (isReactivated) {
    const daysToReactivate = random(90, 365);
    currentDate = new Date(currentDate.getTime() + daysToReactivate * 24 * 60 * 60 * 1000);
    const reactivationSource = randomChoice(['Campaign', 'Self-Service', 'Support Call', 'Branch Visit']);
    events.push({
      id: `EVT-${customerId}-${eventCount++}`,
      customerId,
      eventType: 'reactivated',
      eventDate: currentDate.toISOString(),
      previousStage: 'churned',
      newStage: 'reactivated',
      trigger: reactivationSource,
      details: `Customer reactivated via ${reactivationSource}`,
      daysInPreviousStage: daysToReactivate,
      associatedCampaignId: reactivationSource === 'Campaign' ? `CMP-${random(1, 50)}` : null,
      associatedTransactionId: `TXN-${random(1, 9999)}`
    });

    // Back to active
    events.push({
      id: `EVT-${customerId}-${eventCount++}`,
      customerId,
      eventType: 'activated',
      eventDate: currentDate.toISOString(),
      previousStage: 'reactivated',
      newStage: 'active',
      trigger: 'Resumed Transactions',
      details: 'Customer resumed regular activity',
      daysInPreviousStage: 0,
      associatedCampaignId: null,
      associatedTransactionId: null
    });
  }

  return events;
};

export const generateCustomers = (count: number = 850000): Customer[] => {
  const customers: Customer[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-11-03');

  // Distribution targets
  const newCount = Math.floor(count * 0.15);
  const activeCount = Math.floor(count * 0.45);
  const loyalCount = Math.floor(count * 0.25);
  const atRiskCount = Math.floor(count * 0.10);
  const churnedCount = count - newCount - activeCount - loyalCount - atRiskCount;

  let stageIndex = 0;
  const stages = [
    ...Array(newCount).fill('new'),
    ...Array(activeCount).fill('active'),
    ...Array(loyalCount).fill('loyal'),
    ...Array(atRiskCount).fill('at-risk'),
    ...Array(churnedCount).fill('churned')
  ];

  for (let i = 0; i < count; i++) {
    const gender = randomChoice(['Male', 'Female'] as const);
    const name = generateNigerianName(gender);
    const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
    const dateJoined = randomDate(startDate, endDate);
    const lifecycleStage = stages[stageIndex++] as Customer['lifecycleStage'];
    
    const isChurned = lifecycleStage === 'churned';
    const isReactivated = isChurned && Math.random() < 0.03; // 3% of churned are reactivated
    
    const status: Customer['status'] = 
      lifecycleStage === 'churned' ? 'inactive' :
      lifecycleStage === 'at-risk' ? 'at-risk' :
      'active';

    const engagementLevel: Customer['engagementLevel'] = 
      lifecycleStage === 'loyal' ? 'high' :
      lifecycleStage === 'at-risk' || lifecycleStage === 'churned' ? 'low' :
      randomChoice(['high', 'medium', 'low']);

    const churnRisk: Customer['churnRisk'] = 
      lifecycleStage === 'at-risk' ? 'high' :
      lifecycleStage === 'churned' ? 'high' :
      lifecycleStage === 'new' ? 'medium' :
      'low';

    const accountBalance = random(50000, 25000000);
    const productsOwned = ['Savings Account'];
    if (Math.random() > 0.6) productsOwned.push('Investment Plan');
    if (Math.random() > 0.75) productsOwned.push('Fixed Deposit');
    if (Math.random() > 0.85) productsOwned.push('Loan');

    const lifecycleHistory = generateLifecycleHistory(
      `CUST-${String(i + 1).padStart(3, '0')}`,
      lifecycleStage,
      dateJoined,
      isChurned,
      isReactivated
    );

    const churnEvent = lifecycleHistory.find(e => e.eventType === 'churned');
    const reactivationEvent = lifecycleHistory.find(e => e.eventType === 'reactivated');
    const lastEventDate = new Date(lifecycleHistory[lifecycleHistory.length - 1].eventDate);
    const daysInactive = isChurned || status === 'inactive' 
      ? Math.floor((Date.now() - lastEventDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    customers.push({
      id: `CUST-${String(i + 1).padStart(3, '0')}`,
      name,
      email,
      phone: generatePhoneNumber(),
      dateJoined: dateJoined.toISOString(),
      status,
      age: random(22, 65),
      gender,
      location: randomChoice(LAGOS_LOCATIONS),
      occupation: randomChoice(OCCUPATIONS),
      incomeRange: randomChoice(INCOME_RANGES),
      accountBalance,
      totalDeposits: random(500000, 50000000),
      totalWithdrawals: random(250000, 40000000),
      productsOwned,
      lastTransactionDate: randomDate(new Date(dateJoined), endDate).toISOString(),
      transactionFrequency: status === 'active' ? random(5, 30) : random(0, 5),
      sentimentScore: random(1, 10),
      sentimentBucket: randomChoice(['High Engagement + Good Fit', 'Medium Engagement', 'Low Engagement']),
      engagementLevel,
      churnRisk,
      lifetimeValue: random(500000, 25000000),
      supportTickets: random(0, 20),
      lastContactDate: randomDate(dateJoined, endDate).toISOString(),
      satisfactionScore: random(1, 5),
      conversationCount: random(0, 15),
      campaignsReceived: random(5, 50),
      campaignsEngaged: random(0, 25),
      lastCampaignDate: randomDate(dateJoined, endDate).toISOString(),
      conversionRate: Math.random(),
      lifecycleStage: isReactivated ? 'active' : lifecycleStage,
      lifecycleHistory,
      churnDate: churnEvent ? churnEvent.eventDate : null,
      reactivationDate: reactivationEvent ? reactivationEvent.eventDate : null,
      churnCount: isChurned ? 1 : 0,
      reactivationCount: isReactivated ? 1 : 0,
      daysInactive,
      daysSinceChurn: churnEvent 
        ? Math.floor((Date.now() - new Date(churnEvent.eventDate).getTime()) / (1000 * 60 * 60 * 24))
        : null,
      reactivationSource: reactivationEvent 
        ? reactivationEvent.trigger 
        : null,
      winbackCampaignId: reactivationEvent?.associatedCampaignId || null
    });
  }

  return customers;
};

export const generateTransactions = (customers: Customer[], count: number = 5000000): Transaction[] => {
  const transactions: Transaction[] = [];
  const startDate = new Date('2023-11-01');
  const endDate = new Date('2024-11-03');

  for (let i = 0; i < count; i++) {
    const customer = randomChoice(customers);
    const type = randomChoice(['deposit', 'withdrawal', 'transfer', 'investment'] as const);
    const amount = type === 'investment' 
      ? random(500000, 5000000)
      : random(5000, 2500000);
    const date = randomDate(startDate, endDate);
    const status = Math.random() > 0.05 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed');
    const channel = randomChoice(['mobile', 'web', 'branch', 'atm'] as const);
    
    const isReactivationTransaction = 
      customer.reactivationDate && 
      Math.abs(new Date(customer.reactivationDate).getTime() - date.getTime()) < 24 * 60 * 60 * 1000;

    transactions.push({
      id: `TXN-${String(i + 1).padStart(4, '0')}`,
      customerId: customer.id,
      type,
      amount,
      date: date.toISOString(),
      description: randomChoice(TRANSACTION_DESCRIPTIONS[type]),
      status,
      channel,
      balanceAfter: customer.accountBalance + (type === 'deposit' ? amount : -amount),
      isReactivationTransaction: isReactivationTransaction || false
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
