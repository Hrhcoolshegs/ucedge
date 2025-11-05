import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CampaignFormData, Campaign } from '@/types/campaign';
import { StepOne } from './wizard-steps/StepOne';
import { StepTwo } from './wizard-steps/StepTwo';
import { StepThree } from './wizard-steps/StepThree';
import { StepFour } from './wizard-steps/StepFour';
import { useCampaigns } from '@/contexts/CampaignsContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface CampaignWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: CampaignFormData) => void;
}

export const CampaignWizard = ({ open, onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CampaignFormData>>({
    targetingMethod: 'lifecycle',
    selectedBuckets: [],
    selectedLifecycleStages: [],
    priority: 'medium'
  });
  const { addCampaign } = useCampaigns();
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Campaign Details' },
    { number: 2, title: 'Audience Selection' },
    { number: 3, title: 'Content & Design' },
    { number: 4, title: 'Schedule & Review' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = () => {
    const estimatedReach = formData.targetingMethod === 'lifecycle'
      ? (formData.selectedLifecycleStages?.reduce((sum, stage) => {
          const counts = { new: 1867, active: 5602, loyal: 3112, 'at-risk': 1245, churned: 623, reactivated: 45 };
          return sum + (counts[stage] || 0);
        }, 0) || 0)
      : 456;

    const newCampaign: Campaign = {
      id: `CMP-${Date.now()}`,
      name: formData.name!,
      type: formData.type!,
      status: 'scheduled',
      targetAudience: formData.targetingMethod === 'lifecycle' 
        ? formData.selectedLifecycleStages?.join(', ') || 'Custom'
        : 'Sentiment-based',
      lifecycleTarget: formData.selectedLifecycleStages?.[0] || null,
      segmentSize: estimatedReach,
      subject: formData.subject || '',
      message: formData.message!,
      ctaText: formData.ctaText || '',
      ctaLink: formData.ctaLink || '',
      launchDate: formData.launchDate!,
      endDate: formData.endDate || '',
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0,
      isWinBackCampaign: formData.goal === 'win-back',
      reactivationCount: 0,
      goal: formData.goal,
      priority: formData.priority,
      budget: formData.budget
    };

    addCampaign(newCampaign);
    toast({
      title: 'Campaign Created',
      description: `${formData.name} has been scheduled successfully.`
    });
    onComplete(formData as CampaignFormData);
    setCurrentStep(1);
    setFormData({
      targetingMethod: 'lifecycle',
      selectedBuckets: [],
      selectedLifecycleStages: [],
      priority: 'medium'
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b-4 border-primary pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">Create Campaign</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="py-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-2 transition-colors ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-1">
          {currentStep === 1 && (
            <StepOne formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <StepTwo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <StepThree formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <StepFour formData={formData} updateFormData={updateFormData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Back
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Launch Campaign
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
