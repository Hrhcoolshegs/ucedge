import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CampaignFormData } from '@/types/campaign';
import { StepOne } from './wizard-steps/StepOne';
import { StepTwo } from './wizard-steps/StepTwo';
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
    onComplete(formData as CampaignFormData);
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
            <div className="text-center py-12">
              <p className="text-muted-foreground">Step 3: Content & Design - Coming soon</p>
            </div>
          )}
          {currentStep === 4 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Step 4: Schedule & Review - Coming soon</p>
            </div>
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
