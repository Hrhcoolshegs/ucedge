import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export function SplitNode({ data, selected }: NodeProps) {
  const d = data as any;
  const branches = d.branches || [{ name: 'A', weight: 50 }, { name: 'B', weight: 50 }];

  return (
    <div className={`px-4 py-3 rounded-xl border-2 bg-teal-50 min-w-[180px] transition-shadow ${selected ? 'border-teal-500 shadow-lg shadow-teal-500/20' : 'border-teal-300'}`}>
      <Handle type="target" position={Position.Top} className="!bg-teal-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
          <GitBranch className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-bold uppercase text-teal-700 tracking-wide">Split</span>
      </div>
      <p className="text-sm font-semibold text-teal-900">{d.label || 'A/B Test'}</p>
      <div className="flex gap-2 mt-1.5">
        {branches.map((b: any, i: number) => (
          <span key={i} className="text-[10px] bg-teal-200 text-teal-800 px-1.5 py-0.5 rounded font-medium">
            {b.name}: {b.weight}%
          </span>
        ))}
      </div>
      {branches.map((_: any, i: number) => (
        <Handle
          key={`branch-${i}`}
          type="source"
          position={Position.Bottom}
          id={`branch-${i}`}
          style={{ left: `${((i + 1) / (branches.length + 1)) * 100}%` }}
          className="!bg-teal-500 !w-3 !h-3 !border-2 !border-white"
        />
      ))}
    </div>
  );
}
