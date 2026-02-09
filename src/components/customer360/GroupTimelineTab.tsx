import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerTimelineEvent } from '@/types';
import { formatDate } from '@/utils/formatters';
import { supabase } from '@/lib/supabase';
import {
  MessageSquare,
  CreditCard,
  Briefcase,
  TrendingUp,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface GroupTimelineTabProps {
  customerId: string;
}

const getEventIcon = (eventType: CustomerTimelineEvent['event_type']) => {
  switch (eventType) {
    case 'ENGAGEMENT': return MessageSquare;
    case 'TRANSACTION': return CreditCard;
    case 'LOAN': return Briefcase;
    case 'PORTFOLIO': return TrendingUp;
    case 'DEAL': return Briefcase;
    case 'CONSENT': return FileText;
    case 'NOTE': return FileText;
    case 'SUPPORT': return HelpCircle;
    case 'KYC': return CheckCircle;
    case 'RISK_REVIEW': return AlertTriangle;
    case 'LIFECYCLE': return Activity;
    default: return Activity;
  }
};

const getEventColor = (eventType: CustomerTimelineEvent['event_type']) => {
  switch (eventType) {
    case 'ENGAGEMENT': return 'text-blue-500';
    case 'TRANSACTION': return 'text-green-500';
    case 'LOAN': return 'text-purple-500';
    case 'PORTFOLIO': return 'text-indigo-500';
    case 'DEAL': return 'text-orange-500';
    case 'CONSENT': return 'text-gray-500';
    case 'NOTE': return 'text-gray-500';
    case 'SUPPORT': return 'text-yellow-500';
    case 'KYC': return 'text-green-600';
    case 'RISK_REVIEW': return 'text-red-500';
    case 'LIFECYCLE': return 'text-cyan-500';
    default: return 'text-gray-500';
  }
};

export const GroupTimelineTab = ({ customerId }: GroupTimelineTabProps) => {
  const [events, setEvents] = useState<CustomerTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      const { data, error } = await supabase
        .from('customer_timeline_events')
        .select(`
          id,
          event_type,
          title,
          description,
          metadata,
          occurred_at,
          created_at,
          business_unit:business_units (
            id,
            code,
            name
          ),
          created_by:users!created_by_user_id (
            id,
            full_name
          )
        `)
        .eq('customer_id', customerId)
        .order('occurred_at', { ascending: false });

      if (!error && data) {
        setEvents(data as any);
      }
      setLoading(false);
    };

    fetchTimeline();
  }, [customerId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Group Activity Timeline</h3>
          <p className="text-sm text-muted-foreground">
            All activities across United Capital Group business units
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          No timeline events found
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Group Activity Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Complete history of interactions across all business units
          </p>
        </div>

        <div className="relative space-y-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {events.map((event, idx) => {
            const Icon = getEventIcon(event.event_type);
            const iconColor = getEventColor(event.event_type);

            return (
              <div key={event.id} className="relative flex gap-4">
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 ${iconColor.replace('text-', 'border-')}`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>

                <Card className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.event_type}
                        </Badge>
                        {event.business_unit && (
                          <Badge variant="secondary" className="text-xs">
                            {event.business_unit.code}
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDate(event.occurred_at)}
                    </span>
                  </div>

                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(event.metadata).slice(0, 4).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground">{key}: </span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
