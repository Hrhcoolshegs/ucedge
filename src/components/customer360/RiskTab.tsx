import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';
import { RiskSignal } from '@/types/governance';
import { AlertTriangle, Shield, TrendingUp, Clock, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/formatters';

interface RiskTabProps {
  customer: Customer;
}

export const RiskTab = ({ customer }: RiskTabProps) => {
  const riskRating = customer.risk_rating || 'MEDIUM';
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskSignals = async () => {
      const { data, error } = await supabase
        .from('risk_signals')
        .select(`
          id,
          customer_id,
          business_unit_id,
          signal_type,
          score,
          band,
          rationale,
          created_at,
          business_unit:business_units (
            id,
            code,
            name
          )
        `)
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRiskSignals(data as any);
      }
      setLoading(false);
    };

    fetchRiskSignals();
  }, [customer.id]);

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
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Risk Signals by Business Unit</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : riskSignals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No risk signals detected
          </p>
        ) : (
          <div className="space-y-4">
            {riskSignals.map((signal) => {
              const signalColor =
                signal.band === 'HIGH' ? 'border-red-200 bg-red-50' :
                signal.band === 'MEDIUM' ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50';

              const badgeVariant =
                signal.band === 'HIGH' ? 'destructive' :
                signal.band === 'MEDIUM' ? 'secondary' :
                'default';

              return (
                <Card key={signal.id} className={`p-4 border-2 ${signalColor}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeVariant}>{signal.band}</Badge>
                      <Badge variant="outline">{signal.signal_type}</Badge>
                      {signal.business_unit && (
                        <Badge variant="secondary" className="text-xs">
                          {signal.business_unit.code}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(signal.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">
                      {signal.score}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <p className="text-sm">{signal.rationale}</p>
                  {signal.business_unit && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Detected by: {signal.business_unit.name}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
