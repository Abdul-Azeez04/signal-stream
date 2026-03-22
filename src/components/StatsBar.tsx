import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Zap, BarChart3, Globe } from "lucide-react";

export function StatsBar() {
  const { data: stats } = useQuery({
    queryKey: ["signal-stats"],
    queryFn: async () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

      const [totalRes, dayRes, hourRes] = await Promise.all([
        supabase.from("signals").select("id", { count: "exact", head: true }),
        supabase.from("signals").select("id", { count: "exact", head: true }).gte("published_at", oneDayAgo),
        supabase.from("signals").select("id", { count: "exact", head: true }).gte("published_at", oneHourAgo),
      ]);

      return {
        total: totalRes.count || 0,
        today: dayRes.count || 0,
        thisHour: hourRes.count || 0,
      };
    },
    refetchInterval: 30000,
  });

  if (!stats) return null;

  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <BarChart3 className="h-3 w-3" />
          <span className="font-mono font-medium text-foreground">{stats.total.toLocaleString()}</span>
          <span>total signals</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Activity className="h-3 w-3 text-accent" />
          <span className="font-mono font-medium text-foreground">{stats.today}</span>
          <span>today</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Zap className="h-3 w-3 text-primary" />
          <span className="font-mono font-medium text-foreground">{stats.thisHour}</span>
          <span>this hour</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
          <Globe className="h-3 w-3" />
          <span>8 categories • AI moderated</span>
        </div>
      </div>
    </div>
  );
}
