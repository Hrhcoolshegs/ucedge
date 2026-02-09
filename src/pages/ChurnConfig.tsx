import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Activity,
  Plus,
  Trash2,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  XCircle,
  Gauge,
  Info,
} from 'lucide-react';
import type { ChurnStage, ChurnMetricWithStage } from '@/types/churn';
import { CUSTOMER_FIELD_OPTIONS, OPERATOR_OPTIONS } from '@/types/churn';
import {
  fetchChurnStages,
  fetchChurnMetrics,
  createChurnMetric,
  updateChurnMetric,
  toggleChurnMetric,
  deleteChurnMetric,
} from '@/services/churnConfigService';
import { ChurnMetricModal } from '@/components/churn/ChurnMetricModal';

const STAGE_ICONS: Record<string, typeof Activity> = {
  healthy: CheckCircle2,
  'at-risk': AlertTriangle,
  churning: AlertOctagon,
  churned: XCircle,
};

export const ChurnConfig = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [stages, setStages] = useState<ChurnStage[]>([]);
  const [metrics, setMetrics] = useState<ChurnMetricWithStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ChurnMetricWithStage | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [s, m] = await Promise.all([fetchChurnStages(), fetchChurnMetrics()]);
      setStages(s);
      setMetrics(m);
    } catch {
      toast({ title: 'Failed to load churn configuration', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await toggleChurnMetric(id, active);
      setMetrics(prev => prev.map(m => m.id === id ? { ...m, is_active: active } : m));
      toast({ title: active ? 'Metric enabled' : 'Metric disabled' });
    } catch {
      toast({ title: 'Failed to update metric', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChurnMetric(id);
      setMetrics(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Metric deleted' });
    } catch {
      toast({ title: 'Failed to delete metric', variant: 'destructive' });
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingMetric) {
        await updateChurnMetric(editingMetric.id, data);
        toast({ title: 'Metric updated' });
      } else {
        await createChurnMetric({ ...data, created_by: user?.name ?? 'unknown' });
        toast({ title: 'Metric created' });
      }
      setModalOpen(false);
      setEditingMetric(null);
      await loadData();
    } catch {
      toast({ title: 'Failed to save metric', variant: 'destructive' });
    }
  };

  const openEdit = (metric: ChurnMetricWithStage) => {
    setEditingMetric(metric);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingMetric(null);
    setModalOpen(true);
  };

  const getMetricsForStage = (stageId: string) =>
    metrics.filter(m => m.churn_stage_id === stageId);

  const getFieldLabel = (field: string) =>
    CUSTOMER_FIELD_OPTIONS.find(f => f.value === field)?.label ?? field;

  const getOperatorSymbol = (op: string) =>
    OPERATOR_OPTIONS.find(o => o.value === op)?.symbol ?? op;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-accent">Churn Configuration</h1>
          <p className="text-muted-foreground mt-1">Loading configuration...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-24 mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Churn Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Define the metrics and thresholds that determine customer churn stages
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Metric
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stages.map(stage => {
          const Icon = STAGE_ICONS[stage.slug] ?? Activity;
          const stageMetrics = getMetricsForStage(stage.id);
          const activeCount = stageMetrics.filter(m => m.is_active).length;
          return (
            <Card key={stage.id} className="p-5 border-t-4" style={{ borderTopColor: stage.color }}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stage.color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: stage.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{stage.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeCount} of {stageMetrics.length} metrics active
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">How churn scoring works</p>
          <p className="text-sm text-blue-700 mt-1">
            Each metric checks a customer data field against a threshold. When a metric condition is met,
            it signals the associated churn stage. Metrics with higher weights have more influence.
            A customer is assigned to the highest-severity stage triggered by any active metric.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {stages.map(stage => {
          const stageMetrics = getMetricsForStage(stage.id);
          if (stageMetrics.length === 0) return null;

          return (
            <div key={stage.id}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <h2 className="text-lg font-semibold text-foreground">
                  {stage.name} Metrics
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({stageMetrics.length})
                </span>
              </div>

              <div className="space-y-3">
                {stageMetrics.map(metric => (
                  <MetricRow
                    key={metric.id}
                    metric={metric}
                    stageColor={stage.color}
                    onToggle={handleToggle}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    getFieldLabel={getFieldLabel}
                    getOperatorSymbol={getOperatorSymbol}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ChurnMetricModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingMetric(null); }}
        onSave={handleSave}
        stages={stages}
        metric={editingMetric}
      />
    </div>
  );
};

interface MetricRowProps {
  metric: ChurnMetricWithStage;
  stageColor: string;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (metric: ChurnMetricWithStage) => void;
  onDelete: (id: string) => void;
  getFieldLabel: (field: string) => string;
  getOperatorSymbol: (op: string) => string;
}

function MetricRow({
  metric,
  stageColor,
  onToggle,
  onEdit,
  onDelete,
  getFieldLabel,
  getOperatorSymbol,
}: MetricRowProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <Card className={`p-4 transition-all duration-200 ${metric.is_active ? '' : 'opacity-60'}`}>
      <div className="flex items-center gap-4">
        <Switch
          checked={metric.is_active}
          onCheckedChange={(checked) => onToggle(metric.id, checked)}
        />

        <div
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: stageColor }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground text-sm">{metric.name}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
        </div>

        <div className="hidden sm:flex items-center gap-6 shrink-0">
          <div className="text-center min-w-[100px]">
            <p className="text-xs text-muted-foreground">Field</p>
            <p className="text-sm font-medium text-foreground">{getFieldLabel(metric.customer_field)}</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-xs text-muted-foreground">Condition</p>
            <p className="text-sm font-mono font-medium text-foreground">
              {getOperatorSymbol(metric.operator)} {metric.threshold_value.toLocaleString()}
              {metric.operator === 'between' && metric.threshold_value_max != null
                ? ` - ${metric.threshold_value_max.toLocaleString()}`
                : ''}
            </p>
          </div>
          <div className="text-center min-w-[50px]">
            <p className="text-xs text-muted-foreground">Unit</p>
            <p className="text-sm text-foreground">{metric.unit}</p>
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-xs text-muted-foreground">Weight</p>
            <div className="flex items-center gap-1.5 justify-center">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">{metric.weight}/10</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(metric)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(metric.id); setConfirming(false); }}
                className="px-2 py-1 text-xs bg-destructive text-white rounded hover:bg-destructive/90 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-2 py-1 text-xs bg-muted text-foreground rounded hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
