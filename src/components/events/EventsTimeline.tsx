import { CustomerEvent } from '@/types/events';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Smartphone, Eye, ArrowUpRight, ArrowDownLeft,
  CreditCard, Mail, MessageSquare, Bell,
  HelpCircle, Zap, ShoppingBag, Radio
} from 'lucide-react';

interface EventsTimelineProps {
  events: CustomerEvent[];
  limit?: number;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  app_opened: <Smartphone className="w-5 h-5 text-blue-600" />,
  screen_viewed: <Eye className="w-5 h-5 text-slate-500" />,
  transfer_completed: <ArrowUpRight className="w-5 h-5 text-emerald-600" />,
  transfer_initiated: <ArrowUpRight className="w-5 h-5 text-amber-500" />,
  deposit_made: <ArrowDownLeft className="w-5 h-5 text-emerald-600" />,
  account_funded: <ArrowDownLeft className="w-5 h-5 text-emerald-600" />,
  withdrawal_made: <ArrowUpRight className="w-5 h-5 text-red-500" />,
  bill_payment_completed: <CreditCard className="w-5 h-5 text-sky-500" />,
  airtime_purchase: <Radio className="w-5 h-5 text-orange-500" />,
  email_opened: <Mail className="w-5 h-5 text-blue-500" />,
  email_clicked: <Mail className="w-5 h-5 text-blue-600" />,
  sms_clicked: <MessageSquare className="w-5 h-5 text-emerald-500" />,
  push_notification_opened: <Bell className="w-5 h-5 text-amber-500" />,
  help_article_viewed: <HelpCircle className="w-5 h-5 text-slate-400" />,
  loan_application_started: <ShoppingBag className="w-5 h-5 text-teal-500" />,
  investment_viewed: <Zap className="w-5 h-5 text-amber-600" />,
  feature_clicked: <Zap className="w-5 h-5 text-slate-500" />,
};

function formatEventName(eventType: string): string {
  return eventType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function EventsTimeline({ events, limit = 20 }: EventsTimelineProps) {
  const displayEvents = events.slice(0, limit);

  if (displayEvents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No activity events recorded yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {displayEvents.map((event) => (
        <Card key={event.eventId} className="hover:border-primary/30 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {EVENT_ICONS[event.eventType] || <Smartphone className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm">
                    {formatEventName(event.eventType)}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs capitalize">
                    {event.channel.replace('_', ' ')}
                  </Badge>

                  {event.properties.amount != null && (
                    <span className="text-xs text-muted-foreground">
                      N{Number(event.properties.amount).toLocaleString()}
                    </span>
                  )}

                  {event.properties.screenName && (
                    <span className="text-xs text-muted-foreground">
                      {event.properties.screenName}
                    </span>
                  )}

                  {event.deviceInfo && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {event.deviceInfo.platform}
                    </Badge>
                  )}
                </div>

                {(event.properties.recipient || event.properties.biller || event.properties.network || event.properties.productName) && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {event.properties.recipient && <span>To: {event.properties.recipient}</span>}
                    {event.properties.biller && <span>Biller: {event.properties.biller}</span>}
                    {event.properties.network && <span>Network: {event.properties.network}</span>}
                    {event.properties.productName && <span>Product: {event.properties.productName}</span>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
