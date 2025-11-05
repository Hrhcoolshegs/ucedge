import { Phone, Users, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export const LiveSupport = () => {
  const agents = [
    { id: '1', name: 'Sarah Mitchell', status: 'online', activeChats: 3, rating: 4.9 },
    { id: '2', name: 'James Wilson', status: 'online', activeChats: 2, rating: 4.8 },
    { id: '3', name: 'Maria Garcia', status: 'busy', activeChats: 4, rating: 4.7 },
    { id: '4', name: 'David Chen', status: 'away', activeChats: 0, rating: 4.9 }
  ];

  const activeChats = [
    { id: '1', customer: 'Alice Johnson', agent: 'Sarah Mitchell', duration: 15, priority: 'high' },
    { id: '2', customer: 'Bob Smith', agent: 'James Wilson', duration: 8, priority: 'medium' },
    { id: '3', customer: 'Carol Davis', agent: 'Sarah Mitchell', duration: 22, priority: 'low' },
    { id: '4', customer: 'Dan Lee', agent: 'Maria Garcia', duration: 5, priority: 'high' }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      online: 'bg-success',
      busy: 'bg-yellow-500',
      away: 'bg-muted'
    };
    return colors[status] || 'bg-muted';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-destructive/10 text-destructive',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-success/10 text-success'
    };
    return colors[priority] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Live Support</h1>
          <p className="text-muted-foreground mt-1">Real-time customer support dashboard</p>
        </div>
        <Button>
          <Phone className="h-4 w-4 mr-2" />
          Start New Chat
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Chats</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{activeChats.length}</h3>
          <p className="text-sm text-success mt-1">+2 from last hour</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Response</p>
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">45s</h3>
          <p className="text-sm text-success mt-1">12% faster</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Resolved Today</p>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">127,000</h3>
          <p className="text-sm text-success mt-1">+18% vs yesterday</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Satisfaction</p>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">4.8/5</h3>
          <p className="text-sm text-success mt-1">+0.2 this week</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agents */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Support Agents</h2>
          <div className="space-y-2">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{agent.status}</span>
                        <span>•</span>
                        <span>{agent.activeChats} active</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-foreground">{agent.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Chats */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Active Conversations</h2>
          <div className="space-y-2">
            {activeChats.map((chat) => (
              <Card key={chat.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-medium">
                      {chat.customer.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{chat.customer}</h3>
                      <p className="text-sm text-muted-foreground">with {chat.agent}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(chat.priority)}>
                    {chat.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{chat.duration} min</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};