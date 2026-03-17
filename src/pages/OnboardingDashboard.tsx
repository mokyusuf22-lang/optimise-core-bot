import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const mockNewJoiners = [
  { name: "Sarah Chen", dept: "Operations", riskScore: 72, drivers: ["Delayed system access", "Low manager interaction"], daysIn: 14 },
  { name: "James Okoro", dept: "Finance", riskScore: 45, drivers: ["Training incomplete"], daysIn: 28 },
  { name: "Maria Lopez", dept: "Engineering", riskScore: 85, drivers: ["No manager check-in", "Negative survey sentiment"], daysIn: 7 },
  { name: "Alex Turner", dept: "Sales", riskScore: 22, drivers: [], daysIn: 45 },
  { name: "Priya Sharma", dept: "Operations", riskScore: 68, drivers: ["Delayed system access"], daysIn: 10 },
];

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

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Proactive Onboarding Effectiveness
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            First 90 Days Risk Score — identifying and mitigating new joiner drop-off risk.
          </p>
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
              <span className="font-bold">Pal-D Insight:</span> New joiners in the Operations department have a 35% higher drop-off risk score. Primary drivers: significant delays in system access and low manager interaction during the first two weeks.
            </p>
          </CardContent>
        </Card>

        {/* New joiner table */}
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
      </motion.div>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;
