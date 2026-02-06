import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Search, Download, Mail, MessageSquare, Bell, Send, Shield, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import { ConsentRecord } from '@/types/audit';

const COLORS = ['#10b981', '#ef4444', '#94a3b8'];

export default function ConsentManagement() {
  const { consentRecords, customers } = useData();
  const [search, setSearch] = useState('');
  const [selectedConsent, setSelectedConsent] = useState<ConsentRecord | null>(null);
  const [showExport, setShowExport] = useState(false);

  const records = useMemo(() => Array.from(consentRecords.values()), [consentRecords]);

  const channelStats = useMemo(() => {
    const stats = { email: { yes: 0, no: 0 }, sms: { yes: 0, no: 0 }, push: { yes: 0, no: 0 }, whatsapp: { yes: 0, no: 0 } };
    records.forEach(r => {
      if (r.channels.email.marketing.consented) stats.email.yes++; else stats.email.no++;
      if (r.channels.sms.marketing.consented) stats.sms.yes++; else stats.sms.no++;
      if (r.channels.push.marketing.consented) stats.push.yes++; else stats.push.no++;
      if (r.channels.whatsapp.marketing.consented) stats.whatsapp.yes++; else stats.whatsapp.no++;
    });
    return stats;
  }, [records]);

  const channelChartData = useMemo(() => [
    { channel: 'Email', 'Opted In': channelStats.email.yes, 'Opted Out': channelStats.email.no },
    { channel: 'SMS', 'Opted In': channelStats.sms.yes, 'Opted Out': channelStats.sms.no },
    { channel: 'Push', 'Opted In': channelStats.push.yes, 'Opted Out': channelStats.push.no },
    { channel: 'WhatsApp', 'Opted In': channelStats.whatsapp.yes, 'Opted Out': channelStats.whatsapp.no },
  ], [channelStats]);

  const freqData = useMemo(() => {
    const freq = { daily: 0, weekly: 0, monthly: 0 };
    records.forEach(r => freq[r.preferences.frequency]++);
    return [
      { name: 'Daily', value: freq.daily },
      { name: 'Weekly', value: freq.weekly },
      { name: 'Monthly', value: freq.monthly },
    ];
  }, [records]);

  const filteredCustomers = useMemo(() => {
    if (!search) return customers.slice(0, 50);
    const q = search.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 50);
  }, [customers, search]);

  const quietHoursCount = records.filter(r => r.preferences.quietHours.enabled).length;
  const totalOptIn = channelStats.email.yes + channelStats.sms.yes + channelStats.push.yes + channelStats.whatsapp.yes;
  const totalPossible = records.length * 4;

  const getCustomerName = (customerId: string) => customers.find(c => c.id === customerId)?.name || customerId;
  const getCustomerEmail = (customerId: string) => customers.find(c => c.id === customerId)?.email || '';

  const exportColumns = ['Customer ID', 'Email Mkt', 'SMS Mkt', 'Push Mkt', 'WhatsApp Mkt', 'Frequency', 'Quiet Hours'];
  const exportRows = records.slice(0, 100).map(r => [
    r.customerId,
    r.channels.email.marketing.consented ? 'Yes' : 'No',
    r.channels.sms.marketing.consented ? 'Yes' : 'No',
    r.channels.push.marketing.consented ? 'Yes' : 'No',
    r.channels.whatsapp.marketing.consented ? 'Yes' : 'No',
    r.preferences.frequency,
    r.preferences.quietHours.enabled ? 'Yes' : 'No',
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consent Management</h1>
          <p className="text-muted-foreground">Channel consent tracking and preference management</p>
        </div>
        <Button variant="outline" onClick={() => setShowExport(true)}>
          <Download className="h-4 w-4 mr-1" /> Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold">{((totalOptIn / totalPossible) * 100).toFixed(0)}%</p><p className="text-xs text-muted-foreground">Overall Opt-In Rate</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Mail className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{records.length > 0 ? ((channelStats.email.yes / records.length) * 100).toFixed(0) : 0}%</p><p className="text-xs text-muted-foreground">Email Opt-In</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-2xl font-bold">{records.length > 0 ? ((quietHoursCount / records.length) * 100).toFixed(0) : 0}%</p><p className="text-xs text-muted-foreground">Quiet Hours Enabled</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><Shield className="h-5 w-5 text-teal-600" /></div>
            <div><p className="text-2xl font-bold">{records.length}</p><p className="text-xs text-muted-foreground">Records Tracked</p></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Channel Opt-In vs Opt-Out</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channelChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Opted In" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Opted Out" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Frequency Preferences</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={freqData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {freqData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Consent Lookup</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 font-semibold text-muted-foreground">Customer</th>
                  <th className="text-center p-2 font-semibold text-muted-foreground">Email</th>
                  <th className="text-center p-2 font-semibold text-muted-foreground">SMS</th>
                  <th className="text-center p-2 font-semibold text-muted-foreground">Push</th>
                  <th className="text-center p-2 font-semibold text-muted-foreground">WhatsApp</th>
                  <th className="text-center p-2 font-semibold text-muted-foreground">Frequency</th>
                  <th className="text-center p-2 font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => {
                  const consent = consentRecords.get(c.id);
                  if (!consent) return null;
                  return (
                    <tr key={c.id} className="border-b hover:bg-muted/30">
                      <td className="p-2">
                        <p className="font-medium text-xs">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.email}</p>
                      </td>
                      <td className="p-2 text-center">{consent.channels.email.marketing.consented ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}</td>
                      <td className="p-2 text-center">{consent.channels.sms.marketing.consented ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}</td>
                      <td className="p-2 text-center">{consent.channels.push.marketing.consented ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}</td>
                      <td className="p-2 text-center">{consent.channels.whatsapp.marketing.consented ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}</td>
                      <td className="p-2 text-center"><span className="text-xs capitalize bg-muted px-2 py-0.5 rounded-full">{consent.preferences.frequency}</span></td>
                      <td className="p-2 text-center">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedConsent(consent)}>View</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedConsent} onOpenChange={() => setSelectedConsent(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Consent Proof - {getCustomerName(selectedConsent?.customerId || '')}</DialogTitle></DialogHeader>
          {selectedConsent && (
            <div className="space-y-4 text-sm">
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Customer ID: <span className="font-mono">{selectedConsent.customerId}</span></p>
                <p className="text-xs text-muted-foreground">Email: {getCustomerEmail(selectedConsent.customerId)}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Channel Consent Status</p>
                {(['email', 'sms', 'push', 'whatsapp'] as const).map(ch => {
                  const mkt = selectedConsent.channels[ch].marketing;
                  const txn = selectedConsent.channels[ch].transactional;
                  return (
                    <div key={ch} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="capitalize font-medium">{ch}</span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          {mkt.consented ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}
                          Marketing
                        </span>
                        <span className="flex items-center gap-1">
                          {txn.consented ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}
                          Transactional
                        </span>
                        <span className="text-muted-foreground capitalize">{mkt.method}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Preferences</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Frequency:</span> <span className="capitalize font-medium">{selectedConsent.preferences.frequency}</span></div>
                  <div><span className="text-muted-foreground">Quiet Hours:</span> <span className="font-medium">{selectedConsent.preferences.quietHours.enabled ? `${selectedConsent.preferences.quietHours.start} - ${selectedConsent.preferences.quietHours.end}` : 'Disabled'}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Topics:</span> <span className="font-medium">{selectedConsent.preferences.topics.join(', ')}</span></div>
                </div>
              </div>

              {selectedConsent.history.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Consent History</p>
                  <div className="space-y-2">
                    {selectedConsent.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium capitalize">{h.action.replace('_', ' ')} - {h.channel}</p>
                          <p className="text-muted-foreground">{h.timestamp.toLocaleDateString()} via {h.source}</p>
                          {h.previousState !== undefined && (
                            <p className="text-muted-foreground">{h.previousState ? 'Opted In' : 'Opted Out'} &rarr; {h.newState ? 'Opted In' : 'Opted Out'}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showExport && (
        <ExportPreviewModal
          title="Consent Records Export"
          columns={exportColumns}
          rows={exportRows}
          onClose={() => setShowExport(false)}
          containsPII={true}
          recordCount={records.length}
        />
      )}
    </div>
  );
}
