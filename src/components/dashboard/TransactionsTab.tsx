import { useMemo, useState } from 'react';
import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/common/ChartCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart } from 'recharts';
import { DollarSign, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const TransactionsTab = () => {
  const { transactions, getCustomerById } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const todayTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return transactions.filter(t => new Date(t.date) >= today);
  }, [transactions]);

  const successfulToday = todayTransactions.filter(t => t.status === 'completed');
  const failedToday = todayTransactions.filter(t => t.status === 'failed');
  const totalValueToday = successfulToday.reduce((sum, t) => sum + t.amount, 0);
  const successRate = todayTransactions.length > 0 ? (successfulToday.length / todayTransactions.length) * 100 : 0;

  // Last 30 days data
  const last30DaysData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === date.getTime();
      });
      
      const completed = dayTransactions.filter(t => t.status === 'completed');
      const value = completed.reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayTransactions.length,
        value: value / 1000000000 // Convert to billions
      });
    }
    return data;
  }, [transactions]);

  // Type breakdown
  const typeBreakdown = useMemo(() => {
    const types = {
      deposit: { count: 0, color: 'hsl(var(--primary))' },
      withdrawal: { count: 0, color: 'hsl(var(--warning))' },
      transfer: { count: 0, color: 'hsl(var(--secondary))' },
      investment: { count: 0, color: 'hsl(var(--accent))' }
    };
    
    transactions.forEach(t => {
      if (t.type in types) types[t.type].count++;
    });
    
    return Object.entries(types).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: data.count,
      color: data.color
    }));
  }, [transactions]);

  // Channel performance
  const channelPerformance = useMemo(() => {
    const channels = {
      mobile: { total: 0, success: 0 },
      web: { total: 0, success: 0 },
      branch: { total: 0, success: 0 },
      atm: { total: 0, success: 0 }
    };
    
    transactions.forEach(t => {
      channels[t.channel].total++;
      if (t.status === 'completed') channels[t.channel].success++;
    });
    
    return Object.entries(channels).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      transactions: data.total,
      successRate: data.total > 0 ? (data.success / data.total) * 100 : 0
    })).sort((a, b) => b.transactions - a.transactions);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const customer = getCustomerById(t.customerId);
      return (
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }).slice(0, 50);
  }, [transactions, searchQuery, getCustomerById]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Transactions Today"
          value={todayTransactions.length.toString()}
          change={12.3}
          icon={DollarSign}
          iconColor="text-primary"
          borderColor="border-t-primary"
          explanation="Total number of all transaction attempts made today, including successful, failed, and pending transactions. Helps monitor daily platform activity and identify unusual spikes or drops."
        />
        <MetricCard
          title="Total Value Today"
          value={formatCurrency(totalValueToday)}
          change={8.7}
          icon={TrendingUp}
          iconColor="text-secondary"
          borderColor="border-t-secondary"
          explanation="Total monetary value of all successfully completed transactions today. This reflects actual money flow through the platform and directly impacts revenue generation."
        />
        <MetricCard
          title="Success Rate"
          value={formatPercentage(successRate / 100)}
          change={0.5}
          icon={CheckCircle}
          iconColor="text-success"
          borderColor="border-t-success"
          explanation="Percentage of transactions that completed successfully today. A high success rate (above 95%) indicates good system reliability. Lower rates may signal technical issues or payment gateway problems."
        />
        <MetricCard
          title="Failed Transactions"
          value={failedToday.length.toString()}
          change={-12}
          icon={XCircle}
          iconColor="text-warning"
          borderColor="border-t-warning"
          explanation="Number of transactions that failed today due to technical errors, insufficient funds, or payment gateway issues. Monitor this to identify and resolve recurring problems."
        />
      </div>

      {/* Transaction Volume Chart */}
      <ChartCard title="Transaction Volume & Value Trend" subtitle="Last 30 days" explanation="Shows both transaction count and monetary value over the past 30 days. Use this to identify patterns, peak transaction periods, and correlate volume with value to understand customer behavior."
>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={last30DaysData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Transaction Count" />
            <Line yAxisId="right" type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2} name="Value (₦B)" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Two Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Breakdown */}
        <ChartCard title="Transaction Type Breakdown" explanation="Distribution of transaction types across deposits, withdrawals, transfers, and investments. Helps identify which services are most used and informs product development priorities."
>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${((entry.value / transactions.length) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Channel Performance */}
        <ChartCard title="Channel Performance" explanation="Compares transaction volume and success rates across different channels (mobile, web, branch, ATM). Use this to identify which channels need optimization and where to focus infrastructure investments."
>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Bar dataKey="transactions" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Time</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Type</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Amount</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.map((transaction) => {
                const customer = getCustomerById(transaction.customerId);
                return (
                  <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-sm text-foreground">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{customer?.name || 'Unknown'}</span>
                        {transaction.isReactivationTransaction && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            <RefreshCw className="h-3 w-3" />
                            Reactivation
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={transaction.type as any} variant="type" />
                    </td>
                    <td className="py-3 text-sm font-medium text-foreground">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="py-3 text-sm text-muted-foreground capitalize">
                      {transaction.channel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};