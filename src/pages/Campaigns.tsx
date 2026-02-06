import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Send, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { CampaignWizard } from '@/components/campaigns/CampaignWizard';
import { useCampaigns } from '@/contexts/CampaignsContext';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { Campaign } from '@/types/campaign';
import { RangeFilter, NumericRange } from '@/components/common/RangeFilter';
import { Card } from '@/components/ui/card';

export const Campaigns = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [roiRange, setRoiRange] = useState<NumericRange>({ min: undefined, max: undefined });
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { campaigns, updateCampaign, deleteCampaign } = useCampaigns();
  const { toast } = useToast();

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.goal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;

    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;

    const matchesRoi = (roiRange.min === undefined || campaign.roi >= roiRange.min) &&
                        (roiRange.max === undefined || campaign.roi <= roiRange.max);

    return matchesSearch && matchesStatus && matchesType && matchesChannel && matchesRoi;
  });

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' ||
    channelFilter !== 'all' || roiRange.min !== undefined || roiRange.max !== undefined;

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setChannelFilter('all');
    setRoiRange({ min: undefined, max: undefined });
  };

  const handleComplete = () => {
    setWizardOpen(false);
    setEditingCampaign(null);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setWizardOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCampaign(id);
      toast({
        title: 'Campaign deleted',
        description: `"${name}" has been removed.`,
      });
    }
  };

  const handleTrigger = (campaign: Campaign) => {
    if (campaign.status === 'active') {
      toast({
        title: 'Campaign already running',
        description: `"${campaign.name}" is already active.`,
      });
      return;
    }
    
    updateCampaign(campaign.id, { status: 'active' });
    toast({
      title: 'Campaign triggered',
      description: `"${campaign.name}" has been activated.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and track marketing campaigns</p>
        </div>
        <Button onClick={() => setWizardOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
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
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="lifecycle">Lifecycle</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="retention">Retention</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>

            <RangeFilter
              value={roiRange}
              onChange={setRoiRange}
              label="ROI Multiplier"
              min={0}
              max={10}
              step={0.1}
              suffix="x"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
        </div>
      </Card>

      {/* Campaigns Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Campaign Name</th>
                <th className="text-left p-4 font-semibold text-foreground">Type</th>
                <th className="text-left p-4 font-semibold text-foreground">Target</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-right p-4 font-semibold text-foreground">Sent</th>
                <th className="text-right p-4 font-semibold text-foreground">Opened</th>
                <th className="text-right p-4 font-semibold text-foreground">Clicked</th>
                <th className="text-right p-4 font-semibold text-foreground">Converted</th>
                <th className="text-right p-4 font-semibold text-foreground">ROI</th>
                <th className="text-right p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">{campaign.goal}</div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={campaign.type as any} variant="type" />
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-foreground">{campaign.targetAudience}</div>
                      {campaign.lifecycleTarget && campaign.lifecycleTarget !== 'all' && (
                        <LifecycleBadge stage={campaign.lifecycleTarget} size="sm" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={campaign.status as any} />
                  </td>
                  <td className="p-4 text-right text-foreground">{campaign.sent.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <div className="text-foreground">{campaign.opened.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(campaign.opened / campaign.sent)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-foreground">{campaign.clicked.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(campaign.clicked / campaign.sent)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-foreground">{campaign.converted.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(campaign.converted / campaign.sent)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-semibold ${
                      campaign.roi > 2 ? 'text-success' :
                      campaign.roi > 1 ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {campaign.roi.toFixed(1)}x
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(campaign)}
                        title="Edit campaign"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTrigger(campaign)}
                        title="Trigger campaign"
                        disabled={campaign.status === 'active'}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(campaign.id, campaign.name)}
                        title="Delete campaign"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CampaignWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onComplete={handleComplete} />
    </div>
  );
};