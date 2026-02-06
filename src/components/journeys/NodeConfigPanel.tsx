import { Node } from '@xyflow/react';
import { X, Plus, Trash2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PersonalizationEngine } from '@/utils/personalization';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

interface NodeConfigPanelProps {
  node: Node | null;
  onUpdate: (id: string, data: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function NodeConfigPanel({ node, onUpdate, onClose, onDelete }: NodeConfigPanelProps) {
  if (!node) return null;

  const d = node.data as any;
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const update = (key: string, value: any) => {
    onUpdate(node.id, { ...d, [key]: value });
  };

  const personalization = d.personalization || {};
  const availableVars = PersonalizationEngine.getAvailableVariables();

  const addPersonalizationVar = () => {
    if (newVarKey && newVarValue) {
      update('personalization', {
        ...personalization,
        [newVarKey]: newVarValue,
      });
      setNewVarKey('');
      setNewVarValue('');
    }
  };

  const removePersonalizationVar = (key: string) => {
    const updated = { ...personalization };
    delete updated[key];
    update('personalization', updated);
  };

  return (
    <div className="w-72 bg-background border-l border-border p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Configure Node</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Label</label>
          <Input value={d.label || ''} onChange={(e) => update('label', e.target.value)} className="mt-1 h-9" />
        </div>

        {node.type === 'trigger' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Trigger Type</label>
              <Select value={d.triggerType || 'event'} onValueChange={(v) => update('triggerType', v)}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event Based</SelectItem>
                  <SelectItem value="segment_entry">Segment Entry</SelectItem>
                  <SelectItem value="schedule">Scheduled</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {d.triggerType === 'schedule' && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Frequency</label>
                  <Select value={d.frequency || 'once'} onValueChange={(v) => update('frequency', v)}>
                    <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {d.frequency !== 'once' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Time</label>
                    <Input
                      type="time"
                      value={d.time || '09:00'}
                      onChange={(e) => update('time', e.target.value)}
                      className="mt-1 h-9"
                    />
                  </div>
                )}

                {d.frequency === 'weekly' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Day of Week</label>
                    <Select value={d.dayOfWeek?.toString() || '1'} onValueChange={(v) => update('dayOfWeek', parseInt(v))}>
                      <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="0">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {d.frequency === 'monthly' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Day of Month</label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={d.dayOfMonth || 1}
                      onChange={(e) => update('dayOfMonth', parseInt(e.target.value))}
                      className="mt-1 h-9"
                    />
                  </div>
                )}
              </>
            )}

            {d.triggerType === 'event' && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Event Type</label>
                <Input
                  value={d.eventType || ''}
                  onChange={(e) => update('eventType', e.target.value)}
                  className="mt-1 h-9"
                  placeholder="e.g. account_created"
                />
              </div>
            )}

            {d.triggerType === 'segment_entry' && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Segment ID</label>
                <Input
                  value={d.segmentId || ''}
                  onChange={(e) => update('segmentId', e.target.value)}
                  className="mt-1 h-9"
                  placeholder="Enter segment ID"
                />
              </div>
            )}
          </>
        )}

        {node.type === 'action' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Channel</label>
              <Select value={d.channel || 'email'} onValueChange={(v) => update('channel', v)}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="in_app">In-App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Subject</label>
              <Input value={d.subject || ''} onChange={(e) => update('subject', e.target.value)} className="mt-1 h-9" placeholder="Message subject" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Message Body</label>
              <textarea
                value={d.body || ''}
                onChange={(e) => update('body', e.target.value)}
                className="mt-1 w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                placeholder="Enter message content... Use {{variableName}} for personalization"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Personalization</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Info className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-xs">
                    <div className="space-y-2">
                      <p className="font-semibold">Available Variables:</p>
                      {availableVars.slice(0, 5).map((v) => (
                        <div key={v.name} className="flex items-start gap-2">
                          <code className="text-primary">{`{{${v.name}}}`}</code>
                          <span className="text-muted-foreground flex-1">{v.description}</span>
                        </div>
                      ))}
                      <p className="text-muted-foreground pt-2 border-t">
                        Add custom variables below to pass additional data.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {Object.entries(personalization).length > 0 && (
                <div className="space-y-2 mb-2">
                  {Object.entries(personalization).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <code className="text-xs text-primary flex-1">{`{{${key}}}`}</code>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {String(value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => removePersonalizationVar(key)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-1">
                <Input
                  value={newVarKey}
                  onChange={(e) => setNewVarKey(e.target.value)}
                  placeholder="Key"
                  className="h-8 text-xs"
                />
                <Input
                  value={newVarValue}
                  onChange={(e) => setNewVarValue(e.target.value)}
                  placeholder="Value"
                  className="h-8 text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={addPersonalizationVar}
                  disabled={!newVarKey || !newVarValue}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Requires Approval</label>
              <Switch checked={d.requiresApproval || false} onCheckedChange={(v) => update('requiresApproval', v)} />
            </div>
          </>
        )}

        {node.type === 'wait' && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Duration</label>
            <Select value={d.duration || '24h'} onValueChange={(v) => update('duration', v)}>
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="6h">6 Hours</SelectItem>
                <SelectItem value="12h">12 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="48h">2 Days</SelectItem>
                <SelectItem value="72h">3 Days</SelectItem>
                <SelectItem value="168h">7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {node.type === 'condition' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Field</label>
              <Input value={d.conditionField || ''} onChange={(e) => update('conditionField', e.target.value)} className="mt-1 h-9" placeholder="e.g. customer.balance" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Operator</label>
              <Select value={d.conditionOperator || 'greater_than'} onValueChange={(v) => update('conditionOperator', v)}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Value</label>
              <Input value={d.conditionValue || ''} onChange={(e) => update('conditionValue', e.target.value)} className="mt-1 h-9" placeholder="Comparison value" />
            </div>
          </>
        )}

        {node.type === 'split' && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Split Type</label>
            <Select value={d.splitType || 'ab_test'} onValueChange={(v) => update('splitType', v)}>
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ab_test">A/B Test</SelectItem>
                <SelectItem value="multi_branch">Multi-Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border">
        <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(node.id)}>
          Delete Node
        </Button>
      </div>
    </div>
  );
}
