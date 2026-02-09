import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ContextualNLPProps {
  context: {
    page: string;
    section?: string;
    data?: any;
  };
}

const CONTEXT_KNOWLEDGE: Record<string, any> = {
  analytics: {
    description: 'Comprehensive analytics and reporting platform',
    capabilities: [
      'View revenue trends and forecasts',
      'Analyze customer growth and churn',
      'Track campaign performance',
      'Create custom reports',
      'Export data for external analysis'
    ],
    sampleQuestions: [
      'What is the current conversion rate?',
      'Show me revenue trend',
      'How many customers churned last month?',
      'What are my top performing products?'
    ]
  },
  campaigns: {
    description: 'Campaign management and execution',
    capabilities: [
      'Create and launch campaigns',
      'Target specific segments',
      'Track campaign performance',
      'A/B test campaigns',
      'Schedule campaigns'
    ],
    sampleQuestions: [
      'How do I create a new campaign?',
      'What segments can I target?',
      'Show me campaign performance metrics',
      'How do I schedule a campaign?'
    ]
  },
  segments: {
    description: 'Customer segmentation and targeting',
    capabilities: [
      'Create dynamic segments',
      'Use behavioral criteria',
      'Target by lifecycle stage',
      'Export segment data',
      'View segment analytics'
    ],
    sampleQuestions: [
      'How do I create a new segment?',
      'What criteria can I use?',
      'Show me high-value customers',
      'How many customers are in each segment?'
    ]
  },
  'customer-360': {
    description: 'Complete customer view and management',
    capabilities: [
      'View customer profile',
      'Track customer timeline',
      'See all interactions',
      'Manage customer data',
      'View risk signals'
    ],
    sampleQuestions: [
      'Show me customer details',
      'What is customer lifetime value?',
      'Show customer interaction history',
      'What products does this customer use?'
    ]
  },
  journeys: {
    description: 'Customer journey automation',
    capabilities: [
      'Build automated journeys',
      'Create multi-step workflows',
      'Add conditional logic',
      'Track journey performance',
      'Personalize customer experiences'
    ],
    sampleQuestions: [
      'How do I create a journey?',
      'What triggers can I use?',
      'Show me journey performance',
      'How do I add conditions?'
    ]
  },
  'churn-config': {
    description: 'Churn prediction and prevention',
    capabilities: [
      'Configure churn metrics',
      'Set churn thresholds',
      'Track at-risk customers',
      'Create retention campaigns',
      'Monitor churn trends'
    ],
    sampleQuestions: [
      'How is churn calculated?',
      'Show me at-risk customers',
      'What are the churn stages?',
      'How do I create a churn metric?'
    ]
  },
  dashboard: {
    description: 'Main dashboard and overview',
    capabilities: [
      'View key metrics',
      'Track business performance',
      'Monitor customer activity',
      'See recent transactions',
      'View risk alerts'
    ],
    sampleQuestions: [
      'What are my key metrics?',
      'Show me today\'s performance',
      'How many active customers?',
      'What are the top alerts?'
    ]
  },
  'sentiment-analysis': {
    description: 'Customer sentiment analysis and insights',
    capabilities: [
      'Analyze customer sentiment',
      'Track sentiment trends',
      'View sentiment by segment',
      'Monitor feedback patterns',
      'Identify sentiment drivers'
    ],
    sampleQuestions: [
      'What is the overall sentiment?',
      'Show me negative sentiment trends',
      'Which segments have the best sentiment?',
      'What are customers saying?'
    ]
  }
};

export const ContextualNLP = ({ context }: ContextualNLPProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const contextInfo = CONTEXT_KNOWLEDGE[context.page] || CONTEXT_KNOWLEDGE.dashboard;
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hello! I'm your AI assistant for ${contextInfo.description}. I can help you with:\n\n${contextInfo.capabilities.map((c: string) => `• ${c}`).join('\n')}\n\nTry asking me questions like:\n${contextInfo.sampleQuestions.map((q: string) => `"${q}"`).join('\n')}`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, context.page]);

  const generateResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();
    const contextInfo = CONTEXT_KNOWLEDGE[context.page] || CONTEXT_KNOWLEDGE.dashboard;

    if (question.includes('how') && (question.includes('create') || question.includes('make'))) {
      if (context.page === 'campaigns') {
        return 'To create a new campaign:\n\n1. Click the "Create Campaign" button\n2. Select your campaign type (Email, SMS, Push, etc.)\n3. Choose your target segment\n4. Define your message and CTA\n5. Set your schedule\n6. Review and launch\n\nWould you like help with any specific step?';
      } else if (context.page === 'segments') {
        return 'To create a new segment:\n\n1. Click "Create Segment"\n2. Choose segment type (Behavioral, Demographic, etc.)\n3. Add your criteria (e.g., age, location, purchase history)\n4. Use AND/OR logic for complex rules\n5. Save and name your segment\n\nThe segment will update automatically based on your criteria.';
      } else if (context.page === 'journeys') {
        return 'To create a customer journey:\n\n1. Click "Create Journey"\n2. Choose your trigger (event, time-based, manual)\n3. Drag nodes from the palette to build your flow\n4. Configure each node (wait times, conditions, actions)\n5. Connect nodes to define the flow\n6. Test and publish\n\nYou can add splits, conditions, and delays to personalize the experience.';
      }
    }

    if (question.includes('metric') || question.includes('kpi') || question.includes('performance')) {
      if (context.page === 'analytics') {
        return 'Key metrics available in Analytics:\n\n📊 Revenue Metrics:\n• Total Revenue: ₦328M\n• MRR: ₦5.6M\n• ARR: ₦67.2M\n• ARPU: ₦6,588\n\n👥 Customer Metrics:\n• Total Customers: 25\n• Active Users: 810K\n• Churn Rate: 1.5%\n• Conversion Rate: 5.6%\n\n📈 Growth Metrics:\n• Customer Growth: +8.2%\n• Revenue Growth: +12.5%\n• CAC: ₦125\n• LTV: ₦3,750\n\nYou can filter by business unit, date range, and metric type.';
      } else if (context.page === 'campaigns') {
        return 'Campaign performance metrics:\n\n• Sent: Total messages sent\n• Delivered: Successfully delivered messages\n• Open Rate: % of recipients who opened\n• Click Rate: % who clicked your CTA\n• Conversion Rate: % who completed desired action\n• ROI: Revenue generated vs. campaign cost\n\nTrack these in real-time on the Campaigns page.';
      }
    }

    if (question.includes('churn') || question.includes('at-risk') || question.includes('retention')) {
      return 'Churn Management:\n\n🎯 Current Churn Rate: 1.5% (down 0.8pp)\n\nChurn Stages:\n• Healthy: Active engaged customers\n• At-Risk: Showing early warning signs\n• Churning: High probability of leaving\n• Churned: No longer active\n\nPrevention Strategies:\n• Identify at-risk customers early\n• Create retention campaigns\n• Offer personalized incentives\n• Improve customer experience\n• Monitor key engagement metrics\n\nYou can configure custom churn metrics in Churn Configuration.';
    }

    if (question.includes('segment') || question.includes('target') || question.includes('audience')) {
      return 'Customer Segmentation:\n\nAvailable segment types:\n• Lifecycle Segments: New, Active, At-Risk, Churned\n• Value Segments: High, Medium, Low Value\n• Behavioral Segments: Based on actions and usage\n• Business Segments: By business unit or product\n\nSegmentation criteria:\n• Demographics (age, location, etc.)\n• Behavioral (purchases, engagement)\n• Transactional (spend, frequency)\n• Product usage\n• Risk factors\n\nUse these segments for targeted campaigns and personalization.';
    }

    if (question.includes('revenue') || question.includes('sales') || question.includes('money')) {
      return 'Revenue Insights:\n\n💰 Current Performance:\n• Total Revenue: ₦328M (+12.5%)\n• Monthly Recurring Revenue: ₦5.6M\n• Average Transaction: ₦1,312\n\nTop Revenue Products:\n1. Savings Account: ₦6.5M\n2. Investment Plan: ₦4.5M\n3. Fixed Deposit: ₦3.8M\n4. Loan Products: ₦2.8M\n5. Card Services: ₦2.2M\n\nRevenue is growing steadily with strong performance in Q4.';
    }

    if (question.includes('customer') || question.includes('user')) {
      return 'Customer Insights:\n\n👥 Customer Overview:\n• Total Customers: 25\n• Active Users: 810K\n• New This Month: 30K\n• Customer Growth: +8.2%\n\n📊 Segment Breakdown:\n• High Value: 15K customers (₦45M revenue)\n• Medium Value: 35K customers (₦35M revenue)\n• Low Value: 50K customers (₦10M revenue)\n• At Risk: 8K customers (₦5M revenue)\n\n🎯 Key Metrics:\n• LTV: ₦3,750\n• CAC: ₦125\n• LTV:CAC Ratio: 30:1\n\nFocus on reducing at-risk segment and growing high-value customers.';
    }

    if (question.includes('campaign') || question.includes('marketing')) {
      return 'Campaign Management:\n\n📧 Active Campaigns: 6\n\nCampaign Types Available:\n• Email Campaigns\n• SMS Campaigns\n• Push Notifications\n• WhatsApp Messages\n\nBest Practices:\n• Segment your audience for better targeting\n• Personalize messages using customer data\n• A/B test subject lines and content\n• Schedule for optimal send times\n• Track and optimize based on performance\n\nAverage campaign metrics:\n• Open Rate: 28%\n• Click Rate: 12%\n• Conversion Rate: 5.6%';
    }

    if (question.includes('help') || question.includes('what can you')) {
      return `I can help you with ${contextInfo.description}.\n\nMy capabilities:\n${contextInfo.capabilities.map((c: string) => `• ${c}`).join('\n')}\n\nTry asking:\n${contextInfo.sampleQuestions.map((q: string) => `"${q}"`).join('\n')}\n\nI understand your current context (${context.page}) and can provide specific answers about this feature.`;
    }

    if (question.includes('filter') || question.includes('search') || question.includes('find')) {
      return 'Filtering & Search:\n\nAvailable filters:\n• Business Unit: Filter by Microfinance, Asset Mgmt, Inv Banking, or Wealth\n• Date Range: Select specific time periods\n• Status: Active, Inactive, Pending, etc.\n• Customer Type: Individual, Corporate, Government\n• Risk Level: Low, Medium, High\n\nTips:\n• Combine multiple filters for precise results\n• Save common filter combinations\n• Export filtered data for analysis\n• Use advanced search for specific criteria';
    }

    if (question.includes('sentiment') || question.includes('feedback') || question.includes('opinion')) {
      return 'Customer Sentiment Analysis:\n\n😊 Sentiment Overview:\n• Positive: 65% (↑ 5%)\n• Neutral: 25%\n• Negative: 10% (↓ 2%)\n\n📊 Sentiment by Segment:\n• High Value: 78% positive\n• Medium Value: 68% positive\n• Low Value: 52% positive\n• At Risk: 35% positive\n\n🔍 Key Insights:\n• Product quality is main positive driver\n• Customer service mentioned most frequently\n• Response time affects sentiment\n• Mobile app experience improving\n\nTop Positive Themes:\n• Fast service\n• Helpful support staff\n• Easy-to-use platform\n\nTop Negative Themes:\n• Long wait times\n• Complex processes\n• Limited features\n\nUse this data to improve customer experience and retention.';
    }

    return `I understand you're asking about "${userQuestion}".\n\nBased on your current page (${contextInfo.description}), here are some things I can help with:\n\n${contextInfo.capabilities.map((c: string) => `• ${c}`).join('\n')}\n\nCould you rephrase your question or try one of these:\n${contextInfo.sampleQuestions.slice(0, 3).map((q: string) => `• ${q}`).join('\n')}`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5" />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-90">{CONTEXT_KNOWLEDGE[context.page]?.description || 'Here to help'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <Badge variant="secondary" className="mb-2 text-xs">
                Context: {context.page} {context.section && `• ${context.section}`}
              </Badge>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
