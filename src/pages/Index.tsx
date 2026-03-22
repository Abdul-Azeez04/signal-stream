import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SignalCard } from "@/components/SignalCard";
import { useSignals } from "@/hooks/useSignals";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [category, setCategory] = useState<string | null>(null);
  const { data: signals, isLoading, error } = useSignals(category);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Hero section */}
        <section className="mb-8 animate-reveal">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl" style={{ lineHeight: 1.1 }}>
            Real-time AI & Web3 intelligence
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Curated signals from across the internet — AI breakthroughs, DeFi protocols, dev tools, and emerging opportunities. Updated continuously.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-6 animate-reveal" style={{ animationDelay: "100ms" }}>
          <CategoryFilter selected={category} onSelect={setCategory} />
        </section>

        {/* Feed */}
        <section className="space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              Failed to load signals. Please try again later.
            </div>
          )}

          {signals?.length === 0 && !isLoading && (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No signals in this category yet.
            </div>
          )}

          {signals?.map((signal, i) => (
            <SignalCard key={signal.id} signal={signal} index={i} />
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pb-8 pt-6 text-center text-xs text-muted-foreground">
          <p>SignalFlow — AI & Web3 intelligence, open to everyone.</p>
        </footer>
      </main>
    </div>
  );
}
