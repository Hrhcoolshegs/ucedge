import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart, TrendingUp, MessageSquare, AlertCircle, Building2, Heart, GraduationCap, Briefcase, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ChurnRiskIndicator } from '@/components/common/ChurnRiskIndicator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { EventsTimeline } from '@/components/events/EventsTimeline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BusinessProfilesTab } from '@/components/customer360/BusinessProfilesTab';
import { GroupTimelineTab } from '@/components/customer360/GroupTimelineTab';
import { RiskTab } from '@/components/customer360/RiskTab';
import { ComplianceTab } from '@/components/customer360/ComplianceTab';

export const Customer360 = () => {
  const {
    customers, getCustomerTransactions, getCustomerLifecycleHistory,
    getCustomerEvents, getCustomerJourneys, getCustomerAuditLogs
  } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');

  const customer = customers.find(c => c.id === selectedCustomerId);
  const transactions = customer ? getCustomerTransactions(customer.id) : [];
  const lifecycleHistory = customer ? getCustomerLifecycleHistory(customer.id) : [];
  const customerEvents = customer ? getCustomerEvents(customer.id) : [];
  const customerJourneys = customer ? getCustomerJourneys(customer.id) : [];
  const customerAuditLogs = customer ? getCustomerAuditLogs(customer.id) : [];

  if (!customer) return null;

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalSpent / transactions.length || 0;

  const spendingTrend = transactions
    .slice(-6)
    .map((t) => ({
      month: new Date(t.date).toLocaleDateString('en-US', { month: 'short' }),
      amount: t.amount
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">360 Customer View</h1>
          <p className="text-muted-foreground mt-1">Complete customer intelligence dashboard</p>
        </div>
        <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.slice(0, 20).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{customer.name}</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {customer.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since {formatDate(customer.dateJoined)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <LifecycleBadge stage={customer.lifecycleStage} />
            <ChurnRiskIndicator risk={customer.churnRisk} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{transactions.length}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Order</p>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(avgTransaction)}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Sentiment Score</p>
            <MessageSquare className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{customer.sentimentScore.toFixed(1)}/10</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Churn Risk</p>
            <AlertCircle className={`h-5 w-5 ${customer.churnRisk === 'high' ? 'text-destructive' : 'text-success'}`} />
          </div>
          <h3 className="text-2xl font-bold text-foreground capitalize">{customer.churnRisk}</h3>
        </Card>
      </div>

      <Tabs defaultValue="biodata" className="space-y-4">
        <TabsList>
          <TabsTrigger value="biodata">Biodata</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="business-profiles">Business Profiles</TabsTrigger>
          <TabsTrigger value="group-timeline">Group Timeline</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="journeys">Journeys</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="biodata" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.name}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <span className="text-sm font-medium text-foreground text-right">{formatDate(customer.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.age} years</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.gender}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Nationality</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.nationality}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Marital Status</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.maritalStatus}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Dependents</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.dependents}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Contact & Address</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium text-foreground text-right break-all">{customer.email}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.phone}</span>
                </div>
                {customer.alternatePhone && (
                  <div className="flex justify-between items-start border-b pb-2">
                    <span className="text-sm text-muted-foreground">Alternate Phone</span>
                    <span className="text-sm font-medium text-foreground text-right">{customer.alternatePhone}</span>
                  </div>
                )}
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.address}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">City</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.city}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">State</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.state}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Postal Code</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.postalCode}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Employment Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Occupation</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.occupation}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Employer</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.employer}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Employment Type</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.employmentType}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Years at Current Job</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.yearsAtCurrentJob} years</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Income Range</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.incomeRange}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Monthly Income</span>
                  <span className="text-sm font-medium text-foreground text-right">{formatCurrency(customer.monthlyIncome)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Education & Emergency Contact</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Education Level</span>
                  <span className="text-sm font-medium text-foreground text-right">{customer.education}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold text-foreground">Emergency Contact</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium text-foreground text-right">{customer.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm font-medium text-foreground text-right">{customer.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Financial Summary</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(customer.accountBalance)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Deposits</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(customer.totalDeposits)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Withdrawals</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(customer.totalWithdrawals)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(customer.lifetimeValue)}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Products Owned</p>
              <div className="flex flex-wrap gap-2">
                {customer.productsOwned.map((product, idx) => (
                  <Badge key={idx} variant="outline">{product}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(customer.dateJoined)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Last Transaction</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(customer.lastTransactionDate)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Last Contact</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(customer.lastContactDate)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Spending Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={spendingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Lifecycle Journey</h3>
              <div className="space-y-3">
                {lifecycleHistory.slice(-5).reverse().map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground capitalize">{event.newStage.replace('-', ' ')}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(event.eventDate)}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{event.trigger}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Channel</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(-10).reverse().map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="p-3 text-sm text-muted-foreground">{formatDate(transaction.date)}</td>
                      <td className="p-3 text-sm text-foreground capitalize">{transaction.type}</td>
                      <td className="p-3 text-sm text-muted-foreground capitalize">{transaction.channel}</td>
                      <td className="p-3 text-sm font-semibold text-foreground">{formatCurrency(transaction.amount)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Customer Activity Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Real-time behavioral events from all channels
              </p>
            </div>
            <EventsTimeline events={customerEvents} limit={50} />
          </Card>
        </TabsContent>

        <TabsContent value="business-profiles">
          <BusinessProfilesTab customerId={customer.id} />
        </TabsContent>

        <TabsContent value="group-timeline">
          <GroupTimelineTab customerId={customer.id} />
        </TabsContent>

        <TabsContent value="risk">
          <RiskTab customer={customer} />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceTab customer={customer} />
        </TabsContent>

        <TabsContent value="journeys" className="space-y-4">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Journey History</h3>
              <p className="text-sm text-muted-foreground">
                Active and completed customer journeys
              </p>
            </div>
            {customerJourneys.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No journey history yet
              </p>
            ) : (
              <div className="space-y-4">
                {customerJourneys.map(execution => (
                  <Card key={execution.executionId} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">
                        {execution.journeyId.replace(/_/g, ' ').replace(/journey /i, '')}
                      </p>
                      <Badge variant={
                        execution.status === 'active' ? 'default' :
                        execution.status === 'completed' ? 'secondary' :
                        'destructive'
                      }>
                        {execution.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Started:</span>
                        <span>{new Date(execution.startedAt).toLocaleDateString()}</span>
                      </div>
                      {execution.completedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Completed:</span>
                          <span>{new Date(execution.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Step:</span>
                        <span>{execution.currentNodeId}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Communication Audit Log</h3>
              <p className="text-sm text-muted-foreground">
                Complete history of all messages sent to this customer
              </p>
            </div>
            {customerAuditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No communications recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {customerAuditLogs.slice(0, 20).map(log => (
                  <Card key={log.auditId} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {log.channel}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {log.deliveryStatus}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.sentTime).toLocaleString()}
                      </span>
                    </div>
                    {log.subject && (
                      <p className="font-medium text-sm mb-1">{log.subject}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {log.messageContent}
                    </p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {log.campaignName && (
                        <Badge variant="outline" className="text-xs">
                          Campaign: {log.campaignName}
                        </Badge>
                      )}
                      {log.journeyName && (
                        <Badge variant="outline" className="text-xs">
                          Journey: {log.journeyName}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
