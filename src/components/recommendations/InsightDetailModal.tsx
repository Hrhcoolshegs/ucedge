import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, AlertCircle, Info, TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';
import type { BusinessInsight } from '@/utils/insightsGenerator';

interface InsightDetailModalProps {
  insight: BusinessInsight | null;
  open: boolean;
  onClose: () => void;
}

const severityConfig = {
  critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle, iconColor: 'text-red-600' },
  high: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle, iconColor: 'text-orange-600' },
  medium: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Info, iconColor: 'text-amber-600' },
  low: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: TrendingUp, iconColor: 'text-blue-600' },
};

const typeConfig = {
  risk: { color: 'bg-red-500 text-white', icon: ShieldAlert, label: 'Risk' },
  opportunity: { color: 'bg-emerald-500 text-white', icon: TrendingUp, label: 'Opportunity' },
  insight: { color: 'bg-sky-500 text-white', icon: Info, label: 'Insight' },
};

export function InsightDetailModal({ insight, open, onClose }: InsightDetailModalProps) {
  if (!insight) return null;

  const severity = severityConfig[insight.severity];
  const type = typeConfig[insight.type];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${severity.color} border text-xs font-semibold capitalize`}>
              <severity.icon className="h-3 w-3 mr-1" />
              {insight.severity}
            </Badge>
            <Badge variant="outline" className="text-xs">{insight.category}</Badge>
            <Badge className={`${type.color} text-xs`}>{type.label}</Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground leading-tight">
            {insight.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Generated {insight.generatedDate}</p>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 pt-2">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Summary</h4>
            <p className="text-sm text-foreground leading-relaxed">{insight.summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Trend Analysis</h4>
            <p className="text-sm text-foreground leading-relaxed">{insight.trendAnalysis}</p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
            {insight.type === 'risk' ? (
              <TrendingDown className="h-5 w-5 text-red-500 flex-shrink-0" />
            ) : (
              <TrendingUp className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            )}
            <p className="text-sm">
              This insight indicates a potential <strong>{insight.type}</strong> that requires attention.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Recommended Actions</h4>
            <div className="space-y-2.5">
              {insight.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Supporting Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              {insight.supportingMetrics.map((metric, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/40 border">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Confidence Score</h4>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">AI Confidence</span>
              <div className="flex-1">
                <Progress value={insight.confidence} className="h-2" />
              </div>
              <span className="text-sm font-semibold text-foreground">{insight.confidence}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Info className="h-3.5 w-3.5" />
            <span>Related KPI: {insight.relatedKPI}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
