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
    <div className="space-y-6 sticky top-36">
      {/* Most Read */}
      <div className="animate-reveal" style={{ animationDelay: "200ms" }}>
        <div className="mb-3 flex items-center gap-2 border-b-2 border-primary pb-2">
          <Flame className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-body font-bold uppercase tracking-wider text-foreground">Most Read</h3>
        </div>
        <div className="space-y-3">
          {trending?.map((signal, i) => (
            <Link
              key={signal.id}
              to={`/signal/${signal.id}`}
              className="group flex items-start gap-3"
            >
              <span className="mt-0.5 font-headline text-2xl font-bold text-border group-hover:text-primary transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-body font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                  {signal.title}
                </p>
                <span className="mt-0.5 block text-[10px] font-body text-muted-foreground">
                  {categoryLabels[signal.category] || signal.category}
                </span>
              </div>
            </Link>
          ))}
          {!trending?.length && (
            <p className="text-xs font-body text-muted-foreground">No trending articles yet</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="animate-reveal" style={{ animationDelay: "280ms" }}>
        <div className="mb-3 flex items-center gap-2 border-b-2 border-foreground pb-2">
          <TrendingUp className="h-4 w-4 text-foreground" />
          <h3 className="text-xs font-body font-bold uppercase tracking-wider text-foreground">Sections</h3>
        </div>
        <div className="space-y-1.5">
          {categoryCounts &&
            Object.entries(categoryCounts)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 12)
              .map(([cat, count]) => (
                <Link
                  key={cat}
                  to={`/?category=${cat}`}
                  className="flex items-center justify-between py-1 text-xs font-body hover:text-primary transition-colors"
                >
                  <span className="text-muted-foreground hover:text-foreground">{categoryLabels[cat] || cat}</span>
                  <span className="font-mono text-foreground/50">{String(count)}</span>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}