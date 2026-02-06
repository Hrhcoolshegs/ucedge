import { useState, useMemo } from 'react';
import { Search, Filter, UserPlus, Mail, Phone, Calendar, TrendingUp, Download, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { ChurnRiskIndicator } from '@/components/common/ChurnRiskIndicator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { BulkActionBar } from '@/components/segments/BulkActionBar';
import { ExportPreviewModal } from '@/components/common/ExportPreviewModal';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { RangeFilter, NumericRange } from '@/components/common/RangeFilter';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const Customers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState('all');
  const [churnRiskFilter, setChurnRiskFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [clvRange, setClvRange] = useState<NumericRange>({ min: undefined, max: undefined });
  const [sentimentRange, setSentimentRange] = useState<NumericRange>({ min: undefined, max: undefined });
  const { customers, getCustomerTransactions, DISPLAY_MULTIPLIER } = useData();

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesLifecycle = lifecycleFilter === 'all' || c.lifecycleStage === lifecycleFilter;

    const matchesChurnRisk = churnRiskFilter === 'all' || c.churnRisk === churnRiskFilter;

    const matchesLocation = locationFilter === 'all' || c.location === locationFilter;

    const matchesDateRange = (!dateRange.from && !dateRange.to) ||
      (c.lastTransactionDate >= (dateRange.from || new Date(0)) &&
       c.lastTransactionDate <= (dateRange.to || new Date()));

    const matchesCLV = (clvRange.min === undefined || c.lifetimeValue >= clvRange.min) &&
                        (clvRange.max === undefined || c.lifetimeValue <= clvRange.max);

    const matchesSentiment = (sentimentRange.min === undefined || c.sentimentScore >= sentimentRange.min) &&
                              (sentimentRange.max === undefined || c.sentimentScore <= sentimentRange.max);

    return matchesSearch && matchesLifecycle && matchesChurnRisk && matchesLocation &&
           matchesDateRange && matchesCLV && matchesSentiment;
  }).slice(0, 50);

  const hasActiveFilters = lifecycleFilter !== 'all' || churnRiskFilter !== 'all' ||
    locationFilter !== 'all' || dateRange.from || dateRange.to ||
    clvRange.min !== undefined || clvRange.max !== undefined ||
    sentimentRange.min !== undefined || sentimentRange.max !== undefined;

  const clearFilters = () => {
    setLifecycleFilter('all');
    setChurnRiskFilter('all');
    setLocationFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setClvRange({ min: undefined, max: undefined });
    setSentimentRange({ min: undefined, max: undefined });
  };

  const uniqueLocations = useMemo(() =>
    [...new Set(customers.map(c => c.location))].sort(),
    [customers]
  );

  const {
    selectedItems,
    selectedCount,
    hasSelection,
    isAllSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected
  } = useBulkSelection(filteredCustomers);

  const totalLTV = useMemo(() => 
    selectedItems.reduce((sum, c) => sum + c.lifetimeValue, 0),
    [selectedItems]
  );

  const handleCreateCampaign = () => {
    navigate('/campaigns', { state: { selectedCustomers: selectedItems } });
    toast({
      title: "Campaign wizard opened",
      description: `Pre-filled with ${selectedCount} selected customers`,
    });
  };

  const [showExport, setShowExport] = useState(false);

  const handleExport = () => {
    setShowExport(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage and view customer information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4 mr-1" /> Export Data
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: customers.length * DISPLAY_MULTIPLIER, stage: 'all' },
          { label: 'Active', value: customers.filter(c => c.lifecycleStage === 'active').length * DISPLAY_MULTIPLIER, stage: 'active' },
          { label: 'At Risk', value: customers.filter(c => c.lifecycleStage === 'at-risk').length * DISPLAY_MULTIPLIER, stage: 'at-risk' },
          { label: 'Churned', value: customers.filter(c => c.lifecycleStage === 'churned').length * DISPLAY_MULTIPLIER, stage: 'churned' },
          { label: 'Reactivated', value: customers.filter(c => c.reactivationCount > 0).length * DISPLAY_MULTIPLIER, stage: 'reactivated' }
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value.toLocaleString()}</h3>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lifecycle Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
                <SelectItem value="reactivated">Reactivated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={churnRiskFilter} onValueChange={setChurnRiskFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Churn Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateRangeFilter
              value={dateRange}
              onChange={setDateRange}
              placeholder="Last active date"
            />

            <RangeFilter
              value={clvRange}
              onChange={setClvRange}
              label="Customer LTV"
              min={0}
              max={10000000}
              step={100000}
              prefix="₦"
            />

            <RangeFilter
              value={sentimentRange}
              onChange={setSentimentRange}
              label="Sentiment Score"
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length * DISPLAY_MULTIPLIER} customers
          </div>
        </div>
      </Card>

      {/* Customer Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => isAllSelected ? clearSelection() : selectAll()}
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lifecycle</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Risk</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">CLV</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const transactions = getCustomerTransactions(customer.id);
                const clv = transactions.reduce((sum, t) => sum + t.amount, 0);
                
                return (
                  <tr key={customer.id} className="border-t hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={isSelected(customer.id)}
                        onCheckedChange={() => toggleSelection(customer.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {customer.id.slice(0, 8)}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <LifecycleBadge stage={customer.lifecycleStage} />
                    </td>
                    <td className="p-4">
                      <ChurnRiskIndicator risk={customer.churnRisk} />
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{formatCurrency(clv)}</div>
                      <div className="text-xs text-muted-foreground">{transactions.length} transactions</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(customer.lastTransactionDate)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">View Details</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        totalCustomers={selectedItems.length}
        totalLTV={totalLTV}
        onClearSelection={clearSelection}
        onCreateCampaign={handleCreateCampaign}
        onExport={handleExport}
      />

      {showExport && (
        <ExportPreviewModal
          title="Customer Data Export"
          columns={['Name', 'Email', 'Phone', 'Lifecycle', 'Churn Risk', 'LTV']}
          rows={filteredCustomers.map(c => [c.name, c.email, c.phone, c.lifecycleStage, c.churnRisk, formatCurrency(c.lifetimeValue)])}
          onClose={() => setShowExport(false)}
          containsPII={true}
          recordCount={customers.length}
        />
      )}
    </div>
  );
};