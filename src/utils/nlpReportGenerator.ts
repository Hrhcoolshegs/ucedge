import { Customer, Transaction, Journey } from '@/types';
import { formatCurrency, formatNumber } from './formatters';

export interface GeneratedReport {
  id: string;
  query: string;
  title: string;
  chartType: 'bar' | 'line' | 'pie' | 'table';
  chartData: any[];
  tableData: {
    columns: string[];
    rows: string[][];
  };
  summary: string;
  timestamp: Date;
}

export function parseNLPQuery(
  query: string,
  customers: Customer[],
  transactions: Transaction[],
  journeys: Journey[]
): GeneratedReport | null {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('revenue') && lowerQuery.includes('trend')) {
    return generateRevenueTrendReport(query, transactions);
  }

  if (lowerQuery.includes('customer') && (lowerQuery.includes('segment') || lowerQuery.includes('distribution'))) {
    return generateCustomerSegmentReport(query, customers);
  }

  if (lowerQuery.includes('lifecycle') || lowerQuery.includes('stage')) {
    return generateLifecycleReport(query, customers);
  }

  if (lowerQuery.includes('churn')) {
    return generateChurnReport(query, customers);
  }

  if (lowerQuery.includes('top') && lowerQuery.includes('customer')) {
    return generateTopCustomersReport(query, customers, transactions);
  }

  if (lowerQuery.includes('journey') || lowerQuery.includes('campaign')) {
    return generateJourneyPerformanceReport(query, journeys);
  }

  if (lowerQuery.includes('transaction') && lowerQuery.includes('volume')) {
    return generateTransactionVolumeReport(query, transactions);
  }

  if (lowerQuery.includes('business unit') || lowerQuery.includes('bu')) {
    return generateBusinessUnitReport(query, customers, transactions);
  }

  if (lowerQuery.includes('retention') || lowerQuery.includes('cohort')) {
    return generateRetentionReport(query, customers);
  }

  if (lowerQuery.includes('ltv') || lowerQuery.includes('lifetime value')) {
    return generateLTVReport(query, customers, transactions);
  }

  return generateGenericReport(query, customers, transactions);
}

function generateRevenueTrendReport(query: string, transactions: Transaction[]): GeneratedReport {
  const monthlyRevenue: Record<string, number> = {};

  transactions.forEach(t => {
    const date = new Date(t.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + t.amount;
  });

  const sortedMonths = Object.keys(monthlyRevenue).sort().slice(-6);
  const chartData = sortedMonths.map(month => ({
    month: new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    revenue: monthlyRevenue[month]
  }));

  const totalRevenue = sortedMonths.reduce((sum, month) => sum + monthlyRevenue[month], 0);
  const avgRevenue = totalRevenue / sortedMonths.length;

  return {
    id: Date.now().toString(),
    query,
    title: 'Revenue Trend Analysis',
    chartType: 'line',
    chartData,
    tableData: {
      columns: ['Month', 'Revenue', 'Change'],
      rows: chartData.map((data, idx) => {
        const prevRevenue = idx > 0 ? chartData[idx - 1].revenue : data.revenue;
        const change = ((data.revenue - prevRevenue) / prevRevenue * 100).toFixed(1);
        return [
          data.month,
          formatCurrency(data.revenue),
          idx > 0 ? `${change}%` : '-'
        ];
      })
    },
    summary: `Analyzed revenue trends over the last ${sortedMonths.length} months. Total revenue: ${formatCurrency(totalRevenue)}. Average monthly revenue: ${formatCurrency(avgRevenue)}.`,
    timestamp: new Date()
  };
}

function generateCustomerSegmentReport(query: string, customers: Customer[]): GeneratedReport {
  const segments: Record<string, number> = {};

  customers.forEach(c => {
    const segment = c.segment || 'Unassigned';
    segments[segment] = (segments[segment] || 0) + 1;
  });

  const chartData = Object.entries(segments).map(([segment, count]) => ({
    segment,
    count,
    percentage: ((count / customers.length) * 100).toFixed(1)
  }));

  return {
    id: Date.now().toString(),
    query,
    title: 'Customer Segment Distribution',
    chartType: 'pie',
    chartData,
    tableData: {
      columns: ['Segment', 'Count', 'Percentage'],
      rows: chartData.map(data => [
        data.segment,
        formatNumber(data.count),
        `${data.percentage}%`
      ])
    },
    summary: `Customer base distributed across ${Object.keys(segments).length} segments. Total customers: ${formatNumber(customers.length)}.`,
    timestamp: new Date()
  };
}

function generateLifecycleReport(query: string, customers: Customer[]): GeneratedReport {
  const stages: Record<string, number> = {};

  customers.forEach(c => {
    const stage = c.lifecycleStage || 'unknown';
    stages[stage] = (stages[stage] || 0) + 1;
  });

  const chartData = Object.entries(stages).map(([stage, count]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
    count
  }));

  return {
    id: Date.now().toString(),
    query,
    title: 'Customer Lifecycle Analysis',
    chartType: 'bar',
    chartData,
    tableData: {
      columns: ['Lifecycle Stage', 'Count', 'Percentage'],
      rows: chartData.map(data => [
        data.stage,
        formatNumber(data.count),
        `${((data.count / customers.length) * 100).toFixed(1)}%`
      ])
    },
    summary: `Customers distributed across ${Object.keys(stages).length} lifecycle stages. Most common stage: ${chartData.sort((a, b) => b.count - a.count)[0]?.stage}.`,
    timestamp: new Date()
  };
}

function generateChurnReport(query: string, customers: Customer[]): GeneratedReport {
  const churned = customers.filter(c => c.lifecycleStage === 'churned').length;
  const atRisk = customers.filter(c => c.lifecycleStage === 'at-risk').length;
  const active = customers.filter(c => c.lifecycleStage === 'active').length;
  const loyal = customers.filter(c => c.lifecycleStage === 'loyal').length;

  const chartData = [
    { status: 'Active', count: active },
    { status: 'Loyal', count: loyal },
    { status: 'At Risk', count: atRisk },
    { status: 'Churned', count: churned }
  ];

  const churnRate = ((churned / customers.length) * 100).toFixed(2);

  return {
    id: Date.now().toString(),
    query,
    title: 'Churn Analysis Report',
    chartType: 'bar',
    chartData,
    tableData: {
      columns: ['Status', 'Count', 'Percentage'],
      rows: chartData.map(data => [
        data.status,
        formatNumber(data.count),
        `${((data.count / customers.length) * 100).toFixed(1)}%`
      ])
    },
    summary: `Churn rate: ${churnRate}%. At-risk customers: ${formatNumber(atRisk)}. Churned customers: ${formatNumber(churned)}.`,
    timestamp: new Date()
  };
}

function generateTopCustomersReport(query: string, customers: Customer[], transactions: Transaction[]): GeneratedReport {
  const customerRevenue: Record<string, number> = {};

  transactions.forEach(t => {
    customerRevenue[t.customerId] = (customerRevenue[t.customerId] || 0) + t.amount;
  });

  const topCustomers = Object.entries(customerRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([customerId, revenue]) => {
      const customer = customers.find(c => c.id === customerId);
      return {
        name: customer?.name || 'Unknown',
        revenue,
        customerId
      };
    });

  return {
    id: Date.now().toString(),
    query,
    title: 'Top 10 Customers by Revenue',
    chartType: 'bar',
    chartData: topCustomers,
    tableData: {
      columns: ['Rank', 'Customer Name', 'Revenue', 'Customer ID'],
      rows: topCustomers.map((customer, idx) => [
        `#${idx + 1}`,
        customer.name,
        formatCurrency(customer.revenue),
        customer.customerId.slice(0, 8)
      ])
    },
    summary: `Top customer: ${topCustomers[0]?.name} with ${formatCurrency(topCustomers[0]?.revenue)}. Combined revenue of top 10: ${formatCurrency(topCustomers.reduce((sum, c) => sum + c.revenue, 0))}.`,
    timestamp: new Date()
  };
}

function generateJourneyPerformanceReport(query: string, journeys: Journey[]): GeneratedReport {
  const journeyData = journeys.map(j => ({
    name: j.name,
    entered: j.analytics.totalEntered,
    completed: j.analytics.totalCompleted,
    conversionRate: j.analytics.totalEntered > 0
      ? ((j.analytics.totalCompleted / j.analytics.totalEntered) * 100).toFixed(1)
      : '0'
  }));

  return {
    id: Date.now().toString(),
    query,
    title: 'Journey Performance Report',
    chartType: 'bar',
    chartData: journeyData,
    tableData: {
      columns: ['Journey Name', 'Entered', 'Completed', 'Conversion Rate'],
      rows: journeyData.map(data => [
        data.name,
        formatNumber(data.entered),
        formatNumber(data.completed),
        `${data.conversionRate}%`
      ])
    },
    summary: `Analyzed ${journeys.length} journeys. Total entries: ${formatNumber(journeyData.reduce((sum, j) => sum + j.entered, 0))}. Total completions: ${formatNumber(journeyData.reduce((sum, j) => sum + j.completed, 0))}.`,
    timestamp: new Date()
  };
}

function generateTransactionVolumeReport(query: string, transactions: Transaction[]): GeneratedReport {
  const dailyVolume: Record<string, number> = {};

  transactions.forEach(t => {
    const date = new Date(t.timestamp).toISOString().split('T')[0];
    dailyVolume[date] = (dailyVolume[date] || 0) + 1;
  });

  const sortedDates = Object.keys(dailyVolume).sort().slice(-14);
  const chartData = sortedDates.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: dailyVolume[date]
  }));

  const totalVolume = sortedDates.reduce((sum, date) => sum + dailyVolume[date], 0);
  const avgVolume = Math.round(totalVolume / sortedDates.length);

  return {
    id: Date.now().toString(),
    query,
    title: 'Transaction Volume Report',
    chartType: 'line',
    chartData,
    tableData: {
      columns: ['Date', 'Transaction Count'],
      rows: chartData.map(data => [data.date, formatNumber(data.volume)])
    },
    summary: `Analyzed transaction volume over ${sortedDates.length} days. Total transactions: ${formatNumber(totalVolume)}. Average daily volume: ${formatNumber(avgVolume)}.`,
    timestamp: new Date()
  };
}

function generateBusinessUnitReport(query: string, customers: Customer[], transactions: Transaction[]): GeneratedReport {
  const buData: Record<string, { customers: number; revenue: number }> = {};

  customers.forEach(c => {
    const bu = c.businessUnit || 'Unassigned';
    if (!buData[bu]) buData[bu] = { customers: 0, revenue: 0 };
    buData[bu].customers++;
  });

  transactions.forEach(t => {
    const customer = customers.find(c => c.id === t.customerId);
    const bu = customer?.businessUnit || 'Unassigned';
    if (!buData[bu]) buData[bu] = { customers: 0, revenue: 0 };
    buData[bu].revenue += t.amount;
  });

  const chartData = Object.entries(buData).map(([bu, data]) => ({
    businessUnit: bu,
    customers: data.customers,
    revenue: data.revenue
  }));

  return {
    id: Date.now().toString(),
    query,
    title: 'Business Unit Performance',
    chartType: 'bar',
    chartData,
    tableData: {
      columns: ['Business Unit', 'Customers', 'Revenue', 'Avg Revenue per Customer'],
      rows: chartData.map(data => [
        data.businessUnit,
        formatNumber(data.customers),
        formatCurrency(data.revenue),
        formatCurrency(data.revenue / data.customers)
      ])
    },
    summary: `Performance across ${Object.keys(buData).length} business units. Total customers: ${formatNumber(customers.length)}. Total revenue: ${formatCurrency(chartData.reduce((sum, bu) => sum + bu.revenue, 0))}.`,
    timestamp: new Date()
  };
}

function generateRetentionReport(query: string, customers: Customer[]): GeneratedReport {
  const cohorts: Record<string, { total: number; retained: number }> = {};

  customers.forEach(c => {
    const joinDate = new Date(c.createdAt);
    const cohortKey = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`;

    if (!cohorts[cohortKey]) cohorts[cohortKey] = { total: 0, retained: 0 };
    cohorts[cohortKey].total++;

    if (c.lifecycleStage === 'active' || c.lifecycleStage === 'loyal') {
      cohorts[cohortKey].retained++;
    }
  });

  const chartData = Object.entries(cohorts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([cohort, data]) => ({
      cohort: new Date(cohort).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      retentionRate: ((data.retained / data.total) * 100).toFixed(1),
      total: data.total,
      retained: data.retained
    }));

  return {
    id: Date.now().toString(),
    query,
    title: 'Customer Retention Analysis',
    chartType: 'line',
    chartData,
    tableData: {
      columns: ['Cohort', 'Total Customers', 'Retained', 'Retention Rate'],
      rows: chartData.map(data => [
        data.cohort,
        formatNumber(data.total),
        formatNumber(data.retained),
        `${data.retentionRate}%`
      ])
    },
    summary: `Retention analysis across ${chartData.length} cohorts. Average retention rate: ${(chartData.reduce((sum, c) => sum + parseFloat(c.retentionRate), 0) / chartData.length).toFixed(1)}%.`,
    timestamp: new Date()
  };
}

function generateLTVReport(query: string, customers: Customer[], transactions: Transaction[]): GeneratedReport {
  const customerLTV: Record<string, number> = {};

  transactions.forEach(t => {
    customerLTV[t.customerId] = (customerLTV[t.customerId] || 0) + t.amount;
  });

  const ltvBuckets = {
    'High (>$10k)': 0,
    'Medium ($5k-$10k)': 0,
    'Low ($1k-$5k)': 0,
    'Very Low (<$1k)': 0
  };

  Object.values(customerLTV).forEach(ltv => {
    if (ltv > 10000) ltvBuckets['High (>$10k)']++;
    else if (ltv > 5000) ltvBuckets['Medium ($5k-$10k)']++;
    else if (ltv > 1000) ltvBuckets['Low ($1k-$5k)']++;
    else ltvBuckets['Very Low (<$1k)']++;
  });

  const chartData = Object.entries(ltvBuckets).map(([bucket, count]) => ({
    bucket,
    count
  }));

  const avgLTV = Object.values(customerLTV).reduce((sum, ltv) => sum + ltv, 0) / Object.keys(customerLTV).length;

  return {
    id: Date.now().toString(),
    query,
    title: 'Customer Lifetime Value Distribution',
    chartType: 'pie',
    chartData,
    tableData: {
      columns: ['LTV Range', 'Customer Count', 'Percentage'],
      rows: chartData.map(data => [
        data.bucket,
        formatNumber(data.count),
        `${((data.count / customers.length) * 100).toFixed(1)}%`
      ])
    },
    summary: `Average customer LTV: ${formatCurrency(avgLTV)}. ${ltvBuckets['High (>$10k)']} high-value customers (>${formatCurrency(10000)}).`,
    timestamp: new Date()
  };
}

function generateGenericReport(query: string, customers: Customer[], transactions: Transaction[]): GeneratedReport {
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransactionValue = totalRevenue / transactions.length;

  const chartData = [
    { metric: 'Total Customers', value: customers.length },
    { metric: 'Total Transactions', value: transactions.length },
    { metric: 'Active Customers', value: customers.filter(c => c.lifecycleStage === 'active').length },
    { metric: 'At-Risk Customers', value: customers.filter(c => c.lifecycleStage === 'at-risk').length }
  ];

  return {
    id: Date.now().toString(),
    query,
    title: 'General Business Overview',
    chartType: 'bar',
    chartData,
    tableData: {
      columns: ['Metric', 'Value'],
      rows: [
        ['Total Customers', formatNumber(customers.length)],
        ['Total Transactions', formatNumber(transactions.length)],
        ['Total Revenue', formatCurrency(totalRevenue)],
        ['Avg Transaction Value', formatCurrency(avgTransactionValue)],
        ['Active Customers', formatNumber(customers.filter(c => c.lifecycleStage === 'active').length)],
        ['At-Risk Customers', formatNumber(customers.filter(c => c.lifecycleStage === 'at-risk').length)]
      ]
    },
    summary: `Business overview: ${formatNumber(customers.length)} customers, ${formatNumber(transactions.length)} transactions, ${formatCurrency(totalRevenue)} total revenue.`,
    timestamp: new Date()
  };
}
