import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardViewProvider } from "@/hooks/useDashboardView";
import Dashboard from "./pages/Dashboard";
import OnboardingDashboard from "./pages/OnboardingDashboard";
import AttritionDashboard from "./pages/AttritionDashboard";
import BurnoutDashboard from "./pages/BurnoutDashboard";
import DataReadiness from "./pages/DataReadiness";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardViewProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/onboarding" element={<OnboardingDashboard />} />
            <Route path="/dashboard/attrition" element={<AttritionDashboard />} />
            <Route path="/dashboard/burnout" element={<BurnoutDashboard />} />
            <Route path="/dashboard/data-readiness" element={<DataReadiness />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardViewProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
