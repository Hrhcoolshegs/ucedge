import { NavLink } from 'react-router-dom';
import {
  Home, LayoutDashboard, TrendingUp, Target, Users,
  Bot, MessageSquare, BookOpen, Phone, BarChart3, Circle,
  Settings, ChevronLeft, ChevronRight, Layers, ChevronDown, GitBranch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuGroups = [
  {
    label: 'Dashboard',
    items: [
      { icon: Home, label: 'Overview', path: '/overview' },
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ]
  },
  {
    label: 'Customer Intelligence',
    items: [
      { icon: Layers, label: 'Segments', path: '/segments' },
      { icon: Users, label: 'Customers', path: '/customers' },
      { icon: Circle, label: '360° View', path: '/customer-360' },
    ]
  },
  {
    label: 'Engagement',
    items: [
      { icon: Target, label: 'Campaigns', path: '/campaigns' },
      { icon: GitBranch, label: 'Journeys', path: '/journeys' },
      { icon: TrendingUp, label: 'Sentiment', path: '/sentiment-analysis' },
    ]
  },
  {
    label: 'AI & Analytics',
    items: [
      { icon: Bot, label: 'AI Agents', path: '/ai-agents' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ]
  },
  {
    label: 'Support',
    items: [
      { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
      { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge' },
      { icon: Phone, label: 'Live Support', path: '/support' },
    ]
  }
];

const standaloneItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Dashboard': true,
    'Customer Intelligence': false,
    'Engagement': false,
    'AI & Analytics': false,
    'Support': false,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className={cn(
      'bg-background border-r border-border h-screen flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-60'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-lg">
                UC-Edge
              </div>
              <p className="text-xs text-muted-foreground mt-1">Powered by United Capital Plc</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-muted ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {/* Collapsible Menu Groups */}
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{group.label}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openGroups[group.label] ? "rotate-180" : ""
                    )}
                  />
                </button>
              )}
              
              {(collapsed || openGroups[group.label]) && (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Standalone Items */}
          {!collapsed && <div className="h-px bg-border my-2" />}
          {standaloneItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">User Account</p>
              <p className="text-xs text-muted-foreground truncate">user@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
