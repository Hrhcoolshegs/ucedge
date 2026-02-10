import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Segment, Customer } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatters';
import { Users, TrendingUp, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SegmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: Segment | null;
  customers: Customer[];
}

const sentimentBucketColors: Record<string, string> = {
  'champions': 'bg-green-500/10 text-green-700 border-green-500/30',
  'loyal': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  'potential': 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30',
  'new': 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  'promising': 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30',
  'need-attention': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  'about-to-sleep': 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  'at-risk': 'bg-red-500/10 text-red-700 border-red-500/30',
  'cant-lose': 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  'hibernating': 'bg-gray-500/10 text-gray-700 border-gray-500/30',
  'lost': 'bg-slate-500/10 text-slate-700 border-slate-500/30',
};

const sentimentBucketLabels: Record<string, string> = {
  'champions': 'Champions',
  'loyal': 'Loyal Customers',
  'potential': 'Potential Loyalists',
  'new': 'New Customers',
  'promising': 'Promising',
  'need-attention': 'Need Attention',
  'about-to-sleep': 'About to Sleep',
  'at-risk': 'At Risk',
  'cant-lose': "Can't Lose Them",
  'hibernating': 'Hibernating',
  'lost': 'Lost',
};

export const SegmentDetailsModal = ({ open, onOpenChange, segment, customers }: SegmentDetailsModalProps) => {
  const [expandedBuckets, setExpandedBuckets] = useState<Set<string>>(new Set(['champions', 'loyal', 'at-risk']));

  if (!segment) return null;

  const customersByBucket = customers.reduce((acc, customer) => {
    const bucket = customer.sentimentBucket || 'unknown';
    if (!acc[bucket]) {
      acc[bucket] = [];
    }
    acc[bucket].push(customer);
    return acc;
  }, {} as Record<string, Customer[]>);

  const buckets = Object.keys(customersByBucket).sort((a, b) => {
    return customersByBucket[b].length - customersByBucket[a].length;
  });

  const toggleBucket = (bucket: string) => {
    setExpandedBuckets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bucket)) {
        newSet.delete(bucket);
      } else {
        newSet.add(bucket);
      }
      return newSet;
    });
  };

  const totalLTV = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const avgLTV = customers.length > 0 ? totalLTV / customers.length : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{segment.name}</DialogTitle>
          <p className="text-muted-foreground">{segment.description}</p>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <Card className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Total Customers</span>
            </div>
            <p className="text-2xl font-bold">{customers.length.toLocaleString()}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total LTV</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalLTV)}</p>
          </Card>
          <Card className="p-3">
            <div className="text-muted-foreground mb-1">
              <span className="text-xs">Avg LTV</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgLTV)}</p>
          </Card>
          <Card className="p-3">
            <div className="text-muted-foreground mb-1">
              <span className="text-xs">Segment Type</span>
            </div>
            <Badge className="mt-1">{segment.type.toUpperCase()}</Badge>
          </Card>
        </div>

        <Tabs defaultValue="buckets" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="buckets">Customer Buckets ({buckets.length})</TabsTrigger>
            <TabsTrigger value="all">All Customers ({customers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="buckets" className="flex-1 min-h-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {buckets.map(bucket => {
                  const bucketCustomers = customersByBucket[bucket];
                  const isExpanded = expandedBuckets.has(bucket);
                  const bucketLabel = sentimentBucketLabels[bucket] || bucket;
                  const bucketColor = sentimentBucketColors[bucket] || 'bg-gray-500/10 text-gray-700 border-gray-500/30';

                  return (
                    <Card key={bucket} className="overflow-hidden">
                      <button
                        onClick={() => toggleBucket(bucket)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                          <Badge className={cn('border', bucketColor)}>
                            {bucketLabel}
                          </Badge>
                          <span className="text-sm font-medium">
                            {bucketCustomers.length} customers
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total LTV: {formatCurrency(bucketCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0))}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t bg-muted/20">
                          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                            {bucketCustomers.map(customer => (
                              <Card key={customer.id} className="p-3 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-foreground">{customer.name}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {customer.lifecycleStage}
                                      </Badge>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        {customer.email}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        {customer.phone}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-muted-foreground">LTV</div>
                                    <div className="text-lg font-bold text-foreground">
                                      {formatCurrency(customer.lifetimeValue)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Engagement: {customer.engagementLevel}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all" className="flex-1 min-h-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {customers.map(customer => (
                  <Card key={customer.id} className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{customer.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {customer.lifecycleStage}
                          </Badge>
                          <Badge className={cn('text-xs border', sentimentBucketColors[customer.sentimentBucket] || 'bg-gray-500/10 text-gray-700')}>
                            {sentimentBucketLabels[customer.sentimentBucket] || customer.sentimentBucket}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">LTV</div>
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(customer.lifetimeValue)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Engagement: {customer.engagementLevel}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
