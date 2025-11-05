import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CampaignFormData } from '@/types/campaign';

interface StepThreeProps {
  formData: Partial<CampaignFormData>;
  updateFormData: (data: Partial<CampaignFormData>) => void;
}

export const StepThree = ({ formData, updateFormData }: StepThreeProps) => {
  const channelGuidelines: Record<string, { subject?: number; message: number }> = {
    Email: { subject: 60, message: 500 },
    SMS: { message: 160 },
    WhatsApp: { message: 300 },
    Push: { subject: 40, message: 120 }
  };

  const guidelines = formData.type ? channelGuidelines[formData.type] : null;

  const getTemplates = () => {
    if (formData.goal === 'win-back') {
      return [
        {
          subject: "We Miss You at United Capital!",
          message: "It's been a while since we've seen you. Come back and enjoy 15% bonus on your first deposit. Your financial goals are waiting!",
          cta: "Claim Your Bonus"
        },
        {
          subject: "Special Comeback Offer Just for You",
          message: "We value your partnership. Return today and get zero fees for 3 months on all transactions. Let's continue your wealth journey together.",
          cta: "Return Now"
        }
      ];
    }
    if (formData.goal === 'reactivation-nurture') {
      return [
        {
          subject: "Welcome Back to United Capital!",
          message: "Great to have you back! We've missed you. Explore our new investment options designed just for returning customers like you.",
          cta: "Explore Now"
        }
      ];
    }
    return [];
  };

  const templates = getTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Content & Design</h3>
        <p className="text-sm text-muted-foreground">Create compelling content for your campaign</p>
      </div>

      {/* Template Suggestions */}
      {templates.length > 0 && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            💡 Template Suggestions for {formData.goal}
          </h4>
          <div className="space-y-3">
            {templates.map((template, idx) => (
              <div
                key={idx}
                className="bg-card border rounded p-3 cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  updateFormData({
                    subject: template.subject,
                    message: template.message,
                    ctaText: template.cta
                  });
                }}
              >
                <div className="text-sm font-medium text-foreground">{template.subject}</div>
                <div className="text-xs text-muted-foreground mt-1">{template.message}</div>
                <div className="text-xs text-primary mt-2">CTA: {template.cta}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Line (if applicable) */}
      {formData.type && ['Email', 'Push'].includes(formData.type) && (
        <div className="space-y-2">
          <Label htmlFor="subject">
            Subject Line {guidelines && `(${formData.subject?.length || 0}/${guidelines.subject})`}
          </Label>
          <Input
            id="subject"
            placeholder={`Enter ${formData.type} subject...`}
            value={formData.subject || ''}
            onChange={(e) => updateFormData({ subject: e.target.value })}
            maxLength={guidelines?.subject}
          />
          {guidelines && formData.subject && formData.subject.length > guidelines.subject * 0.9 && (
            <p className="text-xs text-warning">Approaching character limit</p>
          )}
        </div>
      )}

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Message {guidelines && `(${formData.message?.length || 0}/${guidelines.message})`}
        </Label>
        <Textarea
          id="message"
          placeholder="Write your campaign message..."
          value={formData.message || ''}
          onChange={(e) => updateFormData({ message: e.target.value })}
          maxLength={guidelines?.message}
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {formData.type === 'SMS' && 'Keep it concise for SMS'}
          {formData.type === 'Email' && 'Include a clear value proposition'}
          {formData.type === 'WhatsApp' && 'Personal and conversational works best'}
          {formData.type === 'Push' && 'Short and urgent messages perform better'}
        </p>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ctaText">Call-to-Action Text</Label>
          <Input
            id="ctaText"
            placeholder="e.g., Get Started"
            value={formData.ctaText || ''}
            onChange={(e) => updateFormData({ ctaText: e.target.value })}
            maxLength={30}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaLink">CTA Link (Optional)</Label>
          <Input
            id="ctaLink"
            type="url"
            placeholder="https://..."
            value={formData.ctaLink || ''}
            onChange={(e) => updateFormData({ ctaLink: e.target.value })}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border border-border rounded-lg p-4 bg-muted/30">
        <h4 className="text-sm font-semibold text-foreground mb-3">Preview</h4>
        <div className="bg-card border rounded p-4 space-y-3">
          {formData.subject && (
            <div className="font-semibold text-foreground">{formData.subject}</div>
          )}
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {formData.message || 'Your message will appear here...'}
          </div>
          {formData.ctaText && (
            <div>
              <button className="bg-primary text-white px-4 py-2 rounded text-sm font-medium">
                {formData.ctaText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};