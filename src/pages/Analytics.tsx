import { useState } from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUp, ArrowDown, Download, Filter as FilterIcon, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Analytics = () => {
  const { customers, transactions } = useData();
  const [showExport, setShowExport] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [metricFilter, setMetricFilter] = useState('all');

  const hasActiveFilters = dateRange.from || dateRange.to || metricFilter !== 'all';

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setMetricFilter('all');
  };

  const monthlyData = [
    { month: 'Jul', revenue: 45000000, customers: 720000, transactions: 4500000 },
    { month: 'Aug', revenue: 52000000, customers: 735000, transactions: 4520000 },
    { month: 'Sep', revenue: 48000000, customers: 758000, transactions: 4800000 },
    { month: 'Oct', revenue: 61000000, customers: 785000, transactions: 4900000 },
    { month: 'Nov', revenue: 55000000, customers: 820000, transactions: 4950000 },
    { month: 'Dec', revenue: 67000000, customers: 850000, transactions: 5000000 }
  ];

  const channelData = [
    { name: 'Web', value: 45, color: '#0088FE' },
    { name: 'Mobile', value: 30, color: '#00C49F' },
    { name: 'Email', value: 15, color: '#FFBB28' },
    { name: 'Social', value: 10, color: '#FF8042' }
  ];

  const productData = [
    { product: 'Savings Account', sales: 6500000 },
    { product: 'Investment Plan', sales: 4500000 },
    { product: 'Fixed Deposit', sales: 3800000 },
    { product: 'Loan Products', sales: 2800000 },
    { product: 'Card Services', sales: 2200000 }
  ];

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalRevenue / transactions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Analytics</h1>
          <p className="text-muted-foreground mt-1">Platform-wide performance metrics and insights</p>
        </div>
        <Button variant="outline" onClick={() => setShowExport(true)}>
          <Download className="h-4 w-4 mr-1" /> Export Data
        </Button>
      </div>

      {showExport && (
        <ExportPreviewModal
          title="Analytics Data Export"
          columns={['Month', 'Revenue', 'Customers', 'Transactions']}
          rows={monthlyData.map(m => [m.month, formatCurrency(m.revenue), m.customers.toLocaleString(), m.transactions.toLocaleString()])}
          onClose={() => setShowExport(false)}
          recordCount={monthlyData.length}
        />
      )}

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

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <DateRangeFilter
              value={dateRange}
              onChange={setDateRange}
              placeholder="Date range"
            />

            <Select value={metricFilter} onValueChange={setMetricFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Metric Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="revenue">Revenue Only</SelectItem>
                <SelectItem value="customers">Customers Only</SelectItem>
                <SelectItem value="transactions">Transactions Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Viewing analytics data {dateRange.from && dateRange.to ? 'for selected period' : 'for all time'}
          </div>
        </div>
      </Card>

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