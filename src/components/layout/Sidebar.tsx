import { NavLink } from 'react-router-dom';
import { 
  Home, LayoutDashboard, TrendingUp, Target, FileText, Users, 
  Bot, MessageSquare, BookOpen, Phone, BarChart3, Circle, 
  Settings, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { icon: Home, label: 'Overview', path: '/overview' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Sentiment Analysis', path: '/sentiment-analysis' },
  { icon: Layers, label: 'Segments', path: '/segments' },
  { icon: Target, label: 'Campaigns', path: '/campaigns' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Bot, label: 'AI Agents', path: '/ai-agents' },
  { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
  { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge' },
  { icon: Phone, label: 'Live Support', path: '/support' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Circle, label: '360° Customer View', path: '/customer-360' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      'bg-white border-r border-border h-screen flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-60'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <div className="bg-primary text-white px-3 py-1 rounded font-bold text-lg">
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
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
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
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
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
