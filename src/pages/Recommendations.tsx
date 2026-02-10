import { useState, useMemo } from 'react';
import { Sparkles, AlertTriangle, AlertCircle, Info, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { generateBusinessInsights, type InsightCategory, type InsightSeverity, type BusinessInsight } from '@/utils/insightsGenerator';
import { InsightDetailModal } from '@/components/recommendations/InsightDetailModal';

const categories: { label: InsightCategory | 'All'; key: InsightCategory | 'All' }[] = [
  { label: 'All', key: 'All' },
  { label: 'Customers', key: 'Customers' },
  { label: 'Transactions', key: 'Transactions' },
  { label: 'Behavior', key: 'Behavior' },
  { label: 'Products', key: 'Products' },
  { label: 'Marketing', key: 'Marketing' },
  { label: 'Risk', key: 'Risk' },
  { label: 'Revenue', key: 'Revenue' },
];

const severityConfig: Record<InsightSeverity, { label: string; icon: typeof AlertTriangle; cardBorder: string; badgeClass: string; textColor: string; iconColor: string }> = {
  critical: {
    label: 'Critical',
    icon: AlertTriangle,
    cardBorder: 'border-l-red-500',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    textColor: 'text-red-600',
    iconColor: 'text-red-500',
  },
  high: {
    label: 'High',
    icon: AlertCircle,
    cardBorder: 'border-l-orange-500',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    textColor: 'text-orange-600',
    iconColor: 'text-orange-500',
  },
  medium: {
    label: 'Medium',
    icon: Info,
    cardBorder: 'border-l-amber-500',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    textColor: 'text-amber-600',
    iconColor: 'text-amber-500',
  },
  low: {
    label: 'Low/Info',
    icon: TrendingUp,
    cardBorder: 'border-l-blue-500',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    textColor: 'text-blue-600',
    iconColor: 'text-blue-500',
  },
};

const typeColors = {
  risk: 'bg-red-500 text-white',
  opportunity: 'bg-emerald-500 text-white',
  insight: 'bg-sky-500 text-white',
};

export default function Recommendations() {
  const { customers, transactions, journeys } = useData();
  const [activeCategory, setActiveCategory] = useState<InsightCategory | 'All'>('All');
  const [selectedInsight, setSelectedInsight] = useState<BusinessInsight | null>(null);
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());

  const insights = useMemo(
    () => generateBusinessInsights(customers, transactions, journeys),
    [customers, transactions, journeys]
  );

  const filteredInsights = useMemo(
    () => activeCategory === 'All' ? insights : insights.filter(i => i.category === activeCategory),
    [insights, activeCategory]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    insights.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [insights]);

  const severityCounts = useMemo(() => {
    const counts: Record<InsightSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    filteredInsights.forEach(i => { counts[i.severity]++; });
    return counts;
  }, [filteredInsights]);

  const toggleRecommendations = (id: string) => {
    setExpandedRecommendations(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <Card className="p-6 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border-sky-100 dark:border-sky-900/50">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recommendations & Business Insights</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Intelligent analysis and actionable recommendations across all business modules
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => {
          const count = cat.key === 'All' ? insights.length : (categoryCounts[cat.key] || 0);
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-muted-foreground/15 text-muted-foreground'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(severityConfig) as [InsightSeverity, typeof severityConfig[InsightSeverity]][]).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Card key={key} className={`p-5 border-l-4 ${config.cardBorder}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${config.textColor}`}>
                    {severityCounts[key]}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${config.iconColor} opacity-60`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-semibold text-muted-foreground">No insights for this category</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select a different category to view insights
            </p>
          </Card>
        ) : (
          filteredInsights.map(insight => (
            <InsightCard
              key={insight.id}
              insight={insight}
              expanded={expandedRecommendations.has(insight.id)}
              onToggleExpand={() => toggleRecommendations(insight.id)}
              onViewDetails={() => setSelectedInsight(insight)}
            />
          ))
        )}
      </div>

      <InsightDetailModal
        insight={selectedInsight}
        open={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />
    </div>
  );
}

function InsightCard({
  insight,
  expanded,
  onToggleExpand,
  onViewDetails,
}: {
  insight: BusinessInsight;
  expanded: boolean;
  onToggleExpand: () => void;
  onViewDetails: () => void;
}) {
  const severity = severityConfig[insight.severity];
  const SeverityIcon = severity.icon;

  return (
    <Card className={`border-l-4 ${severity.cardBorder} transition-shadow hover:shadow-md`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <Badge className={`${severity.badgeClass} border text-xs font-semibold`}>
                <SeverityIcon className="h-3 w-3 mr-1" />
                {severity.label}
              </Badge>
              <Badge variant="outline" className="text-xs">{insight.category}</Badge>
              <Badge className={`${typeColors[insight.type]} text-xs`}>
                {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">{insight.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-shrink-0 mt-1">
            View Details
          </Button>
        </div>

        <div className="mt-4 bg-muted/40 rounded-lg p-4 border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Top Recommendation
          </p>
          <p className="text-sm text-foreground">{insight.recommendedActions[0]}</p>

          {insight.recommendedActions.length > 1 && (
            <div className="mt-2">
              {expanded ? (
                <div className="space-y-2 mt-3 border-t pt-3">
                  {insight.recommendedActions.slice(1).map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 2}
                      </span>
                      <p className="text-sm text-foreground">{action}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <button
                onClick={onToggleExpand}
                className="text-sm font-medium text-primary hover:text-primary/80 mt-2 flex items-center gap-1 transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    +{insight.recommendedActions.length - 1} more actions
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <span>Related KPI: {insight.relatedKPI}</span>
          <span className="text-muted-foreground/40">|</span>
          <span>Generated {insight.generatedDate}</span>
        </div>
      </div>
    </Card>
  );
}
