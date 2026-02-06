import { Journey, JourneyNode } from '@/types/journeys';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail, Clock, Filter, GitBranch, Zap,
  MessageSquare, Bell, X, Webhook
} from 'lucide-react';

interface JourneyDetailsModalProps {
  journey: Journey;
  onClose: () => void;
}

const NODE_ICONS: Record<string, React.ReactNode> = {
  trigger: <Zap className="w-4 h-4 text-amber-500" />,
  action: <Mail className="w-4 h-4 text-blue-500" />,
  wait: <Clock className="w-4 h-4 text-slate-500" />,
  condition: <Filter className="w-4 h-4 text-teal-500" />,
  split: <GitBranch className="w-4 h-4 text-orange-500" />,
  end: <div className="w-4 h-4 rounded-full border-2 border-slate-400" />,
};

function getChannelIcon(config: any) {
  if (!config || config.actionType !== 'send_message') return null;
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="w-3 h-3" />,
    sms: <MessageSquare className="w-3 h-3" />,
    push: <Bell className="w-3 h-3" />,
    whatsapp: <MessageSquare className="w-3 h-3" />,
  };
  return config.channel ? icons[config.channel] : null;
}

export function JourneyDetailsModal({ journey, onClose }: JourneyDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{journey.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{journey.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={journey.status === 'active' ? 'default' : 'secondary'}>
                  {journey.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Trigger: {journey.trigger.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 bg-muted/20">
            <h3 className="font-semibold mb-4 text-sm">Journey Flow</h3>
            <div className="space-y-1">
              {journey.nodes.map((node, idx) => (
                <div key={node.id}>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-background border flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      {NODE_ICONS[node.type]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{node.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground capitalize">{node.type}</span>
                        {getChannelIcon(node.config) && (
                          <Badge variant="outline" className="text-xs py-0 h-5 gap-1">
                            {getChannelIcon(node.config)}
                            {(node.config as any).channel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {idx < journey.nodes.length - 1 && (
                    <div className="ml-[22px] h-4 border-l-2 border-dashed border-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Performance Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Entered</p>
                <p className="text-xl font-bold">{journey.analytics.totalEntered.toLocaleString()}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{journey.analytics.totalCompleted.toLocaleString()}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-xl font-bold">{journey.analytics.conversionRate}%</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Avg Completion</p>
                <p className="text-xl font-bold">{journey.analytics.avgCompletionTime}h</p>
              </div>
            </div>
          </div>

          {journey.analytics.stepPerformance.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm">Step Performance</h3>
              <div className="space-y-2">
                {journey.analytics.stepPerformance.map(step => (
                  <div key={step.nodeId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{step.nodeName}</p>
                      <span className="text-xs text-muted-foreground">
                        Drop rate: {step.dropRate}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${step.entered > 0 ? (step.completed / step.entered) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{step.entered.toLocaleString()} entered</span>
                      <span>{step.completed.toLocaleString()} completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {journey.analytics.channelPerformance.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm">Channel Performance</h3>
              <div className="space-y-2">
                {journey.analytics.channelPerformance.map(channel => (
                  <div key={channel.channel} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm capitalize">{channel.channel}</p>
                      <Badge variant="outline">
                        {channel.conversions.toLocaleString()} conversions
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-semibold">{channel.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivered</p>
                        <p className="font-semibold">{channel.delivered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-semibold">{channel.opened.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicked</p>
                        <p className="font-semibold">{channel.clicked.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
