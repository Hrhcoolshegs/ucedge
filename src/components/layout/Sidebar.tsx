import { NavLink } from 'react-router-dom';
import {
  Home, LayoutDashboard, TrendingUp, Target, Users,
  Bot, MessageSquare, BookOpen, Phone, BarChart3, Circle,
  Settings, ChevronLeft, ChevronRight, Layers, ChevronDown, GitBranch,
  Shield, CheckCircle, FileCheck, ClipboardCheck, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_DEFINITIONS } from '@/types/rbac';

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
      { icon: Circle, label: '360 View', path: '/customer-360' },
    ]
  },
  {
    label: 'Engagement',
    items: [
      { icon: Target, label: 'Campaigns', path: '/campaigns' },
      { icon: GitBranch, label: 'Journeys', path: '/journeys' },
      { icon: ClipboardCheck, label: 'Approvals', path: '/approvals', badge: true },
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
    label: 'Compliance',
    items: [
      { icon: Shield, label: 'Audit Trail', path: '/audit' },
      { icon: CheckCircle, label: 'Consent', path: '/consent' },
      { icon: FileCheck, label: 'Governance', path: '/governance' },
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
    'Customer Intelligence': true,
    'Engagement': true,
    'AI & Analytics': true,
    'Compliance': true,
    'Support': true,
  });
  const { user, logout } = useAuth();

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const roleLabel = user?.role ? ROLE_DEFINITIONS[user.role].label : '';

  return (
    <div className={cn(
      'bg-background border-r border-border h-screen flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-60'
    )}>
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

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
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
                      {!collapsed && (
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                      )}
                      {!collapsed && 'badge' in item && item.badge && (
                        <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                          3
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

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

      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {user?.avatarInitials || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'User Account'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{roleLabel}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
