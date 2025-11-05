import { CampaignFormData } from '@/types/campaign';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mail, MessageSquare, Send, Bell } from 'lucide-react';

interface StepOneProps {
  formData: Partial<CampaignFormData>;
  updateFormData: (data: Partial<CampaignFormData>) => void;
}

export const StepOne = ({ formData, updateFormData }: StepOneProps) => {
  const campaignTypes = [
    { value: 'Email', icon: Mail, cost: '₦5' },
    { value: 'SMS', icon: MessageSquare, cost: '₦3' },
    { value: 'WhatsApp', icon: Send, cost: '₦7' },
    { value: 'Push', icon: Bell, cost: '₦1' }
  ];

  const campaignGoals = [
    { value: 'onboarding', label: 'Onboarding', description: 'New customers' },
    { value: 'activation', label: 'Activation', description: 'First transaction' },
    { value: 'cross-sell', label: 'Cross-sell', description: 'New products' },
    { value: 're-engagement', label: 'Re-engagement', description: 'Dormant customers' },
    { value: 'retention', label: 'Retention', description: 'At-risk customers' },
    { value: 'win-back', label: 'Win-Back', description: 'Churned customers', isPurple: true },
    { value: 'reactivation-nurture', label: 'Reactivation Nurture', description: 'Recently reactivated', isPurple: true },
    { value: 'upsell', label: 'Upsell', description: 'Premium products' }
  ];

  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaignName">Campaign Name *</Label>
        <Input
          id="campaignName"
          placeholder="Q4 Investment Drive"
          value={formData.name || ''}
          onChange={(e) => updateFormData({ name: e.target.value })}
          maxLength={100}
          className="border-border focus:border-primary"
        />
        <p className="text-xs text-muted-foreground text-right">
          {(formData.name || '').length}/100
        </p>
      </div>

      {/* Campaign Type */}
      <div className="space-y-2">
        <Label>Campaign Type *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {campaignTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => updateFormData({ type: type.value as CampaignFormData['type'] })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-medium text-sm">{type.value}</p>
                <p className="text-xs text-muted-foreground">{type.cost}/send</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign Goal */}
      <div className="space-y-2">
        <Label htmlFor="goal">Campaign Goal *</Label>
        <Select value={formData.goal} onValueChange={(value) => updateFormData({ goal: value as CampaignFormData['goal'] })}>
          <SelectTrigger className="border-border">
            <SelectValue placeholder="Select campaign goal" />
          </SelectTrigger>
          <SelectContent>
            {campaignGoals.map((goal) => (
              <SelectItem key={goal.value} value={goal.value}>
                <div className="flex items-center gap-2">
                  <span className={goal.isPurple ? 'text-purple-600' : ''}>{goal.label}</span>
                  <span className="text-xs text-muted-foreground">- {goal.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div className="space-y-3">
        <Label>Priority *</Label>
        <RadioGroup
          value={formData.priority}
          onValueChange={(value) => updateFormData({ priority: value as CampaignFormData['priority'] })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="cursor-pointer font-normal text-muted-foreground">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer font-normal text-warning">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="cursor-pointer font-normal text-orange-500">High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="urgent" id="urgent" />
            <Label htmlFor="urgent" className="cursor-pointer font-normal text-primary">Urgent</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Budget (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (Optional)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
          <Input
            id="budget"
            type="number"
            placeholder="0"
            value={formData.budget || ''}
            onChange={(e) => updateFormData({ budget: parseInt(e.target.value) || undefined })}
            className="pl-8 border-border"
          />
        </div>
        <p className="text-xs text-muted-foreground">Set maximum campaign spend</p>
      </div>
    </div>
  );
};
