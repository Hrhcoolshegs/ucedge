import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ContextualNLP } from '@/components/common/ContextualNLP';

export const MainLayout = () => {
  const location = useLocation();

  const getCurrentPageContext = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return {
      page: path,
      section: location.pathname.split('/')[2],
    };
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
        <footer className="border-t border-border bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>UC-Edge Intelligence Platform</span>
            <span>© {new Date().getFullYear()} Optimus AI Labs. All rights reserved.</span>
          </div>
        </footer>
      </div>
      <ContextualNLP context={getCurrentPageContext()} />
    </div>
  );
};
