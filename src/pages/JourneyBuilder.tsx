import { useState, useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { Journey } from '@/types/journeys';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JourneyDetailsModal } from '@/components/journeys/JourneyDetailsModal';
import { JourneyCanvas } from '@/components/journeys/JourneyCanvas';
import { journeyToFlow, flowToJourneyNodes, createFlowNode } from '@/utils/journeyFlowUtils';
import { Node, Edge } from '@xyflow/react';
import {
  Mail, Clock, Filter, GitBranch, Zap, Users, TrendingUp, Activity,
  ArrowRight, Plus, PenTool, Search, X,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermission } from '@/hooks/usePermission';
import { formatNumber } from '@/utils/formatters';

const NODE_TYPE_ICONS: Record<string, JSX.Element> = {
  trigger: <Zap className="h-3.5 w-3.5 text-emerald-500" />,
  action: <Mail className="h-3.5 w-3.5 text-blue-500" />,
  wait: <Clock className="h-3.5 w-3.5 text-amber-500" />,
  condition: <Filter className="h-3.5 w-3.5 text-orange-500" />,
  split: <GitBranch className="h-3.5 w-3.5 text-teal-500" />,
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  paused: 'bg-amber-100 text-amber-800',
  draft: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-500',
};

function getUniqueNodeTypes(nodes: { type: string }[]) {
  return [...new Set(nodes.map((n) => n.type).filter((t) => t !== 'end'))];
}

type ViewMode = 'grid' | 'canvas';

export default function JourneyBuilder() {
  const { journeys, updateJourney, addJourney } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedJourney, setSelectedJourney] = useState<Journey | undefined>();
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState<string>('event');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');
  const canEdit = usePermission('can_edit_journeys');
  const canCreate = usePermission('can_create_journeys');

  const filteredJourneys = journeys.filter((j) => {
    const matchesSearch = searchQuery === '' ||
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;

    const matchesTrigger = triggerFilter === 'all' || j.trigger.type === triggerFilter;

    return matchesSearch && matchesStatus && matchesTrigger;
  });

  const hasActiveFilters = statusFilter !== 'all' || triggerFilter !== 'all';

  const clearFilters = () => {
    setStatusFilter('all');
    setTriggerFilter('all');
  };

  const activeJourneys = filteredJourneys.filter((j) => j.status === 'active');
  const totalEntered = filteredJourneys.reduce((s, j) => s + j.analytics.totalEntered, 0);
  const totalCompleted = filteredJourneys.reduce((s, j) => s + j.analytics.totalCompleted, 0);
  const avgConversion = filteredJourneys.length > 0 ? filteredJourneys.reduce((s, j) => s + j.analytics.conversionRate, 0) / filteredJourneys.length : 0;

  const handleOpenCanvas = useCallback((journey: Journey) => {
    setEditingJourney(journey);
    setViewMode('canvas');
  }, []);

  const handleSaveCanvas = useCallback((nodes: Node[], edges: Edge[]) => {
    if (!editingJourney) return;
    const updatedNodes = flowToJourneyNodes(nodes, edges);
    const updated: Journey = { ...editingJourney, nodes: updatedNodes, updatedAt: new Date() };
    updateJourney(updated);
    setEditingJourney(updated);
  }, [editingJourney, updateJourney]);

  const handleCreateNew = useCallback(() => {
    if (!newName.trim()) return;
    const triggerNode = createFlowNode('trigger', { x: 300, y: 50 });
    const endNode = createFlowNode('end', { x: 300, y: 250 });
    const now = new Date();

    const newJourney: Journey = {
      id: `journey_custom_${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim(),
      status: 'draft',
      trigger: { type: newTrigger as any, config: {} },
      nodes: [
        { id: triggerNode.id, type: 'trigger', name: 'Start', config: {}, next: [endNode.id], position: triggerNode.position },
        { id: endNode.id, type: 'end', name: 'Journey Complete', config: {}, next: [], position: endNode.position },
      ],
      analytics: {
        totalEntered: 0, totalCompleted: 0, totalActive: 0, totalDropped: 0,
        conversionRate: 0, avgCompletionTime: 0, stepPerformance: [], channelPerformance: [],
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'current_user',
    };

    addJourney(newJourney);
    setShowNewDialog(false);
    setNewName('');
    setNewDesc('');
    setNewTrigger('event');
    setEditingJourney(newJourney);
    setViewMode('canvas');
  }, [newName, newDesc, newTrigger, addJourney]);

  if (viewMode === 'canvas' && editingJourney) {
    const { nodes: flowNodes, edges: flowEdges } = journeyToFlow(editingJourney);
    return (
      <JourneyCanvas
        initialNodes={flowNodes}
        initialEdges={flowEdges}
        journeyName={editingJourney.name}
        journeyStatus={editingJourney.status}
        onSave={handleSaveCanvas}
        onBack={() => { setViewMode('grid'); setEditingJourney(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Journey Builder</h1>
          <p className="text-muted-foreground">Design and manage automated customer journeys</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Journey
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Activity className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold">{activeJourneys.length}</p><p className="text-xs text-muted-foreground">Active Journeys</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{formatNumber(totalEntered)}</p><p className="text-xs text-muted-foreground">Total Entered</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-teal-600" /></div>
            <div><p className="text-2xl font-bold">{formatNumber(totalCompleted)}</p><p className="text-xs text-muted-foreground">Total Completed</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><ArrowRight className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-2xl font-bold">{avgConversion.toFixed(1)}%</p><p className="text-xs text-muted-foreground">Avg Conversion</p></div>
          </div>
        </CardContent></Card>
      </div>

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
                placeholder="Search journeys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={triggerFilter} onValueChange={setTriggerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trigger Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Triggers</SelectItem>
                <SelectItem value="event">Event-Based</SelectItem>
                <SelectItem value="segment">Segment Entry</SelectItem>
                <SelectItem value="date">Date-Based</SelectItem>
                <SelectItem value="api">API Trigger</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredJourneys.length} of {journeys.length} journeys
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJourneys.map((journey) => (
          <Card key={journey.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base">{journey.name}</CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-2">{journey.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[journey.status] || STATUS_COLORS.draft}`}>
                  {journey.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground text-xs">Entered</span><p className="font-semibold">{formatNumber(journey.analytics.totalEntered)}</p></div>
                <div><span className="text-muted-foreground text-xs">Conversion</span><p className="font-semibold">{journey.analytics.conversionRate}%</p></div>
                <div><span className="text-muted-foreground text-xs">Active</span><p className="font-semibold">{formatNumber(journey.analytics.totalActive)}</p></div>
                <div><span className="text-muted-foreground text-xs">Avg Time</span><p className="font-semibold">{journey.analytics.avgCompletionTime}h</p></div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {getUniqueNodeTypes(journey.nodes).map((type) => (
                  <span key={type} className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                    {NODE_TYPE_ICONS[type]} {type}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedJourney(journey); setShowDetailsModal(true); }}>
                  Details
                </Button>
                {canEdit && (
                  <Button size="sm" className="flex-1" onClick={() => handleOpenCanvas(journey)}>
                    <PenTool className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showDetailsModal && selectedJourney && (
        <JourneyDetailsModal
          journey={selectedJourney}
          onClose={() => { setShowDetailsModal(false); setSelectedJourney(undefined); }}
        />
      )}

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Journey</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Journey Name</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Premium Upgrade Flow" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Brief description of this journey" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Trigger Type</label>
              <Select value={newTrigger} onValueChange={setNewTrigger}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event Based</SelectItem>
                  <SelectItem value="segment_entry">Segment Entry</SelectItem>
                  <SelectItem value="schedule">Scheduled</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateNew} disabled={!newName.trim()}>Create & Open Editor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
