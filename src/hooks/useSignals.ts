import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSignals(category: string | null) {
  return useQuery({
    queryKey: ["signals", category],
    queryFn: async () => {
      let query = supabase
        .from("signals")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(50);

      if (category) {
        query = query.eq("category", category as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
