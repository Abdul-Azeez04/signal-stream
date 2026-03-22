import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SignalCard } from "@/components/SignalCard";
import { SearchBar } from "@/components/SearchBar";
import { useSignals } from "@/hooks/useSignals";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { data: signals, isLoading, error } = useSignals(category, search);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Hero section */}
        <section className="mb-6 animate-reveal">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl" style={{ lineHeight: 1.1 }}>
            Real-time AI & Web3 intelligence
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Curated signals from across the internet — AI breakthroughs, DeFi protocols, dev tools, and emerging opportunities. Updated continuously.
          </p>
        </section>

        {/* Search */}
        <section className="mb-4 animate-reveal" style={{ animationDelay: "60ms" }}>
          <SearchBar value={search} onChange={setSearch} />
        </section>

        {/* Filters */}
        <section className="mb-6 animate-reveal" style={{ animationDelay: "120ms" }}>
          <CategoryFilter selected={category} onSelect={setCategory} />
        </section>

        {/* Live indicator */}
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground animate-reveal" style={{ animationDelay: "160ms" }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span>Feed updates in real-time</span>
          {signals && <span className="ml-auto">{signals.length} signal{signals.length !== 1 ? "s" : ""}</span>}
        </div>

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
              {search ? "No signals match your search." : "No signals in this category yet."}
            </div>
          )}

          {signals?.map((signal, i) => (
            <div key={signal.id} onClick={() => navigate(`/signal/${signal.id}`)} className="cursor-pointer">
              <SignalCard signal={signal} index={i} />
            </div>
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
