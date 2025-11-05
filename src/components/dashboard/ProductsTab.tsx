import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/common/ChartCard';
import { formatCurrency } from '@/utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Wallet, TrendingUp, Lock, CreditCard } from 'lucide-react';

export const ProductsTab = () => {
  const revenueData = [
    { month: 'Jun', savings: 18000000, investments: 14000000, deposits: 4800000, loans: 3200000 },
    { month: 'Jul', savings: 19000000, investments: 15000000, deposits: 5000000, loans: 3400000 },
    { month: 'Aug', savings: 20000000, investments: 15500000, deposits: 5200000, loans: 3500000 },
    { month: 'Sep', savings: 20500000, investments: 16000000, deposits: 5500000, loans: 3600000 },
    { month: 'Oct', savings: 21000000, investments: 16500000, deposits: 5700000, loans: 3700000 },
    { month: 'Nov', savings: 21600000, investments: 16800000, deposits: 5800000, loans: 3800000 }
  ];

  const npsData = [
    { product: 'Savings Account', nps: 45, promoters: 58, passives: 29, detractors: 13 },
    { product: 'Investment Plans', nps: 52, promoters: 65, passives: 22, detractors: 13 },
    { product: 'Fixed Deposits', nps: 38, promoters: 50, passives: 38, detractors: 12 },
    { product: 'Loans', nps: 25, promoters: 40, passives: 45, detractors: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Product Portfolio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border-t-4 border-t-primary rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-xs text-success">+12%</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Savings Account</h3>
          <p className="text-2xl font-bold text-foreground mb-1">8,920</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
          <p className="text-sm font-medium text-foreground mt-2">{formatCurrency(890000000)} AUM</p>
        </div>

        <div className="bg-card border-t-4 border-t-secondary rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <span className="text-xs text-success">+22%</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Investment Plans</h3>
          <p className="text-2xl font-bold text-foreground mb-1">2,450</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
          <p className="text-sm font-medium text-foreground mt-2">{formatCurrency(1200000000)} AUM</p>
        </div>

        <div className="bg-card border-t-4 border-t-accent rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Lock className="h-5 w-5 text-accent" />
            <span className="text-xs text-success">+8%</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Fixed Deposits</h3>
          <p className="text-2xl font-bold text-foreground mb-1">1,680</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
          <p className="text-sm font-medium text-foreground mt-2">{formatCurrency(650000000)} AUM</p>
        </div>

        <div className="bg-card border-t-4 border-t-warning rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="h-5 w-5 text-warning" />
            <span className="text-xs text-success">+5%</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Loans</h3>
          <p className="text-2xl font-bold text-foreground mb-1">890</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
          <p className="text-sm font-medium text-foreground mt-2">{formatCurrency(340000000)} Disbursed</p>
        </div>
      </div>

      {/* Product Revenue Contribution */}
      <ChartCard title="Revenue by Product" subtitle="Last 6 months">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))'
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Area type="monotone" dataKey="savings" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" name="Savings" />
            <Area type="monotone" dataKey="investments" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" name="Investments" />
            <Area type="monotone" dataKey="deposits" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" name="Fixed Deposits" />
            <Area type="monotone" dataKey="loans" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" name="Loans" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cross-Sell Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">💡 Investment Opportunity</h4>
          <p className="text-sm text-muted-foreground mb-2">2,340 savings customers don't have investments</p>
          <p className="text-xs text-muted-foreground mb-3">Potential Revenue: {formatCurrency(1140000000)}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Conversion Likelihood: 35%</p>
          <button className="text-xs bg-primary text-white px-3 py-1 rounded">Create Campaign</button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">🔄 Reactivated Upsell</h4>
          <p className="text-sm text-muted-foreground mb-2">42 reactivated customers ready for upgrades</p>
          <p className="text-xs text-muted-foreground mb-3">Potential Revenue: {formatCurrency(180000000)}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Conversion Likelihood: 45%</p>
          <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded">Create Campaign</button>
        </div>
      </div>

      {/* Product Satisfaction & NPS */}
      <ChartCard title="Product Satisfaction (NPS)" subtitle="Net Promoter Score by product">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={npsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="product" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))'
              }}
            />
            <Bar dataKey="nps" fill="hsl(var(--success))" name="NPS Score" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};