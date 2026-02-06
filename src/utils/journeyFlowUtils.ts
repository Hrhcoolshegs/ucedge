import { Node, Edge } from '@xyflow/react';
import { Journey, JourneyNode } from '@/types/journeys';

export function journeyToFlow(journey: Journey): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = journey.nodes.map((jn: JourneyNode) => {
    const data: Record<string, any> = { label: jn.name };

    if (jn.type === 'trigger') {
      data.triggerType = journey.trigger.type;
    } else if (jn.type === 'action') {
      const cfg = jn.config as any;
      data.channel = cfg?.channel || 'email';
      data.subject = cfg?.content?.subject || '';
      data.body = cfg?.content?.body || '';
      data.requiresApproval = cfg?.requiresApproval || false;
    } else if (jn.type === 'wait') {
      const cfg = jn.config as any;
      data.duration = cfg?.duration || '24h';
    } else if (jn.type === 'condition') {
      const cfg = jn.config as any;
      const cond = cfg?.conditions?.[0];
      if (cond) {
        data.conditionField = cond.field;
        data.conditionOperator = cond.operator;
        data.conditionValue = String(cond.value);
      }
    } else if (jn.type === 'split') {
      const cfg = jn.config as any;
      data.splitType = cfg?.splitType || 'ab_test';
      data.branches = cfg?.branches?.map((b: any) => ({ name: b.name, weight: b.weight || 50 })) || [];
    }

    return {
      id: jn.id,
      type: jn.type,
      position: jn.position,
      data,
    };
  });

  const edges: Edge[] = [];
  journey.nodes.forEach((jn) => {
    jn.next.forEach((targetId, idx) => {
      if (!targetId) return;
      let sourceHandle: string | undefined;

      if (jn.type === 'condition') {
        sourceHandle = idx === 0 ? 'yes' : 'no';
      } else if (jn.type === 'split') {
        sourceHandle = `branch-${idx}`;
      }

      edges.push({
        id: `e-${jn.id}-${targetId}`,
        source: jn.id,
        target: targetId,
        sourceHandle,
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      });
    });
  });

  return { nodes, edges };
}

export function flowToJourneyNodes(nodes: Node[], edges: Edge[]): JourneyNode[] {
  return nodes.map((n) => {
    const d = n.data as any;
    const outgoing = edges.filter((e) => e.source === n.id);
    const nextIds = outgoing.map((e) => e.target);

    let config: any = {};
    if (n.type === 'action') {
      config = {
        actionType: 'send_message',
        channel: d.channel || 'email',
        content: { subject: d.subject || '', body: d.body || '' },
        requiresApproval: d.requiresApproval || false,
      };
    } else if (n.type === 'wait') {
      config = { type: 'time', duration: d.duration || '24h' };
    } else if (n.type === 'condition') {
      config = {
        conditions: [{ field: d.conditionField || '', operator: d.conditionOperator || 'equals', value: d.conditionValue || '' }],
        logic: 'and',
        truePath: nextIds[0] || '',
        falsePath: nextIds[1] || '',
      };
    } else if (n.type === 'split') {
      config = {
        splitType: d.splitType || 'ab_test',
        branches: (d.branches || []).map((b: any, i: number) => ({
          id: `branch_${i}`,
          name: b.name,
          weight: b.weight,
          nextNode: nextIds[i] || '',
        })),
      };
    }

    return {
      id: n.id,
      type: n.type as JourneyNode['type'],
      name: d.label || '',
      config,
      next: nextIds,
      position: { x: n.position.x, y: n.position.y },
    };
  });
}

let nodeCounter = 0;
export function createFlowNode(type: string, position: { x: number; y: number }): Node {
  nodeCounter++;
  const id = `node_new_${Date.now()}_${nodeCounter}`;
  const defaults: Record<string, Record<string, any>> = {
    trigger: { label: 'New Trigger', triggerType: 'event' },
    action: { label: 'New Action', channel: 'email', subject: '', body: '', requiresApproval: false },
    wait: { label: 'Wait', duration: '24h' },
    condition: { label: 'Check Condition', conditionField: '', conditionOperator: 'equals', conditionValue: '' },
    split: { label: 'A/B Test', splitType: 'ab_test', branches: [{ name: 'A', weight: 50 }, { name: 'B', weight: 50 }] },
    end: { label: 'Journey Complete' },
  };

  return { id, type, position, data: defaults[type] || { label: 'Node' } };
}
