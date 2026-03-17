import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, AlertTriangle, Activity, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const roleGreetings: Record<string, { title: string; subtitle: string }> = {
  manager: { title: "Team Performance Overview", subtitle: "Monitor your direct reports' onboarding progress, engagement, and well-being." },
  hr: { title: "Organisation-Wide Insights", subtitle: "Analyse workforce health across onboarding, retention, and capacity dimensions." },
  it_admin: { title: "Platform Operations", subtitle: "Monitor data pipeline health, system integrations, and platform performance." },
  senior_leader: { title: "Executive Summary", subtitle: "Strategic view of workforce risk indicators, cost impacts, and organisational health." },
};

const kpiCards = [
  { label: "Onboarding Risk", value: "23%", trend: "+2.1%", trendUp: true, icon: Users, color: "text-primary", link: "/dashboard/onboarding" },
  { label: "Attrition Risk", value: "18%", trend: "-1.5%", trendUp: false, icon: AlertTriangle, color: "text-destructive", link: "/dashboard/attrition" },
  { label: "Burnout Index", value: "31%", trend: "+4.3%", trendUp: true, icon: Activity, color: "text-accent", link: "/dashboard/burnout" },
  { label: "Retention Rate", value: "87%", trend: "+0.8%", trendUp: false, icon: TrendingUp, color: "text-primary", link: "/dashboard/attrition" },
];

const recentInsights = [
  { severity: "high", message: "Engineering team shows burnout risk: overtime +28%, sick leave +15%.", area: "Burnout" },
  { severity: "medium", message: "New joiners in Ops have 35% higher drop-off risk due to delayed system access.", area: "Onboarding" },
  { severity: "high", message: "High performers in Sales are 2.3x more likely to leave — compensation gap detected.", area: "Attrition" },
];

const Dashboard = () => {
  const { role } = useAuth();
  const greeting = roleGreetings[role ?? "hr"];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {greeting.title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{greeting.subtitle}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map(({ label, value, trend, trendUp, icon: Icon, color, link }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="text-xs font-medium">{label}</CardDescription>
                    <Icon className={cn("h-4 w-4", color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{value}</div>
                    <p className={`text-xs mt-1 ${trendUp ? "text-destructive" : "text-accent"}`}>
                      {trend} from last period
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pal-D Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pal-D AI Insights</CardTitle>
                <CardDescription>Latest automated diagnostics from your live service data</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Badge variant={insight.severity === "high" ? "destructive" : "secondary"} className="mt-0.5 text-[10px] shrink-0">
                  {insight.severity}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{insight.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.area} Use Case</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

// cn helper inline for this file
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
