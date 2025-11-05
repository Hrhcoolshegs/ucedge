import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { Login } from "@/pages/Login";
import { Overview } from "@/pages/Overview";
import { Dashboard } from "@/pages/Dashboard";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { MainLayout } from "@/components/layout/MainLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/overview" element={<Overview />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sentiment" element={<PlaceholderPage title="Sentiment Analysis" description="AI-powered customer sentiment tracking" />} />
                <Route path="/campaigns" element={<PlaceholderPage title="Campaigns" description="Manage marketing campaigns" />} />
                <Route path="/reports" element={<PlaceholderPage title="Reports" description="Generate and view reports" />} />
                <Route path="/customers" element={<PlaceholderPage title="Customers" description="Customer management" />} />
                <Route path="/ai-agents" element={<PlaceholderPage title="AI Agents" description="Configure AI agents" />} />
                <Route path="/conversations" element={<PlaceholderPage title="Conversations" description="Customer conversations" />} />
                <Route path="/knowledge" element={<PlaceholderPage title="Knowledge Base" description="Manage knowledge articles" />} />
                <Route path="/support" element={<PlaceholderPage title="Live Support" description="Live customer support" />} />
                <Route path="/analytics" element={<PlaceholderPage title="Analytics" description="Platform analytics" />} />
                <Route path="/customer-360" element={<PlaceholderPage title="360° Customer View" description="Complete customer insights" />} />
                <Route path="/settings" element={<PlaceholderPage title="Settings" description="Application settings" />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
