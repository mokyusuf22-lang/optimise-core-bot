import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, AlertTriangle, Activity, Database, Shield, BookOpen, MapPin } from "lucide-react";
import GuidedTour from "@/components/GuidedTour";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
  manager: "Manager",
  hr: "HR Personnel",
  it_admin: "IT Administrator",
  senior_leader: "Senior Leader",
};

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/onboarding", icon: Users, label: "Onboarding" },
  { to: "/dashboard/attrition", icon: AlertTriangle, label: "Attrition Risk" },
  { to: "/dashboard/burnout", icon: Activity, label: "Burnout & Capacity" },
  { to: "/dashboard/data-readiness", icon: Database, label: "Data Readiness" },
  { to: "/dashboard/prompt-log", icon: BookOpen, label: "AI Prompt Log" },
];

const adminNavItems = [
  { to: "/dashboard/admin-roles", icon: Shield, label: "Role Management" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [tourOpen, setTourOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <h2 className="text-base font-bold text-sidebar-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Mission Control
          </h2>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">Live Service Insight</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}

          {role === "it_admin" && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">Admin</p>
              </div>
              {adminNavItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground border-sidebar-border"
            onClick={() => setTourOpen(true)}
          >
            <MapPin className="h-4 w-4 text-primary" />
            Platform Tour
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.email}</p>
              <p className="text-[10px] text-sidebar-foreground/50">{role ? roleLabels[role] : "No role"}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>Mission Control</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTourOpen(true)}>
              <MapPin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <GuidedTour isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
