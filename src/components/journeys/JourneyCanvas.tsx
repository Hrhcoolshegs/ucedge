import { useCallback, useState, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { WaitNode } from './nodes/WaitNode';
import { ConditionNode } from './nodes/ConditionNode';
import { SplitNode } from './nodes/SplitNode';
import { EndNode } from './nodes/EndNode';
import { NodePalette } from './NodePalette';
import { NodeConfigPanel } from './NodeConfigPanel';
import { createFlowNode } from '@/utils/journeyFlowUtils';
import { Button } from '@/components/ui/button';
import { Save, LayoutGrid, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  wait: WaitNode,
  condition: ConditionNode,
  split: SplitNode,
  end: EndNode,
};

interface JourneyCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  journeyName: string;
  journeyStatus: string;
  onSave: (nodes: Node[], edges: Edge[]) => void;
  onBack: () => void;
}

function JourneyCanvasInner({ initialNodes, initialEdges, journeyName, journeyStatus, onSave, onBack }: JourneyCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !rfInstance || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInstance.screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const newNode = createFlowNode(type, position);
    setNodes((nds) => [...nds, newNode]);
  }, [rfInstance, setNodes]);

  const handleNodeUpdate = useCallback((id: string, data: Record<string, any>) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data } : n)));
    setSelectedNode((prev) => (prev && prev.id === id ? { ...prev, data } : prev));
  }, [setNodes]);

  const handleNodeDelete = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const handleAutoLayout = useCallback(() => {
    const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const spacing = 120;
    const layouted = sorted.map((n, i) => ({
      ...n,
      position: { x: 300, y: i * spacing + 50 },
    }));
    setNodes(layouted);
    setTimeout(() => rfInstance?.fitView({ padding: 0.2 }), 50);
  }, [nodes, setNodes, rfInstance]);

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    draft: 'bg-gray-100 text-gray-800',
    paused: 'bg-amber-100 text-amber-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <NodePalette onDragStart={onDragStart} />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h3 className="font-semibold text-foreground">{journeyName}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[journeyStatus] || statusColors.draft}`}>
              {journeyStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAutoLayout}>
              <LayoutGrid className="h-4 w-4 mr-1" /> Auto-layout
            </Button>
            <Button variant="outline" size="sm" onClick={() => rfInstance?.zoomIn()}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => rfInstance?.zoomOut()}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => rfInstance?.fitView({ padding: 0.2 })}>
              <Maximize className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => onSave(nodes, edges)}>
              <Save className="h-4 w-4 mr-1" /> Save Journey
            </Button>
          </div>
        </div>
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className="bg-muted/30"
          >
            <Background gap={20} size={1} />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              className="!bg-background !border-border"
            />
          </ReactFlow>
        </div>
      </div>
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onUpdate={handleNodeUpdate}
          onClose={() => setSelectedNode(null)}
          onDelete={handleNodeDelete}
        />
      )}
    </div>
  );
}

export function JourneyCanvas(props: JourneyCanvasProps) {
  return (
    <ReactFlowProvider>
      <JourneyCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
