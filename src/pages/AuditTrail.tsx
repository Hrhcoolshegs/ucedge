import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Search, Mail, MessageSquare, Bell, Send, Smartphone, Eye, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { CommunicationAuditLog } from '@/types/audit';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';

const channelIcons: Record<string, typeof Mail> = {
  email: Mail, sms: MessageSquare, push: Bell, whatsapp: Send, in_app: Smartphone,
};

const statusColors: Record<string, string> = {
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  bounced: 'bg-orange-100 text-orange-800',
  opted_out: 'bg-gray-100 text-gray-800',
};

export default function AuditTrail() {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');
  const [detailLog, setDetailLog] = useState<CommunicationAuditLog | null>(null);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => {
    return auditLogs.filter(log => {
      if (channelFilter !== 'all' && log.channel !== channelFilter) return false;
      if (statusFilter !== 'all' && log.deliveryStatus !== statusFilter) return false;
      if (triggerFilter !== 'all' && log.triggerType !== triggerFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!log.customerName.toLowerCase().includes(q) && !log.customerId.toLowerCase().includes(q) && !log.messageContent.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [auditLogs, search, channelFilter, statusFilter, triggerFilter]);

  const deliveredCount = auditLogs.filter(l => l.deliveryStatus === 'delivered').length;
  const failedCount = auditLogs.filter(l => l.deliveryStatus === 'failed' || l.deliveryStatus === 'bounced').length;
  const gdprCount = auditLogs.filter(l => l.gdprCompliant).length;

  const exportColumns = ['Timestamp', 'Customer', 'Channel', 'Trigger', 'Status', 'Journey', 'Campaign', 'Initiated By', 'Approved By'];
  const exportRows = filtered.slice(0, 100).map(l => [
    l.timestamp.toLocaleString(), l.customerName, l.channel, l.triggerType, l.deliveryStatus,
    l.journeyName || '-', l.campaignName || '-', l.initiatedBy, l.approvedBy || '-',
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground">Complete communication audit log with compliance tracking</p>
        </div>
        <Button variant="outline" onClick={() => setShowExport(true)}>
          <Download className="h-4 w-4 mr-1" /> Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Shield className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{auditLogs.length}</p><p className="text-xs text-muted-foreground">Total Logs</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold">{deliveredCount}</p><p className="text-xs text-muted-foreground">Delivered</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{failedCount}</p><p className="text-xs text-muted-foreground">Failed/Bounced</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><Shield className="h-5 w-5 text-teal-600" /></div>
            <div><p className="text-2xl font-bold">{gdprCount}</p><p className="text-xs text-muted-foreground">GDPR Compliant</p></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer..." className="pl-9" />
        </div>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Channel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="in_app">In-App</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
            <SelectItem value="opted_out">Opted Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={triggerFilter} onValueChange={setTriggerFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Trigger" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Triggers</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automated">Automated</SelectItem>
            <SelectItem value="event_based">Event Based</SelectItem>
            <SelectItem value="journey">Journey</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Timestamp</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Channel</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Message</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Trigger</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Initiated By</th>
                <th className="text-left p-3 font-semibold text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((log) => {
                const ChIcon = channelIcons[log.channel] || Mail;
                return (
                  <tr key={log.auditId} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-xs whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
                    <td className="p-3">
                      <p className="font-medium text-xs">{log.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{log.customerId}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <ChIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs capitalize">{log.channel}</span>
                      </div>
                    </td>
                    <td className="p-3 max-w-[200px]">
                      <p className="text-xs truncate">{log.messageContent}</p>
                    </td>
                    <td className="p-3">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">{log.triggerType.replace('_', ' ')}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[log.deliveryStatus]}`}>
                        {log.deliveryStatus}
                      </span>
                    </td>
                    <td className="p-3 text-xs">{log.initiatedBy}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => setDetailLog(log)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div className="p-3 text-center text-xs text-muted-foreground border-t">
            Showing 50 of {filtered.length} records
          </div>
        )}
      </Card>

      <Dialog open={!!detailLog} onOpenChange={() => setDetailLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Audit Log Detail</DialogTitle></DialogHeader>
          {detailLog && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Audit ID</p><p className="font-mono text-xs">{detailLog.auditId}</p></div>
                <div><p className="text-xs text-muted-foreground">Timestamp</p><p>{detailLog.timestamp.toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{detailLog.customerName}</p><p className="text-xs text-muted-foreground">{detailLog.customerEmail}</p></div>
                <div><p className="text-xs text-muted-foreground">Channel</p><p className="capitalize">{detailLog.channel}</p></div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-1">Full Message Content</p>
                <div className="bg-muted rounded-lg p-3 text-sm">{detailLog.messageContent}</div>
              </div>
              {detailLog.subject && (
                <div><p className="text-xs text-muted-foreground">Subject</p><p>{detailLog.subject}</p></div>
              )}
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div><p className="text-xs text-muted-foreground">Delivery Status</p><p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[detailLog.deliveryStatus]}`}>{detailLog.deliveryStatus}</span></p></div>
                <div><p className="text-xs text-muted-foreground">Trigger Type</p><p className="capitalize">{detailLog.triggerType.replace('_', ' ')}</p></div>
                {detailLog.journeyName && <div><p className="text-xs text-muted-foreground">Journey</p><p>{detailLog.journeyName}</p></div>}
                {detailLog.campaignName && <div><p className="text-xs text-muted-foreground">Campaign</p><p>{detailLog.campaignName}</p></div>}
                <div><p className="text-xs text-muted-foreground">Template</p><p className="font-mono text-xs">{detailLog.templateId} ({detailLog.templateVersion})</p></div>
                <div><p className="text-xs text-muted-foreground">Content Hash</p><p className="font-mono text-xs">{detailLog.contentHash}</p></div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-2">Consent Status at Send Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(detailLog.consentStatus).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      {val ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                      <span className="text-xs capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div><p className="text-xs text-muted-foreground">GDPR Compliant</p><p>{detailLog.gdprCompliant ? 'Yes' : 'No'}</p></div>
                <div><p className="text-xs text-muted-foreground">Data Residency</p><p>{detailLog.dataResidency}</p></div>
                <div><p className="text-xs text-muted-foreground">Initiated By</p><p>{detailLog.initiatedBy}</p></div>
                <div><p className="text-xs text-muted-foreground">Approved By</p><p>{detailLog.approvedBy || 'N/A'}</p></div>
              </div>
              {detailLog.failureReason && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs font-medium text-red-800">Failure Reason</p>
                    <p className="text-xs text-red-600">{detailLog.failureReason}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showExport && (
        <ExportPreviewModal
          title="Audit Trail Export"
          columns={exportColumns}
          rows={exportRows}
          onClose={() => setShowExport(false)}
          containsPII={true}
          recordCount={filtered.length}
        />
      )}
    </div>
  );
}
