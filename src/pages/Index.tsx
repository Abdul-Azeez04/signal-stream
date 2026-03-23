import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SignalCard } from "@/components/SignalCard";
import { SearchBar } from "@/components/SearchBar";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { StatsBar } from "@/components/StatsBar";
import { useSignals } from "@/hooks/useSignals";
import { Loader2, Rss, Newspaper } from "lucide-react";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category");
  const [category, setCategory] = useState<string | null>(initialCat);
  const [search, setSearch] = useState("");
  const { data: signals, isLoading, error } = useSignals(category, search);
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat);
    setVisibleCount(20);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && signals && visibleCount < signals.length) {
          setVisibleCount((prev) => prev + 15);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [signals, visibleCount]);

  const heroSignal = signals?.[0];
  const feedSignals = signals?.slice(1, visibleCount) || [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <StatsBar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero section */}
        <section className="mb-8 animate-reveal">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl" style={{ lineHeight: 1.1 }}>
                SignalFlow
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI-powered global intelligence • Updated every minute
              </p>
            </div>
            <a
              href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20 active:scale-[0.97]"
            >
              <Rss className="h-3 w-3" />
              RSS
            </a>
          </div>
        </section>

        {/* Hero article card */}
        {heroSignal && !isLoading && (
          <section
            className="mb-8 animate-reveal cursor-pointer"
            style={{ animationDelay: "40ms" }}
            onClick={() => navigate(`/signal/${heroSignal.id}`)}
          >
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
              {heroSignal.image_url && (
                <div className="h-48 sm:h-64 overflow-hidden">
                  <img
                    src={heroSignal.image_url}
                    alt={heroSignal.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {heroSignal.category.toUpperCase()}
                  </span>
                  {heroSignal.importance >= 8 && (
                    <span className="text-xs font-medium text-destructive">🔴 BREAKING</span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {heroSignal.source}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors sm:text-2xl" style={{ lineHeight: 1.2 }}>
                  {heroSignal.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {heroSignal.summary}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {heroSignal.author_name && <span>By {heroSignal.author_name}</span>}
                  <span>•</span>
                  <span>{Math.max(1, Math.ceil((heroSignal.content || heroSignal.summary).split(" ").length / 200))} min read</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex gap-8">
          {/* Main feed */}
          <div className="min-w-0 flex-1">
            {/* Search */}
            <section className="mb-4 animate-reveal" style={{ animationDelay: "60ms" }}>
              <SearchBar value={search} onChange={setSearch} />
            </section>

            {/* Filters */}
            <section className="mb-6 animate-reveal" style={{ animationDelay: "120ms" }}>
              <CategoryFilter selected={category} onSelect={handleCategoryChange} />
            </section>

            {/* Live indicator */}
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground animate-reveal" style={{ animationDelay: "160ms" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>AI-moderated • Live feed</span>
              {signals && (
                <span className="ml-auto font-mono">
                  {signals.length} article{signals.length !== 1 ? "s" : ""}
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
                  Failed to load articles. Please try again later.
                </div>
              )}

              {signals?.length === 0 && !isLoading && (
                <div className="py-20 text-center text-sm text-muted-foreground">
                  {search ? "No articles match your search." : "No articles in this category yet."}
                </div>
              )}

              {feedSignals.map((signal, i) => (
                <div
                  key={signal.id}
                  onClick={() => navigate(`/signal/${signal.id}`)}
                  className="cursor-pointer"
                >
                  <SignalCard signal={signal} index={i} />
                </div>
              ))}

              {/* Infinite scroll trigger */}
              {signals && visibleCount < signals.length && (
                <div ref={loaderRef} className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </section>
          </div>

          {/* Trending sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <TrendingSidebar />
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pb-8 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              SignalFlow — AI-powered global news intelligence. Free and open.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">RSS</a>
              <a href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Sitemap</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
