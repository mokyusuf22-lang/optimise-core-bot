import DashboardLayout from "@/components/DashboardLayout";
import DashboardViewToggle from "@/components/DashboardViewToggle";
import { useDashboardView } from "@/hooks/useDashboardView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

// Real data from User_Story_Data.xlsx — 498 employees, 85 leavers (17.1%)
const trendData = [
  { month: "Jan", risk: 14, leavers: 2 },
  { month: "Feb", risk: 16, leavers: 2 },
  { month: "Mar", risk: 18, leavers: 78 },
  { month: "Jul", risk: 12, leavers: 1 },
  { month: "Nov", risk: 10, leavers: 1 },
  { month: "Dec", risk: 11, leavers: 1 },
];

const hotspots = [
  { group: "Operations", riskMultiplier: "22.9%", drivers: ["Poor onboarding experience", "Role clarity", "System access delays"], count: 8, severity: "high" as const },
  { group: "Legal", riskMultiplier: "22.2%", drivers: ["Limited career growth", "Niche roles"], count: 2, severity: "high" as const },
  { group: "Sales", riskMultiplier: "19.6%", drivers: ["Below-market compensation", "Workload imbalance"], count: 11, severity: "high" as const },
  { group: "AI Lab", riskMultiplier: "17.9%", drivers: ["Better offers / Comp", "Burnout from high workload"], count: 15, severity: "medium" as const },
  { group: "Content", riskMultiplier: "17.3%", drivers: ["Lack of growth", "Compensation"], count: 9, severity: "medium" as const },
  { group: "Engineering", riskMultiplier: "15.9%", drivers: ["Better offers", "Burnout / WLB"], count: 14, severity: "medium" as const },
];

const exitReasons = [
  { reason: "Better Offer / Comp", count: 28 },
  { reason: "Lack of Growth", count: 28 },
  { reason: "Burnout / WLB", count: 16 },
  { reason: "Compensation", count: 8 },
  { reason: "Poor Onboarding", count: 1 },
  { reason: "Poor Management", count: 1 },
];

const chartConfig = {
  risk: { label: "Attrition Risk %", color: "hsl(var(--destructive))" },
  leavers: { label: "Actual Leavers", color: "hsl(var(--primary))" },
  count: { label: "Count", color: "hsl(var(--destructive))" },
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
                ? "High-level risk metrics across 498 employees."
                : "Proactive, data-driven strategies for retaining your most valuable talent (498 employees tracked)."}
            </p>
          </div>
          <DashboardViewToggle />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Overall Attrition Rate", value: "17.1%", sub: "85 of 498 employees" },
            { label: "Top Exit Reason", value: "Comp & Growth", sub: "28 each (33% of exits)" },
            { label: "Highest Risk Dept", value: "Operations", sub: "22.9% attrition rate" },
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
              <span className="font-bold">Pal-D Insight:</span> "Better Offer / Comp" and "Lack of Growth" are tied as the #1 exit reasons (28 each). Operations has the highest attrition at 22.9%, driven by poor onboarding and access delays.
            </p>
          </CardContent>
        </Card>

        {/* Trend chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Attrition by Month of Departure</CardTitle>
            <CardDescription>Actual leavers and estimated risk % over time</CardDescription>
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

        {/* Exit Reasons bar chart */}
        {isExec && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Exit Interview Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={exitReasons} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="reason" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Hotspots — detailed only */}
        {!isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attrition Hotspots by Department</CardTitle>
              <CardDescription>Departments with the highest attrition rates</CardDescription>
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
                      {spot.count} leavers · Drivers: {spot.drivers.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Executive: bar chart of dept attrition */}
        {isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Department Attrition Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "Leavers", color: "hsl(var(--destructive))" } }} className="h-[200px] w-full">
                <BarChart data={hotspots.map(h => ({ group: h.group, count: h.count }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
