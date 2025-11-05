import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/common/ChartCard';
import { Button } from '@/components/common/Button';
import { useData } from '@/contexts/DataContext';
import { 
  Users, UserCheck, TrendingUp, DollarSign, MessageSquare, 
  Target, Wallet, AlertTriangle 
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Mock revenue data
const revenueData = [
  { month: 'Nov 23', revenue: 35200000 },
  { month: 'Dec 23', revenue: 37800000 },
  { month: 'Jan 24', revenue: 36500000 },
  { month: 'Feb 24', revenue: 39100000 },
  { month: 'Mar 24', revenue: 41200000 },
  { month: 'Apr 24', revenue: 40800000 },
  { month: 'May 24', revenue: 43500000 },
  { month: 'Jun 24', revenue: 45200000 },
  { month: 'Jul 24', revenue: 44800000 },
  { month: 'Aug 24', revenue: 46500000 },
  { month: 'Sep 24', revenue: 47200000 },
  { month: 'Oct 24', revenue: 48000000 },
];

const customerGrowthData = [
  { month: 'Jun', customers: 10500 },
  { month: 'Jul', customers: 11200 },
  { month: 'Aug', customers: 11650 },
  { month: 'Sep', customers: 11900 },
  { month: 'Oct', customers: 12200 },
  { month: 'Nov', customers: 12450 },
];

export const Overview = () => {
  const { customers, transactions, loading } = useData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading UC-Edge Platform...</p>
        </div>
      </div>
    );
  }

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalTransactionVolume = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const revenue = totalTransactionVolume * 0.02; // 2% fee
  const atRiskCustomers = customers.filter(c => c.lifecycleStage === 'at-risk').length;
  const avgLTV = customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length;
  const churnRate = (customers.filter(c => c.lifecycleStage === 'churned').length / customers.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent">Overview</h1>
        <p className="text-muted-foreground mt-1">United Capital Platform Analytics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Customers"
          value={formatNumber(totalCustomers)}
          change="+3.2%"
          changeType="positive"
          subtitle="Total registered customers"
          icon={Users}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <MetricCard
          title="Active Users"
          value={formatNumber(activeCustomers)}
          change="+5.1%"
          changeType="positive"
          subtitle="Currently active customers"
          icon={UserCheck}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <MetricCard
          title="Transaction Volume"
          value={formatCurrency(totalTransactionVolume)}
          change="+12.8%"
          changeType="positive"
          subtitle="Total transaction value"
          icon={TrendingUp}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/20"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(revenue)}
          change="+8.5%"
          changeType="positive"
          subtitle="Platform revenue"
          icon={DollarSign}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Support Tickets"
          value="1,240"
          change="-15.3%"
          changeType="positive"
          subtitle="Active support requests"
          icon={MessageSquare}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <MetricCard
          title="Campaign ROI"
          value="3.8x"
          change="+0.4x"
          changeType="positive"
          subtitle="Average return on campaigns"
          icon={Target}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/20"
        />
        <MetricCard
          title="Avg Customer LTV"
          value={formatCurrency(avgLTV)}
          change="+6.2%"
          changeType="positive"
          subtitle="Lifetime value per customer"
          icon={Wallet}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/20"
        />
        <MetricCard
          title="Churn Rate"
          value={`${churnRate.toFixed(1)}%`}
          change="-1.1%"
          changeType="positive"
          subtitle="Customer churn rate"
          icon={AlertTriangle}
          iconColor="text-warning"
          iconBgColor="bg-warning/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ChartCard
            title="Revenue Trend (Last 12 Months)"
            subtitle="Monthly revenue performance"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FE0000" 
                  strokeWidth={3}
                  dot={{ fill: '#FE0000', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard
            title="Customer Growth"
            subtitle="New customers per month"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={customerGrowthData}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFE47D" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFE47D" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatNumber(value), 'Customers']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#573704" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCustomers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-accent mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/campaigns')}
          >
            <Target className="h-5 w-5" />
            Launch Campaign
          </Button>
          <Button
            variant="warning"
            size="lg"
            className="w-full relative"
            onClick={() => navigate('/dashboard?tab=risk')}
          >
            <AlertTriangle className="h-5 w-5" />
            View At-Risk Customers
            <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {atRiskCustomers}
            </span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/reports')}
          >
            <TrendingUp className="h-5 w-5" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};
