export interface SentimentBucket {
  id: string;
  name: string;
  engagementLevel: "Low" | "Below Average" | "Average" | "High" | "Very High";
  fitScore: "Poor" | "Below Average" | "Average" | "Good" | "Excellent";
  customerCount: number;
  trend: number;
  avgLTV: number;
  churnRate: number;
  conversionRate: number;
  recommendedAction: string;
  priority: "urgent" | "high" | "medium" | "low" | "ideal";
  customerIds: string[];
  lifecycleBreakdown: {
    new: number;
    active: number;
    loyal: number;
    atRisk: number;
    churned: number;
    reactivated: number;
  };
  avgDaysInBucket: number;
  churnRiskByLifecycle: {
    active: number;
    loyal: number;
  };
}

export const generateSentimentBuckets = (customerIds: string[]): SentimentBucket[] => {
  const buckets: SentimentBucket[] = [];
  
  const engagementLevels: SentimentBucket['engagementLevel'][] = 
    ["Low", "Below Average", "Average", "High", "Very High"];
  const fitScores: SentimentBucket['fitScore'][] = 
    ["Poor", "Below Average", "Average", "Good", "Excellent"];
  
  let customerIndex = 0;
  
  for (let e = 0; e < 5; e++) {
    for (let f = 0; f < 5; f++) {
      const engagement = engagementLevels[4 - e]; // Reverse for top-to-bottom
      const fit = fitScores[f];
      
      // Determine priority and distribution
      let priority: SentimentBucket['priority'] = "medium";
      let basePercentage = 0.04; // 4% default
      
      // Ideal customers (top-right)
      if ((e === 0 || e === 1) && (f === 3 || f === 4)) {
        priority = "ideal";
        basePercentage = 0.05;
      }
      // Growth opportunities (high engagement or good fit)
      else if ((e <= 1 && f === 2) || (e === 2 && f >= 3)) {
        priority = "low";
        basePercentage = 0.15;
      }
      // Stable (center)
      else if (e === 2 && f === 2) {
        priority = "medium";
        basePercentage = 0.65;
      }
      // Warning (mismatches)
      else if ((e === 3 && f >= 3) || (e <= 1 && f === 1)) {
        priority = "high";
        basePercentage = 0.03;
      }
      // Urgent (bottom-left)
      else if ((e >= 3 && f <= 1) || (e === 4 && f === 2)) {
        priority = "urgent";
        basePercentage = 0.05;
      }
      
      const customerCount = Math.floor(customerIds.length * basePercentage);
      const bucketCustomerIds = customerIds.slice(customerIndex, customerIndex + customerCount);
      customerIndex += customerCount;
      
      // Lifecycle breakdown based on priority
      let lifecycleBreakdown = {
        new: 0.15,
        active: 0.45,
        loyal: 0.25,
        atRisk: 0.10,
        churned: 0.02,
        reactivated: 0.03
      };
      
      if (priority === "ideal") {
        lifecycleBreakdown = {
          new: 0.05,
          active: 0.45,
          loyal: 0.40,
          atRisk: 0.02,
          churned: 0,
          reactivated: 0.08
        };
      } else if (priority === "urgent") {
        lifecycleBreakdown = {
          new: 0.02,
          active: 0.15,
          loyal: 0.05,
          atRisk: 0.38,
          churned: 0.40,
          reactivated: 0
        };
      } else if (priority === "high") {
        lifecycleBreakdown = {
          new: 0.05,
          active: 0.30,
          loyal: 0.15,
          atRisk: 0.45,
          churned: 0.05,
          reactivated: 0
        };
      }
      
      // Calculate metrics based on priority
      const avgLTV = priority === "ideal" ? 8500000 :
                     priority === "low" ? 5200000 :
                     priority === "medium" ? 3800000 :
                     priority === "high" ? 2100000 : 950000;
      
      const churnRate = priority === "ideal" ? 0.02 :
                       priority === "low" ? 0.05 :
                       priority === "medium" ? 0.08 :
                       priority === "high" ? 0.25 : 0.45;
      
      const conversionRate = priority === "ideal" ? 0.72 :
                            priority === "low" ? 0.55 :
                            priority === "medium" ? 0.35 :
                            priority === "high" ? 0.18 : 0.08;
      
      const trend = priority === "ideal" ? 12 :
                   priority === "low" ? 8 :
                   priority === "medium" ? -2 :
                   priority === "high" ? -15 : -28;
      
      const avgDaysInBucket = priority === "ideal" ? 180 :
                             priority === "low" ? 90 :
                             priority === "medium" ? 120 :
                             priority === "high" ? 45 : 30;
      
      let recommendedAction = "";
      if (priority === "ideal") {
        recommendedAction = "Cross-sell premium products and request referrals";
      } else if (priority === "low") {
        recommendedAction = "Upsell opportunities - ready for product upgrades";
      } else if (priority === "medium") {
        recommendedAction = "Maintain engagement with regular communication";
      } else if (priority === "high") {
        recommendedAction = "Re-engagement campaign needed immediately";
      } else {
        recommendedAction = "Urgent intervention required - high churn risk";
      }
      
      buckets.push({
        id: `BUCKET-${String(e * 5 + f + 1).padStart(2, '0')}`,
        name: `${engagement} Engagement + ${fit} Fit`,
        engagementLevel: engagement,
        fitScore: fit,
        customerCount,
        trend,
        avgLTV,
        churnRate,
        conversionRate,
        recommendedAction,
        priority,
        customerIds: bucketCustomerIds,
        lifecycleBreakdown: {
          new: Math.floor(customerCount * lifecycleBreakdown.new),
          active: Math.floor(customerCount * lifecycleBreakdown.active),
          loyal: Math.floor(customerCount * lifecycleBreakdown.loyal),
          atRisk: Math.floor(customerCount * lifecycleBreakdown.atRisk),
          churned: Math.floor(customerCount * lifecycleBreakdown.churned),
          reactivated: Math.floor(customerCount * lifecycleBreakdown.reactivated)
        },
        avgDaysInBucket,
        churnRiskByLifecycle: {
          active: churnRate * 0.5,
          loyal: churnRate * 0.2
        }
      });
    }
  }
  
  return buckets;
};