import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';

export function TriggerNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-4 py-3 rounded-xl border-2 bg-emerald-50 min-w-[180px] transition-shadow ${selected ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-emerald-300'}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-bold uppercase text-emerald-700 tracking-wide">Trigger</span>
      </div>
      <p className="text-sm font-semibold text-emerald-900">{(data as any).label || 'Start'}</p>
      {(data as any).triggerType && (
        <p className="text-xs text-emerald-600 mt-0.5">{(data as any).triggerType}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
