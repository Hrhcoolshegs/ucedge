import { useMemo } from 'react';
import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/common/ChartCard';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ChurnRiskIndicator } from '@/components/common/ChurnRiskIndicator';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, AlertTriangle, TrendingDown, UserMinus, UserCheck, AlertOctagon, Settings2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const RiskAlertsTab = () => {
  const navigate = useNavigate();
  const { customers } = useData();

  const highRisk = customers.filter(c => c.churnRisk === 'high').length;
  const mediumRisk = customers.filter(c => c.churnRisk === 'medium').length;
  const atRisk = customers.filter(c => c.lifecycleStage === 'at-risk').length;
  const churned = customers.filter(c => c.lifecycleStage === 'churned').length;
  const reactivated = customers.filter(c => c.reactivationCount > 0).length;

  const atRiskCustomers = useMemo(() => {
    return customers
      .filter(c => c.lifecycleStage === 'at-risk' || c.lifecycleStage === 'churned')
      .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
      .slice(0, 50);
  }, [customers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Churn detection based on your configured metrics and thresholds
        </p>
        <Link
          to="/churn-config"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Settings2 className="h-4 w-4" />
          Configure Metrics
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="High Risk"
          value={highRisk.toString()}
          icon={AlertCircle}
          iconColor="text-destructive"
          borderColor="border-t-destructive"
          explanation="Customers with an 80%+ probability of churning within the next 30 days. Requires immediate intervention with personalized retention campaigns, special offers, or direct contact from relationship managers."
        />
        <MetricCard
          title="Medium Risk"
          value={mediumRisk.toString()}
          icon={AlertTriangle}
          iconColor="text-warning"
          borderColor="border-t-warning"
          explanation="Customers showing early warning signs of disengagement (50-79% churn probability). Proactive engagement through automated campaigns can prevent escalation to high risk."
        />
        <MetricCard
          title="At-Risk (Lifecycle)"
          value={atRisk.toString()}
          icon={TrendingDown}
          iconColor="text-warning"
          borderColor="border-t-warning"
          explanation="Customers in the 'At-Risk' lifecycle stage based on behavioral patterns like reduced login frequency or declining transaction activity. Monitor closely and trigger win-back campaigns."
        />
        <MetricCard
          title="Churned This Month"
          value={churned.toString()}
          icon={UserMinus}
          iconColor="text-muted-foreground"
          explanation="Customers who became inactive this month (no transactions or logins for 60+ days). Analyze common patterns among churned customers to improve retention strategies."
        />
        <MetricCard
          title="Recovered"
          value={reactivated.toString()}
          icon={UserCheck}
          iconColor="text-success"
          borderColor="border-t-success"
          explanation="Previously churned customers who have been successfully reactivated through win-back campaigns. This metric validates the effectiveness of retention efforts and win-back strategies."
        />
        <MetricCard
          title="Pending Churn"
          value="87"
          icon={AlertOctagon}
          iconColor="text-destructive"
          borderColor="border-t-destructive"
          explanation="Customers identified as likely to churn very soon based on recent behavioral changes or critical events (e.g., service complaints, failed transactions). Requires urgent attention within 48 hours."
        />
      </div>

      {/* Lifecycle Flow Visualization */}
      <ChartCard title="Customer Lifecycle Flow" subtitle="Movement between stages this month" explanation="Visualizes how customers move through different lifecycle stages. Understand the flow from New to Active to Loyal, and identify drop-off points where customers become At-Risk or Churned."
>
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
                New (187)
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                Active (5,602)
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium">
                Loyal (3,112)
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-medium">
                At-Risk (1,245)
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
                Churned (623)
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium">
                Reactivated (45)
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* At-Risk & Churned Customer Table */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">At-Risk & Churned Customers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Name</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Lifecycle Stage</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Days Inactive</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">LTV</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Churn Risk</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {atRiskCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">{customer.name}</td>
                  <td className="py-3">
                    <LifecycleBadge stage={customer.lifecycleStage} size="sm" />
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{customer.daysInactive} days</td>
                  <td className="py-3 text-sm font-medium text-foreground">
                    {formatCurrency(customer.lifetimeValue)}
                  </td>
                  <td className="py-3">
                    <ChurnRiskIndicator risk={customer.churnRisk} />
                  </td>
                  <td className="py-3">
                    <span className={`text-sm font-medium ${
                      customer.sentimentScore >= 7 ? 'text-success' :
                      customer.sentimentScore >= 4 ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {customer.sentimentScore}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Predictive Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive mb-1">Churn Risk Alert</h4>
              <p className="text-sm text-foreground mb-2">85 customers likely to churn in next 30 days</p>
              <p className="text-xs text-muted-foreground mb-2">Total LTV at risk: {formatCurrency(72250000)}</p>
              <button 
                onClick={() => {
                  navigate('/campaigns', { 
                    state: { 
                      prefillGoal: 'retention',
                      prefillLifecycle: ['at-risk'],
                      prefillName: 'Churn Prevention Campaign'
                    } 
                  });
                  toast({
                    title: "Campaign wizard opened",
                    description: "Pre-filled with at-risk customers for retention",
                  });
                }}
                className="text-xs bg-destructive text-white px-3 py-1 rounded hover:bg-destructive/90 transition-colors"
              >
                Launch Retention Campaign
              </button>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <UserCheck className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">Reactivation Opportunities</h4>
              <p className="text-sm text-foreground mb-2">67 churned customers showing re-interest signals</p>
              <p className="text-xs text-muted-foreground mb-2">Potential recovered LTV: {formatCurrency(56950000)}</p>
              <button 
                onClick={() => {
                  navigate('/campaigns', { 
                    state: { 
                      prefillGoal: 'win-back',
                      prefillLifecycle: ['churned'],
                      prefillName: 'Win-back Campaign'
                    } 
                  });
                  toast({
                    title: "Campaign wizard opened",
                    description: "Pre-filled with churned customers for win-back",
                  });
                }}
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
              >
                Launch Winback Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};