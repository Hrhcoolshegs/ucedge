import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUp, ArrowDown, Download, Filter as FilterIcon, X, Building2, AlertTriangle, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { BusinessUnitFilter } from '@/components/common/BusinessUnitFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { RiskSignal } from '@/types/governance';

export const Analytics = () => {
  const { customers, transactions } = useData();
  const [showExport, setShowExport] = useState(false);
  const [businessUnitFilter, setBusinessUnitFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [metricFilter, setMetricFilter] = useState('all');
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>([]);
  const [crossBusinessMetrics, setCrossBusinessMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup360Data = async () => {
      const [signalsResult, profilesResult, customersResult] = await Promise.all([
        supabase
          .from('risk_signals')
          .select(`
            id,
            customer_id,
            business_unit_id,
            signal_type,
            score,
            band,
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
          .select('id, name, entity_type')
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
          totalRiskSignals: signalsResult.data?.length || 0
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="group360">Group 360 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">

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
        </TabsContent>

        <TabsContent value="group360" className="space-y-6 mt-6">
          {loading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Cross-Business Coverage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-900">Total Customers</p>
                        <p className="text-2xl font-bold text-blue-600">{crossBusinessMetrics?.totalCustomers || 0}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-900">Cross-Business Customers</p>
                        <p className="text-2xl font-bold text-green-600">{crossBusinessMetrics?.crossBusinessCustomers || 0}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-8 w-8 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-900">Active Risk Signals</p>
                        <p className="text-2xl font-bold text-amber-600">{crossBusinessMetrics?.totalRiskSignals || 0}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  <p className="font-medium mb-2">Cross-Sell Opportunity</p>
                  <p>
                    {crossBusinessMetrics?.crossBusinessCustomers || 0} customers ({
                      crossBusinessMetrics?.totalCustomers > 0
                        ? ((crossBusinessMetrics.crossBusinessCustomers / crossBusinessMetrics.totalCustomers) * 100).toFixed(1)
                        : 0
                    }%) have relationships across multiple business units
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Performance by Business Unit</h3>
                {crossBusinessMetrics?.businessUnitCoverage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {crossBusinessMetrics.businessUnitCoverage.map((bu: any) => (
                      <Card key={bu.code} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">{bu.name}</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Profiles:</span>
                            <span className="font-bold">{bu.customers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Active:</span>
                            <span className="font-bold text-green-600">{bu.active}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Inactive:</span>
                            <span className="font-bold text-gray-600">{bu.customers - bu.active}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Risk Command Center</h3>
                </div>
                {riskSignals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No risk signals detected
                  </p>
                ) : (
                  <div className="space-y-3">
                    {riskSignals.slice(0, 10).map((signal) => (
                      <Card
                        key={signal.id}
                        className={`p-3 ${
                          signal.band === 'HIGH' ? 'border-l-4 border-l-red-500 bg-red-50' :
                          signal.band === 'MEDIUM' ? 'border-l-4 border-l-yellow-500 bg-yellow-50' :
                          'border-l-4 border-l-green-500 bg-green-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              signal.band === 'HIGH' ? 'destructive' :
                              signal.band === 'MEDIUM' ? 'secondary' :
                              'default'
                            }>
                              {signal.band}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{signal.signal_type}</Badge>
                            {signal.business_unit && (
                              <Badge variant="secondary" className="text-xs">
                                {signal.business_unit.code}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xl font-bold">{signal.score}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{signal.rationale}</p>
                      </Card>
                    ))}
                    {riskSignals.length > 10 && (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        Showing 10 of {riskSignals.length} risk signals
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};