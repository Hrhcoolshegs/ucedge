import type { Customer, Segment } from '@/types';

export class SegmentEvaluator {
  static evaluateSegment(segment: Segment, customers: Customer[]): {
    matchingCustomers: Customer[];
    metrics: {
      customerCount: number;
      totalLTV: number;
      avgLTV: number;
      churnRate: number;
    };
  } {
    const matchingCustomers = customers.filter(customer => {
      if (segment.criteria.lifecycleStages?.length) {
        if (!segment.criteria.lifecycleStages.includes(customer.lifecycleStage)) {
          return false;
        }
      }

      if (segment.criteria.sentimentBuckets?.length) {
        if (!segment.criteria.sentimentBuckets.includes(customer.sentimentBucket)) {
          return false;
        }
      }

      const filters = segment.criteria.customFilters || {};

      if (filters.minLTV && customer.lifetimeValue < filters.minLTV) {
        return false;
      }

      if (filters.maxLTV && customer.lifetimeValue > filters.maxLTV) {
        return false;
      }

      if (filters.maxDaysInactive && customer.daysInactive > filters.maxDaysInactive) {
        return false;
      }

      if (filters.maxDaysSinceChurn && customer.churnDate) {
        const daysSinceChurn = Math.floor(
          (new Date().getTime() - customer.churnDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceChurn > filters.maxDaysSinceChurn) {
          return false;
        }
      }

      if (filters.minAge && customer.age < filters.minAge) {
        return false;
      }

      if (filters.maxAge && customer.age > filters.maxAge) {
        return false;
      }

      if (filters.genders?.length && !filters.genders.includes(customer.gender)) {
        return false;
      }

      if (filters.locations?.length) {
        const matchesLocation = filters.locations.some((loc: string) =>
          customer.location.includes(loc)
        );
        if (!matchesLocation) {
          return false;
        }
      }

      if (filters.engagementLevels?.length) {
        if (!filters.engagementLevels.includes(customer.engagementLevel)) {
          return false;
        }
      }

      if (filters.minSentimentScore && customer.sentimentScore < filters.minSentimentScore) {
        return false;
      }

      if (filters.maxSentimentScore && customer.sentimentScore > filters.maxSentimentScore) {
        return false;
      }

      if (filters.churnRisks?.length && !filters.churnRisks.includes(customer.churnRisk)) {
        return false;
      }

      return true;
    });

    const totalLTV = matchingCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const avgLTV = matchingCustomers.length > 0 ? totalLTV / matchingCustomers.length : 0;
    const churnRate =
      matchingCustomers.length > 0
        ? matchingCustomers.filter(c => c.churnRisk === 'high').length / matchingCustomers.length
        : 0;

    return {
      matchingCustomers,
      metrics: {
        customerCount: matchingCustomers.length,
        totalLTV,
        avgLTV,
        churnRate,
      },
    };
  }

  static evaluateAllSegments(
    segments: Segment[],
    customers: Customer[]
  ): Map<string, {
    customerCount: number;
    totalLTV: number;
    avgLTV: number;
    churnRate: number;
  }> {
    const results = new Map();

    segments.forEach(segment => {
      const evaluation = this.evaluateSegment(segment, customers);
      results.set(segment.id, evaluation.metrics);
    });

    return results;
  }
}
