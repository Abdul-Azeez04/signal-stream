import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryLabels } from "./CategoryFilter";

export function TrendingSidebar() {
  const { data: trending } = useQuery({
    queryKey: ["trending-signals"],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("signals")
        .select("id, title, category, importance, published_at, source")
        .gte("published_at", since)
        .order("importance", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30_000,
  });

  const { data: categoryCounts } = useQuery({
    queryKey: ["category-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signals")
        .select("category");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((s) => {
        counts[s.category] = (counts[s.category] || 0) + 1;
      });
      return counts;
    },
    refetchInterval: 60_000,
  });

  return (
    <div className="space-y-4">
      {/* Trending */}
      <div className="animate-reveal rounded-lg border border-border bg-card p-4" style={{ animationDelay: "200ms" }}>
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-semibold text-card-foreground">Trending Now</h3>
        </div>
        <div className="space-y-2.5">
          {trending?.map((signal, i) => (
            <Link
              key={signal.id}
              to={`/signal/${signal.id}`}
              className="group block"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-muted-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {signal.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{categoryLabels[signal.category] || signal.category}</span>
                    <span>•</span>
                    <span>{signal.source}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!trending?.length && (
            <p className="text-xs text-muted-foreground">No trending signals yet</p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="animate-reveal rounded-lg border border-border bg-card p-4" style={{ animationDelay: "280ms" }}>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Categories</h3>
        </div>
        <div className="space-y-1.5">
          {categoryCounts &&
            Object.entries(categoryCounts)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 12)
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{categoryLabels[cat] || cat}</span>
                  <span className="font-mono text-foreground/70">{String(count)}</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
