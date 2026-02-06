import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Button as ShadButton } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { generateSentimentBuckets, SentimentBucket } from '@/utils/sentimentBucketGenerator';
import { RefreshCw, Users, TrendingUp, AlertTriangle, AlertCircle, Sparkles, Download } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';

export const SentimentAnalysis = () => {
  const { customers } = useData();
  const [selectedBucket, setSelectedBucket] = useState<SentimentBucket | null>(null);
  
  const buckets = useMemo(() => {
    return generateSentimentBuckets(customers.map(c => c.id));
  }, [customers]);

  const idealCustomers = buckets.filter(b => b.priority === 'ideal')
    .reduce((sum, b) => sum + b.customerCount, 0);
  const growthOpportunities = buckets.filter(b => b.priority === 'low')
    .reduce((sum, b) => sum + b.customerCount, 0);
  const atRiskCustomers = buckets.filter(b => b.priority === 'high')
    .reduce((sum, b) => sum + b.customerCount, 0);
  const urgentAction = buckets.filter(b => b.priority === 'urgent')
    .reduce((sum, b) => sum + b.customerCount, 0);
  const reactivated = customers.filter(c => c.reactivationCount > 0).length;
  const [showExport, setShowExport] = useState(false);

  const exportColumns = ['Bucket', 'Engagement', 'Fit', 'Customers', 'Avg LTV', 'Churn Rate', 'Priority'];
  const exportRows = buckets.map(b => [
    b.name, b.engagementLevel, b.fitScore, b.customerCount.toString(),
    formatCurrency(b.avgLTV), `${(b.churnRate * 100).toFixed(1)}%`, b.priority,
  ]);

  const getCellColor = (priority: SentimentBucket['priority']) => {
    switch (priority) {
      case 'ideal':
        return 'bg-success/20 border-success hover:bg-success/30';
      case 'low':
        return 'bg-secondary/30 border-secondary hover:bg-secondary/40';
      case 'medium':
        return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      case 'high':
        return 'bg-warning/20 border-warning hover:bg-warning/30';
      case 'urgent':
        return 'bg-destructive/20 border-destructive hover:bg-destructive/30';
    }
  };

  const engagementLevels = ["Very High", "High", "Average", "Below Average", "Low"];
  const fitScores = ["Poor", "Below Average", "Average", "Good", "Excellent"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Sentiment Analysis Grid</h1>
          <p className="text-muted-foreground mt-1">Customer segmentation by engagement and product fit</p>
          <div className="mt-2 inline-flex items-center gap-2 text-sm text-accent">
            <span className="font-medium">Powered by UC Intelligence</span>
            <span className="px-2 py-0.5 bg-secondary/20 text-accent rounded-full font-semibold">
              {formatNumber(customers.length)} customers analyzed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShadButton variant="outline" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4 mr-1" /> Export Data
          </ShadButton>
          <Button variant="primary" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border-success border-t-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ideal Customers</p>
              <p className="text-2xl font-bold text-success">{formatNumber(idealCustomers)}</p>
              <p className="text-xs text-muted-foreground">High engagement + excellent fit</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-secondary border-t-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth Opportunities</p>
              <p className="text-2xl font-bold text-accent">{formatNumber(growthOpportunities)}</p>
              <p className="text-xs text-muted-foreground">Ready for upgrades</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-warning border-t-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">At-Risk</p>
              <p className="text-2xl font-bold text-warning">{formatNumber(atRiskCustomers)}</p>
              <p className="text-xs text-muted-foreground">Declining engagement</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-destructive border-t-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Urgent Action</p>
              <p className="text-2xl font-bold text-destructive">{formatNumber(urgentAction)}</p>
              <p className="text-xs text-muted-foreground">Critical intervention needed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-purple-400 border-t-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reactivation Success</p>
              <p className="text-2xl font-bold text-purple-700">{formatNumber(reactivated)}</p>
              <p className="text-xs text-muted-foreground">Recently brought back</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 5x5 Grid */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-accent mb-2">Customer Segmentation Matrix</h2>
          <p className="text-sm text-muted-foreground">
            Click any cell to view detailed customer insights and recommended actions
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Y-axis label */}
            <div className="flex gap-2 mb-2">
              <div className="w-32 flex items-center justify-end pr-4">
                <p className="text-sm font-medium text-accent rotate-0">Engagement Level →</p>
              </div>
              <div className="flex-1" />
            </div>

            {/* Grid */}
            <div className="flex gap-2">
              {/* Y-axis labels */}
              <div className="flex flex-col gap-2 w-32">
                <div className="h-4" /> {/* Spacer for fit score labels */}
                {engagementLevels.map((level) => (
                  <div key={level} className="h-24 flex items-center justify-end pr-4">
                    <p className="text-xs font-medium text-accent text-right">{level}</p>
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              <div className="flex-1">
                {/* X-axis labels */}
                <div className="flex gap-2 mb-2 h-4">
                  {fitScores.map((score) => (
                    <div key={score} className="flex-1 flex items-center justify-center">
                      <p className="text-xs font-medium text-accent">{score}</p>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {engagementLevels.map((engagement, rowIndex) => (
                  <div key={engagement} className="flex gap-2 mb-2">
                    {fitScores.map((fit, colIndex) => {
                      const bucket = buckets.find(
                        b => b.engagementLevel === engagement && b.fitScore === fit
                      );
                      
                      if (!bucket) return null;

                      return (
                        <button
                          key={bucket.id}
                          onClick={() => setSelectedBucket(bucket)}
                          className={cn(
                            "flex-1 h-24 p-3 rounded-lg border-2 transition-all duration-200",
                            "hover:scale-105 hover:shadow-lg cursor-pointer",
                            getCellColor(bucket.priority)
                          )}
                        >
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-xs text-accent/70 font-medium truncate">
                              {bucket.name}
                            </p>
                            <p className="text-2xl font-bold text-accent">
                              {formatNumber(bucket.customerCount)}
                            </p>
                            <div className="flex items-center justify-between gap-1">
                              <span className={cn(
                                "text-xs font-medium",
                                bucket.trend > 0 ? "text-success" : "text-destructive"
                              )}>
                                {bucket.trend > 0 ? '↑' : '↓'} {Math.abs(bucket.trend)}
                              </span>
                              <div className="flex gap-0.5">
                                {bucket.lifecycleBreakdown.reactivated > 0 && (
                                  <div className="w-1 h-1 rounded-full bg-purple-500" title="Reactivated" />
                                )}
                                {bucket.lifecycleBreakdown.loyal > 0 && (
                                  <div className="w-1 h-1 rounded-full bg-yellow-500" title="Loyal" />
                                )}
                                {bucket.lifecycleBreakdown.atRisk > 0 && (
                                  <div className="w-1 h-1 rounded-full bg-orange-500" title="At-Risk" />
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis label */}
            <div className="flex gap-2 mt-4">
              <div className="w-32" />
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-accent">Product Fit →</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-semibold text-accent mb-3">Color Legend:</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/20 border border-success" />
              <span className="text-xs text-muted-foreground">Ideal customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary/30 border border-secondary" />
              <span className="text-xs text-muted-foreground">Growth opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
              <span className="text-xs text-muted-foreground">Stable customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning/20 border border-warning" />
              <span className="text-xs text-muted-foreground">Attention needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
              <span className="text-xs text-muted-foreground">Urgent action</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Bucket Detail Modal - Simple version for now */}
      {showExport && (
        <ExportPreviewModal
          title="Sentiment Analysis Export"
          columns={exportColumns}
          rows={exportRows}
          onClose={() => setShowExport(false)}
          recordCount={buckets.length}
        />
      )}

      {selectedBucket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-accent">{selectedBucket.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      selectedBucket.priority === 'ideal' && "bg-success/20 text-success",
                      selectedBucket.priority === 'low' && "bg-secondary/30 text-accent",
                      selectedBucket.priority === 'medium' && "bg-blue-100 text-blue-700",
                      selectedBucket.priority === 'high' && "bg-warning/20 text-warning",
                      selectedBucket.priority === 'urgent' && "bg-destructive/20 text-destructive"
                    )}>
                      {selectedBucket.priority.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground">
                      {formatNumber(selectedBucket.customerCount)} customers
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedBucket(null)}
                >
                  Close
                </Button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4 border-secondary border-t-2">
                  <p className="text-sm text-muted-foreground">Average LTV</p>
                  <p className="text-2xl font-bold text-accent">{formatCurrency(selectedBucket.avgLTV)}</p>
                </Card>
                <Card className="p-4 border-warning border-t-2">
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-bold text-warning">{(selectedBucket.churnRate * 100).toFixed(1)}%</p>
                </Card>
                <Card className="p-4 border-success border-t-2">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-success">{(selectedBucket.conversionRate * 100).toFixed(1)}%</p>
                </Card>
              </div>

              {/* Lifecycle Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-3">Lifecycle Composition</h3>
                <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                  {selectedBucket.lifecycleBreakdown.new > 0 && (
                    <div 
                      className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedBucket.lifecycleBreakdown.new / selectedBucket.customerCount) * 100}%` }}
                    >
                      {selectedBucket.lifecycleBreakdown.new}
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.active > 0 && (
                    <div 
                      className="bg-success flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedBucket.lifecycleBreakdown.active / selectedBucket.customerCount) * 100}%` }}
                    >
                      {selectedBucket.lifecycleBreakdown.active}
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.loyal > 0 && (
                    <div 
                      className="bg-secondary flex items-center justify-center text-accent text-xs font-medium"
                      style={{ width: `${(selectedBucket.lifecycleBreakdown.loyal / selectedBucket.customerCount) * 100}%` }}
                    >
                      {selectedBucket.lifecycleBreakdown.loyal}
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.reactivated > 0 && (
                    <div 
                      className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedBucket.lifecycleBreakdown.reactivated / selectedBucket.customerCount) * 100}%` }}
                    >
                      {selectedBucket.lifecycleBreakdown.reactivated}
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.atRisk > 0 && (
                    <div 
                      className="bg-warning flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedBucket.lifecycleBreakdown.atRisk / selectedBucket.customerCount) * 100}%` }}
                    >
                      {selectedBucket.lifecycleBreakdown.atRisk}
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.churned > 0 && (
                    <div 
                      className="bg-gray-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedBucket.lifecycleBreakdown.churned / selectedBucket.customerCount) * 100}%` }}
                    >
                      {selectedBucket.lifecycleBreakdown.churned}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-xs text-muted-foreground">New ({selectedBucket.lifecycleBreakdown.new})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span className="text-xs text-muted-foreground">Active ({selectedBucket.lifecycleBreakdown.active})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-secondary" />
                    <span className="text-xs text-muted-foreground">Loyal ({selectedBucket.lifecycleBreakdown.loyal})</span>
                  </div>
                  {selectedBucket.lifecycleBreakdown.reactivated > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-purple-500" />
                      <span className="text-xs text-muted-foreground">Reactivated ({selectedBucket.lifecycleBreakdown.reactivated})</span>
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.atRisk > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-warning" />
                      <span className="text-xs text-muted-foreground">At-Risk ({selectedBucket.lifecycleBreakdown.atRisk})</span>
                    </div>
                  )}
                  {selectedBucket.lifecycleBreakdown.churned > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-gray-500" />
                      <span className="text-xs text-muted-foreground">Churned ({selectedBucket.lifecycleBreakdown.churned})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="text-lg font-semibold text-accent mb-3">💡 Recommended Actions</h3>
                <Card className="p-4 bg-primary/5 border-primary">
                  <p className="text-accent">{selectedBucket.recommendedAction}</p>
                  <div className="mt-4">
                    <Button variant="primary" size="sm">
                      Create Campaign
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};