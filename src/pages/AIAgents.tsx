import { Bot, Plus, Play, Pause, Settings, TrendingUp, MessageSquare, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export const AIAgents = () => {
  const agents = [
    {
      id: '1',
      name: 'Churn Prevention Agent',
      description: 'Automatically identifies at-risk customers and triggers win-back campaigns',
      status: 'active',
      tasksCompleted: 245000,
      successRate: 87,
      type: 'retention'
    },
    {
      id: '2',
      name: 'Sentiment Analyzer',
      description: 'Analyzes customer feedback and assigns sentiment scores',
      status: 'active',
      tasksCompleted: 1842000,
      successRate: 92,
      type: 'analysis'
    },
    {
      id: '3',
      name: 'Campaign Optimizer',
      description: 'Optimizes campaign targeting based on customer behavior',
      status: 'paused',
      tasksCompleted: 156000,
      successRate: 78,
      type: 'marketing'
    },
    {
      id: '4',
      name: 'Response Bot',
      description: 'Handles common customer inquiries automatically',
      status: 'active',
      tasksCompleted: 3421000,
      successRate: 95,
      type: 'support'
    }
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      retention: 'bg-primary/10 text-primary',
      analysis: 'bg-success/10 text-success',
      marketing: 'bg-accent/10 text-accent',
      support: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">AI Agents</h1>
          <p className="text-muted-foreground mt-1">Configure and manage AI automation agents</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Agents</p>
            <Bot className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">3</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">5,664,000</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Success Rate</p>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">88%</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Interactions</p>
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">12.4M</h3>
        </Card>
      </div>

      {/* Agents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(agent.type)}`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
              <Switch checked={agent.status === 'active'} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {agent.tasksCompleted.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-semibold text-foreground">{agent.successRate}%</p>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" className="flex-1">
                View Logs
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};