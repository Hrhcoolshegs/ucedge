import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, FileCheck, CheckCircle, XCircle, Clock, Users, Activity } from 'lucide-react';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const actionTypeColors: Record<string, string> = {
  login: 'bg-blue-100 text-blue-800',
  campaign_launch: 'bg-emerald-100 text-emerald-800',
  journey_update: 'bg-teal-100 text-teal-800',
  segment_modify: 'bg-orange-100 text-orange-800',
  data_export: 'bg-amber-100 text-amber-800',
  settings_change: 'bg-gray-100 text-gray-800',
  approval: 'bg-blue-100 text-blue-800',
  user_action: 'bg-gray-100 text-gray-800',
};

export default function GovernanceLogs() {
  const { contentApprovals, activityLogs } = useData();
  const [contentSearch, setContentSearch] = useState('');
  const [contentStatus, setContentStatus] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [showExport, setShowExport] = useState(false);
  const [exportTab, setExportTab] = useState<'content' | 'activity'>('content');

  const filteredContent = useMemo(() => {
    return contentApprovals.filter(c => {
      if (contentStatus !== 'all' && c.status !== contentStatus) return false;
      if (contentSearch) {
        const q = contentSearch.toLowerCase();
        if (!c.contentPreview.toLowerCase().includes(q) && !c.submitter.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [contentApprovals, contentSearch, contentStatus]);

  const filteredActivity = useMemo(() => {
    return activityLogs.filter(a => {
      if (activityType !== 'all' && a.actionType !== activityType) return false;
      if (activitySearch) {
        const q = activitySearch.toLowerCase();
        if (!a.userName.toLowerCase().includes(q) && !a.resource.toLowerCase().includes(q) && !a.details.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activityLogs, activitySearch, activityType]);

  const pendingContent = contentApprovals.filter(c => c.status === 'pending').length;
  const approvedContent = contentApprovals.filter(c => c.status === 'approved').length;
  const rejectedContent = contentApprovals.filter(c => c.status === 'rejected').length;

  const contentExportCols = ['Submitter', 'Content', 'Channel', 'Status', 'Submitted', 'Reviewer', 'Reviewed'];
  const contentExportRows = filteredContent.map(c => [
    c.submitter, c.contentPreview, c.channel, c.status,
    c.submittedAt.toLocaleDateString(), c.reviewer || '-', c.reviewedAt?.toLocaleDateString() || '-',
  ]);

  const activityExportCols = ['Timestamp', 'User', 'Role', 'Action', 'Resource', 'Details'];
  const activityExportRows = filteredActivity.map(a => [
    a.timestamp.toLocaleString(), a.userName, a.userRole, a.actionType.replace('_', ' '),
    a.resource, a.details,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Governance Logs</h1>
          <p className="text-muted-foreground">Content approvals and platform activity tracking</p>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content Approvals</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
                <div><p className="text-2xl font-bold">{pendingContent}</p><p className="text-xs text-muted-foreground">Pending Review</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
                <div><p className="text-2xl font-bold">{approvedContent}</p><p className="text-xs text-muted-foreground">Approved</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-600" /></div>
                <div><p className="text-2xl font-bold">{rejectedContent}</p><p className="text-xs text-muted-foreground">Rejected</p></div>
              </div>
            </CardContent></Card>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={contentSearch} onChange={(e) => setContentSearch(e.target.value)} placeholder="Search content..." className="pl-9" />
            </div>
            <Select value={contentStatus} onValueChange={setContentStatus}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setExportTab('content'); setShowExport(true); }}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold text-muted-foreground">Submitter</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Content</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Channel</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Context</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Submitted</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Reviewer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs font-medium">{item.submitter}</td>
                      <td className="p-3 text-xs max-w-[250px]">
                        <p className="truncate">{item.contentPreview}</p>
                        {item.comments && <p className="text-red-500 text-[10px] mt-0.5 truncate">{item.comments}</p>}
                      </td>
                      <td className="p-3"><span className="text-xs capitalize bg-muted px-2 py-0.5 rounded-full">{item.channel}</span></td>
                      <td className="p-3 text-xs text-muted-foreground">{item.journeyName || item.campaignName || '-'}</td>
                      <td className="p-3 text-xs">{item.submittedAt.toLocaleDateString()}</td>
                      <td className="p-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>{item.status}</span></td>
                      <td className="p-3 text-xs">{item.reviewer || '-'}{item.reviewedAt && <span className="text-muted-foreground"> ({item.reviewedAt.toLocaleDateString()})</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={activitySearch} onChange={(e) => setActivitySearch(e.target.value)} placeholder="Search activity..." className="pl-9" />
            </div>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="campaign_launch">Campaign Launch</SelectItem>
                <SelectItem value="journey_update">Journey Update</SelectItem>
                <SelectItem value="segment_modify">Segment Modify</SelectItem>
                <SelectItem value="data_export">Data Export</SelectItem>
                <SelectItem value="settings_change">Settings Change</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
                <SelectItem value="user_action">User Action</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setExportTab('activity'); setShowExport(true); }}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold text-muted-foreground">Timestamp</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">User</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Action</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Resource</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivity.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
                      <td className="p-3 text-xs font-medium">{log.userName}</td>
                      <td className="p-3"><span className="text-xs capitalize bg-muted px-2 py-0.5 rounded-full">{log.userRole.replace('_', ' ')}</span></td>
                      <td className="p-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${actionTypeColors[log.actionType] || 'bg-gray-100 text-gray-800'}`}>{log.actionType.replace('_', ' ')}</span></td>
                      <td className="p-3 text-xs font-medium">{log.resource}</td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[300px] truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {showExport && (
        <ExportPreviewModal
          title={exportTab === 'content' ? 'Content Approvals Export' : 'Activity Logs Export'}
          columns={exportTab === 'content' ? contentExportCols : activityExportCols}
          rows={exportTab === 'content' ? contentExportRows : activityExportRows}
          onClose={() => setShowExport(false)}
          recordCount={exportTab === 'content' ? filteredContent.length : filteredActivity.length}
        />
      )}
    </div>
  );
}
