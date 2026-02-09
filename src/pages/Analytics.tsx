import { useState, useEffect } from 'react';
import {
  TrendingUp, Users, DollarSign, ShoppingCart, ArrowUp, ArrowDown,
  Download, Filter as FilterIcon, X, Building2, AlertTriangle, Activity,
  BarChart3, PieChart, LineChart, Target, Clock, Percent, Zap, Calendar,
  FileText, Plus, Settings as SettingsIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart as RechartsLineChart, Line, BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell,
  AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { BusinessUnitFilter } from '@/components/common/BusinessUnitFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { RiskSignal } from '@/types/governance';

interface CustomReport {
  id: string;
  name: string;
  metrics: string[];
  filters: any;
  chartType: 'line' | 'bar' | 'pie' | 'area';
}

export const Analytics = () => {
  const { customers, transactions } = useData();
  const [showExport, setShowExport] = useState(false);
  const [businessUnitFilter, setBusinessUnitFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [metricFilter, setMetricFilter] = useState('all');
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>([]);
  const [crossBusinessMetrics, setCrossBusinessMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customReportDialog, setCustomReportDialog] = useState(false);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [newReport, setNewReport] = useState({
    name: '',
    metrics: [] as string[],
    chartType: 'line' as 'line' | 'bar' | 'pie' | 'area',
  });

  useEffect(() => {
    const fetchGroup360Data = async () => {
      const [signalsResult, profilesResult, customersResult, campaignsResult] = await Promise.all([
        supabase
          .from('risk_signals')
          .select(`
            id,
            customer_id,
            business_unit_id,
            signal_type,
            score,
            band,
            rationale,
            created_at,
            business_unit:business_units (id, code, name)
          `)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('customer_business_profiles')
          .select('id, customer_id, business_unit_id, profile_status'),
        supabase
          .from('customers')
          .select('id, name, entity_type'),
        supabase
          .from('campaigns')
          .select('id, name, status, sent, delivered, opened, clicked, converted, revenue')
      ]);

      if (!signalsResult.error && signalsResult.data) {
        setRiskSignals(signalsResult.data as any);
      }

      if (!profilesResult.error && profilesResult.data && !customersResult.error && customersResult.data) {
        const profiles = profilesResult.data;
        const customers = customersResult.data;

        const businessUnitCoverage = ['MICROFIN', 'ASSETMGT', 'INVBANK', 'WEALTH'].map(code => {
          const unitProfiles = profiles.filter((p: any) => {
            const buData = p.business_unit_id;
            return true;
          });
          return {
            code,
            name: code === 'MICROFIN' ? 'Microfinance' : code === 'ASSETMGT' ? 'Asset Mgmt' : code === 'INVBANK' ? 'Inv Banking' : 'Wealth',
            customers: unitProfiles.length,
            active: unitProfiles.filter((p: any) => p.profile_status === 'ACTIVE').length
          };
        });

        const customersWithMultipleBU = customers.filter((c: any) => {
          const customerProfiles = profiles.filter((p: any) => p.customer_id === c.id);
          return customerProfiles.length >= 2;
        });

        setCrossBusinessMetrics({
          totalCustomers: customers.length,
          crossBusinessCustomers: customersWithMultipleBU.length,
          businessUnitCoverage,
          totalRiskSignals: signalsResult.data?.length || 0,
          campaigns: campaignsResult.data || []
        });
      }

      setLoading(false);
    };

    fetchGroup360Data();
  }, []);

  const hasActiveFilters = businessUnitFilter !== 'all' || dateRange.from || dateRange.to || metricFilter !== 'all';

  const clearFilters = () => {
    setBusinessUnitFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setMetricFilter('all');
  };

  const monthlyData = [
    { month: 'Jul', revenue: 45000000, customers: 720000, transactions: 4500000, activeUsers: 680000, churnRate: 2.3, conversionRate: 4.2 },
    { month: 'Aug', revenue: 52000000, customers: 735000, transactions: 4520000, activeUsers: 698000, churnRate: 2.1, conversionRate: 4.5 },
    { month: 'Sep', revenue: 48000000, customers: 758000, transactions: 4800000, activeUsers: 720000, churnRate: 1.9, conversionRate: 4.8 },
    { month: 'Oct', revenue: 61000000, customers: 785000, transactions: 4900000, activeUsers: 745000, churnRate: 1.7, conversionRate: 5.1 },
    { month: 'Nov', revenue: 55000000, customers: 820000, transactions: 4950000, activeUsers: 780000, churnRate: 1.6, conversionRate: 5.3 },
    { month: 'Dec', revenue: 67000000, customers: 850000, transactions: 5000000, activeUsers: 810000, churnRate: 1.5, conversionRate: 5.6 }
  ];

  const channelData = [
    { name: 'Web', value: 45, color: '#0088FE' },
    { name: 'Mobile', value: 30, color: '#00C49F' },
    { name: 'Email', value: 15, color: '#FFBB28' },
    { name: 'Social', value: 10, color: '#FF8042' }
  ];

  const productData = [
    { product: 'Savings Account', sales: 6500000, growth: 12.5 },
    { product: 'Investment Plan', sales: 4500000, growth: 18.2 },
    { product: 'Fixed Deposit', sales: 3800000, growth: 8.9 },
    { product: 'Loan Products', sales: 2800000, growth: 15.3 },
    { product: 'Card Services', sales: 2200000, growth: 10.1 }
  ];

  const cohortData = [
    { cohort: 'Jan 2024', retention_1m: 85, retention_3m: 72, retention_6m: 65 },
    { cohort: 'Feb 2024', retention_1m: 87, retention_3m: 75, retention_6m: 68 },
    { cohort: 'Mar 2024', retention_1m: 89, retention_3m: 78, retention_6m: 0 },
    { cohort: 'Apr 2024', retention_1m: 88, retention_3m: 76, retention_6m: 0 },
    { cohort: 'May 2024', retention_1m: 90, retention_3m: 0, retention_6m: 0 },
    { cohort: 'Jun 2024', retention_1m: 91, retention_3m: 0, retention_6m: 0 },
  ];

  const customerSegmentData = [
    { segment: 'High Value', count: 15000, revenue: 45000000, avgValue: 3000 },
    { segment: 'Medium Value', count: 35000, revenue: 35000000, avgValue: 1000 },
    { segment: 'Low Value', count: 50000, revenue: 10000000, avgValue: 200 },
    { segment: 'At Risk', count: 8000, revenue: 5000000, avgValue: 625 },
  ];

  const campaignPerformanceData = crossBusinessMetrics?.campaigns?.map((c: any) => ({
    name: c.name.substring(0, 20),
    sent: c.sent || 0,
    delivered: c.delivered || 0,
    opened: c.opened || 0,
    clicked: c.clicked || 0,
    converted: c.converted || 0,
    revenue: c.revenue || 0,
  })) || [];

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalRevenue / transactions.length;

  const createCustomReport = () => {
    if (newReport.name && newReport.metrics.length > 0) {
      const report: CustomReport = {
        id: Date.now().toString(),
        name: newReport.name,
        metrics: newReport.metrics,
        filters: { businessUnit: businessUnitFilter, dateRange, metricFilter },
        chartType: newReport.chartType,
      };
      setCustomReports([...customReports, report]);
      setNewReport({ name: '', metrics: [], chartType: 'line' });
      setCustomReportDialog(false);
    }
  };

  const availableMetrics = [
    'revenue', 'customers', 'transactions', 'activeUsers', 'churnRate', 'conversionRate'
  ];

  const toggleMetric = (metric: string) => {
    setNewReport(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Comprehensive Analytics</h1>
          <p className="text-muted-foreground mt-1">Advanced analytics, insights, and custom reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCustomReportDialog(true)}>
            <Plus className="h-4 w-4 mr-1" /> Custom Report
          </Button>
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4 mr-1" /> Export Data
          </Button>
        </div>
      </div>

      {showExport && (
        <ExportPreviewModal
          title="Analytics Data Export"
          columns={['Month', 'Revenue', 'Customers', 'Transactions', 'Active Users', 'Churn Rate', 'Conversion Rate']}
          rows={monthlyData.map(m => [
            m.month,
            formatCurrency(m.revenue),
            m.customers.toLocaleString(),
            m.transactions.toLocaleString(),
            m.activeUsers.toLocaleString(),
            `${m.churnRate}%`,
            `${m.conversionRate}%`
          ])}
          onClose={() => setShowExport(false)}
          recordCount={monthlyData.length}
        />
      )}

      <Dialog open={customReportDialog} onOpenChange={setCustomReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Select metrics and configure your custom analytics report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Name</Label>
              <Input
                value={newReport.name}
                onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                placeholder="e.g., Q4 Revenue Analysis"
              />
            </div>
            <div>
              <Label>Select Metrics</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableMetrics.map(metric => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox
                      checked={newReport.metrics.includes(metric)}
                      onCheckedChange={() => toggleMetric(metric)}
                    />
                    <label className="text-sm capitalize">{metric}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Chart Type</Label>
              <Select value={newReport.chartType} onValueChange={(v: any) => setNewReport({ ...newReport, chartType: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomReportDialog(false)}>Cancel</Button>
            <Button onClick={createCustomReport}>Create Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FilterIcon className="h-4 w-4" />
              <span>Advanced Filters</span>
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
            <BusinessUnitFilter value={businessUnitFilter} onChange={setBusinessUnitFilter} />
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
                <SelectItem value="engagement">Engagement Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Viewing analytics data {dateRange.from && dateRange.to ? 'for selected period' : 'for all time'}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
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
              <h3 className="text-2xl font-bold text-foreground">{customers.length.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <ArrowUp className="h-4 w-4" />
                <span>+8.2%</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <Percent className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">5.6%</h3>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <ArrowUp className="h-4 w-4" />
                <span>+0.4pp</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">1.5%</h3>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <ArrowDown className="h-4 w-4" />
                <span>-0.8pp</span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue & Customers Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="customers" stroke="hsl(var(--accent))" name="Customers" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Customer Segments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Churn & Conversion Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="churnRate" stroke="#FF8042" strokeWidth={2} name="Churn Rate %" />
                  <Line type="monotone" dataKey="conversionRate" stroke="#00C49F" strokeWidth={2} name="Conversion Rate %" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Channel Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
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
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Cohort Retention Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cohort" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="retention_1m" fill="#0088FE" name="1 Month" />
                <Bar dataKey="retention_3m" fill="#00C49F" name="3 Months" />
                <Bar dataKey="retention_6m" fill="#FFBB28" name="6 Months" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">MRR</p>
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(5600000)}</h3>
              <p className="text-xs text-muted-foreground mt-1">Monthly Recurring Revenue</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">ARR</p>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(67200000)}</h3>
              <p className="text-xs text-muted-foreground mt-1">Annual Recurring Revenue</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">ARPU</p>
                <Users className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(6588)}</h3>
              <p className="text-xs text-muted-foreground mt-1">Average Revenue Per User</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Breakdown by Product</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <Activity className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">810,000</h3>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <ArrowUp className="h-4 w-4" />
                <span>+3.8%</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">New Customers</p>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">30,000</h3>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">CAC</p>
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(125)}</h3>
              <p className="text-xs text-muted-foreground mt-1">Customer Acquisition Cost</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">LTV</p>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(3750)}</h3>
              <p className="text-xs text-muted-foreground mt-1">Lifetime Value</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Customer Segment Performance</h3>
            <div className="space-y-4">
              {customerSegmentData.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{segment.segment}</h4>
                    <p className="text-sm text-muted-foreground">{segment.count.toLocaleString()} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(segment.revenue)}</p>
                    <p className="text-sm text-muted-foreground">Avg: {formatCurrency(segment.avgValue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Customer Growth</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorCustomers)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6 mt-6">
          {campaignPerformanceData.length > 0 ? (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Performance Overview</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                    <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                    <Bar dataKey="opened" fill="#ffc658" name="Opened" />
                    <Bar dataKey="clicked" fill="#ff8042" name="Clicked" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Conversion Funnel</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={campaignPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="converted" fill="hsl(var(--success))" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Campaign Data</h3>
              <p className="text-muted-foreground">Campaign analytics will appear here once campaigns are active</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-6">
          {customReports.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Custom Reports</h3>
              <p className="text-muted-foreground mb-4">Create custom reports to analyze specific metrics</p>
              <Button onClick={() => setCustomReportDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> Create Your First Report
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {customReports.map((report) => (
                <Card key={report.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{report.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCustomReports(customReports.filter(r => r.id !== report.id))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    {report.chartType === 'line' && (
                      <RechartsLineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {report.metrics.map((metric, idx) => (
                          <Line key={metric} type="monotone" dataKey={metric} stroke={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]} strokeWidth={2} />
                        ))}
                      </RechartsLineChart>
                    )}
                    {report.chartType === 'bar' && (
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {report.metrics.map((metric, idx) => (
                          <Bar key={metric} dataKey={metric} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]} />
                        ))}
                      </BarChart>
                    )}
                    {report.chartType === 'area' && (
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {report.metrics.map((metric, idx) => (
                          <Area key={metric} type="monotone" dataKey={metric} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]} stroke={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]} />
                        ))}
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
