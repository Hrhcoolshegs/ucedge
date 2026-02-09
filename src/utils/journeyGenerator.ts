import { Journey, JourneyExecution } from '../types/journeys';
import { Customer } from '../types';

export function generateDefaultJourneys(): Journey[] {
  return [
    createOnboardingJourney(),
    createWinBackJourney(),
    createProductCrossSellJourney(),
    createChurnPreventionJourney(),
    createHighValueNurtureJourney()
  ];
}

export function generateJourneyExecutions(customers: Customer[], journeys: Journey[]): JourneyExecution[] {
  const executions: JourneyExecution[] = [];
  const now = new Date();

  customers.slice(0, 100).forEach((customer, index) => {
    const numJourneys = Math.floor(Math.random() * 3) + 1;
    const customerJourneys = journeys.sort(() => 0.5 - Math.random()).slice(0, numJourneys);

    customerJourneys.forEach((journey, jIndex) => {
      const startedAt = new Date(now.getTime() - Math.random() * 30 * 86400000);
      const isCompleted = Math.random() > 0.3;
      const isActive = !isCompleted && Math.random() > 0.2;
      const isFailed = !isCompleted && !isActive;

      const status: JourneyExecution['status'] = isCompleted ? 'completed' : isActive ? 'active' : 'failed';
      const completedAt = isCompleted ? new Date(startedAt.getTime() + Math.random() * 7 * 86400000) : undefined;

      const nodes = journey.nodes.filter(n => n.type !== 'end');
      const currentNodeIndex = isCompleted ? nodes.length - 1 : Math.floor(Math.random() * nodes.length);
      const currentNode = nodes[currentNodeIndex];

      executions.push({
        executionId: `exec_${index}_${jIndex}_${Math.random().toString(36).substring(7)}`,
        journeyId: journey.id,
        customerId: customer.id,
        status,
        currentNodeId: currentNode.id,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt?.toISOString(),
        failedAt: isFailed ? new Date(startedAt.getTime() + Math.random() * 3 * 86400000).toISOString() : undefined,
        failureReason: isFailed ? 'Customer unsubscribed from communications' : undefined,
        context: {
          customerName: customer.name,
          customerEmail: customer.email,
          balance: customer.accountBalance,
          lifecycleStage: customer.lifecycleStage
        },
        stepHistory: nodes.slice(0, currentNodeIndex + 1).map((node, idx) => ({
          nodeId: node.id,
          nodeName: node.name,
          enteredAt: new Date(startedAt.getTime() + idx * 86400000).toISOString(),
          completedAt: new Date(startedAt.getTime() + (idx + 1) * 86400000).toISOString(),
          outcome: 'success'
        }))
      });
    });
  });

  return executions;
}

function createOnboardingJourney(): Journey {
  const now = new Date();

  return {
    id: 'journey_onboarding_v2',
    name: 'New Customer Onboarding',
    description: 'Guide new customers through account setup and first deposit',
    status: 'active',
    trigger: {
      type: 'event',
      config: { eventType: 'account_created' }
    },
    nodes: [
      {
        id: 'node_1',
        type: 'trigger',
        name: 'Account Created',
        config: {},
        next: ['node_2'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'node_2',
        type: 'action',
        name: 'Send Welcome Email',
        config: {
          actionType: 'send_message',
          channel: 'email',
          template: 'welcome_email_v1',
          content: {
            subject: 'Welcome to United Capital!',
            body: 'Hi {{name}}, we\'re excited to have you! Complete your profile to unlock all features.',
            cta: 'Complete Profile',
            ctaUrl: '/complete-profile'
          }
        },
        next: ['node_3'],
        position: { x: 100, y: 200 }
      },
      {
        id: 'node_3',
        type: 'wait',
        name: 'Wait 24 hours',
        config: { type: 'time', duration: '24h' },
        next: ['node_4'],
        position: { x: 100, y: 300 }
      },
      {
        id: 'node_4',
        type: 'condition',
        name: 'Check if funded',
        config: {
          conditions: [{ field: 'customer.balance', operator: 'greater_than', value: 0 }],
          logic: 'and',
          truePath: 'node_5',
          falsePath: 'node_6'
        },
        next: ['node_5', 'node_6'],
        position: { x: 100, y: 400 }
      },
      {
        id: 'node_5',
        type: 'action',
        name: 'Send Success Message',
        config: {
          actionType: 'send_message',
          channel: 'push',
          content: {
            subject: 'Great start!',
            body: 'Your account is funded. Explore our investment products.',
            cta: 'View Investments'
          }
        },
        next: ['node_end'],
        position: { x: 50, y: 500 }
      },
      {
        id: 'node_6',
        type: 'action',
        name: 'Send Funding Reminder',
        config: {
          actionType: 'send_message',
          channel: 'sms',
          content: {
            body: 'Hi {{name}}, fund your account today and get N500 bonus! Reply FUND for details.'
          }
        },
        next: ['node_end'],
        position: { x: 150, y: 500 }
      },
      {
        id: 'node_end',
        type: 'end',
        name: 'Journey Complete',
        config: {},
        next: [],
        position: { x: 100, y: 600 }
      }
    ],
    analytics: {
      totalEntered: 12543,
      totalCompleted: 8921,
      totalActive: 1234,
      totalDropped: 2388,
      conversionRate: 71.1,
      avgCompletionTime: 48,
      stepPerformance: [
        {
          nodeId: 'node_2',
          nodeName: 'Send Welcome Email',
          entered: 12543,
          completed: 12543,
          dropped: 0,
          avgTimeInStep: 0.5,
          dropRate: 0
        },
        {
          nodeId: 'node_4',
          nodeName: 'Check if funded',
          entered: 12543,
          completed: 10155,
          dropped: 2388,
          avgTimeInStep: 24,
          dropRate: 19.0
        }
      ],
      channelPerformance: [
        {
          channel: 'email',
          sent: 12543,
          delivered: 12234,
          opened: 9876,
          clicked: 5432,
          conversions: 4321
        },
        {
          channel: 'sms',
          sent: 2388,
          delivered: 2350,
          opened: 0,
          clicked: 876,
          conversions: 234
        }
      ]
    },
    createdAt: new Date(now.getTime() - 30 * 86400000),
    updatedAt: now,
    createdBy: 'system'
  };
}

function createWinBackJourney(): Journey {
  const now = new Date();
  return {
    id: 'journey_winback_v1',
    name: 'Win-Back Inactive Customers',
    description: 'Re-engage customers who haven\'t logged in for 14+ days',
    status: 'active',
    trigger: {
      type: 'segment_entry',
      config: { segmentId: 'segment_at_risk' }
    },
    nodes: [
      {
        id: 'node_1',
        type: 'trigger',
        name: 'Customer At Risk',
        config: {},
        next: ['node_2'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'node_2',
        type: 'action',
        name: 'Send Win-Back SMS',
        config: {
          actionType: 'send_message',
          channel: 'sms',
          content: {
            body: 'We miss you! Login today and claim N500 bonus. Valid for 48 hours.'
          }
        },
        next: ['node_3'],
        position: { x: 100, y: 200 }
      },
      {
        id: 'node_3',
        type: 'wait',
        name: 'Wait for login or 3 days',
        config: {
          type: 'time_or_event',
          duration: '72h',
          waitForEvent: 'app_opened',
          maxWaitTime: '72h'
        },
        next: ['node_4'],
        position: { x: 100, y: 300 }
      },
      {
        id: 'node_4',
        type: 'condition',
        name: 'Did customer return?',
        config: {
          conditions: [{ field: 'customer.lastLogin', operator: 'less_than', value: '3d' }],
          logic: 'and',
          truePath: 'node_5',
          falsePath: 'node_6'
        },
        next: ['node_5', 'node_6'],
        position: { x: 100, y: 400 }
      },
      {
        id: 'node_5',
        type: 'action',
        name: 'Credit Bonus',
        config: {
          actionType: 'update_profile',
          content: { body: 'Customer returned - credit N500 bonus' }
        },
        next: ['node_end'],
        position: { x: 50, y: 500 }
      },
      {
        id: 'node_6',
        type: 'action',
        name: 'Escalate to RM',
        config: {
          actionType: 'trigger_webhook',
          content: { body: 'Assign to relationship manager for personal outreach' }
        },
        next: ['node_end'],
        position: { x: 150, y: 500 }
      },
      {
        id: 'node_end',
        type: 'end',
        name: 'Journey Complete',
        config: {},
        next: [],
        position: { x: 100, y: 600 }
      }
    ],
    analytics: {
      totalEntered: 5432,
      totalCompleted: 3876,
      totalActive: 456,
      totalDropped: 1100,
      conversionRate: 71.3,
      avgCompletionTime: 56,
      stepPerformance: [
        { nodeId: 'node_2', nodeName: 'Send Win-Back SMS', entered: 5432, completed: 5432, dropped: 0, avgTimeInStep: 0.2, dropRate: 0 },
        { nodeId: 'node_4', nodeName: 'Did customer return?', entered: 5432, completed: 4332, dropped: 1100, avgTimeInStep: 72, dropRate: 20.3 }
      ],
      channelPerformance: [
        { channel: 'sms', sent: 5432, delivered: 5380, opened: 0, clicked: 2134, conversions: 1876 }
      ]
    },
    createdAt: new Date(now.getTime() - 21 * 86400000),
    updatedAt: now,
    createdBy: 'admin'
  };
}

function createProductCrossSellJourney(): Journey {
  const now = new Date();
  return {
    id: 'journey_product_crosssell',
    name: 'Product Cross-Sell: Savings to Investment',
    description: 'Recommend investment products to high-balance savers',
    status: 'active',
    trigger: {
      type: 'event',
      config: { eventType: 'deposit_made' }
    },
    nodes: [
      {
        id: 'node_1',
        type: 'trigger',
        name: 'Deposit Made',
        config: {},
        next: ['node_2'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'node_2',
        type: 'condition',
        name: 'Balance > N100k?',
        config: {
          conditions: [{ field: 'customer.balance', operator: 'greater_than', value: 100000 }],
          logic: 'and',
          truePath: 'node_3',
          falsePath: 'node_end'
        },
        next: ['node_3', 'node_end'],
        position: { x: 100, y: 200 }
      },
      {
        id: 'node_3',
        type: 'split',
        name: 'A/B Test: Email vs Push',
        config: {
          splitType: 'ab_test',
          branches: [
            { id: 'branch_email', name: 'Email Variant', weight: 50, nextNode: 'node_4' },
            { id: 'branch_push', name: 'Push Variant', weight: 50, nextNode: 'node_5' }
          ]
        },
        next: ['node_4', 'node_5'],
        position: { x: 100, y: 300 }
      },
      {
        id: 'node_4',
        type: 'action',
        name: 'Send Email Offer',
        config: {
          actionType: 'send_message',
          channel: 'email',
          content: {
            subject: 'Grow your savings with 12% returns',
            body: 'Your savings deserve more. Invest in Fixed Deposits at 12% p.a.',
            cta: 'View Investment Options'
          }
        },
        next: ['node_end'],
        position: { x: 50, y: 400 }
      },
      {
        id: 'node_5',
        type: 'action',
        name: 'Send Push Offer',
        config: {
          actionType: 'send_message',
          channel: 'push',
          content: {
            subject: 'Investment opportunity',
            body: 'Turn your savings into wealth in 12 months with our investment products',
            cta: 'Invest Now'
          }
        },
        next: ['node_end'],
        position: { x: 150, y: 400 }
      },
      {
        id: 'node_end',
        type: 'end',
        name: 'Journey Complete',
        config: {},
        next: [],
        position: { x: 100, y: 500 }
      }
    ],
    analytics: {
      totalEntered: 8765,
      totalCompleted: 7234,
      totalActive: 234,
      totalDropped: 1297,
      conversionRate: 82.5,
      avgCompletionTime: 12,
      stepPerformance: [
        { nodeId: 'node_2', nodeName: 'Balance > N100k?', entered: 8765, completed: 6234, dropped: 2531, avgTimeInStep: 0.1, dropRate: 28.9 },
        { nodeId: 'node_3', nodeName: 'A/B Test', entered: 6234, completed: 6234, dropped: 0, avgTimeInStep: 0, dropRate: 0 }
      ],
      channelPerformance: [
        { channel: 'email', sent: 3117, delivered: 3050, opened: 2345, clicked: 1234, conversions: 876 },
        { channel: 'push', sent: 3117, delivered: 3100, opened: 2890, clicked: 1567, conversions: 1023 }
      ]
    },
    createdAt: new Date(now.getTime() - 14 * 86400000),
    updatedAt: now,
    createdBy: 'admin'
  };
}

function createChurnPreventionJourney(): Journey {
  const now = new Date();
  return {
    id: 'journey_churn_prevention',
    name: 'Churn Prevention - Critical Risk',
    description: 'Aggressive intervention for customers with >80% churn risk',
    status: 'active',
    trigger: {
      type: 'event',
      config: { eventType: 'app_opened' }
    },
    nodes: [
      {
        id: 'node_1',
        type: 'trigger',
        name: 'High Churn Risk Detected',
        config: {},
        next: ['node_2'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'node_2',
        type: 'action',
        name: 'Immediate SMS Alert',
        config: {
          actionType: 'send_message',
          channel: 'sms',
          content: {
            body: '{{name}}, we value you! Enjoy 20% off on your next transfer. Login to claim.'
          }
        },
        next: ['node_3'],
        position: { x: 100, y: 200 }
      },
      {
        id: 'node_3',
        type: 'wait',
        name: 'Wait 6 hours',
        config: { type: 'time', duration: '6h' },
        next: ['node_4'],
        position: { x: 100, y: 300 }
      },
      {
        id: 'node_4',
        type: 'action',
        name: 'Push Notification',
        config: {
          actionType: 'send_message',
          channel: 'push',
          content: {
            subject: 'Special offer expiring soon!',
            body: 'Don\'t miss out on your exclusive discount',
            cta: 'Claim Now'
          }
        },
        next: ['node_5'],
        position: { x: 100, y: 400 }
      },
      {
        id: 'node_5',
        type: 'wait',
        name: 'Wait 24 hours',
        config: { type: 'time', duration: '24h' },
        next: ['node_6'],
        position: { x: 100, y: 500 }
      },
      {
        id: 'node_6',
        type: 'action',
        name: 'Assign to Retention Team',
        config: {
          actionType: 'trigger_webhook',
          content: { body: 'Escalate to retention specialist for personal call' }
        },
        next: ['node_end'],
        position: { x: 100, y: 600 }
      },
      {
        id: 'node_end',
        type: 'end',
        name: 'Journey Complete',
        config: {},
        next: [],
        position: { x: 100, y: 700 }
      }
    ],
    analytics: {
      totalEntered: 2134,
      totalCompleted: 1876,
      totalActive: 123,
      totalDropped: 135,
      conversionRate: 87.9,
      avgCompletionTime: 32,
      stepPerformance: [
        { nodeId: 'node_2', nodeName: 'Immediate SMS Alert', entered: 2134, completed: 2134, dropped: 0, avgTimeInStep: 0.1, dropRate: 0 },
        { nodeId: 'node_4', nodeName: 'Push Notification', entered: 2134, completed: 1999, dropped: 135, avgTimeInStep: 6, dropRate: 6.3 }
      ],
      channelPerformance: [
        { channel: 'sms', sent: 2134, delivered: 2100, opened: 0, clicked: 876, conversions: 654 },
        { channel: 'push', sent: 2134, delivered: 1999, opened: 1678, clicked: 987, conversions: 543 }
      ]
    },
    createdAt: new Date(now.getTime() - 7 * 86400000),
    updatedAt: now,
    createdBy: 'system'
  };
}

function createHighValueNurtureJourney(): Journey {
  const now = new Date();
  return {
    id: 'journey_high_value_nurture',
    name: 'High Value Customer Nurture',
    description: 'Premium service for customers with N500k+ balance',
    status: 'active',
    trigger: {
      type: 'segment_entry',
      config: { segmentId: 'segment_high_value' }
    },
    nodes: [
      {
        id: 'node_1',
        type: 'trigger',
        name: 'Entered High Value Segment',
        config: {},
        next: ['node_2'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'node_2',
        type: 'action',
        name: 'Congratulations Email',
        config: {
          actionType: 'send_message',
          channel: 'email',
          content: {
            subject: 'Welcome to United Capital Premium',
            body: 'Congratulations {{name}}! You now have access to exclusive investment opportunities and personal banking.',
            cta: 'Explore Premium Benefits'
          }
        },
        next: ['node_3'],
        position: { x: 100, y: 200 }
      },
      {
        id: 'node_3',
        type: 'action',
        name: 'Assign Relationship Manager',
        config: {
          actionType: 'update_profile',
          content: { body: 'Assign dedicated RM to customer' }
        },
        next: ['node_4'],
        position: { x: 100, y: 300 }
      },
      {
        id: 'node_4',
        type: 'wait',
        name: 'Wait 2 days',
        config: { type: 'time', duration: '48h' },
        next: ['node_5'],
        position: { x: 100, y: 400 }
      },
      {
        id: 'node_5',
        type: 'action',
        name: 'RM Introduction Call',
        config: {
          actionType: 'trigger_webhook',
          content: { body: 'Schedule introductory call with RM within 24 hours' }
        },
        next: ['node_end'],
        position: { x: 100, y: 500 }
      },
      {
        id: 'node_end',
        type: 'end',
        name: 'Journey Complete',
        config: {},
        next: [],
        position: { x: 100, y: 600 }
      }
    ],
    analytics: {
      totalEntered: 1543,
      totalCompleted: 1432,
      totalActive: 67,
      totalDropped: 44,
      conversionRate: 92.8,
      avgCompletionTime: 52,
      stepPerformance: [
        { nodeId: 'node_2', nodeName: 'Congratulations Email', entered: 1543, completed: 1543, dropped: 0, avgTimeInStep: 0.3, dropRate: 0 },
        { nodeId: 'node_3', nodeName: 'Assign RM', entered: 1543, completed: 1499, dropped: 44, avgTimeInStep: 1, dropRate: 2.9 }
      ],
      channelPerformance: [
        { channel: 'email', sent: 1543, delivered: 1520, opened: 1432, clicked: 1234, conversions: 1100 }
      ]
    },
    createdAt: new Date(now.getTime() - 45 * 86400000),
    updatedAt: now,
    createdBy: 'admin'
  };
}
