import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Transaction, LifecycleEvent } from '@/types';
import { generateCustomers, generateTransactions } from '@/utils/dataGenerator';
import { calculateDaysBetween } from '@/utils/formatters';

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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Generate data on mount
      const generatedCustomers = generateCustomers(500);
      const generatedTransactions = generateTransactions(generatedCustomers, 2000);
      
      setCustomers(generatedCustomers);
      setTransactions(generatedTransactions);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  const lifecycleEvents = customers.flatMap(c => c.lifecycleHistory);

  const getCustomerById = (id: string) => customers.find(c => c.id === id);
  
  const getCustomerTransactions = (customerId: string) => 
    transactions.filter(t => t.customerId === customerId);
  
  const getCustomerLifecycleHistory = (customerId: string) => 
    customers.find(c => c.id === customerId)?.lifecycleHistory || [];
  
  const getChurnedCustomers = () => 
    customers.filter(c => c.lifecycleStage === 'churned');
  
  const getReactivatedCustomers = () => 
    customers.filter(c => c.reactivationCount > 0);
  
  const getCustomersAtRisk = () => 
    customers.filter(c => c.lifecycleStage === 'at-risk');
  
  const searchCustomers = (query: string) => {
    const q = query.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  };

  const calculateChurnRate = (period: string) => {
    // Simplified calculation: percentage of churned customers
    const churned = customers.filter(c => c.lifecycleStage === 'churned').length;
    return (churned / customers.length) * 100;
  };

  const calculateReactivationRate = (period: string) => {
    const churned = customers.filter(c => c.churnCount > 0).length;
    const reactivated = customers.filter(c => c.reactivationCount > 0).length;
    return churned > 0 ? (reactivated / churned) * 100 : 0;
  };

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
        error
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
