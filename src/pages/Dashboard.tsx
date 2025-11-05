import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './Overview';

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
            <div className="text-center py-12">
              <p className="text-muted-foreground">Transactions tab coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="m-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Risk & Alerts tab coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="m-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Customers tab coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="m-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Behavior tab coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="products" className="m-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Products tab coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="m-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Marketing tab coming soon...</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};