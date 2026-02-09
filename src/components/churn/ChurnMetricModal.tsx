import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import type { ChurnStage, ChurnMetricWithStage } from '@/types/churn';
import { CUSTOMER_FIELD_OPTIONS, OPERATOR_OPTIONS } from '@/types/churn';

interface ChurnMetricModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  stages: ChurnStage[];
  metric: ChurnMetricWithStage | null;
}

export function ChurnMetricModal({ open, onClose, onSave, stages, metric }: ChurnMetricModalProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    customer_field: 'daysInactive',
    operator: 'gte',
    threshold_value: 30,
    threshold_value_max: null as number | null,
    unit: 'days',
    weight: 5,
    churn_stage_id: '',
    is_active: true,
  });

  useEffect(() => {
    if (metric) {
      setForm({
        name: metric.name,
        description: metric.description,
        customer_field: metric.customer_field,
        operator: metric.operator,
        threshold_value: metric.threshold_value,
        threshold_value_max: metric.threshold_value_max,
        unit: metric.unit,
        weight: metric.weight,
        churn_stage_id: metric.churn_stage_id,
        is_active: metric.is_active,
      });
    } else {
      setForm({
        name: '',
        description: '',
        customer_field: 'daysInactive',
        operator: 'gte',
        threshold_value: 30,
        threshold_value_max: null,
        unit: 'days',
        weight: 5,
        churn_stage_id: stages[1]?.id ?? '',
        is_active: true,
      });
    }
  }, [metric, stages, open]);

  const handleFieldChange = (field: string) => {
    const match = CUSTOMER_FIELD_OPTIONS.find(f => f.value === field);
    setForm(prev => ({
      ...prev,
      customer_field: field,
      unit: match?.unit ?? prev.unit,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.churn_stage_id) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.name.trim().length > 0 && form.churn_stage_id.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{metric ? 'Edit Metric' : 'Add Churn Metric'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="metric-name">Metric Name</Label>
            <Input
              id="metric-name"
              placeholder="e.g., Days Inactive"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metric-desc">Description</Label>
            <Textarea
              id="metric-desc"
              placeholder="What does this metric measure?"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Field</Label>
              <Select value={form.customer_field} onValueChange={handleFieldChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_FIELD_OPTIONS.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Churn Stage</Label>
              <Select value={form.churn_stage_id} onValueChange={v => setForm(prev => ({ ...prev, churn_stage_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.filter(s => s.slug !== 'healthy').map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select value={form.operator} onValueChange={v => setForm(prev => ({ ...prev, operator: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.symbol} {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold ({form.unit})</Label>
              <Input
                id="threshold"
                type="number"
                value={form.threshold_value}
                onChange={e => setForm(prev => ({ ...prev, threshold_value: Number(e.target.value) }))}
              />
            </div>
          </div>

          {form.operator === 'between' && (
            <div className="space-y-2">
              <Label htmlFor="threshold-max">Max Threshold ({form.unit})</Label>
              <Input
                id="threshold-max"
                type="number"
                value={form.threshold_value_max ?? ''}
                onChange={e => setForm(prev => ({ ...prev, threshold_value_max: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Weight (Importance)</Label>
              <span className="text-sm font-semibold text-foreground">{form.weight}/10</span>
            </div>
            <Slider
              value={[form.weight]}
              onValueChange={([v]) => setForm(prev => ({ ...prev, weight: v }))}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low priority</span>
              <span>High priority</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {metric ? 'Update Metric' : 'Add Metric'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
