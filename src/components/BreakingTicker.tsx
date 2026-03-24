import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

export function BreakingTicker() {
  const { data: breaking } = useQuery({
    queryKey: ["breaking-ticker"],
    queryFn: async () => {
      const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("signals")
        .select("id, title, category")
        .gte("importance", 7)
        .gte("published_at", since)
        .order("published_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30_000,
  });

  if (!breaking?.length) return null;

  const items = [...breaking, ...breaking]; // duplicate for seamless scroll

  return (
    <div className="border-b border-border bg-destructive/5 overflow-hidden">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="flex shrink-0 items-center gap-1.5 bg-destructive px-3 py-1.5 text-[11px] font-body font-bold uppercase tracking-wider text-destructive-foreground">
          <AlertTriangle className="h-3 w-3" />
          Breaking
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden py-1.5">
          <div className="animate-ticker flex whitespace-nowrap">
            {items.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={`/signal/${item.id}`}
                className="mx-8 inline-block text-[12px] font-body font-medium text-foreground/90 hover:text-destructive transition-colors"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}