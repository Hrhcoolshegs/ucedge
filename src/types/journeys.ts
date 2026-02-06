import { EventType } from './events';

export interface Journey {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  trigger: JourneyTrigger;
  nodes: JourneyNode[];
  analytics: JourneyAnalytics;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface JourneyTrigger {
  type: 'event' | 'segment_entry' | 'schedule' | 'manual';
  config: {
    eventType?: EventType;
    eventFilters?: Record<string, any>;
    segmentId?: string;
    schedule?: {
      frequency: 'once' | 'daily' | 'weekly' | 'monthly';
      time?: string;
      dayOfWeek?: number;
      dayOfMonth?: number;
    };
  };
}

export interface JourneyNode {
  id: string;
  type: 'trigger' | 'wait' | 'condition' | 'action' | 'split' | 'end';
  name: string;
  config: NodeConfig;
  next: string[];
  position: { x: number; y: number };
}

export type NodeConfig =
  | WaitNodeConfig
  | ConditionNodeConfig
  | ActionNodeConfig
  | SplitNodeConfig
  | Record<string, never>;

export interface WaitNodeConfig {
  type: 'time' | 'event' | 'time_or_event';
  duration?: string;
  waitForEvent?: EventType;
  maxWaitTime?: string;
}

export interface ConditionNodeConfig {
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  }[];
  logic: 'and' | 'or';
  truePath: string;
  falsePath: string;
}

export interface ActionNodeConfig {
  actionType: 'send_message' | 'update_profile' | 'assign_segment' | 'trigger_webhook';
  channel?: 'email' | 'sms' | 'push' | 'whatsapp' | 'in_app';
  template?: string;
  content?: {
    subject?: string;
    body: string;
    cta?: string;
    ctaUrl?: string;
  };
  personalization?: Record<string, string>;
}

export interface SplitNodeConfig {
  splitType: 'ab_test' | 'multi_branch';
  branches: {
    id: string;
    name: string;
    condition?: string;
    weight?: number;
    nextNode: string;
  }[];
}

export interface JourneyAnalytics {
  totalEntered: number;
  totalCompleted: number;
  totalActive: number;
  totalDropped: number;
  conversionRate: number;
  avgCompletionTime: number;
  stepPerformance: {
    nodeId: string;
    nodeName: string;
    entered: number;
    completed: number;
    dropped: number;
    avgTimeInStep: number;
    dropRate: number;
  }[];
  channelPerformance: {
    channel: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversions: number;
  }[];
}

export interface JourneyExecution {
  executionId: string;
  journeyId: string;
  customerId: string;
  currentNodeId: string;
  status: 'active' | 'completed' | 'failed' | 'exited';
  startedAt: Date;
  completedAt?: Date;
  history: {
    nodeId: string;
    enteredAt: Date;
    exitedAt?: Date;
    outcome?: 'completed' | 'dropped' | 'condition_met' | 'condition_failed';
  }[];
  context: Record<string, any>;
}
