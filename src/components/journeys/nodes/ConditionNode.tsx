import { Handle, Position, NodeProps } from '@xyflow/react';
import { Filter } from 'lucide-react';

export function ConditionNode({ data, selected }: NodeProps) {
  const d = data as any;
  return (
    <div className={`px-4 py-3 rounded-xl border-2 bg-orange-50 min-w-[180px] transition-shadow ${selected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-orange-300'}`}>
      <Handle type="target" position={Position.Top} className="!bg-orange-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
          <Filter className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-bold uppercase text-orange-700 tracking-wide">Condition</span>
      </div>
      <p className="text-sm font-semibold text-orange-900">{d.label || 'Check Condition'}</p>
      {d.conditionField && (
        <p className="text-xs text-orange-600 mt-0.5">{d.conditionField} {d.conditionOperator} {d.conditionValue}</p>
      )}
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-semibold text-emerald-600">Yes</span>
        <span className="text-[10px] font-semibold text-red-500">No</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '30%' }} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: '70%' }} className="!bg-red-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
