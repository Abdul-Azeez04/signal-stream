import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SignalCard } from "@/components/SignalCard";
import { SearchBar } from "@/components/SearchBar";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { StatsBar } from "@/components/StatsBar";
import { useSignals } from "@/hooks/useSignals";
import { Loader2, Rss } from "lucide-react";

export default function Index() {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { data: signals, isLoading, error } = useSignals(category, search);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Stats bar */}
      <StatsBar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero section */}
        <section className="mb-8 animate-reveal">
          <h1
            className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            style={{ lineHeight: 1.08 }}
          >
            Real-time AI & Web3
            <br />
            intelligence platform
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            AI-powered signals aggregated from X, Discord, Telegram, and 50+ sources.
            Auto-classified, moderated, and delivered in real-time. Updated every 2 minutes.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20 active:scale-[0.97]"
            >
              <Rss className="h-3 w-3" />
              RSS Feed
            </a>
            <span className="text-xs text-muted-foreground">
              Free • No account required • Open API
            </span>
          </div>
        </section>

        <div className="flex gap-8">
          {/* Main feed */}
          <div className="min-w-0 flex-1">
            {/* Search */}
            <section className="mb-4 animate-reveal" style={{ animationDelay: "60ms" }}>
              <SearchBar value={search} onChange={setSearch} />
            </section>

            {/* Filters */}
            <section className="mb-6 animate-reveal" style={{ animationDelay: "120ms" }}>
              <CategoryFilter selected={category} onSelect={setCategory} />
            </section>

            {/* Live indicator */}
            <div
              className="mb-4 flex items-center gap-2 text-xs text-muted-foreground animate-reveal"
              style={{ animationDelay: "160ms" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>AI-moderated • Live feed</span>
              {signals && (
                <span className="ml-auto font-mono">
                  {signals.length} signal{signals.length !== 1 ? "s" : ""}
                </span>
              )}
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
                <div
                  key={signal.id}
                  onClick={() => navigate(`/signal/${signal.id}`)}
                  className="cursor-pointer"
                >
                  <SignalCard signal={signal} index={i} />
                </div>
              ))}
            </section>
          </div>

          {/* Trending sidebar - hidden on mobile */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <TrendingSidebar />
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pb-8 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              SignalFlow — AI-powered intelligence platform. Free and open.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                RSS
              </a>
              <a
                href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
