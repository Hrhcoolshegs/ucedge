import { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp, Users, DollarSign, Download, BarChart3, GitBranch, Mail,
  ArrowUp, ArrowDown, Filter as FilterIcon, X, AlertTriangle, Activity,
  Target, Plus, MessageSquare, Send, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart,
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { BusinessUnitFilter } from '@/components/common/BusinessUnitFilter';
import { supabase } from '@/lib/supabase';
import { RiskSignal } from '@/types/governance';
import { parseNLPQuery, GeneratedReport } from '@/utils/nlpReportGenerator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

interface CustomReport {
  id: string;
  name: string;
  metrics: string[];
  filters: any;
  chartType: 'line' | 'bar' | 'pie' | 'area';
}

interface NLPMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Reports() {
  const { journeys, customers, transactions, auditLogs } = useData();
  const [selectedJourney, setSelectedJourney] = useState(journeys[0]?.id || '');
  const [showExport, setShowExport] = useState<string | null>(null);
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
  const [nlpMessages, setNlpMessages] = useState<NLPMessage[]>([
    { role: 'assistant', content: 'Hello! I can help you create custom reports using natural language. Try asking me something like "Show me revenue trends for the last 6 months" or "Compare customer segments by revenue".' }
  ]);
  const [nlpInput, setNlpInput] = useState('');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  const journey = journeys.find(j => j.id === selectedJourney);

  useEffect(() => {
    const fetchGroup360Data = async () => {
      if (!supabase) return;
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

  const funnelData = useMemo(() => {
    if (!journey) return [];
    return [
      { name: 'Entered', value: journey.analytics.totalEntered, fill: '#0ea5e9' },
      { name: 'Active', value: journey.analytics.totalActive + journey.analytics.totalCompleted, fill: '#06b6d4' },
      { name: 'Completed', value: journey.analytics.totalCompleted, fill: '#10b981' },
    ];
  }, [journey]);

  const channelPerf = useMemo(() => {
    if (!journey) return [];
    return journey.analytics.channelPerformance.map(cp => ({
      channel: cp.channel.charAt(0).toUpperCase() + cp.channel.slice(1),
      Sent: cp.sent,
      Delivered: cp.delivered,
      Opened: cp.opened,
      Clicked: cp.clicked,
      Conversions: cp.conversions,
    }));
  }, [journey]);

  const channelComparison = useMemo(() => {
    const allChannels: Record<string, { sent: number; delivered: number; opened: number; clicked: number; conversions: number }> = {};
    journeys.forEach(j => {
      j.analytics.channelPerformance.forEach(cp => {
        if (!allChannels[cp.channel]) allChannels[cp.channel] = { sent: 0, delivered: 0, opened: 0, clicked: 0, conversions: 0 };
        allChannels[cp.channel].sent += cp.sent;
        allChannels[cp.channel].delivered += cp.delivered;
        allChannels[cp.channel].opened += cp.opened;
        allChannels[cp.channel].clicked += cp.clicked;
        allChannels[cp.channel].conversions += cp.conversions;
      });
    });
    return Object.entries(allChannels).map(([ch, stats]) => ({
      channel: ch.charAt(0).toUpperCase() + ch.slice(1),
      'Delivery Rate': stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0,
      'Open Rate': stats.delivered > 0 ? Math.round((stats.opened / stats.delivered) * 100) : 0,
      'Click Rate': stats.opened > 0 ? Math.round((stats.clicked / stats.opened) * 100) : 0,
      'Conversion Rate': stats.sent > 0 ? Math.round((stats.conversions / stats.sent) * 100) : 0,
    }));
  }, [journeys]);

  const lifecycleTrend = useMemo(() => {
    const stages = ['new', 'active', 'loyal', 'at-risk', 'churned', 'reactivated'];
    const counts: Record<string, number> = {};
    stages.forEach(s => counts[s] = customers.filter(c => c.lifecycleStage === s).length);
    return stages.map(s => ({ stage: s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' '), count: counts[s] }));
  }, [customers]);

  const churnStats = useMemo(() => {
    const churned = customers.filter(c => c.lifecycleStage === 'churned').length;
    const reactivated = customers.filter(c => c.reactivationCount > 0).length;
    const atRisk = customers.filter(c => c.lifecycleStage === 'at-risk').length;
    return { churned, reactivated, atRisk, churnRate: ((churned / customers.length) * 100).toFixed(1), reactivationRate: churned > 0 ? ((reactivated / churned) * 100).toFixed(1) : '0' };
  }, [customers]);

  const monthlyData = [
    { month: 'Jul', revenue: 45000000, customers: 720000, transactions: 4500000, activeUsers: 680000, churnRate: 2.3, conversionRate: 4.2 },
    { month: 'Aug', revenue: 52000000, customers: 735000, transactions: 4520000, activeUsers: 698000, churnRate: 2.1, conversionRate: 4.5 },
    { month: 'Sep', revenue: 48000000, customers: 758000, transactions: 4800000, activeUsers: 720000, churnRate: 1.9, conversionRate: 4.8 },
    { month: 'Oct', revenue: 61000000, customers: 785000, transactions: 4900000, activeUsers: 745000, churnRate: 1.7, conversionRate: 5.1 },
    { month: 'Nov', revenue: 55000000, customers: 820000, transactions: 4950000, activeUsers: 780000, churnRate: 1.6, conversionRate: 5.3 },
    { month: 'Dec', revenue: 67000000, customers: 850000, transactions: 5000000, activeUsers: 810000, churnRate: 1.5, conversionRate: 5.6 }
  ];

  const customerSegmentData = [
    { segment: 'High Value', count: 15000, revenue: 45000000, avgValue: 3000 },
    { segment: 'Medium Value', count: 35000, revenue: 35000000, avgValue: 1000 },
    { segment: 'Low Value', count: 50000, revenue: 10000000, avgValue: 200 },
    { segment: 'At Risk', count: 8000, revenue: 5000000, avgValue: 625 },
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

  const campaignPerformanceData = crossBusinessMetrics?.campaigns?.map((c: any) => ({
    name: c.name.substring(0, 20),
    sent: c.sent || 0,
    delivered: c.delivered || 0,
    opened: c.opened || 0,
    clicked: c.clicked || 0,
    converted: c.converted || 0,
    revenue: c.revenue || 0,
  })) || [];

  const activeCustomers = customers.filter(c => c.lifecycleStage === 'active').length;
  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
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

  const handleNLPSubmit = () => {
    if (!nlpInput.trim()) return;

    const userMessage: NLPMessage = { role: 'user', content: nlpInput };
    setNlpMessages([...nlpMessages, userMessage]);

    setTimeout(() => {
      const generatedReport = parseNLPQuery(nlpInput, customers, transactions, journeys);

      if (generatedReport) {
        setGeneratedReports(prev => [generatedReport, ...prev]);
        const assistantResponse: NLPMessage = {
          role: 'assistant',
          content: `I've generated a report: "${generatedReport.title}". ${generatedReport.summary} The report is displayed below with both a chart and detailed table data. You can download it using the download button.`
        };
        setNlpMessages(prev => [...prev, assistantResponse]);
      } else {
        const assistantResponse: NLPMessage = {
          role: 'assistant',
          content: `I couldn't generate a specific report for that query. Try asking about: revenue trends, customer segments, lifecycle stages, churn analysis, top customers, journey performance, transaction volume, business units, retention, or customer lifetime value.`
        };
        setNlpMessages(prev => [...prev, assistantResponse]);
      }
    }, 800);

    setNlpInput('');
  };

  const downloadReport = (report: GeneratedReport) => {
    let csvContent = `${report.title}\nGenerated: ${report.timestamp.toLocaleString()}\nQuery: ${report.query}\n\n`;
    csvContent += `Summary:\n${report.summary}\n\n`;
    csvContent += `Data Table:\n`;
    csvContent += report.tableData.columns.join(',') + '\n';
    csvContent += report.tableData.rows.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getExportData = (section: string): { columns: string[]; rows: string[][] } => {
    switch (section) {
      case 'journey':
        return {
          columns: ['Stage', 'Count'],
          rows: funnelData.map(d => [d.name, String(d.value)]),
        };
      case 'channel':
        return {
          columns: ['Channel', 'Delivery Rate', 'Open Rate', 'Click Rate', 'Conversion Rate'],
          rows: channelComparison.map(c => [c.channel, `${c['Delivery Rate']}%`, `${c['Open Rate']}%`, `${c['Click Rate']}%`, `${c['Conversion Rate']}%`]),
        };
      case 'lifecycle':
        return {
          columns: ['Stage', 'Count'],
          rows: lifecycleTrend.map(l => [l.stage, String(l.count)]),
        };
      case 'analytics':
        return {
          columns: ['Month', 'Revenue', 'Customers', 'Transactions', 'Active Users', 'Churn Rate', 'Conversion Rate'],
          rows: monthlyData.map(m => [
            m.month,
            formatCurrency(m.revenue),
            m.customers.toLocaleString(),
            m.transactions.toLocaleString(),
            m.activeUsers.toLocaleString(),
            `${m.churnRate}%`,
            `${m.conversionRate}%`
          ]),
        };
      default:
        return { columns: [], rows: [] };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics, insights, and custom reporting with NLP</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCustomReportDialog(true)}>
            <Plus className="h-4 w-4 mr-1" /> Custom Report
          </Button>
        </div>
      </div>

      {showExport && (() => {
        const { columns, rows } = getExportData(showExport);
        return (
          <ExportPreviewModal
            title={`${showExport.charAt(0).toUpperCase() + showExport.slice(1)} Report Export`}
            columns={columns}
            rows={rows}
            onClose={() => setShowExport(null)}
            recordCount={rows.length}
          />
        );
      })()}

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
        </div>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="journeys">Journeys</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="nlp">NLP Builder</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
                <div><p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success mt-2">
                <ArrowUp className="h-4 w-4" />
                <span>+12.5%</span>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
                <div><p className="text-2xl font-bold">{formatNumber(customers.length)}</p><p className="text-xs text-muted-foreground">Total Customers</p></div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success mt-2">
                <ArrowUp className="h-4 w-4" />
                <span>+8.2%</span>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><Activity className="h-5 w-5 text-teal-600" /></div>
                <div><p className="text-2xl font-bold">{formatNumber(activeCustomers)}</p><p className="text-xs text-muted-foreground">Active Customers</p></div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success mt-2">
                <ArrowUp className="h-4 w-4" />
                <span>+3.8%</span>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
                <div><p className="text-2xl font-bold">{churnStats.churnRate}%</p><p className="text-xs text-muted-foreground">Churn Rate</p></div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success mt-2">
                <ArrowDown className="h-4 w-4" />
                <span>-0.8pp</span>
              </div>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Revenue & Customer Trends</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowExport('analytics')}><Download className="h-3.5 w-3.5" /></Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="customers" stroke="hsl(var(--accent))" name="Customers" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Customer Lifecycle Distribution</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowExport('lifecycle')}><Download className="h-3.5 w-3.5" /></Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={lifecycleTrend} cx="50%" cy="50%" outerRadius={100} dataKey="count" label={({ stage, percent }) => `${stage} ${(percent * 100).toFixed(0)}%`}>
                    {lifecycleTrend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Churn & Conversion Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="churnRate" stroke="#FF8042" strokeWidth={2} name="Churn Rate %" />
                <Line type="monotone" dataKey="conversionRate" stroke="#00C49F" strokeWidth={2} name="Conversion Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><GitBranch className="h-5 w-5 text-blue-600" /></div>
                <div><p className="text-2xl font-bold">{journeys.length}</p><p className="text-xs text-muted-foreground">Total Journeys</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Users className="h-5 w-5 text-emerald-600" /></div>
                <div><p className="text-2xl font-bold">{formatNumber(activeCustomers)}</p><p className="text-xs text-muted-foreground">Active in Journeys</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Mail className="h-5 w-5 text-amber-600" /></div>
                <div><p className="text-2xl font-bold">{formatNumber(auditLogs.length)}</p><p className="text-xs text-muted-foreground">Communications</p></div>
              </div>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Journey Execution Funnel</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedJourney} onValueChange={setSelectedJourney}>
                      <SelectTrigger className="w-52 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {journeys.map(j => <SelectItem key={j.id} value={j.id}>{j.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => setShowExport('journey')}><Download className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Channel Performance Comparison</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowExport('channel')}><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={channelComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Delivery Rate" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Open Rate" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Click Rate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Conversion Rate" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
            <h3 className="text-lg font-semibold text-foreground mb-4">Cohort Retention Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cohort" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
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
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="product" type="category" width={150} tick={{ fontSize: 11 }} />
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
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
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
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
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
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
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

        <TabsContent value="nlp" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">NLP Report Builder</h3>
                <p className="text-sm text-muted-foreground">Create reports using natural language</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
                {nlpMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <div className="flex items-start gap-2">
                        {msg.role === 'assistant' && <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={nlpInput}
                  onChange={(e) => setNlpInput(e.target.value)}
                  placeholder="Ask me to create a report, e.g., 'Show me revenue trends for high-value customers' or 'Compare campaign performance across business units'"
                  className="flex-1 min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleNLPSubmit();
                    }
                  }}
                />
                <Button onClick={handleNLPSubmit} className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Example queries:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Show me revenue trends",
                    "Analyze customer lifecycle stages",
                    "Show top 10 customers by revenue",
                    "Generate churn analysis report",
                    "Show customer lifetime value distribution",
                    "Analyze journey performance",
                    "Show transaction volume trends"
                  ].map((example, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => setNlpInput(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {generatedReports.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Generated Reports</h3>
              {generatedReports.map((report) => (
                <Card key={report.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{report.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{report.summary}</p>
                      <p className="text-xs text-muted-foreground mt-1">Generated: {report.timestamp.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download CSV
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setGeneratedReports(generatedReports.filter(r => r.id !== report.id))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-semibold mb-3">Visualization</h5>
                      <ResponsiveContainer width="100%" height={300}>
                        {report.chartType === 'bar' && (
                          <BarChart data={report.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={Object.keys(report.chartData[0] || {})[0]} tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey={Object.keys(report.chartData[0] || {})[1]} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        )}
                        {report.chartType === 'line' && (
                          <LineChart data={report.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={Object.keys(report.chartData[0] || {})[0]} tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey={Object.keys(report.chartData[0] || {})[1]} stroke="hsl(var(--primary))" strokeWidth={2} />
                          </LineChart>
                        )}
                        {report.chartType === 'pie' && (
                          <PieChart>
                            <Pie
                              data={report.chartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey={Object.keys(report.chartData[0] || {})[1]}
                              label={({ name, value }) => `${name || Object.values(report.chartData[0] || {})[0]}: ${value}`}
                            >
                              {report.chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        )}
                        {report.chartType === 'table' && (
                          <div className="text-center text-muted-foreground py-20">
                            Table view - see data on the right
                          </div>
                        )}
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold mb-3">Data Table</h5>
                      <div className="border rounded-lg max-h-[300px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {report.tableData.columns.map((col, idx) => (
                                <TableHead key={idx} className="font-semibold">{col}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {report.tableData.rows.map((row, rowIdx) => (
                              <TableRow key={rowIdx}>
                                {row.map((cell, cellIdx) => (
                                  <TableCell key={cellIdx}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-6">
          {customReports.length === 0 ? (
            <Card className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {report.metrics.map((metric, idx) => (
                          <Line key={metric} type="monotone" dataKey={metric} stroke={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]} strokeWidth={2} />
                        ))}
                      </LineChart>
                    )}
                    {report.chartType === 'bar' && (
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {report.metrics.map((metric, idx) => (
                          <Bar key={metric} dataKey={metric} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]} />
                        ))}
                      </BarChart>
                    )}
                    {report.chartType === 'area' && (
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
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
}
