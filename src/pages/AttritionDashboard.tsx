import DashboardLayout from "@/components/DashboardLayout";
import DashboardViewToggle from "@/components/DashboardViewToggle";
import { useDashboardView } from "@/hooks/useDashboardView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

const trendData = [
  { month: "Oct", risk: 12, leavers: 4 },
  { month: "Nov", risk: 13, leavers: 5 },
  { month: "Dec", risk: 15, leavers: 6 },
  { month: "Jan", risk: 16, leavers: 8 },
  { month: "Feb", risk: 17, leavers: 10 },
  { month: "Mar", risk: 18, leavers: 12 },
];

const hotspots = [
  { group: "Sales — High Performers", riskMultiplier: "2.3x", drivers: ["Below-market compensation", "Sustained workload imbalance"], count: 12, severity: "high" },
  { group: "Engineering — Mid-Level", riskMultiplier: "1.8x", drivers: ["Limited career growth", "Manager effectiveness"], count: 8, severity: "high" },
  { group: "Operations — New Hires (<1yr)", riskMultiplier: "1.5x", drivers: ["Poor onboarding experience", "Role clarity"], count: 15, severity: "medium" },
  { group: "Finance — Senior Analysts", riskMultiplier: "1.3x", drivers: ["Compensation competitiveness"], count: 5, severity: "medium" },
];

const chartConfig = {
  risk: { label: "Attrition Risk %", color: "hsl(var(--destructive))" },
  leavers: { label: "Predicted Leavers", color: "hsl(var(--primary))" },
};

const AttritionDashboard = () => {
  const { view } = useDashboardView();
  const isExec = view === "executive";

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {isExec ? "Attrition Risk — Executive Summary" : "Predicting & Mitigating Attrition Risk"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isExec
                ? "High-level risk metrics and trajectory."
                : "Proactive, data-driven strategies for retaining your most valuable talent."}
            </p>
          </div>
          <DashboardViewToggle />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Overall Attrition Risk", value: "18%", sub: "Organisation-wide" },
            { label: "High-Risk Employees", value: "40", sub: "Across 4 hotspots" },
            { label: "Predicted Leavers (Q2)", value: "12", sub: "Next 90 days" },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">{kpi.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insight banner */}
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium">
              <span className="font-bold">Pal-D Insight:</span> High performers in Sales are 2.3x more likely to leave. Primary drivers: below-market compensation and workload imbalance.
            </p>
          </CardContent>
        </Card>

        {/* Trend chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Attrition Trend (6 Months)</CardTitle>
            <CardDescription>Overall risk % and predicted leavers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="risk" stroke="var(--color-risk)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="leavers" stroke="var(--color-leavers)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Hotspots — detailed only */}
        {!isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attrition Hotspots</CardTitle>
              <CardDescription>Teams and segments with elevated attrition risk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hotspots.map((spot) => (
                <div key={spot.group} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Badge variant={spot.severity === "high" ? "destructive" : "secondary"} className="mt-0.5 shrink-0">
                    {spot.riskMultiplier}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{spot.group}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {spot.count} employees · Drivers: {spot.drivers.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Executive: bar chart of hotspot risk */}
        {isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hotspot Risk Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "At-Risk Employees", color: "hsl(var(--destructive))" } }} className="h-[200px] w-full">
                <BarChart data={hotspots.map(h => ({ group: h.group.split("—")[0].trim(), count: h.count }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="group" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default AttritionDashboard;
