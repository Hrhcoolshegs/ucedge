import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

export const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('all');
  const { customers, transactions } = useData();

  const reports = [
    {
      id: '1',
      name: 'Monthly Churn Analysis',
      type: 'churn',
      period: 'Last 30 days',
      generatedDate: '2024-01-15',
      metrics: { churnRate: 8.5, customersLost: 42, revenue: 125000 }
    },
    {
      id: '2',
      name: 'Win-back Campaign Performance',
      type: 'campaign',
      period: 'Q4 2023',
      generatedDate: '2024-01-10',
      metrics: { reactivated: 28, conversionRate: 12.5, revenue: 89000 }
    },
    {
      id: '3',
      name: 'Customer Lifetime Value',
      type: 'analytics',
      period: 'All time',
      generatedDate: '2024-01-12',
      metrics: { avgLTV: 4850, topSegment: 'Premium', totalRevenue: 2400000 }
    },
    {
      id: '4',
      name: 'Sentiment Trends Report',
      type: 'sentiment',
      period: 'Last 90 days',
      generatedDate: '2024-01-14',
      metrics: { avgScore: 7.2, improving: 65, declining: 15 }
    }
  ];

  const filteredReports = reports.filter(r => 
    (reportType === 'all' || r.type === reportType) &&
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickStats = [
    {
      title: 'Total Reports',
      value: reports.length.toString(),
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.lifecycleStage === 'active').length.toString(),
      icon: Users,
      color: 'text-success'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0)),
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'At Risk',
      value: customers.filter(c => c.lifecycleStage === 'at-risk').length.toString(),
      icon: AlertCircle,
      color: 'text-destructive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and view business intelligence reports</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-80"
          />
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="churn">Churn Analysis</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{report.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {report.period}
                  </div>
                  <span>Generated: {report.generatedDate}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {Object.entries(report.metrics).slice(0, 3).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {typeof value === 'number' && value > 100 ? formatCurrency(value) : value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Button size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};