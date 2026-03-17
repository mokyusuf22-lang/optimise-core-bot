import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const hotspots = [
  { group: "Sales — High Performers", riskMultiplier: "2.3x", drivers: ["Below-market compensation", "Sustained workload imbalance"], count: 12, severity: "high" },
  { group: "Engineering — Mid-Level", riskMultiplier: "1.8x", drivers: ["Limited career growth", "Manager effectiveness"], count: 8, severity: "high" },
  { group: "Operations — New Hires (<1yr)", riskMultiplier: "1.5x", drivers: ["Poor onboarding experience", "Role clarity"], count: 15, severity: "medium" },
  { group: "Finance — Senior Analysts", riskMultiplier: "1.3x", drivers: ["Compensation competitiveness"], count: 5, severity: "medium" },
];

const AttritionDashboard = () => (
  <DashboardLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
          Predicting & Mitigating Attrition Risk
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Proactive, data-driven strategies for retaining your most valuable talent.
        </p>
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
            <span className="font-bold">Pal-D Insight:</span> High performers in the Sales division are 2.3x more likely to leave within the next quarter. Primary drivers: below-market compensation and sustained workload imbalance.
          </p>
        </CardContent>
      </Card>

      {/* Hotspots */}
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
    </motion.div>
  </DashboardLayout>
);

export default AttritionDashboard;
