import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mail, MessageSquare, Bell, Send, Smartphone } from 'lucide-react';

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  whatsapp: Send,
  in_app: Smartphone,
};

export function ActionNode({ data, selected }: NodeProps) {
  const d = data as any;
  const Icon = channelIcons[d.channel] || Mail;

  return (
    <div className={`px-4 py-3 rounded-xl border-2 bg-blue-50 min-w-[180px] transition-shadow ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-300'}`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-bold uppercase text-blue-700 tracking-wide">Action</span>
      </div>
      <p className="text-sm font-semibold text-blue-900">{d.label || 'Send Message'}</p>
      {d.channel && (
        <p className="text-xs text-blue-600 mt-0.5 capitalize">{d.channel}</p>
      )}
      {d.requiresApproval && (
        <div className="mt-1.5 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] font-medium text-amber-700">Approval Required</span>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
