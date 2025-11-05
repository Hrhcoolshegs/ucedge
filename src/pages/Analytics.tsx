import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/utils/formatters';

export const Analytics = () => {
  const { customers, transactions } = useData();

  const monthlyData = [
    { month: 'Jul', revenue: 45000, customers: 120, transactions: 450 },
    { month: 'Aug', revenue: 52000, customers: 135, transactions: 520 },
    { month: 'Sep', revenue: 48000, customers: 128, transactions: 480 },
    { month: 'Oct', revenue: 61000, customers: 145, transactions: 590 },
    { month: 'Nov', revenue: 55000, customers: 142, transactions: 540 },
    { month: 'Dec', revenue: 67000, customers: 158, transactions: 630 }
  ];

  const channelData = [
    { name: 'Web', value: 45, color: '#0088FE' },
    { name: 'Mobile', value: 30, color: '#00C49F' },
    { name: 'Email', value: 15, color: '#FFBB28' },
    { name: 'Social', value: 10, color: '#FF8042' }
  ];

  const productData = [
    { product: 'Product A', sales: 65000 },
    { product: 'Product B', sales: 45000 },
    { product: 'Product C', sales: 38000 },
    { product: 'Product D', sales: 28000 },
    { product: 'Product E', sales: 22000 }
  ];

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalRevenue / transactions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide performance metrics and insights</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</h3>
          <div className="flex items-center gap-1 text-sm text-success mt-1">
            <ArrowUp className="h-4 w-4" />
            <span>+12.5%</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{customers.length}</h3>
          <div className="flex items-center gap-1 text-sm text-success mt-1">
            <ArrowUp className="h-4 w-4" />
            <span>+8.2%</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <ShoppingCart className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{transactions.length}</h3>
          <div className="flex items-center gap-1 text-sm text-success mt-1">
            <ArrowUp className="h-4 w-4" />
            <span>+15.3%</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Transaction</p>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(avgTransaction)}</h3>
          <div className="flex items-center gap-1 text-sm text-destructive mt-1">
            <ArrowDown className="h-4 w-4" />
            <span>-2.1%</span>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Channel Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="customers" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Products by Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="product" type="category" />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};