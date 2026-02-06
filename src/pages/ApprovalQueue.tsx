import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ClipboardCheck, Check, X, Clock, Mail, MessageSquare, Bell, Search, AlertTriangle } from 'lucide-react';

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
};

const typeLabels: Record<string, string> = {
  journey_action: 'Journey Action',
  campaign_launch: 'Campaign Launch',
  data_export: 'Data Export',
};

export default function ApprovalQueue() {
  const { pendingApprovals, approveAction, rejectAction } = useData();
  const { user } = useAuth();
  const canApprove = usePermission('can_approve_actions');
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = pendingApprovals
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return a.customerName.toLowerCase().includes(q) || a.proposedAction.toLowerCase().includes(q) || (a.journeyName || '').toLowerCase().includes(q);
    });

  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;
  const approvedCount = pendingApprovals.filter(a => a.status === 'approved').length;
  const rejectedCount = pendingApprovals.filter(a => a.status === 'rejected').length;

  const handleApprove = (id: string) => {
    if (user?.name) approveAction(id, user.name);
  };

  const handleReject = () => {
    if (rejectDialog && user?.name) {
      rejectAction(rejectDialog, user.name, rejectReason);
      setRejectDialog(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Approval Queue</h1>
        <p className="text-muted-foreground">Review and approve pending actions across journeys and campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-2xl font-bold">{pendingCount}</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Check className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold">{approvedCount}</p><p className="text-xs text-muted-foreground">Approved</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><X className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold">{rejectedCount}</p><p className="text-xs text-muted-foreground">Rejected</p></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search approvals..." className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((approval) => {
          const ChIcon = channelIcons[approval.channel] || Mail;
          const statusColors: Record<string, string> = {
            pending: 'bg-amber-100 text-amber-800',
            approved: 'bg-emerald-100 text-emerald-800',
            rejected: 'bg-red-100 text-red-800',
          };

          return (
            <Card key={approval.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <ChIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-foreground">{approval.proposedAction}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[approval.status]}`}>
                          {approval.status}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                          {typeLabels[approval.type]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Customer: <span className="font-medium text-foreground">{approval.customerName}</span>
                        {approval.journeyName && <> | Journey: <span className="font-medium text-foreground">{approval.journeyName}</span></>}
                        {approval.campaignName && <> | Campaign: <span className="font-medium text-foreground">{approval.campaignName}</span></>}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{approval.contentPreview}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested by {approval.requestedBy} on {approval.requestedAt.toLocaleDateString()}
                        {approval.reviewedBy && <> | Reviewed by {approval.reviewedBy}</>}
                      </p>
                      {approval.rejectionReason && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {approval.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                  {approval.status === 'pending' && canApprove && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50" onClick={() => handleApprove(approval.id)}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => setRejectDialog(approval.id)}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No approvals found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Approval</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-sm font-medium">Reason for Rejection</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Please provide a reason..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
