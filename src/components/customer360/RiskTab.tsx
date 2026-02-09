import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';
import { AlertTriangle, Shield, TrendingUp, Clock } from 'lucide-react';

interface RiskTabProps {
  customer: Customer;
}

export const RiskTab = ({ customer }: RiskTabProps) => {
  const riskRating = customer.risk_rating || 'MEDIUM';

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'LOW': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (rating: string) => {
    switch (rating) {
      case 'LOW': return Shield;
      case 'MEDIUM': return AlertTriangle;
      case 'HIGH': return AlertTriangle;
      default: return Shield;
    }
  };

  const RiskIcon = getRiskIcon(riskRating);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Risk Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`p-6 border-2 ${getRiskColor(riskRating)}`}>
            <div className="flex items-center gap-3 mb-4">
              <RiskIcon className="h-8 w-8" />
              <div>
                <p className="text-sm font-medium">Overall Risk Rating</p>
                <p className="text-2xl font-bold">{riskRating}</p>
              </div>
            </div>
            <p className="text-sm">
              {riskRating === 'LOW' && 'Customer shows low risk indicators with good payment history and stable behavior.'}
              {riskRating === 'MEDIUM' && 'Customer shows moderate risk. Regular monitoring recommended.'}
              {riskRating === 'HIGH' && 'Customer shows high risk indicators. Enhanced monitoring required.'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Entity Type</p>
                <p className="text-2xl font-bold">{customer.entity_type || 'INDIVIDUAL'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {customer.unique_identifiers && (
                <div>
                  <p className="text-muted-foreground">Identifiers Verified:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.keys(customer.unique_identifiers).map((key) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Risk Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Churn Risk</span>
              <Badge variant={
                customer.churnRisk === 'low' ? 'default' :
                customer.churnRisk === 'medium' ? 'secondary' :
                'destructive'
              }>
                {customer.churnRisk}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on engagement and transaction patterns
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Days Inactive</span>
              <span className="text-xl font-bold">{customer.daysInactive}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Since last meaningful interaction
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Lifecycle Stage</span>
              <Badge variant="outline">{customer.lifecycleStage}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Current position in customer journey
            </p>
          </Card>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Risk Events</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          No recent risk events recorded
        </p>
      </Card>
    </div>
  );
};
