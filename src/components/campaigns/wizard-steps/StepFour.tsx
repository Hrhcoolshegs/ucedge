import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CampaignFormData } from '@/types/campaign';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, Calendar, Target, Users, DollarSign } from 'lucide-react';

interface StepFourProps {
  formData: Partial<CampaignFormData>;
  updateFormData: (data: Partial<CampaignFormData>) => void;
}

export const StepFour = ({ formData, updateFormData }: StepFourProps) => {
  const totalSelected = formData.targetingMethod === 'lifecycle'
    ? formData.selectedLifecycleStages?.length || 0
    : formData.selectedBuckets?.length || 0;

  const estimatedReach = formData.targetingMethod === 'lifecycle'
    ? (formData.selectedLifecycleStages?.reduce((sum, stage) => {
        const counts = { new: 1867, active: 5602, loyal: 3112, 'at-risk': 1245, churned: 623, reactivated: 45 };
        return sum + (counts[stage] || 0);
      }, 0) || 0)
    : 456; // Default for sentiment-based

  const errors = [];
  if (!formData.name) errors.push('Campaign name is required');
  if (!formData.type) errors.push('Campaign type is required');
  if (!formData.launchDate) errors.push('Launch date is required');
  if (!formData.message) errors.push('Campaign message is required');
  if (totalSelected === 0) errors.push('Select at least one target segment');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Schedule & Review</h3>
        <p className="text-sm text-muted-foreground">Finalize your campaign details</p>
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="launchDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Launch Date *
          </Label>
          <Input
            id="launchDate"
            type="datetime-local"
            value={formData.launchDate || ''}
            onChange={(e) => updateFormData({ launchDate: e.target.value })}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            End Date (Optional)
          </Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate || ''}
            onChange={(e) => updateFormData({ endDate: e.target.value })}
            min={formData.launchDate}
          />
        </div>
      </div>

      {/* Summary Panel */}
      <div className="border border-border rounded-lg p-6 space-y-4 bg-muted/20">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Campaign Summary
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Campaign Name</div>
            <div className="font-medium text-foreground">{formData.name || '-'}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Type & Goal</div>
            <div className="font-medium text-foreground">
              {formData.type || '-'} • {formData.goal || '-'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Priority</div>
            <div className="font-medium text-foreground capitalize">{formData.priority || '-'}</div>
          </div>
          
          {formData.budget && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Budget
              </div>
              <div className="font-medium text-foreground">{formatCurrency(formData.budget)}</div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Target Audience
            </div>
            <div className="font-medium text-foreground">
              {formData.targetingMethod === 'lifecycle' ? 'Lifecycle-Based' : 'Sentiment-Based'}
            </div>
            {formData.targetingMethod === 'lifecycle' && formData.selectedLifecycleStages && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.selectedLifecycleStages.map(stage => (
                  <LifecycleBadge key={stage} stage={stage} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Estimated Reach</div>
            <div className="text-2xl font-bold text-primary">{estimatedReach.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">customers</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Expected Deliverability</div>
            <div className="text-2xl font-bold text-success">
              {formData.type === 'SMS' ? '98%' : formData.type === 'WhatsApp' ? '95%' : '92%'}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="border border-destructive/30 bg-destructive/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="font-semibold text-destructive">Please fix the following errors:</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};