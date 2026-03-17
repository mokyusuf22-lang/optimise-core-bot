import DashboardLayout from "@/components/DashboardLayout";
import DashboardViewToggle from "@/components/DashboardViewToggle";
import { useDashboardView } from "@/hooks/useDashboardView";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

const trendData = [
  { month: "Oct", riskScore: 48, dropOff: 8 },
  { month: "Nov", riskScore: 52, dropOff: 10 },
  { month: "Dec", riskScore: 55, dropOff: 11 },
  { month: "Jan", riskScore: 58, dropOff: 12 },
  { month: "Feb", riskScore: 60, dropOff: 14 },
  { month: "Mar", riskScore: 62, dropOff: 15 },
];

const mockNewJoiners = [
  { name: "Sarah Chen", dept: "Operations", riskScore: 72, drivers: ["Delayed system access", "Low manager interaction"], daysIn: 14 },
  { name: "James Okoro", dept: "Finance", riskScore: 45, drivers: ["Training incomplete"], daysIn: 28 },
  { name: "Maria Lopez", dept: "Engineering", riskScore: 85, drivers: ["No manager check-in", "Negative survey sentiment"], daysIn: 7 },
  { name: "Alex Turner", dept: "Sales", riskScore: 22, drivers: [], daysIn: 45 },
  { name: "Priya Sharma", dept: "Operations", riskScore: 68, drivers: ["Delayed system access"], daysIn: 10 },
];

const chartConfig = {
  riskScore: { label: "Avg Risk Score", color: "hsl(var(--destructive))" },
  dropOff: { label: "Drop-off Count", color: "hsl(var(--accent))" },
};

const riskColor = (score: number) => {
  if (score >= 60) return "destructive" as const;
  if (score >= 40) return "secondary" as const;
  return "outline" as const;
};

const riskLabel = (score: number) => {
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const OnboardingDashboard = () => {
  const { role } = useAuth();
  const { view } = useDashboardView();
  const isExec = view === "executive";

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {isExec ? "Onboarding — Executive Summary" : "Proactive Onboarding Effectiveness"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isExec
                ? "First 90 days risk trajectory and key metrics."
                : "First 90 Days Risk Score — identifying and mitigating new joiner drop-off risk."}
            </p>
          </div>
          <DashboardViewToggle />
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Access Delay", weight: "30%", value: 65 },
            { label: "Task Completion", weight: "20%", value: 78 },
            { label: "Manager Engagement", weight: "30%", value: 42 },
            { label: "Survey Sentiment", weight: "20%", value: 55 },
          ].map((factor) => (
            <Card key={factor.label}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">{factor.label} ({factor.weight})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>{factor.value}%</div>
                <Progress value={factor.value} className="mt-2 h-1.5" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insight banner */}
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-foreground">
              <span className="font-bold">Pal-D Insight:</span> Ops new joiners have 35% higher drop-off risk. Primary drivers: system access delays and low manager interaction in the first two weeks.
            </p>
          </CardContent>
        </Card>

        {/* Trend chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Onboarding Risk Trend (6 Months)</CardTitle>
            <CardDescription>Average risk score and drop-off count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              {isExec ? (
                <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="riskScore" stroke="var(--color-riskScore)" fill="var(--color-riskScore)" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="dropOff" stroke="var(--color-dropOff)" fill="var(--color-dropOff)" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              ) : (
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="riskScore" stroke="var(--color-riskScore)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="dropOff" stroke="var(--color-dropOff)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Joiner table — detailed only */}
        {!isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New Joiner Risk Monitor</CardTitle>
              <CardDescription>Active employees within their first 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Employee</th>
                      <th className="pb-3 font-medium text-muted-foreground">Department</th>
                      <th className="pb-3 font-medium text-muted-foreground">Day</th>
                      <th className="pb-3 font-medium text-muted-foreground">Risk Score</th>
                      <th className="pb-3 font-medium text-muted-foreground">Top Drivers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockNewJoiners.map((joiner) => (
                      <tr key={joiner.name} className="border-b last:border-0">
                        <td className="py-3 font-medium">{joiner.name}</td>
                        <td className="py-3 text-muted-foreground">{joiner.dept}</td>
                        <td className="py-3 text-muted-foreground">{joiner.daysIn}</td>
                        <td className="py-3">
                          <Badge variant={riskColor(joiner.riskScore)}>
                            {riskLabel(joiner.riskScore)} ({joiner.riskScore})
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {joiner.drivers.length > 0 ? joiner.drivers.join(", ") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;
