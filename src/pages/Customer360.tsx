import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ChurnRiskIndicator } from '@/components/common/ChurnRiskIndicator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Customer360 = () => {
  const { customers, getCustomerTransactions, getCustomerLifecycleHistory } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');

  const customer = customers.find(c => c.id === selectedCustomerId);
  const transactions = customer ? getCustomerTransactions(customer.id) : [];
  const lifecycleHistory = customer ? getCustomerLifecycleHistory(customer.id) : [];

  if (!customer) return null;

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalSpent / transactions.length || 0;

  const spendingTrend = transactions
    .slice(-6)
    .map((t, i) => ({
      month: new Date(t.date).toLocaleDateString('en-US', { month: 'short' }),
      amount: t.amount
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">360° Customer View</h1>
          <p className="text-muted-foreground mt-1">Complete customer intelligence dashboard</p>
        </div>
        <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.slice(0, 20).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer Profile */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{customer.name}</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {customer.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since {formatDate(customer.dateJoined)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <LifecycleBadge stage={customer.lifecycleStage} />
            <ChurnRiskIndicator risk={customer.churnRisk} />
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{transactions.length}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Order</p>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(avgTransaction)}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Sentiment Score</p>
            <MessageSquare className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{customer.sentimentScore.toFixed(1)}/10</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Churn Risk</p>
            <AlertCircle className={`h-5 w-5 ${customer.churnRisk === 'high' ? 'text-destructive' : 'text-success'}`} />
          </div>
          <h3 className="text-2xl font-bold text-foreground capitalize">{customer.churnRisk}</h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spendingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Lifecycle Journey */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Lifecycle Journey</h3>
          <div className="space-y-3">
            {lifecycleHistory.slice(-5).reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="font-medium text-foreground capitalize">{event.newStage.replace('-', ' ')}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(event.eventDate)}</div>
                </div>
                <div className="text-xs text-muted-foreground">{event.trigger}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Channel</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(-10).reverse().map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="p-3 text-sm text-muted-foreground">{formatDate(transaction.date)}</td>
                  <td className="p-3 text-sm text-foreground capitalize">{transaction.type}</td>
                  <td className="p-3 text-sm text-muted-foreground capitalize">{transaction.channel}</td>
                  <td className="p-3 text-sm font-semibold text-foreground">{formatCurrency(transaction.amount)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};