import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSignals(category: string | null, search: string) {
  const queryClient = useQueryClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("signals-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "signals" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["signals"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["signals", category, search],
    queryFn: async () => {
      let query = supabase
        .from("signals")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(100);

      if (category) {
        query = query.eq("category", category as any);
      }

      if (search.trim()) {
        query = query.or(
          `title.ilike.%${search.trim()}%,summary.ilike.%${search.trim()}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useSignal(id: string) {
  return useQuery({
    queryKey: ["signal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
