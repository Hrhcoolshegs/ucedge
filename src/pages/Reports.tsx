import { useState, useMemo } from 'react';
import { TrendingUp, Users, DollarSign, Download, BarChart3, GitBranch, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function Reports() {
  const { journeys, customers, transactions, auditLogs } = useData();
  const [selectedJourney, setSelectedJourney] = useState(journeys[0]?.id || '');
  const [showExport, setShowExport] = useState<string | null>(null);

  const journey = journeys.find(j => j.id === selectedJourney);

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

  const activeCustomers = customers.filter(c => c.lifecycleStage === 'active').length;
  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);

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
      case 'churn':
        return {
          columns: ['Metric', 'Value'],
          rows: [['Churned', String(churnStats.churned)], ['Reactivated', String(churnStats.reactivated)], ['At Risk', String(churnStats.atRisk)], ['Churn Rate', churnStats.churnRate + '%'], ['Reactivation Rate', churnStats.reactivationRate + '%']],
        };
      default:
        return { columns: [], rows: [] };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Data-driven insights across journeys, campaigns, and customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><GitBranch className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{journeys.length}</p><p className="text-xs text-muted-foreground">Total Journeys</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Users className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold">{formatNumber(activeCustomers)}</p><p className="text-xs text-muted-foreground">Active Customers</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-teal-600" /></div>
            <div><p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Customer Lifecycle Distribution</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowExport('lifecycle')}><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={lifecycleTrend} cx="50%" cy="50%" outerRadius={100} dataKey="count" label={({ stage, percent }) => `${stage} ${(percent * 100).toFixed(0)}%`}>
                  {lifecycleTrend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Churn & Win-Back Summary</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowExport('churn')}><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 font-medium">Churn Rate</p>
                <p className="text-2xl font-bold text-red-700">{churnStats.churnRate}%</p>
                <p className="text-xs text-red-500">{formatNumber(churnStats.churned)} churned</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-600 font-medium">Reactivation Rate</p>
                <p className="text-2xl font-bold text-emerald-700">{churnStats.reactivationRate}%</p>
                <p className="text-xs text-emerald-500">{formatNumber(churnStats.reactivated)} won back</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-amber-600 font-medium">Currently At Risk</p>
              <p className="text-xl font-bold text-amber-700">{formatNumber(churnStats.atRisk)} customers</p>
              <p className="text-xs text-amber-500">Requiring intervention</p>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
