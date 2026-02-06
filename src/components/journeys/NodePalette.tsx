import { Zap, Mail, Clock, Filter, GitBranch, CircleCheck } from 'lucide-react';

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'bg-emerald-500', desc: 'Entry point' },
  { type: 'action', label: 'Action', icon: Mail, color: 'bg-blue-500', desc: 'Send message' },
  { type: 'wait', label: 'Wait', icon: Clock, color: 'bg-amber-500', desc: 'Delay step' },
  { type: 'condition', label: 'Condition', icon: Filter, color: 'bg-orange-500', desc: 'Branch logic' },
  { type: 'split', label: 'Split', icon: GitBranch, color: 'bg-teal-500', desc: 'A/B test' },
  { type: 'end', label: 'End', icon: CircleCheck, color: 'bg-gray-500', desc: 'Terminal' },
];

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="w-56 bg-background border-r border-border p-4 space-y-3 overflow-y-auto">
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Node Palette</h3>
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
        >
          <div className={`w-8 h-8 rounded-lg ${node.color} flex items-center justify-center`}>
            <node.icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{node.label}</p>
            <p className="text-xs text-muted-foreground">{node.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
