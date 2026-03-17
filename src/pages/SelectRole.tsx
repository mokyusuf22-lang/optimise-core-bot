import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Users, BarChart3, Settings, Shield } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roles: { role: AppRole; label: string; description: string; icon: typeof Users }[] = [
  { role: "manager", label: "Manager", description: "View team onboarding scores, burnout alerts, and direct report insights.", icon: Users },
  { role: "hr", label: "HR Personnel", description: "Access organisation-wide attrition risk, onboarding effectiveness, and workforce analytics.", icon: BarChart3 },
  { role: "it_admin", label: "IT Administrator", description: "Monitor data pipelines, system integrations, and platform health.", icon: Settings },
  { role: "senior_leader", label: "Senior Leader", description: "Strategic overview of workforce risk, cost impact, and executive summaries.", icon: Shield },
];

const SelectRole = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectRole = async (role: AppRole) => {
    if (!user) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Role assigned", description: `You are now logged in as ${roles.find(r => r.role === role)?.label}.` });
    // Force refresh to pick up new role
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Select Your Role
          </h1>
          <p className="text-muted-foreground mb-8">Choose the view that matches your responsibilities. This determines your dashboard experience.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map(({ role, label, description, icon: Icon }, i) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
                onClick={() => handleSelectRole(role)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
