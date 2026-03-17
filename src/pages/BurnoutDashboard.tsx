import DashboardLayout from "@/components/DashboardLayout";
import DashboardViewToggle from "@/components/DashboardViewToggle";
import { useDashboardView } from "@/hooks/useDashboardView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

const trendData = [
  { month: "Oct", burnout: 45, overtime: 12, sickLeave: 6 },
  { month: "Nov", burnout: 52, overtime: 16, sickLeave: 8 },
  { month: "Dec", burnout: 58, overtime: 20, sickLeave: 10 },
  { month: "Jan", burnout: 65, overtime: 24, sickLeave: 13 },
  { month: "Feb", burnout: 72, overtime: 26, sickLeave: 14 },
  { month: "Mar", burnout: 78, overtime: 28, sickLeave: 15 },
];

const teamData = [
  { team: "Engineering", overtime: 28, sickLeave: 15, burnoutScore: 78, prediction: "Attrition risk within 6–8 weeks" },
  { team: "Customer Support", overtime: 22, sickLeave: 10, burnoutScore: 62, prediction: "Performance decline likely within 4 weeks" },
  { team: "Sales", overtime: 15, sickLeave: 5, burnoutScore: 38, prediction: "Stable" },
  { team: "Operations", overtime: 18, sickLeave: 12, burnoutScore: 55, prediction: "Monitor closely" },
  { team: "Finance", overtime: 8, sickLeave: 3, burnoutScore: 20, prediction: "Healthy" },
];

const chartConfig = {
  burnout: { label: "Burnout Score", color: "hsl(var(--destructive))" },
  overtime: { label: "Overtime %", color: "hsl(var(--primary))" },
  sickLeave: { label: "Sick Leave %", color: "hsl(var(--accent))" },
};

const burnoutColor = (score: number) => {
  if (score >= 60) return "destructive" as const;
  if (score >= 40) return "secondary" as const;
  return "outline" as const;
};

const BurnoutDashboard = () => {
  const { view } = useDashboardView();
  const isExec = view === "executive";

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {isExec ? "Burnout Risk — Executive Summary" : "Managing Capacity & Burnout Risk"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isExec
                ? "Key metrics and trends at a glance."
                : "Early warning system for team burnout, enabling targeted interventions."}
            </p>
          </div>
          <DashboardViewToggle />
        </div>

        {/* Alert banner */}
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium">
              <span className="font-bold">Pal-D Alert:</span> Engineering team shows high burnout risk (78/100). Overtime +28%, sick leave +15% over 4 weeks.
              {isExec ? "" : " Model predicts significant increase in voluntary attrition within 6–8 weeks without intervention."}
            </p>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Teams at Risk", value: "2" },
            { label: "Avg Overtime Delta", value: "+18%" },
            { label: "Sick Leave Trend", value: "+9%" },
            { label: "Well-being Score", value: "62/100" },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">{kpi.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Burnout Trend (6 Months)</CardTitle>
            <CardDescription>Burnout score, overtime, and sick leave over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="burnout" stroke="var(--color-burnout)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="overtime" stroke="var(--color-overtime)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sickLeave" stroke="var(--color-sickLeave)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Team table — hidden in executive view */}
        {!isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Burnout Monitor</CardTitle>
              <CardDescription>Real-time capacity and well-being indicators by team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Team</th>
                      <th className="pb-3 font-medium text-muted-foreground">Overtime Δ</th>
                      <th className="pb-3 font-medium text-muted-foreground">Sick Leave Δ</th>
                      <th className="pb-3 font-medium text-muted-foreground">Burnout Score</th>
                      <th className="pb-3 font-medium text-muted-foreground">Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamData.map((team) => (
                      <tr key={team.team} className="border-b last:border-0">
                        <td className="py-3 font-medium">{team.team}</td>
                        <td className="py-3 text-muted-foreground">+{team.overtime}%</td>
                        <td className="py-3 text-muted-foreground">+{team.sickLeave}%</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={team.burnoutScore} className="h-1.5 w-16" />
                            <Badge variant={burnoutColor(team.burnoutScore)} className="text-[10px]">
                              {team.burnoutScore}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">{team.prediction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Executive: condensed bar chart of team scores */}
        {isExec && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Burnout Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ burnout: { label: "Burnout", color: "hsl(var(--destructive))" } }} className="h-[200px] w-full">
                <BarChart data={teamData.map(t => ({ team: t.team, burnout: t.burnoutScore }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="team" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="burnout" fill="var(--color-burnout)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default BurnoutDashboard;
