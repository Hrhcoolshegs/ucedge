import { MetricCard } from '@/components/common/MetricCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { useCampaigns } from '@/contexts/CampaignsContext';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Play, Send, MailOpen, MousePointer, CheckCircle, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';

export const MarketingTab = () => {
  const { campaigns } = useCampaigns();

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
  const totalConverted = campaigns.reduce((sum, c) => sum + c.converted, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const avgROI = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length : 0;
  
  const winBackCampaigns = campaigns.filter(c => c.isWinBackCampaign);
  const winBackSuccess = winBackCampaigns.reduce((sum, c) => sum + c.reactivationCount, 0);
  const winBackSent = winBackCampaigns.reduce((sum, c) => sum + c.sent, 0);
  const winBackRate = winBackSent > 0 ? (winBackSuccess / winBackSent) * 100 : 0;

  const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
  const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Campaign Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Campaigns"
          value={activeCampaigns.toString()}
          icon={Play}
          iconColor="text-primary"
          borderColor="border-t-primary"
          explanation="Number of campaigns currently running and actively sending messages to customers. Monitor this to ensure balanced campaign frequency and avoid message fatigue."
        />
        <MetricCard
          title="Total Sent This Month"
          value={totalSent.toLocaleString()}
          change={12}
          icon={Send}
          iconColor="text-secondary"
          borderColor="border-t-secondary"
          explanation="Total number of messages sent across all campaigns this month. Includes emails, SMS, push notifications, and other channels. Track sending volume to optimize messaging frequency."
        />
        <MetricCard
          title="Avg Open Rate"
          value={formatPercentage(avgOpenRate / 100)}
          icon={MailOpen}
          iconColor="text-accent"
          borderColor="border-t-accent"
          explanation="Average percentage of recipients who opened campaign messages. Industry benchmark is 20-30% for emails. Higher rates indicate compelling subject lines and relevant targeting."
        />
        <MetricCard
          title="Avg Click Rate"
          value={formatPercentage(avgClickRate / 100)}
          change={3}
          icon={MousePointer}
          iconColor="text-primary"
          borderColor="border-t-primary"
          explanation="Average percentage of recipients who clicked links in campaign messages. Typical rate is 2-5% for emails. Higher rates show engaging content and strong calls-to-action."
        />
        <MetricCard
          title="Total Conversions"
          value={totalConverted.toLocaleString()}
          icon={CheckCircle}
          iconColor="text-success"
          borderColor="border-t-success"
          explanation="Number of customers who completed the desired action (purchase, sign-up, deposit) after receiving a campaign message. This is the ultimate measure of campaign effectiveness."
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={22.7}
          icon={DollarSign}
          iconColor="text-secondary"
          borderColor="border-t-secondary"
          explanation="Total revenue directly attributed to marketing campaigns this month. Calculated by tracking transactions from campaign recipients. Use this to calculate ROI and justify marketing spend."
        />
        <MetricCard
          title="Avg ROI"
          value={`${avgROI.toFixed(1)}x`}
          icon={TrendingUp}
          iconColor="text-secondary"
          borderColor="border-t-secondary"
          explanation="Average Return on Investment across all campaigns. A 3x ROI means every ₦1 spent generates ₦3 in revenue. Benchmark is 3-5x for successful campaigns. Optimize low-performing campaigns."
        />
        <MetricCard
          title="Win-Back Success Rate"
          value={formatPercentage(winBackRate / 100)}
          icon={RefreshCw}
          iconColor="text-purple-600"
          borderColor="border-t-purple-600"
          explanation="Percentage of inactive customers who were successfully reactivated through win-back campaigns. Industry average is 10-15%. Track this to measure retention campaign effectiveness."
        />
      </div>

      {/* Campaign List Table */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Campaign Name</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Type</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Target</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">Sent</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">Opened</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">Clicked</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.slice(0, 20).map((campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{campaign.name}</div>
                      {campaign.goal && (
                        <div className="text-xs text-muted-foreground">{campaign.goal}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={campaign.type as any} variant="type" />
                  </td>
                  <td className="py-3">
                    <div className="space-y-1">
                      <div className="text-sm text-foreground">{campaign.targetAudience}</div>
                      {campaign.lifecycleTarget && campaign.lifecycleTarget !== 'all' && (
                        <LifecycleBadge stage={campaign.lifecycleTarget} size="sm" />
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={campaign.status as any} />
                  </td>
                  <td className="py-3 text-right text-sm text-foreground">
                    {campaign.sent.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <div className="text-sm text-foreground">{campaign.opened.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(campaign.opened / campaign.sent)}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="text-sm text-foreground">{campaign.clicked.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(campaign.clicked / campaign.sent)}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-semibold text-sm ${
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

      {/* Win-Back Campaign Showcase */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          🔄 Win-Back & Reactivation Campaign Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Campaigns</p>
            <p className="text-2xl font-bold text-foreground">{winBackCampaigns.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customers Reactivated</p>
            <p className="text-2xl font-bold text-success">{winBackSuccess}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold text-purple-600">{winBackRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg ROI</p>
            <p className="text-2xl font-bold text-secondary">
              {winBackCampaigns.length > 0 
                ? (winBackCampaigns.reduce((sum, c) => sum + c.roi, 0) / winBackCampaigns.length).toFixed(1)
                : '0'}x
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          💡 Insight: Win-back campaigns performing {winBackRate > 12 ? 'above' : 'at'} industry average (12%)
        </p>
      </div>
    </div>
  );
};