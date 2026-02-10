import { useMemo, useState } from 'react';
import { ChartCard } from '@/components/common/ChartCard';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ChurnRiskIndicator } from '@/components/common/ChurnRiskIndicator';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const CustomersTab = () => {
  const { customers } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const lifecycleData = useMemo(() => {
    const stages = {
      new: { count: 0, color: 'hsl(var(--primary))' },
      active: { count: 0, color: 'hsl(var(--success))' },
      loyal: { count: 0, color: 'hsl(var(--secondary))' },
      'at-risk': { count: 0, color: 'hsl(var(--warning))' },
      churned: { count: 0, color: 'hsl(var(--destructive))' },
      reactivated: { count: 0, color: '#9333EA' }
    };

    customers.forEach(c => {
      if (c.reactivationCount > 0 && c.lifecycleStage === 'active') {
        stages.reactivated.count++;
      } else if (c.lifecycleStage in stages) {
        stages[c.lifecycleStage as keyof typeof stages].count++;
      }
    });

    return Object.entries(stages).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
      value: data.count,
      color: data.color
    }));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 50);
  }, [customers, searchQuery]);

  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
      .slice(0, 10);
  }, [customers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lifecycle Segmentation Chart */}
        <div className="lg:col-span-1">
          <ChartCard title="Customer Lifecycle Segmentation" explanation="Distribution of customers across lifecycle stages. Shows how many customers are New, Active, Loyal, At-Risk, Churned, or Reactivated. Use this to understand customer health and identify stages needing attention."
>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={lifecycleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Customer Lifecycle Funnel */}
        <div className="lg:col-span-2">
          <ChartCard title="Customer Lifecycle Funnel" explanation="Shows customer progression through onboarding stages. Identifies drop-off points between registration, KYC completion, first deposit, and repeat purchases. Low conversion at any stage signals where to improve user experience."
>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400 h-12 rounded flex items-center px-4 text-white font-medium">
                  Registered: 15,000 (100%)
                </div>
              </div>
              <div className="flex items-center gap-3 pl-8">
                <div className="flex-1 bg-gradient-to-r from-green-500 to-green-400 h-12 rounded flex items-center px-4 text-white font-medium" style={{ width: '90%' }}>
                  KYC Complete: 13,500 (90%)
                </div>
              </div>
              <div className="flex items-center gap-3 pl-16">
                <div className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 h-12 rounded flex items-center px-4 text-white font-medium" style={{ width: '81%' }}>
                  First Deposit: 12,150 (81%)
                </div>
              </div>
              <div className="flex items-center gap-3 pl-24">
                <div className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 h-12 rounded flex items-center px-4 text-white font-medium" style={{ width: '59%' }}>
                  Active User: 8,920 (59%)
                </div>
              </div>
              <div className="flex items-center gap-3 pl-32">
                <div className="flex-1 bg-gradient-to-r from-purple-500 to-purple-400 h-12 rounded flex items-center px-4 text-white font-medium" style={{ width: '21%' }}>
                  Loyal Customer: 3,112 (21%)
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Customer List & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Customer List</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="pb-3 text-sm font-semibold text-muted-foreground">Stage</th>
                  <th className="pb-3 text-sm font-semibold text-muted-foreground">LTV</th>
                  <th className="pb-3 text-sm font-semibold text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.email}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <LifecycleBadge stage={customer.lifecycleStage} size="sm" />
                    </td>
                    <td className="py-3 text-sm font-medium text-foreground">
                      {formatCurrency(customer.lifetimeValue)}
                    </td>
                    <td className="py-3">
                      <ChurnRiskIndicator risk={customer.churnRisk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-secondary rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              🏆 Top 10 by LTV
            </h4>
            <div className="space-y-2">
              {topCustomers.map((customer, idx) => (
                <div key={customer.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{idx + 1}.</span>
                    <span className="text-foreground">{customer.name}</span>
                  </div>
                  <span className="font-medium text-secondary">
                    {formatCurrency(customer.lifetimeValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};