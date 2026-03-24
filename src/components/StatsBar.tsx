import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-1.5 text-[11px] font-body text-muted-foreground sm:gap-8">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-semibold text-foreground">{stats.total.toLocaleString()}</span>
          <span>articles</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-semibold text-foreground">{stats.today}</span>
          <span>today</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-semibold text-foreground">{stats.thisHour}</span>
          <span>this hour</span>
        </div>
        <div className="h-3 w-px bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5">
          <span>25+ categories</span>
        </div>
      </div>
    </div>
  );
}