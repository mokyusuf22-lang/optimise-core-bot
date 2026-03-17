import DashboardLayout from "@/components/DashboardLayout";
import DashboardViewToggle from "@/components/DashboardViewToggle";
import { useDashboardView } from "@/hooks/useDashboardView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

// Real data from User_Story_Data.xlsx — 484 employees with burnout metrics
const teamData = [
  { team: "AI Lab", overtime: 20.4, sickLeave: 1.2, burnoutScore: 45, wellbeing: 2.4, prediction: "High workload & low wellbeing — monitor closely" },
  { team: "Engineering", overtime: 13.5, sickLeave: 1.2, burnoutScore: 31, wellbeing: 3.3, prediction: "Moderate risk — overtime trending up" },
  { team: "Customer Support", overtime: 8.0, sickLeave: 2.1, burnoutScore: 29, wellbeing: 2.7, prediction: "Sick leave elevated — emotional toll risk" },
  { team: "Product", overtime: 8.7, sickLeave: 1.1, burnoutScore: 22, wellbeing: 3.6, prediction: "Stable but watch workload backlog" },
  { team: "Operations", overtime: 5.0, sickLeave: 0.7, burnoutScore: 18, wellbeing: 3.4, prediction: "Stable" },
  { team: "Sales", overtime: 6.1, sickLeave: 0.5, burnoutScore: 15, wellbeing: 4.0, prediction: "Healthy" },
  { team: "Legal", overtime: 5.3, sickLeave: 0.0, burnoutScore: 13, wellbeing: 4.1, prediction: "Healthy" },
  { team: "Marketing", overtime: 4.1, sickLeave: 0.5, burnoutScore: 12, wellbeing: 4.0, prediction: "Healthy" },
  { team: "Content", overtime: 4.0, sickLeave: 0.5, burnoutScore: 11, wellbeing: 4.2, prediction: "Healthy" },
  { team: "Finance", overtime: 1.5, sickLeave: 0.1, burnoutScore: 6, wellbeing: 4.4, prediction: "Healthy" },
  { team: "HR", overtime: 1.4, sickLeave: 0.0, burnoutScore: 4, wellbeing: 4.6, prediction: "Healthy" },
];

// Simulated monthly trend based on aggregate data
const trendData = [
  { month: "Oct", burnout: 22, overtime: 8, sickLeave: 0.6 },
  { month: "Nov", burnout: 25, overtime: 8.5, sickLeave: 0.7 },
  { month: "Dec", burnout: 28, overtime: 9, sickLeave: 0.8 },
  { month: "Jan", burnout: 30, overtime: 9.2, sickLeave: 0.9 },
  { month: "Feb", burnout: 32, overtime: 9.5, sickLeave: 0.9 },
  { month: "Mar", burnout: 34, overtime: 10, sickLeave: 1.0 },
];

const chartConfig = {
  burnout: { label: "Burnout Score", color: "hsl(var(--destructive))" },
  overtime: { label: "Avg Overtime (hrs)", color: "hsl(var(--primary))" },
  sickLeave: { label: "Avg Sick Leave (days)", color: "hsl(var(--accent))" },
};

const burnoutColor = (score: number) => {
  if (score >= 40) return "destructive" as const;
  if (score >= 25) return "secondary" as const;
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
                ? "Key metrics across 484 employees with capacity data."
                : "Early warning system for team burnout across 484 employees, enabling targeted interventions."}
            </p>
          </div>
          <DashboardViewToggle />
        </div>

        {/* Alert banner */}
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium">
              <span className="font-bold">Pal-D Alert:</span> AI Lab shows highest burnout risk (score 45/100). Avg overtime 20.4 hrs/week, wellbeing 2.4/5, workload backlog at 80 items.
              {isExec ? "" : " Customer Support also elevated with highest sick leave (2.1 days/3mo) and low wellbeing (2.7/5)."}
            </p>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Teams Elevated Risk", value: "3" },
            { label: "Avg Overtime", value: "9.2 hrs/wk" },
            { label: "Avg Sick Leave", value: "0.9 days/3mo" },
            { label: "Well-being Score", value: "3.5/5" },
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
                      <th className="pb-3 font-medium text-muted-foreground">Overtime (hrs/wk)</th>
                      <th className="pb-3 font-medium text-muted-foreground">Sick Leave (days)</th>
                      <th className="pb-3 font-medium text-muted-foreground">Burnout Score</th>
                      <th className="pb-3 font-medium text-muted-foreground">Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamData.map((team) => (
                      <tr key={team.team} className="border-b last:border-0">
                        <td className="py-3 font-medium">{team.team}</td>
                        <td className="py-3 text-muted-foreground">{team.overtime}</td>
                        <td className="py-3 text-muted-foreground">{team.sickLeave}</td>
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
