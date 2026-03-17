import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const teamData = [
  { team: "Engineering", overtime: 28, sickLeave: 15, burnoutScore: 78, prediction: "Attrition risk within 6–8 weeks" },
  { team: "Customer Support", overtime: 22, sickLeave: 10, burnoutScore: 62, prediction: "Performance decline likely within 4 weeks" },
  { team: "Sales", overtime: 15, sickLeave: 5, burnoutScore: 38, prediction: "Stable" },
  { team: "Operations", overtime: 18, sickLeave: 12, burnoutScore: 55, prediction: "Monitor closely" },
  { team: "Finance", overtime: 8, sickLeave: 3, burnoutScore: 20, prediction: "Healthy" },
];

const burnoutColor = (score: number) => {
  if (score >= 60) return "destructive" as const;
  if (score >= 40) return "secondary" as const;
  return "outline" as const;
};

const BurnoutDashboard = () => (
  <DashboardLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
          Managing Capacity & Burnout Risk
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Early warning system for team burnout, enabling targeted interventions to protect well-being and productivity.
        </p>
      </div>

      {/* Alert banner */}
      <Card className="mb-6 border-destructive/30 bg-destructive/5">
        <CardContent className="py-4">
          <p className="text-sm font-medium">
            <span className="font-bold">Pal-D Alert:</span> Engineering team shows high burnout risk. Overtime has increased by 28% and sick leave is up 15% over the last 4 weeks. Our model predicts a significant increase in voluntary attrition within 6–8 weeks if no intervention is made.
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

      {/* Team table */}
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
    </motion.div>
  </DashboardLayout>
);

export default BurnoutDashboard;
