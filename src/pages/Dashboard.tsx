import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './Overview';
import { TransactionsTab } from '@/components/dashboard/TransactionsTab';
import { RiskAlertsTab } from '@/components/dashboard/RiskAlertsTab';
import { CustomersTab } from '@/components/dashboard/CustomersTab';
import { BehaviorTab } from '@/components/dashboard/BehaviorTab';
import { ProductsTab } from '@/components/dashboard/ProductsTab';
import { MarketingTab } from '@/components/dashboard/MarketingTab';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Comprehensive analytics and insights</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none h-12 bg-transparent p-0">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="transactions"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger 
            value="risk"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Risk & Alerts
          </TabsTrigger>
          <TabsTrigger 
            value="customers"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger 
            value="behavior"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Behavior
          </TabsTrigger>
          <TabsTrigger 
            value="products"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="marketing"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-t-lg rounded-b-none"
          >
            Marketing
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="m-0">
            <Overview />
          </TabsContent>

          <TabsContent value="transactions" className="m-0">
            <TransactionsTab />
          </TabsContent>

          <TabsContent value="risk" className="m-0">
            <RiskAlertsTab />
          </TabsContent>

          <TabsContent value="customers" className="m-0">
            <CustomersTab />
          </TabsContent>

          <TabsContent value="behavior" className="m-0">
            <BehaviorTab />
          </TabsContent>

          <TabsContent value="products" className="m-0">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="marketing" className="m-0">
            <MarketingTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};