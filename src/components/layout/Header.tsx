import { Search, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';

export const Header = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(Boolean);
    return path.length ? path : ['overview'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent">Home</span>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className={index === breadcrumbs.length - 1 ? 'text-primary font-medium' : 'text-accent'}>
                {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers, campaigns..."
              className="pl-10 pr-4 py-2 bg-muted rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 hover:bg-muted px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                U
              </div>
              <span className="text-sm font-medium text-foreground">User</span>
            </button>
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  onClick={() => navigate('/settings')}
                >
                  Profile
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </button>
                <hr className="my-1 border-border" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
