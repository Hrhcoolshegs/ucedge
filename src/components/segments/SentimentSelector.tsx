import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { generateSentimentBuckets, SentimentBucket } from '@/utils/sentimentBucketGenerator';
import { formatNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SentimentSelectorProps {
  selectedBuckets: string[];
  onSelectionChange: (bucketIds: string[]) => void;
}

export const SentimentSelector = ({ selectedBuckets, onSelectionChange }: SentimentSelectorProps) => {
  const { customers } = useData();
  
  const buckets = useMemo(() => {
    return generateSentimentBuckets(customers.map(c => c.id));
  }, [customers]);

  const engagementLevels = ["Very High", "High", "Average", "Below Average", "Low"];
  const fitScores = ["Poor", "Below Average", "Average", "Good", "Excellent"];

  const getCellColor = (priority: SentimentBucket['priority'], isSelected: boolean) => {
    const base = {
      ideal: 'bg-success/20 border-success',
      low: 'bg-secondary/30 border-secondary',
      medium: 'bg-blue-100 border-blue-300',
      high: 'bg-warning/20 border-warning',
      urgent: 'bg-destructive/20 border-destructive'
    }[priority];

    const selected = isSelected ? 'ring-2 ring-primary shadow-lg' : '';
    return `${base} ${selected}`;
  };

  const toggleBucket = (bucketId: string) => {
    if (selectedBuckets.includes(bucketId)) {
      onSelectionChange(selectedBuckets.filter(id => id !== bucketId));
    } else {
      onSelectionChange([...selectedBuckets, bucketId]);
    }
  };

  const totalSelected = buckets
    .filter(b => selectedBuckets.includes(b.id))
    .reduce((sum, b) => sum + b.customerCount, 0);

  return (
    <div className="space-y-4">
      <div className="text-center p-3 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {selectedBuckets.length === 0 ? (
            'Click cells to select sentiment buckets'
          ) : (
            <>
              <span className="font-semibold text-foreground">{selectedBuckets.length} buckets</span>
              {' • '}
              <span className="font-semibold text-foreground">{formatNumber(totalSelected)} customers</span>
            </>
          )}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Grid */}
          <div className="flex gap-1.5">
            {/* Y-axis labels */}
            <div className="flex flex-col gap-1.5 w-24">
              <div className="h-3" />
              {engagementLevels.map((level) => (
                <div key={level} className="h-16 flex items-center justify-end pr-2">
                  <p className="text-xs font-medium text-muted-foreground text-right">{level}</p>
                </div>
              ))}
            </div>

            {/* Grid cells */}
            <div className="flex-1">
              {/* X-axis labels */}
              <div className="flex gap-1.5 mb-1.5 h-3">
                {fitScores.map((score) => (
                  <div key={score} className="flex-1 flex items-center justify-center">
                    <p className="text-xs font-medium text-muted-foreground">{score}</p>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {engagementLevels.map((engagement) => (
                <div key={engagement} className="flex gap-1.5 mb-1.5">
                  {fitScores.map((fit) => {
                    const bucket = buckets.find(
                      b => b.engagementLevel === engagement && b.fitScore === fit
                    );
                    
                    if (!bucket) return null;

                    const isSelected = selectedBuckets.includes(bucket.id);

                    return (
                      <button
                        key={bucket.id}
                        onClick={() => toggleBucket(bucket.id)}
                        className={cn(
                          "flex-1 h-16 p-2 rounded border-2 transition-all duration-200",
                          "hover:scale-105 cursor-pointer relative",
                          getCellColor(bucket.priority, isSelected)
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <div className="flex flex-col h-full justify-between">
                          <p className="text-xs font-bold text-foreground">
                            {formatNumber(bucket.customerCount)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Axis labels */}
          <div className="flex gap-1.5 mt-2">
            <div className="w-24" />
            <div className="flex-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">Product Fit →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
