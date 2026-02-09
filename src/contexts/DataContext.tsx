import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Customer, Transaction, LifecycleEvent } from '@/types';
import { CustomerEvent } from '@/types/events';
import { Journey, JourneyExecution } from '@/types/journeys';
import { CommunicationAuditLog, ConsentRecord } from '@/types/audit';
import { PendingApproval, ContentApproval, ActivityLog } from '@/types/governance';
import { generateCustomers, generateTransactions } from '@/utils/dataGenerator';
import { generateEvents } from '@/utils/eventGenerator';
import { generateDefaultJourneys, generateJourneyExecutions } from '@/utils/journeyGenerator';
import { generateAuditLogs, generatePendingApprovals, generateContentApprovals, generateActivityLogs } from '@/utils/governanceGenerator';

interface DataContextType {
  customers: Customer[];
  transactions: Transaction[];
  lifecycleEvents: LifecycleEvent[];
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerTransactions: (customerId: string) => Transaction[];
  getCustomerLifecycleHistory: (customerId: string) => LifecycleEvent[];
  getChurnedCustomers: () => Customer[];
  getReactivatedCustomers: () => Customer[];
  getCustomersAtRisk: () => Customer[];
  searchCustomers: (query: string) => Customer[];
  calculateChurnRate: (period: string) => number;
  calculateReactivationRate: (period: string) => number;
  loading: boolean;
  error: Error | null;
  DISPLAY_MULTIPLIER: number;

  events: CustomerEvent[];
  getCustomerEvents: (customerId: string) => CustomerEvent[];
  trackEvent: (event: Omit<CustomerEvent, 'eventId' | 'timestamp'>) => void;

  journeys: Journey[];
  journeyExecutions: JourneyExecution[];
  getActiveJourneys: () => Journey[];
  getJourneyById: (journeyId: string) => Journey | undefined;
  getCustomerJourneys: (customerId: string) => JourneyExecution[];
  addJourney: (journey: Journey) => void;
  updateJourney: (journey: Journey) => void;

  auditLogs: CommunicationAuditLog[];
  getCustomerAuditLogs: (customerId: string) => CommunicationAuditLog[];
  logCommunication: (log: Omit<CommunicationAuditLog, 'auditId' | 'timestamp' | 'contentHash'>) => void;

  consentRecords: Map<string, ConsentRecord>;
  getCustomerConsent: (customerId: string) => ConsentRecord | undefined;
  updateConsent: (customerId: string, updates: Partial<ConsentRecord>) => void;

  pendingApprovals: PendingApproval[];
  approveAction: (approvalId: string, reviewerName: string) => void;
  rejectAction: (approvalId: string, reviewerName: string, reason: string) => void;

  contentApprovals: ContentApproval[];
  activityLogs: ActivityLog[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function createDefaultConsent(customerId: string): ConsentRecord {
  const now = new Date();
  const rand = Math.random();
  return {
    customerId,
    channels: {
      email: {
        marketing: { consented: true, timestamp: now, source: 'onboarding', method: 'opt_in' },
        transactional: { consented: true, timestamp: now, source: 'onboarding', method: 'implicit' }
      },
      sms: {
        marketing: { consented: rand > 0.2, timestamp: now, source: 'onboarding', method: rand > 0.2 ? 'opt_in' : 'opt_out' },
        transactional: { consented: true, timestamp: now, source: 'onboarding', method: 'implicit' }
      },
      push: {
        marketing: { consented: rand > 0.5, timestamp: now, source: 'app', method: rand > 0.5 ? 'opt_in' : 'opt_out' },
        transactional: { consented: rand > 0.3, timestamp: now, source: 'app', method: rand > 0.3 ? 'opt_in' : 'opt_out' }
      },
      whatsapp: {
        marketing: { consented: rand > 0.6, timestamp: now, source: 'app', method: rand > 0.6 ? 'explicit' : 'opt_out' },
        transactional: { consented: rand > 0.4, timestamp: now, source: 'app', method: rand > 0.4 ? 'explicit' : 'opt_out' }
      }
    },
    preferences: {
      frequency: (['daily', 'weekly', 'monthly'] as const)[Math.floor(Math.random() * 3)],
      topics: ['savings_tips', 'investment_updates'].concat(rand > 0.5 ? ['loan_offers'] : []),
      quietHours: { enabled: rand > 0.3, start: '22:00', end: '08:00' }
    },
    history: [
      { timestamp: new Date(now.getTime() - 30 * 86400000), action: 'opt_in', channel: 'email', source: 'onboarding', newState: true },
      ...(rand > 0.5 ? [{ timestamp: new Date(now.getTime() - 15 * 86400000), action: 'opt_in' as const, channel: 'sms', source: 'web', previousState: false, newState: true }] : []),
      ...(rand > 0.7 ? [{ timestamp: new Date(now.getTime() - 7 * 86400000), action: 'preference_update' as const, channel: 'push', source: 'app', previousState: false, newState: true }] : []),
    ]
  };
}

function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) - hash) + content.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [events, setEvents] = useState<CustomerEvent[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [journeyExecutions, setJourneyExecutions] = useState<JourneyExecution[]>([]);
  const [auditLogs, setAuditLogs] = useState<CommunicationAuditLog[]>([]);
  const [consentRecords, setConsentRecords] = useState<Map<string, ConsentRecord>>(new Map());
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [contentApprovals, setContentApprovals] = useState<ContentApproval[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [eventsInitialized, setEventsInitialized] = useState(false);

  useEffect(() => {
    try {
      const generatedCustomers = generateCustomers(2000);
      const generatedTransactions = generateTransactions(generatedCustomers, 10000);
      setCustomers(generatedCustomers);
      setTransactions(generatedTransactions);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (customers.length > 0 && !eventsInitialized) {
      const realCustomers = customers.slice(0, 500);
      setEvents(generateEvents(realCustomers, 30));
      const generatedJourneys = generateDefaultJourneys();
      setJourneys(generatedJourneys);
      setJourneyExecutions(generateJourneyExecutions(realCustomers, generatedJourneys));
      setAuditLogs(generateAuditLogs(customers, 300));
      setPendingApprovals(generatePendingApprovals(customers));
      setContentApprovals(generateContentApprovals());
      setActivityLogs(generateActivityLogs());

      const consents = new Map<string, ConsentRecord>();
      realCustomers.forEach(customer => {
        consents.set(customer.id, createDefaultConsent(customer.id));
      });
      setConsentRecords(consents);
      setEventsInitialized(true);
    }
  }, [customers, eventsInitialized]);

  const lifecycleEvents = useMemo(() => customers.flatMap(c => c.lifecycleHistory), [customers]);
  const getCustomerById = useCallback((id: string) => customers.find(c => c.id === id), [customers]);
  const getCustomerTransactions = useCallback((customerId: string) => transactions.filter(t => t.customerId === customerId), [transactions]);
  const getCustomerLifecycleHistory = useCallback((customerId: string) => customers.find(c => c.id === customerId)?.lifecycleHistory || [], [customers]);
  const getChurnedCustomers = useCallback(() => customers.filter(c => c.lifecycleStage === 'churned'), [customers]);
  const getReactivatedCustomers = useCallback(() => customers.filter(c => c.reactivationCount > 0), [customers]);
  const getCustomersAtRisk = useCallback(() => customers.filter(c => c.lifecycleStage === 'at-risk'), [customers]);

  const searchCustomers = useCallback((query: string) => {
    const q = query.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q) || c.id.toLowerCase().includes(q));
  }, [customers]);

  const calculateChurnRate = useCallback((_period: string) => {
    const churned = customers.filter(c => c.lifecycleStage === 'churned').length;
    return (churned / customers.length) * 100;
  }, [customers]);

  const calculateReactivationRate = useCallback((_period: string) => {
    const churned = customers.filter(c => c.churnCount > 0).length;
    const reactivated = customers.filter(c => c.reactivationCount > 0).length;
    return churned > 0 ? (reactivated / churned) * 100 : 0;
  }, [customers]);

  const getCustomerEvents = useCallback((customerId: string) => events.filter(e => e.customerId === customerId), [events]);
  const trackEvent = useCallback((eventData: Omit<CustomerEvent, 'eventId' | 'timestamp'>) => {
    setEvents(prev => [{ ...eventData, eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`, timestamp: new Date() }, ...prev]);
  }, []);

  const getActiveJourneys = useCallback(() => journeys.filter(j => j.status === 'active'), [journeys]);
  const getJourneyById = useCallback((journeyId: string) => journeys.find(j => j.id === journeyId), [journeys]);
  const getCustomerJourneys = useCallback((customerId: string) => journeyExecutions.filter(je => je.customerId === customerId), [journeyExecutions]);
  const addJourney = useCallback((journey: Journey) => setJourneys(prev => [...prev, journey]), []);
  const updateJourney = useCallback((journey: Journey) => setJourneys(prev => prev.map(j => j.id === journey.id ? journey : j)), []);

  const getCustomerAuditLogs = useCallback((customerId: string) => auditLogs.filter(log => log.customerId === customerId), [auditLogs]);
  const logCommunication = useCallback((logData: Omit<CommunicationAuditLog, 'auditId' | 'timestamp' | 'contentHash'>) => {
    setAuditLogs(prev => [{ ...logData, auditId: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`, timestamp: new Date(), contentHash: generateHash(logData.messageContent) }, ...prev]);
  }, []);

  const getCustomerConsent = useCallback((customerId: string) => consentRecords.get(customerId), [consentRecords]);
  const updateConsent = useCallback((customerId: string, updates: Partial<ConsentRecord>) => {
    setConsentRecords(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(customerId);
      if (existing) newMap.set(customerId, { ...existing, ...updates });
      return newMap;
    });
  }, []);

  const approveAction = useCallback((approvalId: string, reviewerName: string) => {
    setPendingApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'approved' as const, reviewedBy: reviewerName, reviewedAt: new Date() } : a));
  }, []);

  const rejectAction = useCallback((approvalId: string, reviewerName: string, reason: string) => {
    setPendingApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'rejected' as const, reviewedBy: reviewerName, reviewedAt: new Date(), rejectionReason: reason } : a));
  }, []);

  return (
    <DataContext.Provider value={{
      customers, transactions, lifecycleEvents,
      getCustomerById, getCustomerTransactions, getCustomerLifecycleHistory,
      getChurnedCustomers, getReactivatedCustomers, getCustomersAtRisk,
      searchCustomers, calculateChurnRate, calculateReactivationRate,
      loading, error, DISPLAY_MULTIPLIER: 425,
      events, getCustomerEvents, trackEvent,
      journeys, journeyExecutions, getActiveJourneys, getJourneyById, getCustomerJourneys, addJourney, updateJourney,
      auditLogs, getCustomerAuditLogs, logCommunication,
      consentRecords, getCustomerConsent, updateConsent,
      pendingApprovals, approveAction, rejectAction,
      contentApprovals, activityLogs,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
