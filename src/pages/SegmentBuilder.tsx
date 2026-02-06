import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSegments } from '@/contexts/SegmentsContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Users, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LifecycleBadge } from '@/components/common/LifecycleBadge';
import { SentimentSelector } from '@/components/segments/SentimentSelector';

type LifecycleStage = "new" | "active" | "loyal" | "at-risk" | "churned" | "reactivated";

export default function SegmentBuilder() {
  const navigate = useNavigate();
  const { addSegment } = useSegments();
  const { customers } = useData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStages, setSelectedStages] = useState<LifecycleStage[]>([]);
  const [minLTV, setMinLTV] = useState('');
  const [maxDaysInactive, setMaxDaysInactive] = useState('');

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<string[]>([]);
  const [minSentiment, setMinSentiment] = useState('');
  const [maxSentiment, setMaxSentiment] = useState('');
  const [selectedChurnRisk, setSelectedChurnRisk] = useState<string[]>([]);
  const [selectedSentimentBuckets, setSelectedSentimentBuckets] = useState<string[]>([]);

  const lifecycleStages: LifecycleStage[] = ['new', 'active', 'loyal', 'at-risk', 'churned', 'reactivated'];

  const toggleStage = (stage: LifecycleStage) => {
    setSelectedStages(prev =>
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const matchingCustomers = customers.filter(customer => {
    if (selectedStages.length && !selectedStages.includes(customer.lifecycleStage)) {
      return false;
    }
    if (minLTV && customer.lifetimeValue < Number(minLTV)) {
      return false;
    }
    if (maxDaysInactive && customer.daysInactive > Number(maxDaysInactive)) {
      return false;
    }

    if (minAge && customer.age < Number(minAge)) {
      return false;
    }
    if (maxAge && customer.age > Number(maxAge)) {
      return false;
    }
    if (selectedGender.length && !selectedGender.includes(customer.gender)) {
      return false;
    }
    if (selectedLocations.length && !selectedLocations.some(loc => customer.location.includes(loc))) {
      return false;
    }
    if (selectedEngagement.length && !selectedEngagement.includes(customer.engagementLevel)) {
      return false;
    }
    if (minSentiment && customer.sentimentScore < Number(minSentiment)) {
      return false;
    }
    if (maxSentiment && customer.sentimentScore > Number(maxSentiment)) {
      return false;
    }
    if (selectedChurnRisk.length && !selectedChurnRisk.includes(customer.churnRisk)) {
      return false;
    }
    if (selectedSentimentBuckets.length && !selectedSentimentBuckets.includes(customer.sentimentBucket)) {
      return false;
    }

    return true;
  });

  const totalLTV = matchingCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const avgLTV = matchingCustomers.length > 0 ? totalLTV / matchingCustomers.length : 0;
  const churnRate = matchingCustomers.filter(c => c.churnRisk === 'high').length / matchingCustomers.length || 0;

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a segment name",
        variant: "destructive"
      });
      return;
    }

    const hasAnyFilter = selectedStages.length > 0 || minLTV || maxDaysInactive ||
      minAge || maxAge || selectedGender.length > 0 || selectedLocations.length > 0 ||
      selectedEngagement.length > 0 || minSentiment || maxSentiment ||
      selectedChurnRisk.length > 0 || selectedSentimentBuckets.length > 0;

    if (!hasAnyFilter) {
      toast({
        title: "Criteria required",
        description: "Please select at least one filter",
        variant: "destructive"
      });
      return;
    }

    addSegment({
      name,
      description: description || `Custom segment with ${matchingCustomers.length} customers`,
      type: 'custom',
      customerCount: matchingCustomers.length,
      criteria: {
        lifecycleStages: selectedStages.length ? selectedStages : undefined,
        sentimentBuckets: selectedSentimentBuckets.length ? selectedSentimentBuckets : undefined,
        customFilters: {
          ...(minLTV && { minLTV: Number(minLTV) }),
          ...(maxDaysInactive && { maxDaysInactive: Number(maxDaysInactive) }),
          ...(minAge && { minAge: Number(minAge) }),
          ...(maxAge && { maxAge: Number(maxAge) }),
          ...(selectedGender.length && { genders: selectedGender }),
          ...(selectedLocations.length && { locations: selectedLocations }),
          ...(selectedEngagement.length && { engagementLevels: selectedEngagement }),
          ...(minSentiment && { minSentimentScore: Number(minSentiment) }),
          ...(maxSentiment && { maxSentimentScore: Number(maxSentiment) }),
          ...(selectedChurnRisk.length && { churnRisks: selectedChurnRisk })
        }
      },
      metrics: {
        totalLTV,
        avgLTV,
        churnRate,
        trend: 'stable'
      },
      createdBy: 'User',
      isAutoGenerated: false
    });

    toast({
      title: "Segment created",
      description: `${name} with ${matchingCustomers.length} customers`,
    });

    navigate('/segments');
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/segments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Create Segment</h1>
          <p className="text-muted-foreground mt-1">Build a custom audience with multiple criteria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Segment Name *</Label>
              <Input
                id="name"
                placeholder="e.g., High Value Active Customers"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this segment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-6">
            <Tabs defaultValue="lifecycle" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
                <TabsTrigger value="sentiment">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Sentiment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lifecycle" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Lifecycle Stages</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {lifecycleStages.map(stage => (
                      <div key={stage} className="flex items-center space-x-2">
                        <Checkbox
                          id={stage}
                          checked={selectedStages.includes(stage)}
                          onCheckedChange={() => toggleStage(stage)}
                        />
                        <label htmlFor={stage} className="flex-1 cursor-pointer">
                          <LifecycleBadge stage={stage} size="sm" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="minLTV">Minimum LTV (₦)</Label>
                    <Input
                      id="minLTV"
                      type="number"
                      placeholder="e.g., 500000"
                      value={minLTV}
                      onChange={(e) => setMinLTV(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDaysInactive">Max Days Inactive</Label>
                    <Input
                      id="maxDaysInactive"
                      type="number"
                      placeholder="e.g., 30"
                      value={maxDaysInactive}
                      onChange={(e) => setMaxDaysInactive(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demographics" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAge">Minimum Age</Label>
                    <Input
                      id="minAge"
                      type="number"
                      placeholder="e.g., 25"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAge">Maximum Age</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      placeholder="e.g., 45"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="flex gap-4">
                    {['Male', 'Female'].map(gender => (
                      <div key={gender} className="flex items-center space-x-2">
                        <Checkbox
                          id={`gender-${gender}`}
                          checked={selectedGender.includes(gender)}
                          onCheckedChange={(checked) => {
                            setSelectedGender(prev =>
                              checked
                                ? [...prev, gender]
                                : prev.filter(g => g !== gender)
                            );
                          }}
                        />
                        <label htmlFor={`gender-${gender}`} className="cursor-pointer text-sm">
                          {gender}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'].map(location => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={(checked) => {
                            setSelectedLocations(prev =>
                              checked
                                ? [...prev, location]
                                : prev.filter(l => l !== location)
                            );
                          }}
                        />
                        <label htmlFor={`location-${location}`} className="cursor-pointer text-sm">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Engagement Level</Label>
                  <div className="flex gap-4">
                    {['high', 'medium', 'low'].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`engagement-${level}`}
                          checked={selectedEngagement.includes(level)}
                          onCheckedChange={(checked) => {
                            setSelectedEngagement(prev =>
                              checked
                                ? [...prev, level]
                                : prev.filter(e => e !== level)
                            );
                          }}
                        />
                        <label htmlFor={`engagement-${level}`} className="cursor-pointer text-sm capitalize">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Churn Risk</Label>
                  <div className="flex gap-4">
                    {['low', 'medium', 'high'].map(risk => (
                      <div key={risk} className="flex items-center space-x-2">
                        <Checkbox
                          id={`risk-${risk}`}
                          checked={selectedChurnRisk.includes(risk)}
                          onCheckedChange={(checked) => {
                            setSelectedChurnRisk(prev =>
                              checked
                                ? [...prev, risk]
                                : prev.filter(r => r !== risk)
                            );
                          }}
                        />
                        <label htmlFor={`risk-${risk}`} className="cursor-pointer text-sm capitalize">
                          {risk}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="minSentiment">Min Sentiment Score</Label>
                    <Input
                      id="minSentiment"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1-10"
                      value={minSentiment}
                      onChange={(e) => setMinSentiment(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxSentiment">Max Sentiment Score</Label>
                    <Input
                      id="maxSentiment"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1-10"
                      value={maxSentiment}
                      onChange={(e) => setMaxSentiment(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sentiment" className="mt-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select sentiment buckets to target specific customer groups
                  </p>
                  <SentimentSelector
                    selectedBuckets={selectedSentimentBuckets}
                    onSelectionChange={setSelectedSentimentBuckets}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 sticky top-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Live Preview</h3>
              <p className="text-sm text-muted-foreground">Matching customers</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center p-6 bg-primary/5 rounded-lg">
                <div className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-4xl font-bold text-foreground">
                    {matchingCustomers.length.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">customers</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total LTV:</span>
                  <span className="font-semibold">₦{(totalLTV / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg LTV:</span>
                  <span className="font-semibold">₦{(avgLTV / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Churn Rate:</span>
                  <span className={`font-semibold ${churnRate > 0.3 ? 'text-destructive' : 'text-success'}`}>
                    {(churnRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full" size="lg">
                <Save className="h-4 w-4 mr-2" />
                Save Segment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
