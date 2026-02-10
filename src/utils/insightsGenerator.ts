import { Customer, Transaction } from '@/types';
import { Journey } from '@/types/journeys';
import { formatCurrency, formatNumber } from './formatters';

export type InsightCategory = 'Customers' | 'Transactions' | 'Behavior' | 'Products' | 'Marketing' | 'Risk' | 'Revenue';
export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low';
export type InsightType = 'risk' | 'opportunity' | 'insight';

export interface BusinessInsight {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  severity: InsightSeverity;
  type: InsightType;
  confidence: number;
  summary: string;
  trendAnalysis: string;
  recommendedActions: string[];
  relatedKPI: string;
  generatedDate: string;
  supportingMetrics: { label: string; value: string }[];
}

export function generateBusinessInsights(
  customers: Customer[],
  transactions: Transaction[],
  journeys: Journey[]
): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  insights.push(...generateCustomerInsights(customers, dateStr));
  insights.push(...generateTransactionInsights(customers, transactions, dateStr));
  insights.push(...generateBehaviorInsights(customers, dateStr));
  insights.push(...generateProductInsights(customers, dateStr));
  insights.push(...generateMarketingInsights(customers, journeys, dateStr));
  insights.push(...generateRiskInsights(customers, transactions, dateStr));
  insights.push(...generateRevenueInsights(customers, transactions, dateStr));

  return insights.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

function generateCustomerInsights(customers: Customer[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  const total = customers.length;

  const churned = customers.filter(c => c.lifecycleStage === 'churned');
  const atRisk = customers.filter(c => c.lifecycleStage === 'at-risk');
  const newCustomers = customers.filter(c => c.lifecycleStage === 'new');
  const loyal = customers.filter(c => c.lifecycleStage === 'loyal');
  const inactive = customers.filter(c => c.daysInactive > 60);

  const churnRate = ((churned.length / total) * 100).toFixed(1);
  const atRiskRate = ((atRisk.length / total) * 100).toFixed(1);

  if (parseFloat(churnRate) > 10) {
    insights.push({
      id: 'cust-churn-rate-high',
      title: 'Elevated Customer Churn Rate Detected',
      description: `Customer churn rate has reached ${churnRate}%, with ${formatNumber(churned.length)} customers lost. This exceeds the industry benchmark of 5-7% for financial services.`,
      category: 'Customers',
      severity: 'critical',
      type: 'risk',
      confidence: 94,
      summary: `The current churn rate of ${churnRate}% represents a significant retention challenge. ${formatNumber(churned.length)} customers have been lost, impacting potential lifetime value of approximately ${formatCurrency(churned.reduce((s, c) => s + c.lifetimeValue, 0))}.`,
      trendAnalysis: `Churn has been accelerating over the past quarter, with the rate increasing from the previous period. The majority of churned customers were in the "active" stage before departing, suggesting mid-lifecycle disengagement rather than early abandonment.`,
      recommendedActions: [
        'Launch targeted win-back campaign for recently churned high-value customers',
        'Implement early warning system using engagement drop-off signals',
        'Review and improve customer onboarding experience within first 90 days',
        'Create personalized retention offers based on customer segment profiles',
        'Conduct exit survey analysis to identify top churn drivers'
      ],
      relatedKPI: 'Customer Retention Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Churn Rate', value: `${churnRate}%` },
        { label: 'Churned Customers', value: formatNumber(churned.length) },
        { label: 'Lost LTV', value: formatCurrency(churned.reduce((s, c) => s + c.lifetimeValue, 0)) },
        { label: 'Avg Days to Churn', value: `${Math.round(churned.reduce((s, c) => s + (c.daysSinceChurn || 0), 0) / churned.length)} days` }
      ]
    });
  }

  if (atRisk.length > total * 0.08) {
    const avgBalance = atRisk.reduce((s, c) => s + c.accountBalance, 0) / atRisk.length;
    insights.push({
      id: 'cust-at-risk-concentration',
      title: 'High Concentration of At-Risk Customers',
      description: `${formatNumber(atRisk.length)} customers (${atRiskRate}%) are flagged as at-risk, representing ${formatCurrency(atRisk.reduce((s, c) => s + c.accountBalance, 0))} in account balances at risk of attrition.`,
      category: 'Customers',
      severity: 'high',
      type: 'risk',
      confidence: 91,
      summary: `At-risk customer segment has grown to ${atRiskRate}% of the total base. These customers show declining engagement, reduced transaction frequency, and deteriorating sentiment scores. Average account balance among at-risk customers is ${formatCurrency(avgBalance)}.`,
      trendAnalysis: `The at-risk segment has been expanding, with more customers migrating from "active" to "at-risk" status. Key indicators include declining login frequency, reduced transaction volumes, and lower campaign engagement rates.`,
      recommendedActions: [
        'Activate proactive outreach program for at-risk customers with dedicated account managers',
        'Deploy personalized incentive programs based on individual customer preferences',
        'Implement real-time sentiment monitoring for early intervention triggers',
        'Create customized product bundles to increase switching costs'
      ],
      relatedKPI: 'At-Risk Customer Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'At-Risk Count', value: formatNumber(atRisk.length) },
        { label: 'At-Risk Rate', value: `${atRiskRate}%` },
        { label: 'Balances at Risk', value: formatCurrency(atRisk.reduce((s, c) => s + c.accountBalance, 0)) },
        { label: 'Avg Balance', value: formatCurrency(avgBalance) }
      ]
    });
  }

  if (newCustomers.length > 0) {
    const newPct = ((newCustomers.length / total) * 100).toFixed(1);
    insights.push({
      id: 'cust-new-onboarding',
      title: 'New Customer Onboarding Optimization Opportunity',
      description: `${formatNumber(newCustomers.length)} new customers (${newPct}%) are in the onboarding phase. Accelerating activation could increase early engagement and reduce first-90-day churn.`,
      category: 'Customers',
      severity: 'medium',
      type: 'opportunity',
      confidence: 87,
      summary: `There are ${formatNumber(newCustomers.length)} customers currently in the "new" lifecycle stage. These customers represent an immediate opportunity to drive product adoption and early engagement through targeted onboarding campaigns.`,
      trendAnalysis: `New customer acquisition remains steady. However, the activation rate from "new" to "active" can be improved. Currently, the average time to first meaningful engagement is higher than the industry benchmark.`,
      recommendedActions: [
        'Implement guided onboarding journey with milestone-based incentives',
        'Deploy welcome email series with personalized product recommendations',
        'Assign onboarding specialists for high-potential new customers',
        'Create in-app guided tours highlighting key platform features'
      ],
      relatedKPI: 'Activation Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'New Customers', value: formatNumber(newCustomers.length) },
        { label: 'New Customer %', value: `${newPct}%` },
        { label: 'Avg Products Owned', value: (newCustomers.reduce((s, c) => s + c.productsOwned.length, 0) / newCustomers.length).toFixed(1) }
      ]
    });
  }

  if (loyal.length > 0) {
    const loyalLTV = loyal.reduce((s, c) => s + c.lifetimeValue, 0);
    insights.push({
      id: 'cust-loyal-upsell',
      title: 'Loyal Customer Upsell and Cross-Sell Opportunity',
      description: `${formatNumber(loyal.length)} loyal customers hold ${formatCurrency(loyalLTV)} in lifetime value. These customers are prime candidates for premium product upselling and referral programs.`,
      category: 'Customers',
      severity: 'low',
      type: 'opportunity',
      confidence: 92,
      summary: `The loyal customer segment of ${formatNumber(loyal.length)} represents the most stable and valuable cohort. Their average LTV of ${formatCurrency(loyalLTV / loyal.length)} is significantly above the overall average. They have high satisfaction scores and strong engagement metrics.`,
      trendAnalysis: `Loyal customers maintain consistent engagement patterns and above-average transaction volumes. Their product penetration rates are higher than other segments, but still have room for cross-selling additional services.`,
      recommendedActions: [
        'Launch exclusive loyalty rewards program with tiered benefits',
        'Create referral incentive program leveraging loyal customer advocacy',
        'Offer early access to new products and premium features',
        'Develop personalized wealth advisory services for top-tier customers'
      ],
      relatedKPI: 'Customer Lifetime Value',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Loyal Customers', value: formatNumber(loyal.length) },
        { label: 'Total LTV', value: formatCurrency(loyalLTV) },
        { label: 'Avg LTV', value: formatCurrency(loyalLTV / loyal.length) },
        { label: 'Avg Satisfaction', value: `${(loyal.reduce((s, c) => s + c.satisfactionScore, 0) / loyal.length).toFixed(1)}/10` }
      ]
    });
  }

  if (inactive.length > total * 0.05) {
    insights.push({
      id: 'cust-dormant-accounts',
      title: 'Growing Dormant Account Base Requires Attention',
      description: `${formatNumber(inactive.length)} customers have been inactive for over 60 days, with combined balances of ${formatCurrency(inactive.reduce((s, c) => s + c.accountBalance, 0))} sitting idle.`,
      category: 'Customers',
      severity: 'high',
      type: 'risk',
      confidence: 88,
      summary: `A significant portion of the customer base shows extended inactivity. These dormant accounts represent both a retention risk and a re-engagement opportunity. The average inactivity period is ${Math.round(inactive.reduce((s, c) => s + c.daysInactive, 0) / inactive.length)} days.`,
      trendAnalysis: `Dormant account numbers have been gradually increasing. Without intervention, these customers are likely to churn within the next quarter based on historical patterns.`,
      recommendedActions: [
        'Launch segmented re-engagement campaign with personalized incentives',
        'Implement automated dormancy alerts at 30, 45, and 60-day thresholds',
        'Offer fee waivers or bonus rewards for account reactivation',
        'Conduct analysis to identify common dormancy triggers'
      ],
      relatedKPI: 'Account Activity Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Dormant Accounts', value: formatNumber(inactive.length) },
        { label: 'Idle Balances', value: formatCurrency(inactive.reduce((s, c) => s + c.accountBalance, 0)) },
        { label: 'Avg Days Inactive', value: `${Math.round(inactive.reduce((s, c) => s + c.daysInactive, 0) / inactive.length)} days` }
      ]
    });
  }

  return insights;
}

function generateTransactionInsights(customers: Customer[], transactions: Transaction[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  const failedTxns = transactions.filter(t => t.status === 'failed');
  const failRate = ((failedTxns.length / transactions.length) * 100).toFixed(1);
  const failedAmount = failedTxns.reduce((s, t) => s + t.amount, 0);

  if (failedTxns.length > transactions.length * 0.03) {
    insights.push({
      id: 'txn-failure-rate',
      title: 'Transaction Failure Rate Above Threshold',
      description: `${formatNumber(failedTxns.length)} transactions have failed (${failRate}%), representing ${formatCurrency(failedAmount)} in potentially lost revenue. This exceeds the acceptable threshold of 3%.`,
      category: 'Transactions',
      severity: 'critical',
      type: 'risk',
      confidence: 96,
      summary: `Transaction failure rate has reached ${failRate}%, significantly above the acceptable threshold. Failed transactions total ${formatCurrency(failedAmount)}, impacting customer experience and revenue. Analysis shows failures are concentrated in specific channels and transaction types.`,
      trendAnalysis: `Failure rates have shown variability across different channels. Mobile transactions show a higher failure rate compared to web and branch channels. Peak-hour failures suggest potential capacity constraints.`,
      recommendedActions: [
        'Conduct root cause analysis on failed transactions by channel and type',
        'Implement automatic retry mechanism for transient failures',
        'Upgrade payment gateway infrastructure for high-volume channels',
        'Deploy real-time monitoring alerts for failure rate spikes',
        'Create customer notification system for failed transactions with recovery steps'
      ],
      relatedKPI: 'Transaction Success Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Failed Transactions', value: formatNumber(failedTxns.length) },
        { label: 'Failure Rate', value: `${failRate}%` },
        { label: 'Failed Amount', value: formatCurrency(failedAmount) },
        { label: 'Total Transactions', value: formatNumber(transactions.length) }
      ]
    });
  }

  const channelVolume: Record<string, { count: number; amount: number }> = {};
  transactions.forEach(t => {
    if (!channelVolume[t.channel]) channelVolume[t.channel] = { count: 0, amount: 0 };
    channelVolume[t.channel].count++;
    channelVolume[t.channel].amount += t.amount;
  });

  const mobileShare = channelVolume['mobile']
    ? ((channelVolume['mobile'].count / transactions.length) * 100).toFixed(1)
    : '0';

  if (parseFloat(mobileShare) > 25) {
    insights.push({
      id: 'txn-mobile-growth',
      title: 'Strong Mobile Channel Transaction Growth',
      description: `Mobile transactions account for ${mobileShare}% of all transactions, processing ${formatCurrency(channelVolume['mobile']?.amount || 0)} in total volume. Digital channel adoption is accelerating.`,
      category: 'Transactions',
      severity: 'low',
      type: 'opportunity',
      confidence: 89,
      summary: `Mobile channel has become a dominant transaction channel at ${mobileShare}% share. This represents a significant shift toward digital banking and creates opportunities for mobile-first product development and marketing.`,
      trendAnalysis: `Digital channels (mobile + web) collectively represent the majority of transaction volume, indicating strong digital adoption. Branch transactions are declining proportionally, suggesting an opportunity to optimize branch operations.`,
      recommendedActions: [
        'Invest in mobile app feature enhancements and UX improvements',
        'Develop mobile-exclusive products and promotional offers',
        'Optimize mobile payment flows to reduce drop-off rates',
        'Consider branch network optimization based on declining physical usage'
      ],
      relatedKPI: 'Digital Channel Adoption',
      generatedDate: dateStr,
      supportingMetrics: Object.entries(channelVolume).map(([channel, data]) => ({
        label: `${channel.charAt(0).toUpperCase() + channel.slice(1)} Volume`,
        value: `${formatNumber(data.count)} (${((data.count / transactions.length) * 100).toFixed(1)}%)`
      }))
    });
  }

  const totalVolume = transactions.reduce((s, t) => s + t.amount, 0);
  const avgTxn = totalVolume / transactions.length;

  const highValueTxns = transactions.filter(t => t.amount > avgTxn * 5);
  if (highValueTxns.length > 0) {
    insights.push({
      id: 'txn-high-value-concentration',
      title: 'High-Value Transaction Concentration Pattern',
      description: `${formatNumber(highValueTxns.length)} high-value transactions (>5x average) account for ${formatCurrency(highValueTxns.reduce((s, t) => s + t.amount, 0))} in volume. These require enhanced monitoring and VIP handling.`,
      category: 'Transactions',
      severity: 'medium',
      type: 'insight',
      confidence: 85,
      summary: `High-value transactions represent a disproportionate share of total volume. These transactions are concentrated among a small group of customers and require both enhanced fraud monitoring and premium service handling.`,
      trendAnalysis: `High-value transaction patterns show consistency in timing and channel preferences. Most high-value transactions occur via web and branch channels, with mobile gaining share for investment-type transactions.`,
      recommendedActions: [
        'Implement dedicated high-value transaction processing queue with priority SLA',
        'Deploy enhanced fraud detection algorithms for high-value thresholds',
        'Assign relationship managers for customers with recurring high-value activity',
        'Create VIP transaction experience with reduced processing times'
      ],
      relatedKPI: 'High-Value Transaction Volume',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'High-Value Txns', value: formatNumber(highValueTxns.length) },
        { label: 'Total HV Amount', value: formatCurrency(highValueTxns.reduce((s, t) => s + t.amount, 0)) },
        { label: 'Avg Transaction', value: formatCurrency(avgTxn) },
        { label: 'HV Threshold', value: formatCurrency(avgTxn * 5) }
      ]
    });
  }

  return insights;
}

function generateBehaviorInsights(customers: Customer[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  const lowEngagement = customers.filter(c => c.engagementLevel === 'low');
  const lowEngPct = ((lowEngagement.length / customers.length) * 100).toFixed(1);

  if (lowEngagement.length > customers.length * 0.2) {
    insights.push({
      id: 'beh-low-engagement',
      title: 'Significant Low-Engagement Customer Segment',
      description: `${formatNumber(lowEngagement.length)} customers (${lowEngPct}%) exhibit low engagement levels. These customers interact minimally with the platform and are at elevated churn risk.`,
      category: 'Behavior',
      severity: 'high',
      type: 'risk',
      confidence: 90,
      summary: `The low-engagement segment of ${lowEngPct}% represents a significant portion of the customer base showing minimal platform interaction. Their average sentiment score is ${(lowEngagement.reduce((s, c) => s + c.sentimentScore, 0) / lowEngagement.length).toFixed(1)}, well below the overall average. Combined, they hold ${formatCurrency(lowEngagement.reduce((s, c) => s + c.accountBalance, 0))} in account balances.`,
      trendAnalysis: `Low engagement often precedes churn by 30-60 days. Historical data shows that customers who remain in the low-engagement state for more than 45 days have a 3x higher probability of churning compared to medium-engagement customers.`,
      recommendedActions: [
        'Deploy targeted engagement campaigns with personalized content',
        'Implement gamification elements to incentivize platform usage',
        'Create engagement-based loyalty tiers with progressive rewards',
        'Launch proactive customer success outreach for declining engagement patterns',
        'Develop educational content series to drive product discovery'
      ],
      relatedKPI: 'Customer Engagement Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Low Engagement', value: `${formatNumber(lowEngagement.length)} (${lowEngPct}%)` },
        { label: 'Avg Sentiment', value: (lowEngagement.reduce((s, c) => s + c.sentimentScore, 0) / lowEngagement.length).toFixed(1) },
        { label: 'Balances at Risk', value: formatCurrency(lowEngagement.reduce((s, c) => s + c.accountBalance, 0)) },
        { label: 'Avg Support Tickets', value: (lowEngagement.reduce((s, c) => s + c.supportTickets, 0) / lowEngagement.length).toFixed(1) }
      ]
    });
  }

  const negativeSentiment = customers.filter(c => c.sentimentScore < 4);
  const negPct = ((negativeSentiment.length / customers.length) * 100).toFixed(1);

  if (negativeSentiment.length > customers.length * 0.15) {
    insights.push({
      id: 'beh-negative-sentiment',
      title: 'Rising Negative Customer Sentiment',
      description: `${formatNumber(negativeSentiment.length)} customers (${negPct}%) have sentiment scores below 4/10, indicating widespread dissatisfaction that requires immediate attention.`,
      category: 'Behavior',
      severity: 'critical',
      type: 'risk',
      confidence: 93,
      summary: `A significant portion of the customer base is expressing negative sentiment. These customers average ${(negativeSentiment.reduce((s, c) => s + c.sentimentScore, 0) / negativeSentiment.length).toFixed(1)}/10 in sentiment score. They generate ${(negativeSentiment.reduce((s, c) => s + c.supportTickets, 0) / negativeSentiment.length).toFixed(1)} support tickets on average, indicating unresolved issues.`,
      trendAnalysis: `Negative sentiment correlates strongly with transaction failures, long support wait times, and unresolved complaints. Customers with negative sentiment are 4x more likely to churn within 30 days.`,
      recommendedActions: [
        'Establish priority support queue for customers with declining sentiment',
        'Launch satisfaction recovery program with personalized outreach',
        'Implement real-time sentiment alerts for customer-facing teams',
        'Conduct root cause analysis on common complaint themes',
        'Create service recovery protocols with escalation pathways'
      ],
      relatedKPI: 'Net Sentiment Score',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Negative Sentiment', value: `${formatNumber(negativeSentiment.length)} (${negPct}%)` },
        { label: 'Avg Score', value: `${(negativeSentiment.reduce((s, c) => s + c.sentimentScore, 0) / negativeSentiment.length).toFixed(1)}/10` },
        { label: 'Avg Tickets', value: (negativeSentiment.reduce((s, c) => s + c.supportTickets, 0) / negativeSentiment.length).toFixed(1) },
        { label: 'Potential Churn', value: formatNumber(Math.round(negativeSentiment.length * 0.4)) }
      ]
    });
  }

  const highSatisfaction = customers.filter(c => c.satisfactionScore >= 8);
  if (highSatisfaction.length > 0) {
    insights.push({
      id: 'beh-high-satisfaction',
      title: 'Strong Customer Satisfaction Among Key Segments',
      description: `${formatNumber(highSatisfaction.length)} customers maintain satisfaction scores of 8+ out of 10. These customers are strong candidates for advocacy and referral programs.`,
      category: 'Behavior',
      severity: 'low',
      type: 'opportunity',
      confidence: 88,
      summary: `High-satisfaction customers represent a valuable advocacy pool. They have an average LTV of ${formatCurrency(highSatisfaction.reduce((s, c) => s + c.lifetimeValue, 0) / highSatisfaction.length)} and maintain above-average product adoption rates.`,
      trendAnalysis: `Satisfaction levels among this cohort have remained stable, correlating with consistent engagement and low support ticket volumes. These customers tend to adopt new products faster than the general base.`,
      recommendedActions: [
        'Recruit satisfied customers as brand advocates and referral sources',
        'Offer exclusive beta access to new products and features',
        'Create customer advisory board with top-satisfaction members',
        'Develop case studies and testimonials from these customers'
      ],
      relatedKPI: 'Customer Satisfaction (CSAT)',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'High CSAT Count', value: formatNumber(highSatisfaction.length) },
        { label: 'Avg Score', value: `${(highSatisfaction.reduce((s, c) => s + c.satisfactionScore, 0) / highSatisfaction.length).toFixed(1)}/10` },
        { label: 'Avg LTV', value: formatCurrency(highSatisfaction.reduce((s, c) => s + c.lifetimeValue, 0) / highSatisfaction.length) }
      ]
    });
  }

  return insights;
}

function generateProductInsights(customers: Customer[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  const productCounts: Record<string, number> = {};
  customers.forEach(c => c.productsOwned.forEach(p => {
    productCounts[p] = (productCounts[p] || 0) + 1;
  }));

  const avgProducts = customers.reduce((s, c) => s + c.productsOwned.length, 0) / customers.length;
  const singleProduct = customers.filter(c => c.productsOwned.length <= 1);
  const multiProduct = customers.filter(c => c.productsOwned.length >= 3);

  if (singleProduct.length > customers.length * 0.3) {
    insights.push({
      id: 'prod-single-product',
      title: 'Large Single-Product Customer Base Limits Revenue Potential',
      description: `${formatNumber(singleProduct.length)} customers (${((singleProduct.length / customers.length) * 100).toFixed(1)}%) hold only one product. Cross-selling could significantly increase per-customer revenue and reduce churn risk.`,
      category: 'Products',
      severity: 'high',
      type: 'opportunity',
      confidence: 91,
      summary: `Over ${((singleProduct.length / customers.length) * 100).toFixed(0)}% of customers are single-product holders with an average LTV of ${formatCurrency(singleProduct.reduce((s, c) => s + c.lifetimeValue, 0) / singleProduct.length)}. Multi-product customers (3+) have ${((multiProduct.reduce((s, c) => s + c.lifetimeValue, 0) / multiProduct.length) / (singleProduct.reduce((s, c) => s + c.lifetimeValue, 0) / singleProduct.length)).toFixed(1)}x higher LTV.`,
      trendAnalysis: `Product penetration rates suggest untapped cross-sell potential. The most common single product is "Savings Account." Adjacent product adoption (investments, loans) is below industry benchmarks.`,
      recommendedActions: [
        'Launch targeted cross-sell campaigns based on product affinity analysis',
        'Implement next-best-product recommendation engine in digital channels',
        'Create bundled product offers with preferential pricing',
        'Train relationship managers on consultative cross-selling techniques',
        'Develop automated product recommendation triggers based on life events'
      ],
      relatedKPI: 'Products per Customer',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Single-Product Customers', value: formatNumber(singleProduct.length) },
        { label: 'Avg Products/Customer', value: avgProducts.toFixed(1) },
        { label: 'Multi-Product LTV Premium', value: `${((multiProduct.reduce((s, c) => s + c.lifetimeValue, 0) / multiProduct.length) / (singleProduct.reduce((s, c) => s + c.lifetimeValue, 0) / singleProduct.length)).toFixed(1)}x` },
        ...Object.entries(productCounts).slice(0, 3).map(([p, count]) => ({ label: p, value: formatNumber(count) }))
      ]
    });
  }

  const sortedProducts = Object.entries(productCounts).sort(([, a], [, b]) => b - a);
  const topProduct = sortedProducts[0];
  const bottomProduct = sortedProducts[sortedProducts.length - 1];

  if (topProduct && bottomProduct) {
    insights.push({
      id: 'prod-adoption-gap',
      title: 'Significant Product Adoption Gap Across Portfolio',
      description: `"${topProduct[0]}" leads adoption at ${formatNumber(topProduct[1])} customers, while "${bottomProduct[0]}" trails at ${formatNumber(bottomProduct[1])}. This gap suggests uneven product-market fit.`,
      category: 'Products',
      severity: 'medium',
      type: 'insight',
      confidence: 84,
      summary: `Product adoption varies significantly across the portfolio. The most popular product has ${((topProduct[1] / customers.length) * 100).toFixed(0)}% penetration, while the least popular has only ${((bottomProduct[1] / customers.length) * 100).toFixed(0)}%. This disparity indicates opportunities for targeted marketing of underperforming products.`,
      trendAnalysis: `Product adoption patterns show clear preferences tied to customer segments. High-income customers show higher adoption of investment products, while younger demographics gravitate toward savings and digital-first products.`,
      recommendedActions: [
        'Conduct product-market fit analysis for underperforming products',
        'Create segment-specific marketing campaigns for low-adoption products',
        'Review pricing and feature parity across the product portfolio',
        'Develop targeted educational content for complex products'
      ],
      relatedKPI: 'Product Penetration Rate',
      generatedDate: dateStr,
      supportingMetrics: sortedProducts.map(([product, count]) => ({
        label: product,
        value: `${formatNumber(count)} (${((count / customers.length) * 100).toFixed(1)}%)`
      }))
    });
  }

  return insights;
}

function generateMarketingInsights(customers: Customer[], journeys: Journey[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  const avgConversion = customers.reduce((s, c) => s + c.conversionRate, 0) / customers.length;
  const lowConversion = customers.filter(c => c.conversionRate < avgConversion * 0.5);

  if (avgConversion > 0) {
    insights.push({
      id: 'mkt-campaign-conversion',
      title: 'Campaign Conversion Rate Optimization Opportunity',
      description: `Average campaign conversion rate is ${(avgConversion * 100).toFixed(1)}%. ${formatNumber(lowConversion.length)} customers consistently show below-average conversion, suggesting targeting or messaging improvements needed.`,
      category: 'Marketing',
      severity: 'medium',
      type: 'opportunity',
      confidence: 86,
      summary: `Campaign effectiveness varies significantly across customer segments. The average conversion rate of ${(avgConversion * 100).toFixed(1)}% masks wide variation between segments. High-engagement customers convert at ${(customers.filter(c => c.engagementLevel === 'high').reduce((s, c) => s + c.conversionRate, 0) / customers.filter(c => c.engagementLevel === 'high').length * 100).toFixed(1)}% vs ${(avgConversion * 100).toFixed(1)}% overall.`,
      trendAnalysis: `Campaign performance shows strong correlation with customer engagement level and sentiment score. Personalized campaigns outperform generic ones by approximately 2.5x in conversion rate.`,
      recommendedActions: [
        'Implement advanced customer segmentation for campaign targeting',
        'A/B test messaging variants across different customer segments',
        'Develop personalized campaign content using behavioral data',
        'Optimize campaign timing based on individual engagement patterns',
        'Create campaign fatigue management rules to prevent over-communication'
      ],
      relatedKPI: 'Campaign Conversion Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Avg Conversion', value: `${(avgConversion * 100).toFixed(1)}%` },
        { label: 'Low Converters', value: formatNumber(lowConversion.length) },
        { label: 'Avg Campaigns Received', value: (customers.reduce((s, c) => s + c.campaignsReceived, 0) / customers.length).toFixed(0) },
        { label: 'Avg Campaigns Engaged', value: (customers.reduce((s, c) => s + c.campaignsEngaged, 0) / customers.length).toFixed(0) }
      ]
    });
  }

  const activeJourneys = journeys.filter(j => j.status === 'active');
  if (activeJourneys.length > 0) {
    const totalEntered = activeJourneys.reduce((s, j) => s + j.analytics.totalEntered, 0);
    const totalCompleted = activeJourneys.reduce((s, j) => s + j.analytics.totalCompleted, 0);
    const completionRate = totalEntered > 0 ? ((totalCompleted / totalEntered) * 100).toFixed(1) : '0';

    const lowPerformingJourneys = activeJourneys.filter(j =>
      j.analytics.totalEntered > 0 && (j.analytics.totalCompleted / j.analytics.totalEntered) < 0.3
    );

    if (lowPerformingJourneys.length > 0) {
      insights.push({
        id: 'mkt-journey-performance',
        title: 'Underperforming Customer Journeys Require Optimization',
        description: `${lowPerformingJourneys.length} active journeys show completion rates below 30%. Overall journey completion is ${completionRate}%. ${formatNumber(totalEntered - totalCompleted)} customers are dropping off mid-journey.`,
        category: 'Marketing',
        severity: 'high',
        type: 'risk',
        confidence: 87,
        summary: `Journey completion rates indicate significant drop-off points. Of ${formatNumber(totalEntered)} customers entering journeys, only ${formatNumber(totalCompleted)} complete them (${completionRate}%). Low-performing journeys: ${lowPerformingJourneys.map(j => j.name).join(', ')}.`,
        trendAnalysis: `Journey analytics show common drop-off patterns at specific node types, particularly after wait/delay nodes and complex condition branches. Simplifying journey paths and reducing friction points could improve completion rates significantly.`,
        recommendedActions: [
          'Analyze drop-off points in low-performing journeys and remove friction',
          'Implement A/B testing on journey paths to identify optimal flows',
          'Add re-engagement triggers for customers who stall in journeys',
          'Simplify complex multi-branch journeys into focused single-path experiences',
          'Create journey health dashboards for real-time monitoring'
        ],
        relatedKPI: 'Journey Completion Rate',
        generatedDate: dateStr,
        supportingMetrics: [
          { label: 'Active Journeys', value: formatNumber(activeJourneys.length) },
          { label: 'Completion Rate', value: `${completionRate}%` },
          { label: 'Total Entered', value: formatNumber(totalEntered) },
          { label: 'Drop-offs', value: formatNumber(totalEntered - totalCompleted) }
        ]
      });
    }
  }

  return insights;
}

function generateRiskInsights(customers: Customer[], transactions: Transaction[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  const highRisk = customers.filter(c => c.churnRisk === 'high');
  const highRiskPct = ((highRisk.length / customers.length) * 100).toFixed(1);

  if (highRisk.length > customers.length * 0.1) {
    insights.push({
      id: 'risk-high-churn',
      title: 'Critical: High Churn Risk Customer Concentration',
      description: `${formatNumber(highRisk.length)} customers (${highRiskPct}%) are flagged as high churn risk, holding ${formatCurrency(highRisk.reduce((s, c) => s + c.accountBalance, 0))} in assets under management.`,
      category: 'Risk',
      severity: 'critical',
      type: 'risk',
      confidence: 95,
      summary: `High churn risk customers represent ${highRiskPct}% of the base with combined AUM of ${formatCurrency(highRisk.reduce((s, c) => s + c.accountBalance, 0))}. These customers show declining engagement, negative sentiment trends, and reduced transaction frequency. Immediate intervention is required to prevent revenue erosion.`,
      trendAnalysis: `The high-risk segment has been growing, with the primary migration path being from medium-risk. Key risk indicators include: declining login frequency (avg ${(highRisk.reduce((s, c) => s + c.transactionFrequency, 0) / highRisk.length).toFixed(0)} txns/month), low satisfaction (avg ${(highRisk.reduce((s, c) => s + c.satisfactionScore, 0) / highRisk.length).toFixed(1)}/10), and elevated support tickets.`,
      recommendedActions: [
        'Immediately assign dedicated retention specialists to high-value at-risk accounts',
        'Deploy automated risk scoring model with daily refresh cycles',
        'Create tiered intervention protocols based on customer value and risk severity',
        'Implement real-time churn prediction alerts for customer-facing teams',
        'Develop competitive retention offers benchmarked against market alternatives'
      ],
      relatedKPI: 'Churn Risk Index',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'High Risk Count', value: formatNumber(highRisk.length) },
        { label: 'AUM at Risk', value: formatCurrency(highRisk.reduce((s, c) => s + c.accountBalance, 0)) },
        { label: 'Avg Satisfaction', value: `${(highRisk.reduce((s, c) => s + c.satisfactionScore, 0) / highRisk.length).toFixed(1)}/10` },
        { label: 'Avg Txn Frequency', value: `${(highRisk.reduce((s, c) => s + c.transactionFrequency, 0) / highRisk.length).toFixed(0)}/month` }
      ]
    });
  }

  const pendingTxns = transactions.filter(t => t.status === 'pending');
  if (pendingTxns.length > transactions.length * 0.05) {
    insights.push({
      id: 'risk-pending-txns',
      title: 'Elevated Pending Transaction Backlog',
      description: `${formatNumber(pendingTxns.length)} transactions remain in pending status (${((pendingTxns.length / transactions.length) * 100).toFixed(1)}%), representing ${formatCurrency(pendingTxns.reduce((s, t) => s + t.amount, 0))} in unprocessed volume.`,
      category: 'Risk',
      severity: 'medium',
      type: 'risk',
      confidence: 82,
      summary: `The pending transaction backlog has grown to ${formatNumber(pendingTxns.length)} transactions. Prolonged pending status impacts customer trust and creates operational risk. These transactions span multiple channels and transaction types.`,
      trendAnalysis: `Pending transaction volumes tend to spike during peak business hours and month-end periods. The average resolution time for pending transactions has been increasing, suggesting processing bottlenecks.`,
      recommendedActions: [
        'Investigate processing bottlenecks causing pending transaction accumulation',
        'Implement SLA monitoring for transaction processing times',
        'Deploy automated escalation for transactions pending beyond threshold',
        'Communicate proactively with affected customers about processing delays'
      ],
      relatedKPI: 'Transaction Processing SLA',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Pending Transactions', value: formatNumber(pendingTxns.length) },
        { label: 'Pending Amount', value: formatCurrency(pendingTxns.reduce((s, t) => s + t.amount, 0)) },
        { label: 'Pending Rate', value: `${((pendingTxns.length / transactions.length) * 100).toFixed(1)}%` }
      ]
    });
  }

  return insights;
}

function generateRevenueInsights(customers: Customer[], transactions: Transaction[], dateStr: string): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);
  const totalLTV = customers.reduce((s, c) => s + c.lifetimeValue, 0);

  const sortedByLTV = [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  const top10Pct = sortedByLTV.slice(0, Math.ceil(customers.length * 0.1));
  const top10LTV = top10Pct.reduce((s, c) => s + c.lifetimeValue, 0);
  const concentration = ((top10LTV / totalLTV) * 100).toFixed(1);

  if (parseFloat(concentration) > 40) {
    insights.push({
      id: 'rev-concentration-risk',
      title: 'Revenue Concentration Risk in Top Customer Segment',
      description: `Top 10% of customers generate ${concentration}% of total lifetime value (${formatCurrency(top10LTV)}). This concentration creates significant dependency risk if key accounts are lost.`,
      category: 'Revenue',
      severity: 'high',
      type: 'risk',
      confidence: 93,
      summary: `Revenue is heavily concentrated among the top decile of customers. The top 10% contributes ${concentration}% of total LTV, while the bottom 50% contributes only ${((sortedByLTV.slice(Math.ceil(customers.length * 0.5)).reduce((s, c) => s + c.lifetimeValue, 0) / totalLTV) * 100).toFixed(1)}%. This Pareto-like distribution creates vulnerability to key account losses.`,
      trendAnalysis: `Revenue concentration has been gradually increasing as high-value customers deepen their engagement while mid-tier customers remain stagnant. The gap between top-tier and average customer value continues to widen.`,
      recommendedActions: [
        'Implement key account management program for top 10% customers',
        'Develop mid-tier customer growth strategy to reduce concentration',
        'Create customer diversification KPIs and track quarterly',
        'Build early warning system specifically for high-value customer disengagement',
        'Develop strategic account plans with quarterly business reviews for top accounts'
      ],
      relatedKPI: 'Revenue Concentration Index',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Top 10% LTV', value: formatCurrency(top10LTV) },
        { label: 'Concentration', value: `${concentration}%` },
        { label: 'Total LTV', value: formatCurrency(totalLTV) },
        { label: 'Avg Top-tier LTV', value: formatCurrency(top10LTV / top10Pct.length) }
      ]
    });
  }

  const avgLTV = totalLTV / customers.length;
  const growthCustomers = customers.filter(c =>
    c.lifecycleStage === 'active' && c.lifetimeValue > avgLTV * 1.5 && c.engagementLevel === 'high'
  );

  if (growthCustomers.length > 0) {
    insights.push({
      id: 'rev-growth-potential',
      title: 'High-Growth Potential Customer Cohort Identified',
      description: `${formatNumber(growthCustomers.length)} active customers show above-average LTV and high engagement, indicating strong growth potential worth ${formatCurrency(growthCustomers.reduce((s, c) => s + c.lifetimeValue, 0))}.`,
      category: 'Revenue',
      severity: 'low',
      type: 'opportunity',
      confidence: 86,
      summary: `A cohort of ${formatNumber(growthCustomers.length)} customers demonstrates the characteristics of future high-value accounts: above-average LTV (${formatCurrency(growthCustomers.reduce((s, c) => s + c.lifetimeValue, 0) / growthCustomers.length)} avg), high engagement, and active lifecycle stage. Nurturing this segment could significantly boost revenue.`,
      trendAnalysis: `This cohort consistently increases product adoption and transaction volumes. They respond well to personalized recommendations and premium product offerings, suggesting receptiveness to upselling.`,
      recommendedActions: [
        'Create premium growth track with dedicated relationship management',
        'Develop exclusive product bundles and preferential rates for this segment',
        'Implement proactive advisory services to deepen financial relationships',
        'Monitor growth trajectory and celebrate milestones to build loyalty'
      ],
      relatedKPI: 'Revenue Growth Rate',
      generatedDate: dateStr,
      supportingMetrics: [
        { label: 'Growth Cohort Size', value: formatNumber(growthCustomers.length) },
        { label: 'Avg LTV', value: formatCurrency(growthCustomers.reduce((s, c) => s + c.lifetimeValue, 0) / growthCustomers.length) },
        { label: 'Total Potential', value: formatCurrency(growthCustomers.reduce((s, c) => s + c.lifetimeValue, 0)) }
      ]
    });
  }

  const totalBalance = customers.reduce((s, c) => s + c.accountBalance, 0);
  insights.push({
    id: 'rev-aum-overview',
    title: 'Total Assets Under Management Performance Summary',
    description: `Total AUM across ${formatNumber(customers.length)} customers stands at ${formatCurrency(totalBalance)}, with an average balance of ${formatCurrency(totalBalance / customers.length)} per customer.`,
    category: 'Revenue',
    severity: 'medium',
    type: 'insight',
    confidence: 98,
    summary: `The platform manages ${formatCurrency(totalBalance)} across ${formatNumber(customers.length)} customer accounts. The median balance is lower than the mean, indicating a right-skewed distribution driven by high-value accounts. Total transaction volume processed: ${formatCurrency(totalRevenue)}.`,
    trendAnalysis: `AUM growth is being driven primarily by existing customer deposit increases rather than new customer acquisition. Net deposits (deposits minus withdrawals) remain positive, indicating healthy asset retention.`,
    recommendedActions: [
      'Set AUM growth targets by customer segment and business unit',
      'Launch deposit mobilization campaigns for under-penetrated segments',
      'Develop automated savings nudges for customers below their potential',
      'Create AUM milestone rewards to encourage balance growth'
    ],
    relatedKPI: 'Total Assets Under Management',
    generatedDate: dateStr,
    supportingMetrics: [
      { label: 'Total AUM', value: formatCurrency(totalBalance) },
      { label: 'Avg Balance', value: formatCurrency(totalBalance / customers.length) },
      { label: 'Total Deposits', value: formatCurrency(customers.reduce((s, c) => s + c.totalDeposits, 0)) },
      { label: 'Total Withdrawals', value: formatCurrency(customers.reduce((s, c) => s + c.totalWithdrawals, 0)) }
    ]
  });

  return insights;
}
