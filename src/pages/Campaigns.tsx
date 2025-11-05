import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { CampaignWizard } from '@/components/campaigns/CampaignWizard';
import { useCampaigns } from '@/contexts/CampaignsContext';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

export const Campaigns = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { campaigns } = useCampaigns();

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComplete = () => {
    setWizardOpen(false);
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

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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