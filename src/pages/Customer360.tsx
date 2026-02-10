import { useState, useMemo } from 'react';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart, TrendingUp, MessageSquare, AlertCircle, Building2, Heart, GraduationCap, Briefcase, Users, Search, Filter, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ChurnRiskIndicator } from '@/components/common/ChurnRiskIndicator';
import { MetricCard } from '@/components/common/MetricCard';
import { formatCurrency, formatDate, formatNumber } from '@/utils/formatters';
import { EventsTimeline } from '@/components/events/EventsTimeline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BusinessProfilesTab } from '@/components/customer360/BusinessProfilesTab';
import { GroupTimelineTab } from '@/components/customer360/GroupTimelineTab';
import { RiskTab } from '@/components/customer360/RiskTab';
import { ComplianceTab } from '@/components/customer360/ComplianceTab';

export const Customer360 = () => {
  const {
    customers, getCustomerTransactions, getCustomerLifecycleHistory,
    getCustomerEvents, getCustomerJourneys, getCustomerAuditLogs
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchQuery ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      const matchesLifecycle = lifecycleFilter === 'all' || customer.lifecycleStage === lifecycleFilter;
      const matchesRisk = riskFilter === 'all' || customer.churnRisk === riskFilter;
      const matchesLocation = locationFilter === 'all' || customer.location === locationFilter;

      return matchesSearch && matchesLifecycle && matchesRisk && matchesLocation;
    });
  }, [customers, searchQuery, lifecycleFilter, riskFilter, locationFilter]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const locations = useMemo(() => {
    return Array.from(new Set(customers.map(c => c.location))).sort();
  }, [customers]);

  const lifecycleSegments = useMemo(() => {
    const segments = customers.reduce((acc, c) => {
      acc[c.lifecycleStage] = (acc[c.lifecycleStage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const riskSegments = useMemo(() => {
    const segments = customers.reduce((acc, c) => {
      acc[c.churnRisk] = (acc[c.churnRisk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const avgLTV = customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length;
  const avgSentiment = customers.reduce((sum, c) => sum + c.sentimentScore, 0) / customers.length;

  const activeFiltersCount = [lifecycleFilter !== 'all', riskFilter !== 'all', locationFilter !== 'all', searchQuery !== ''].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setLifecycleFilter('all');
    setRiskFilter('all');
    setLocationFilter('all');
    setCurrentPage(1);
  };

  const selectedCustomer = selectedCustomerId ? customers.find(c => c.id === selectedCustomerId) : null;
  const transactions = selectedCustomer ? getCustomerTransactions(selectedCustomer.id) : [];
  const lifecycleHistory = selectedCustomer ? getCustomerLifecycleHistory(selectedCustomer.id) : [];
  const customerEvents = selectedCustomer ? getCustomerEvents(selectedCustomer.id) : [];
  const customerJourneys = selectedCustomer ? getCustomerJourneys(selectedCustomer.id) : [];
  const customerAuditLogs = selectedCustomer ? getCustomerAuditLogs(selectedCustomer.id) : [];

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalSpent / transactions.length || 0;

  const spendingTrend = transactions
    .slice(-6)
    .map((t) => ({
      month: new Date(t.date).toLocaleDateString('en-US', { month: 'short' }),
      amount: t.amount
    }));

  const COLORS = ['#FE0000', '#FFE47D', '#573704', '#22c55e', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">360 Customer View</h1>
          <p className="text-muted-foreground mt-1">Segment-based customer intelligence platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Customers"
          value={formatNumber(customers.length)}
          icon={Users}
          iconColor="text-primary"
          explanation="Total number of customers in the database. This represents your entire customer base across all segments and lifecycle stages."
        />
        <MetricCard
          title="Active Customers"
          value={formatNumber(customers.filter(c => c.status === 'active').length)}
          icon={User}
          iconColor="text-success"
          borderColor="border-t-success"
          explanation="Customers with active accounts who have performed at least one transaction in the last 30 days. Indicates healthy engagement."
        />
        <MetricCard
          title="Avg Lifetime Value"
          value={formatCurrency(avgLTV)}
          icon={DollarSign}
          iconColor="text-secondary"
          borderColor="border-t-secondary"
          explanation="Average lifetime value across all customers. This metric helps evaluate customer profitability and informs customer acquisition costs."
        />
        <MetricCard
          title="Avg Sentiment Score"
          value={`${avgSentiment.toFixed(1)}/10`}
          icon={MessageSquare}
          iconColor="text-accent"
          borderColor="border-t-accent"
          explanation="Average sentiment score based on customer interactions, feedback, and support tickets. Higher scores indicate better customer satisfaction."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Lifecycle Segments</h3>
            {lifecycleFilter !== 'all' && (
              <Button variant="ghost" size="sm" onClick={() => {
                setLifecycleFilter('all');
                setCurrentPage(1);
              }}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={lifecycleSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => {
                  setLifecycleFilter(data.name);
                  setCurrentPage(1);
                }}
                cursor="pointer"
              >
                {lifecycleSegments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={lifecycleFilter === 'all' || lifecycleFilter === entry.name ? 1 : 0.3}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">Click on a segment to filter customers</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Churn Risk Distribution</h3>
            {riskFilter !== 'all' && (
              <Button variant="ghost" size="sm" onClick={() => {
                setRiskFilter('all');
                setCurrentPage(1);
              }}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => {
                  setRiskFilter(data.name);
                  setCurrentPage(1);
                }}
                cursor="pointer"
              >
                {riskSegments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={riskFilter === 'all' || riskFilter === entry.name ? 1 : 0.3}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">Click on a segment to filter customers</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Customer Search & Filters</h3>
            {(lifecycleFilter !== 'all' || riskFilter !== 'all') && (
              <div className="flex gap-2 mt-2">
                {lifecycleFilter !== 'all' && (
                  <Badge variant="default" className="capitalize">
                    Lifecycle: {lifecycleFilter}
                  </Badge>
                )}
                {riskFilter !== 'all' && (
                  <Badge variant="default" className="capitalize">
                    Risk: {riskFilter}
                  </Badge>
                )}
              </div>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All Filters ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select value={lifecycleFilter} onValueChange={(value) => {
            setLifecycleFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Lifecycle Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="loyal">Loyal</SelectItem>
              <SelectItem value="at-risk">At-Risk</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
              <SelectItem value="reactivated">Reactivated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={riskFilter} onValueChange={(value) => {
            setRiskFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Churn Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={(value) => {
            setLocationFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Showing {paginatedCustomers.length} of {formatNumber(filteredCustomers.length)} customers
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Contact</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Lifecycle</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">LTV</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Last Activity</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-foreground">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </td>
                  <td className="p-3">
                    <LifecycleBadge stage={customer.lifecycleStage} />
                  </td>
                  <td className="p-3">
                    <ChurnRiskIndicator risk={customer.churnRisk} />
                  </td>
                  <td className="p-3 text-sm font-medium text-foreground">
                    {formatCurrency(customer.lifetimeValue)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatDate(customer.lastTransactionDate)}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCustomerId(customer.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={!!selectedCustomerId} onOpenChange={(open) => !open && setSelectedCustomerId(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Customer Details - {selectedCustomer.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">{selectedCustomer.name}</h2>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {selectedCustomer.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {selectedCustomer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {selectedCustomer.location}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Member since {formatDate(selectedCustomer.dateJoined)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <LifecycleBadge stage={selectedCustomer.lifecycleStage} />
                      <ChurnRiskIndicator risk={selectedCustomer.churnRisk} />
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
                    <h3 className="text-2xl font-bold text-foreground">{selectedCustomer.sentimentScore.toFixed(1)}/10</h3>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Churn Risk</p>
                      <AlertCircle className={`h-5 w-5 ${selectedCustomer.churnRisk === 'high' ? 'text-destructive' : 'text-success'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground capitalize">{selectedCustomer.churnRisk}</h3>
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
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <span className="text-sm font-medium text-foreground text-right">{formatDate(selectedCustomer.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.age} years</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.gender}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Nationality</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.nationality}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Marital Status</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.maritalStatus}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Dependents</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.dependents}</span>
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
                  <span className="text-sm font-medium text-foreground text-right break-all">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.phone}</span>
                </div>
                {selectedCustomer.alternatePhone && (
                  <div className="flex justify-between items-start border-b pb-2">
                    <span className="text-sm text-muted-foreground">Alternate Phone</span>
                    <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.alternatePhone}</span>
                  </div>
                )}
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.address}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">City</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.city}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">State</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.state}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Postal Code</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.postalCode}</span>
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
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.occupation}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Employer</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.employer}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Employment Type</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.employmentType}</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Years at Current Job</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.yearsAtCurrentJob} years</span>
                </div>
                <div className="flex justify-between items-start border-b pb-2">
                  <span className="text-sm text-muted-foreground">Income Range</span>
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.incomeRange}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Monthly Income</span>
                  <span className="text-sm font-medium text-foreground text-right">{formatCurrency(selectedCustomer.monthlyIncome)}</span>
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
                  <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.education}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold text-foreground">Emergency Contact</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm font-medium text-foreground text-right">{selectedCustomer.emergencyPhone}</span>
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
                <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCustomer.accountBalance)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Deposits</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCustomer.totalDeposits)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Withdrawals</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCustomer.totalWithdrawals)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCustomer.lifetimeValue)}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Products Owned</p>
              <div className="flex flex-wrap gap-2">
                {selectedCustomer.productsOwned.map((product, idx) => (
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
                <p className="text-sm font-semibold text-foreground">{formatDate(selectedCustomer.dateJoined)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Last Transaction</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(selectedCustomer.lastTransactionDate)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Last Contact</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(selectedCustomer.lastContactDate)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Customer Profile</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.age} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Occupation</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.occupation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Employer</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.employer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Education</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.education}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Engagement Level</span>
                  <Badge variant={selectedCustomer.engagementLevel === 'high' ? 'default' : 'secondary'} className="capitalize">{selectedCustomer.engagementLevel}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sentiment Score</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.sentimentScore}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Satisfaction</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.satisfactionScore}/5 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Support Tickets</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.supportTickets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Campaigns Received</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.campaignsReceived}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Campaigns Engaged</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.campaignsEngaged}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="text-sm font-medium text-foreground">{(selectedCustomer.conversionRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Financial Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Income Range</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.incomeRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Income</span>
                  <span className="text-sm font-medium text-foreground">{formatCurrency(selectedCustomer.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Balance</span>
                  <span className="text-sm font-medium text-foreground">{formatCurrency(selectedCustomer.accountBalance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Deposits</span>
                  <span className="text-sm font-medium text-foreground">{formatCurrency(selectedCustomer.totalDeposits)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Withdrawals</span>
                  <span className="text-sm font-medium text-foreground">{formatCurrency(selectedCustomer.totalWithdrawals)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lifetime Value</span>
                  <span className="text-sm font-medium text-foreground">{formatCurrency(selectedCustomer.lifetimeValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction Freq.</span>
                  <span className="text-sm font-medium text-foreground">{selectedCustomer.transactionFrequency}/month</span>
                </div>
              </div>
            </Card>
          </div>

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

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Products & Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">Active Products</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.productsOwned.map((product, idx) => (
                    <Badge key={idx} variant="default">{product}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-3">Key Dates</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Transaction:</span>
                    <span className="text-foreground">{formatDate(selectedCustomer.lastTransactionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Contact:</span>
                    <span className="text-foreground">{formatDate(selectedCustomer.lastContactDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Campaign:</span>
                    <span className="text-foreground">{formatDate(selectedCustomer.lastCampaignDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
          <BusinessProfilesTab customerId={selectedCustomer.id} />
        </TabsContent>

        <TabsContent value="group-timeline">
          <GroupTimelineTab customerId={selectedCustomer.id} />
        </TabsContent>

        <TabsContent value="risk">
          <RiskTab customer={selectedCustomer} />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceTab customer={selectedCustomer} />
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
