import { useDashboardView } from "@/hooks/useDashboardView";
import { BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardViewToggle = () => {
  const { view, setView } = useDashboardView();

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-0.5 text-xs">
      <button
        onClick={() => setView("executive")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors font-medium",
          view === "executive"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Zap className="h-3 w-3" />
        Executive
      </button>
      <button
        onClick={() => setView("detailed")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors font-medium",
          view === "detailed"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <BarChart3 className="h-3 w-3" />
        Detailed
      </button>
    </div>
  );
};

export default DashboardViewToggle;
