import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TrendingSidebar() {
  const navigate = useNavigate();

  const { data: trending } = useQuery({
    queryKey: ["trending-signals"],
    queryFn: async () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("signals")
        .select("id, title, category, importance, published_at")
        .gte("published_at", oneDayAgo)
        .order("importance", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const { data: categoryCounts } = useQuery({
    queryKey: ["category-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("signals").select("category");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((s) => {
        counts[s.category] = (counts[s.category] || 0) + 1;
      });
      return counts;
    },
    refetchInterval: 60000,
  });

  const categoryLabels: Record<string, string> = {
    ai: "AI",
    web3: "Web3",
    defi: "DeFi",
    nft: "NFT",
    "dev-tools": "Dev Tools",
    opportunities: "Opportunities",
    news: "News",
    research: "Research",
  };

  return (
    <div className="sticky top-20 space-y-6">
      {/* Trending signals */}
      <div className="animate-reveal rounded-lg border border-border bg-card p-4" style={{ animationDelay: "200ms" }}>
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-card-foreground">Trending Now</h3>
        </div>
        <div className="space-y-2.5">
          {trending?.map((signal, i) => (
            <button
              key={signal.id}
              onClick={() => navigate(`/signal/${signal.id}`)}
              className="group flex w-full items-start gap-2 rounded-md p-1.5 text-left transition-colors hover:bg-secondary/60 active:scale-[0.98]"
            >
              <span className="mt-0.5 shrink-0 font-mono text-[10px] font-medium text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-card-foreground group-hover:text-foreground">
                  {signal.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-secondary px-1 py-0.5 text-[9px] font-medium uppercase text-secondary-foreground">
                    {signal.category}
                  </span>
                  {signal.importance >= 8 && (
                    <TrendingUp className="h-2.5 w-2.5 text-accent" />
                  )}
                </div>
              </div>
            </button>
          ))}
          {!trending?.length && (
            <p className="text-xs text-muted-foreground">No trending signals yet</p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="animate-reveal rounded-lg border border-border bg-card p-4" style={{ animationDelay: "280ms" }}>
        <h3 className="mb-3 text-sm font-semibold text-card-foreground">Categories</h3>
        <div className="space-y-2">
          {categoryCounts &&
            Object.entries(categoryCounts)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{categoryLabels[cat] || cat}</span>
                  <span className="font-mono text-foreground/70">{count}</span>
                </div>
              ))}
        </div>
      </div>

      {/* Platform info */}
      <div className="animate-reveal rounded-lg border border-dashed border-border p-4" style={{ animationDelay: "360ms" }}>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/70">AI-Powered</span> — Signals are auto-generated,
          classified, and moderated by AI every 2 minutes. Content is aggregated from multiple sources
          and processed through quality filters.
        </p>
      </div>
    </div>
  );
}
