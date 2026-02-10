import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { CampaignsProvider } from "@/contexts/CampaignsContext";
import { SegmentsProvider } from "@/contexts/SegmentsContext";
import { Login } from "@/pages/Login";
import Segments from "@/pages/Segments";
import SegmentBuilder from "@/pages/SegmentBuilder";
import { Overview } from "@/pages/Overview";
import { Dashboard } from "@/pages/Dashboard";
import { Campaigns } from "@/pages/Campaigns";
import { SentimentAnalysis } from "@/pages/SentimentAnalysis";
import Reports from "@/pages/Reports";
import { Customers } from "@/pages/Customers";
import { KnowledgeBase } from "@/pages/KnowledgeBase";
import { LiveSupport } from "@/pages/LiveSupport";
import { Customer360 } from "@/pages/Customer360";
import { Settings } from "@/pages/Settings";
import JourneyBuilder from "@/pages/JourneyBuilder";
import ApprovalQueue from "@/pages/ApprovalQueue";
import AuditTrail from "@/pages/AuditTrail";
import ConsentManagement from "@/pages/ConsentManagement";
import GovernanceLogs from "@/pages/GovernanceLogs";
import { ChurnConfig } from "@/pages/ChurnConfig";
import Recommendations from "@/pages/Recommendations";
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
          <SegmentsProvider>
            <CampaignsProvider>
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
                  <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                  <Route path="/sentiment" element={<Navigate to="/sentiment-analysis" replace />} />
                  <Route path="/segments" element={<Segments />} />
                  <Route path="/segment-builder" element={<SegmentBuilder />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/support" element={<LiveSupport />} />
                  <Route path="/analytics" element={<Navigate to="/reports" replace />} />
                  <Route path="/nlp-query" element={<Navigate to="/reports" replace />} />
                  <Route path="/customer-360" element={<Customer360 />} />
                  <Route path="/journeys" element={<JourneyBuilder />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/approvals" element={<ApprovalQueue />} />
                  <Route path="/audit" element={<AuditTrail />} />
                  <Route path="/consent" element={<ConsentManagement />} />
                  <Route path="/governance" element={<GovernanceLogs />} />
                  <Route path="/churn-config" element={<ChurnConfig />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              </HashRouter>
            </CampaignsProvider>
          </SegmentsProvider>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
