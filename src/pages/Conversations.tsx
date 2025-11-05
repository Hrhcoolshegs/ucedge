import { useState } from 'react';
import { MessageSquare, Search, Filter, Clock, User, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

export const Conversations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const conversations = [
    {
      id: '1',
      customer: 'Sarah Johnson',
      subject: 'Question about recent transaction',
      lastMessage: 'Thanks for the clarification!',
      status: 'resolved',
      channel: 'email',
      timestamp: new Date('2024-01-15T14:30:00'),
      unread: false
    },
    {
      id: '2',
      customer: 'Michael Chen',
      subject: 'Account access issue',
      lastMessage: 'I\'m still unable to login...',
      status: 'open',
      channel: 'chat',
      timestamp: new Date('2024-01-15T16:45:00'),
      unread: true
    },
    {
      id: '3',
      customer: 'Emily Rodriguez',
      subject: 'Product inquiry',
      lastMessage: 'Can you send me more details?',
      status: 'pending',
      channel: 'email',
      timestamp: new Date('2024-01-14T09:20:00'),
      unread: true
    },
    {
      id: '4',
      customer: 'David Park',
      subject: 'Billing question',
      lastMessage: 'All sorted, thank you!',
      status: 'resolved',
      channel: 'phone',
      timestamp: new Date('2024-01-14T11:15:00'),
      unread: false
    },
    {
      id: '5',
      customer: 'Lisa Anderson',
      subject: 'Feature request',
      lastMessage: 'Looking forward to this feature',
      status: 'open',
      channel: 'chat',
      timestamp: new Date('2024-01-15T10:30:00'),
      unread: true
    }
  ];

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-primary/10 text-primary',
      pending: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-success/10 text-success'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const stats = [
    { label: 'Total', value: 850000, icon: MessageSquare },
    { label: 'Open', value: 125000, icon: MessageSquare },
    { label: 'Pending', value: 48000, icon: Clock },
    { label: 'Resolved', value: 677000, icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent">Conversations</h1>
        <p className="text-muted-foreground mt-1">View and manage customer conversations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.map((conv) => (
          <Card 
            key={conv.id} 
            className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
              conv.unread ? 'border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                    {conv.customer.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{conv.customer}</h3>
                      {conv.unread && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-accent">{conv.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-13">{conv.lastMessage}</p>
              </div>
              
              <div className="text-right space-y-2">
                <Badge className={getStatusColor(conv.status)}>
                  {conv.status}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(conv.timestamp.toISOString())}
                </div>
                <Badge variant="outline" className="text-xs">
                  {conv.channel}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};