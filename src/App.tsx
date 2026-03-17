import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardViewProvider } from "@/hooks/useDashboardView";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import Dashboard from "./pages/Dashboard";
import OnboardingDashboard from "./pages/OnboardingDashboard";
import AttritionDashboard from "./pages/AttritionDashboard";
import BurnoutDashboard from "./pages/BurnoutDashboard";
import DataReadiness from "./pages/DataReadiness";
import NotFound from "./pages/NotFound";
import PalDChatbot from "./components/PalDChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DashboardViewProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/onboarding" element={<ProtectedRoute><OnboardingDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/attrition" element={<ProtectedRoute><AttritionDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/burnout" element={<ProtectedRoute><BurnoutDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PalDChatbot />
          </DashboardViewProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
