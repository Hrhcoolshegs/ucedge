import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Journey, JourneyNode } from '@/types/journeys';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JourneyDetailsModal } from '@/components/journeys/JourneyDetailsModal';
import {
  Mail, Clock, Filter, GitBranch, Zap,
  Users, TrendingUp, Activity, ArrowRight
} from 'lucide-react';

const NODE_TYPE_ICONS: Record<string, React.ReactNode> = {
  trigger: <Zap className="w-3.5 h-3.5" />,
  action: <Mail className="w-3.5 h-3.5" />,
  wait: <Clock className="w-3.5 h-3.5" />,
  condition: <Filter className="w-3.5 h-3.5" />,
  split: <GitBranch className="w-3.5 h-3.5" />,
};

function getUniqueNodeTypes(nodes: JourneyNode[]): string[] {
  return Array.from(new Set(nodes.filter(n => n.type !== 'end').map(n => n.type)));
}

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  paused: 'secondary',
  draft: 'outline',
  completed: 'secondary',
  archived: 'outline',
};

export default function JourneyBuilder() {
  const { journeys } = useData();
  const [selectedJourney, setSelectedJourney] = useState<Journey | undefined>(undefined);

  const activeJourneys = journeys.filter(j => j.status === 'active');
  const totalEntered = journeys.reduce((s, j) => s + j.analytics.totalEntered, 0);
  const totalCompleted = journeys.reduce((s, j) => s + j.analytics.totalCompleted, 0);
  const avgConversion = journeys.length > 0
    ? journeys.reduce((s, j) => s + j.analytics.conversionRate, 0) / journeys.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Journey Orchestration</h1>
          <p className="text-muted-foreground mt-1">
            Automate customer engagement across touchpoints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Journeys</p>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold">{activeJourneys.length}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Entered</p>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold">{totalEntered.toLocaleString()}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Completed</p>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold">{totalCompleted.toLocaleString()}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Conversion</p>
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold">{avgConversion.toFixed(1)}%</h3>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {journeys.map(journey => (
          <Card
            key={journey.id}
            className="cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => setSelectedJourney(journey)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-base leading-tight">{journey.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {journey.description}
                  </p>
                </div>
                <Badge variant={STATUS_COLORS[journey.status] || 'outline'} className="ml-2 flex-shrink-0">
                  {journey.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground text-xs">Entered</p>
                  <p className="font-semibold">{journey.analytics.totalEntered.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Conversion</p>
                  <p className="font-semibold">{journey.analytics.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Active</p>
                  <p className="font-semibold">{journey.analytics.totalActive.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Avg Time</p>
                  <p className="font-semibold">{journey.analytics.avgCompletionTime}h</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex gap-1.5 flex-wrap">
                  {getUniqueNodeTypes(journey.nodes).map(type => (
                    <div key={type} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                      {NODE_TYPE_ICONS[type]}
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedJourney && (
        <JourneyDetailsModal
          journey={selectedJourney}
          onClose={() => setSelectedJourney(undefined)}
        />
      )}
    </div>
  );
}
