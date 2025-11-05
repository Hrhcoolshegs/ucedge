import { CampaignFormData } from '@/types/campaign';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { User, UserCheck, Star, AlertTriangle, UserX, RefreshCw, Lightbulb } from 'lucide-react';
import { useMemo } from 'react';

interface StepTwoProps {
  formData: Partial<CampaignFormData>;
  updateFormData: (data: Partial<CampaignFormData>) => void;
}

export const StepTwo = ({ formData, updateFormData }: StepTwoProps) => {
  const { customers } = useData();
  const targetingMethod = formData.targetingMethod || 'lifecycle';

  const lifecycleStages = useMemo(() => {
    const stages = [
      {
        id: 'new',
        icon: User,
        title: 'NEW CUSTOMERS',
        count: customers.filter(c => c.lifecycleStage === 'new').length,
        subtitle: '<30 days with United Capital',
        bestFor: 'Onboarding, Activation',
        avgLTV: '₦250k',
        color: 'blue'
      },
      {
        id: 'active',
        icon: UserCheck,
        title: 'ACTIVE CUSTOMERS',
        count: customers.filter(c => c.lifecycleStage === 'active').length,
        subtitle: 'Regular engagement',
        bestFor: 'Cross-sell, Upsell',
        avgLTV: '₦650k',
        color: 'green'
      },
      {
        id: 'loyal',
        icon: Star,
        title: 'LOYAL CUSTOMERS',
        count: customers.filter(c => c.lifecycleStage === 'loyal').length,
        subtitle: '12+ months, high engagement',
        bestFor: 'Referrals, Premium offers',
        avgLTV: '₦1.2M',
        color: 'gold'
      },
      {
        id: 'at-risk',
        icon: AlertTriangle,
        title: 'AT-RISK CUSTOMERS',
        count: customers.filter(c => c.lifecycleStage === 'at-risk').length,
        subtitle: 'Declining engagement',
        bestFor: 'Retention, Re-engagement',
        avgLTV: '₦480k',
        color: 'orange'
      },
      {
        id: 'churned',
        icon: UserX,
        title: 'CHURNED CUSTOMERS',
        count: customers.filter(c => c.lifecycleStage === 'churned').length,
        subtitle: '90+ days inactive',
        bestFor: 'Win-back campaigns',
        potential: '₦528.5M',
        recovery: '18% expected',
        color: 'red'
      },
      {
        id: 'reactivated',
        icon: RefreshCw,
        title: 'REACTIVATED CUSTOMERS',
        count: customers.filter(c => c.reactivationCount > 0 && c.lifecycleStage !== 'churned').length,
        subtitle: 'Recently returned',
        bestFor: 'Nurture, Welcome back',
        avgLTV: '₦950k (+15% vs pre)',
        color: 'purple'
      }
    ];
    return stages;
  }, [customers]);

  const toggleLifecycleStage = (stageId: string) => {
    const currentStages = formData.selectedLifecycleStages || [];
    const newStages = currentStages.includes(stageId as any)
      ? currentStages.filter(s => s !== stageId)
      : [...currentStages, stageId as any];
    updateFormData({ selectedLifecycleStages: newStages });
  };

  const totalSelected = useMemo(() => {
    const selected = formData.selectedLifecycleStages || [];
    return selected.reduce((sum, stageId) => {
      const stage = lifecycleStages.find(s => s.id === stageId);
      return sum + (stage?.count || 0);
    }, 0);
  }, [formData.selectedLifecycleStages, lifecycleStages]);

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors: Record<string, { border: string; bg: string; icon: string }> = {
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-border',
        bg: isSelected ? 'bg-blue-50' : 'bg-background',
        icon: 'text-blue-600'
      },
      green: {
        border: isSelected ? 'border-success' : 'border-border',
        bg: isSelected ? 'bg-success/10' : 'bg-background',
        icon: 'text-success'
      },
      gold: {
        border: isSelected ? 'border-secondary' : 'border-border',
        bg: isSelected ? 'bg-secondary/20' : 'bg-background',
        icon: 'text-secondary'
      },
      orange: {
        border: isSelected ? 'border-warning' : 'border-border',
        bg: isSelected ? 'bg-warning/10' : 'bg-background',
        icon: 'text-warning'
      },
      red: {
        border: isSelected ? 'border-primary' : 'border-border',
        bg: isSelected ? 'bg-primary/10' : 'bg-background',
        icon: 'text-primary'
      },
      purple: {
        border: isSelected ? 'border-purple-500' : 'border-border',
        bg: isSelected ? 'bg-purple-50' : 'bg-background',
        icon: 'text-purple-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const showRecommendations = useMemo(() => {
    const selected = formData.selectedLifecycleStages || [];
    if (selected.includes('churned')) {
      const churnedCustomers = customers.filter(c => c.lifecycleStage === 'churned');
      return {
        title: '💡 Win-Back Campaign Best Practices',
        tips: [
          'Timing: Customers churned 90-180 days ago have highest recovery rate (22%)',
          'Channel: WhatsApp performs best (5.2x ROI vs 3.1x email)',
          'Incentive: Zero fees for 3 months shows 27% conversion',
          'Personal Touch: Include account manager name if high LTV',
          'Urgency: Limited-time offers increase response by 35%'
        ],
        estimate: {
          target: churnedCustomers.length,
          expectedReactivation: Math.round(churnedCustomers.length * 0.18),
          potentialRevenue: '₦26.6M',
          estimatedROI: '5.2x'
        }
      };
    }
    if (selected.includes('reactivated')) {
      return {
        title: '💡 Reactivation Nurture Best Practices',
        tips: [
          'Welcome Back: Send personalized welcome message within 24 hours',
          'Easy Wins: Highlight simple, valuable features they can use immediately',
          'Exclusive Offer: Provide special benefit for returning customers',
          'Regular Touch: Maintain consistent engagement for first 60 days',
          'Monitor Risk: Watch for re-churn signals (15% risk in first 90 days)'
        ],
        estimate: {
          target: customers.filter(c => c.reactivationCount > 0).length,
          expectedEngagement: '72%',
          retentionRate: '85%',
          avgLTVIncrease: '+15%'
        }
      };
    }
    return null;
  }, [formData.selectedLifecycleStages, customers]);

  return (
    <div className="space-y-6">
      {/* Targeting Method Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          type="button"
          variant={targetingMethod === 'sentiment' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateFormData({ targetingMethod: 'sentiment' })}
          className={targetingMethod === 'sentiment' ? 'bg-primary text-white' : ''}
        >
          Sentiment-Based
        </Button>
        <Button
          type="button"
          variant={targetingMethod === 'lifecycle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateFormData({ targetingMethod: 'lifecycle' })}
          className={targetingMethod === 'lifecycle' ? 'bg-primary text-white' : ''}
        >
          Lifecycle-Based
        </Button>
        <Button
          type="button"
          variant={targetingMethod === 'custom' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateFormData({ targetingMethod: 'custom' })}
          className={targetingMethod === 'custom' ? 'bg-primary text-white' : ''}
        >
          Custom Filters
        </Button>
      </div>

      {targetingMethod === 'lifecycle' && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Target customers by their lifecycle stage - ideal for retention and win-back
          </p>

          {/* Lifecycle Stage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lifecycleStages.map((stage) => {
              const Icon = stage.icon;
              const isSelected = (formData.selectedLifecycleStages || []).includes(stage.id as any);
              const colorClasses = getColorClasses(stage.color, isSelected);

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => toggleLifecycleStage(stage.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${colorClasses.border} ${colorClasses.bg}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{stage.title}</h3>
                  <p className="text-2xl font-bold mb-2">{stage.count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mb-3">{stage.subtitle}</p>
                  <div className="space-y-1 text-xs">
                    <p className="font-medium">Best for: <span className="font-normal">{stage.bestFor}</span></p>
                    {stage.avgLTV && <p>Avg LTV: <span className="font-semibold">{stage.avgLTV}</span></p>}
                    {stage.potential && <p>Potential: <span className="font-semibold">{stage.potential}</span></p>}
                    {stage.recovery && <p className="text-success">{stage.recovery}</p>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selection Summary */}
          {totalSelected > 0 && (
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-semibold mb-2">Selection Summary</h4>
              <p className="text-sm">
                <span className="font-bold text-primary">{totalSelected.toLocaleString()}</span> customers selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated reach: {Math.round(totalSelected * 0.98).toLocaleString()} (98% deliverability)
              </p>
            </div>
          )}

          {/* AI Recommendations */}
          {showRecommendations && (
            <div className="p-6 bg-secondary/10 rounded-lg border border-secondary">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-3">{showRecommendations.title}</h4>
                  <ul className="space-y-2 mb-4">
                    {showRecommendations.tips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-success mt-0.5">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white/50 rounded-lg p-4 mt-4">
                    <h5 className="font-semibold mb-2">Estimated Performance:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(showRecommendations.estimate).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-semibold ml-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {targetingMethod === 'sentiment' && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Sentiment-based targeting - Coming soon</p>
        </div>
      )}

      {targetingMethod === 'custom' && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Custom filters - Coming soon</p>
        </div>
      )}
    </div>
  );
};
