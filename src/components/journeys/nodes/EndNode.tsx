import { Handle, Position, NodeProps } from '@xyflow/react';
import { CircleCheck } from 'lucide-react';

export function EndNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-4 py-3 rounded-xl border-2 bg-gray-50 min-w-[140px] transition-shadow ${selected ? 'border-gray-500 shadow-lg shadow-gray-500/20' : 'border-gray-300'}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-500 flex items-center justify-center">
          <CircleCheck className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase text-gray-500 tracking-wide">End</span>
          <p className="text-sm font-semibold text-gray-700">{(data as any).label || 'Journey Complete'}</p>
        </div>
      </div>
    </div>
  );
}
