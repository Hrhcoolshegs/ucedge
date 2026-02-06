import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Customer, Transaction, LifecycleEvent } from '@/types';
import { CustomerEvent } from '@/types/events';
import { Journey, JourneyExecution } from '@/types/journeys';
import { CommunicationAuditLog, ConsentRecord } from '@/types/audit';
import { generateCustomers, generateTransactions } from '@/utils/dataGenerator';
import { generateEvents } from '@/utils/eventGenerator';
import { generateDefaultJourneys } from '@/utils/journeyGenerator';

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

  auditLogs: CommunicationAuditLog[];
  getCustomerAuditLogs: (customerId: string) => CommunicationAuditLog[];
  logCommunication: (log: Omit<CommunicationAuditLog, 'auditId' | 'timestamp' | 'contentHash'>) => void;

  consentRecords: Map<string, ConsentRecord>;
  getCustomerConsent: (customerId: string) => ConsentRecord | undefined;
  updateConsent: (customerId: string, updates: Partial<ConsentRecord>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function createDefaultConsent(customerId: string): ConsentRecord {
  const now = new Date();
  return {
    customerId,
    channels: {
      email: {
        marketing: { consented: true, timestamp: now, source: 'onboarding', method: 'opt_in' },
        transactional: { consented: true, timestamp: now, source: 'onboarding', method: 'implicit' }
      },
      sms: {
        marketing: { consented: true, timestamp: now, source: 'onboarding', method: 'opt_in' },
        transactional: { consented: true, timestamp: now, source: 'onboarding', method: 'implicit' }
      },
      push: {
        marketing: { consented: false, timestamp: now, source: 'app', method: 'opt_out' },
        transactional: { consented: false, timestamp: now, source: 'app', method: 'opt_out' }
      },
      whatsapp: {
        marketing: { consented: false, timestamp: now, source: 'app', method: 'opt_out' },
        transactional: { consented: false, timestamp: now, source: 'app', method: 'opt_out' }
      }
    },
    preferences: {
      frequency: 'weekly',
      topics: ['savings_tips', 'investment_updates'],
      quietHours: { enabled: true, start: '22:00', end: '08:00' }
    },
    history: []
  };
}

function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
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
      const generatedEvents = generateEvents(realCustomers, 30);
      setEvents(generatedEvents);

      const defaultJourneys = generateDefaultJourneys();
      setJourneys(defaultJourneys);

      const consents = new Map<string, ConsentRecord>();
      customers.slice(0, 500).forEach(customer => {
        consents.set(customer.id, createDefaultConsent(customer.id));
      });
      setConsentRecords(consents);
      setEventsInitialized(true);
    }
  }, [customers, eventsInitialized]);

  const lifecycleEvents = useMemo(
    () => customers.flatMap(c => c.lifecycleHistory),
    [customers]
  );

  const getCustomerById = useCallback(
    (id: string) => customers.find(c => c.id === id),
    [customers]
  );

  const getCustomerTransactions = useCallback(
    (customerId: string) => transactions.filter(t => t.customerId === customerId),
    [transactions]
  );

  const getCustomerLifecycleHistory = useCallback(
    (customerId: string) => customers.find(c => c.id === customerId)?.lifecycleHistory || [],
    [customers]
  );

  const getChurnedCustomers = useCallback(
    () => customers.filter(c => c.lifecycleStage === 'churned'),
    [customers]
  );

  const getReactivatedCustomers = useCallback(
    () => customers.filter(c => c.reactivationCount > 0),
    [customers]
  );

  const getCustomersAtRisk = useCallback(
    () => customers.filter(c => c.lifecycleStage === 'at-risk'),
    [customers]
  );

  const searchCustomers = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    },
    [customers]
  );

  const calculateChurnRate = useCallback(
    (_period: string) => {
      const churned = customers.filter(c => c.lifecycleStage === 'churned').length;
      return (churned / customers.length) * 100;
    },
    [customers]
  );

  const calculateReactivationRate = useCallback(
    (_period: string) => {
      const churned = customers.filter(c => c.churnCount > 0).length;
      const reactivated = customers.filter(c => c.reactivationCount > 0).length;
      return churned > 0 ? (reactivated / churned) * 100 : 0;
    },
    [customers]
  );

  const getCustomerEvents = useCallback(
    (customerId: string) => events.filter(e => e.customerId === customerId),
    [events]
  );

  const trackEvent = useCallback(
    (eventData: Omit<CustomerEvent, 'eventId' | 'timestamp'>) => {
      const newEvent: CustomerEvent = {
        ...eventData,
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date()
      };
      setEvents(prev => [newEvent, ...prev]);
    },
    []
  );

  const getActiveJourneys = useCallback(
    () => journeys.filter(j => j.status === 'active'),
    [journeys]
  );

  const getJourneyById = useCallback(
    (journeyId: string) => journeys.find(j => j.id === journeyId),
    [journeys]
  );

  const getCustomerJourneys = useCallback(
    (customerId: string) => journeyExecutions.filter(je => je.customerId === customerId),
    [journeyExecutions]
  );

  const getCustomerAuditLogs = useCallback(
    (customerId: string) => auditLogs.filter(log => log.customerId === customerId),
    [auditLogs]
  );

  const logCommunication = useCallback(
    (logData: Omit<CommunicationAuditLog, 'auditId' | 'timestamp' | 'contentHash'>) => {
      const newLog: CommunicationAuditLog = {
        ...logData,
        auditId: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date(),
        contentHash: generateHash(logData.messageContent)
      };
      setAuditLogs(prev => [newLog, ...prev]);
    },
    []
  );

  const getCustomerConsent = useCallback(
    (customerId: string) => consentRecords.get(customerId),
    [consentRecords]
  );

  const updateConsent = useCallback(
    (customerId: string, updates: Partial<ConsentRecord>) => {
      setConsentRecords(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(customerId);
        if (existing) {
          newMap.set(customerId, { ...existing, ...updates });
        }
        return newMap;
      });
    },
    []
  );

  return (
    <DataContext.Provider
      value={{
        customers,
        transactions,
        lifecycleEvents,
        getCustomerById,
        getCustomerTransactions,
        getCustomerLifecycleHistory,
        getChurnedCustomers,
        getReactivatedCustomers,
        getCustomersAtRisk,
        searchCustomers,
        calculateChurnRate,
        calculateReactivationRate,
        loading,
        error,
        DISPLAY_MULTIPLIER: 425,

        events,
        getCustomerEvents,
        trackEvent,

        journeys,
        journeyExecutions,
        getActiveJourneys,
        getJourneyById,
        getCustomerJourneys,

        auditLogs,
        getCustomerAuditLogs,
        logCommunication,

        consentRecords,
        getCustomerConsent,
        updateConsent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
