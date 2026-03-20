import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, UserCog, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole | null;
}

const roleLabels: Record<AppRole, string> = {
  manager: "Manager",
  hr: "HR Personnel",
  it_admin: "IT Administrator",
  senior_leader: "Senior Leader",
};

const roleBadgeVariant: Record<AppRole, "default" | "secondary" | "destructive" | "outline"> = {
  manager: "default",
  hr: "secondary",
  it_admin: "destructive",
  senior_leader: "outline",
};

const AdminRoles = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles, error: pErr } = await supabase.from("profiles").select("user_id, email, full_name");
    if (pErr) { toast.error("Failed to load users"); setLoading(false); return; }

    const { data: roles, error: rErr } = await supabase.from("user_roles").select("user_id, role");
    if (rErr) { toast.error("Failed to load roles"); setLoading(false); return; }

    const roleMap = new Map(roles?.map((r) => [r.user_id, r.role as AppRole]));
    setUsers(
      (profiles ?? []).map((p) => ({
        user_id: p.user_id,
        email: p.email,
        full_name: p.full_name,
        role: roleMap.get(p.user_id) ?? null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setSaving(userId);
    const existing = users.find((u) => u.user_id === userId);

    if (existing?.role) {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) { toast.error("Failed to update role"); setSaving(null); return; }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });
      if (error) { toast.error("Failed to assign role"); setSaving(null); return; }
    }

    toast.success(`Role updated to ${roleLabels[newRole]}`);
    setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, role: newRole } : u));
    setSaving(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Role Management
          </h1>
          <p className="text-muted-foreground mt-1">Assign and manage user roles across the platform.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCog className="h-5 w-5" />
              All Users
            </CardTitle>
            <CardDescription>{users.length} registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {users.map((u) => (
                  <div key={u.user_id} className="flex items-center justify-between py-4 gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{u.full_name || "No name"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {u.role && (
                        <Badge variant={roleBadgeVariant[u.role]} className="hidden sm:inline-flex">
                          {roleLabels[u.role]}
                        </Badge>
                      )}
                      <Select
                        value={u.role ?? ""}
                        onValueChange={(v) => handleRoleChange(u.user_id, v as AppRole)}
                        disabled={saving === u.user_id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Assign role…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="hr">HR Personnel</SelectItem>
                          <SelectItem value="it_admin">IT Administrator</SelectItem>
                          <SelectItem value="senior_leader">Senior Leader</SelectItem>
                        </SelectContent>
                      </Select>
                      {saving === u.user_id && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminRoles;
