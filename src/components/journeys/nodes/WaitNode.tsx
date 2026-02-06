import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock } from 'lucide-react';

export function WaitNode({ data, selected }: NodeProps) {
  const d = data as any;
  return (
    <div className={`px-4 py-3 rounded-xl border-2 bg-amber-50 min-w-[180px] transition-shadow ${selected ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-amber-300'}`}>
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-bold uppercase text-amber-700 tracking-wide">Wait</span>
      </div>
      <p className="text-sm font-semibold text-amber-900">{d.label || 'Wait'}</p>
      {d.duration && (
        <p className="text-xs text-amber-600 mt-0.5">{d.duration}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
