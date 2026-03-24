import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { BreakingTicker } from "@/components/BreakingTicker";
import { StatsBar } from "@/components/StatsBar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SignalCard } from "@/components/SignalCard";
import { SearchBar } from "@/components/SearchBar";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { useSignals } from "@/hooks/useSignals";
import { Loader2 } from "lucide-react";

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

  const heroSignals = signals?.slice(0, 5) || [];
  const feedSignals = signals?.slice(5, visibleCount + 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <BreakingTicker />
      <StatsBar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero carousel */}
        {!isLoading && heroSignals.length > 0 && !category && !search && (
          <HeroCarousel signals={heroSignals} />
        )}

        <div className="flex gap-8">
          {/* Main feed */}
          <div className="min-w-0 flex-1">
            {/* Section header */}
            <div className="mb-4 flex items-end justify-between border-b-2 border-foreground pb-2">
              <h2 className="text-sm font-body font-bold uppercase tracking-wider text-foreground">
                {category ? (category.charAt(0).toUpperCase() + category.slice(1)) : "Latest News"}
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                {signals?.length || 0} articles
              </span>
            </div>

            {/* Search */}
            <div className="mb-3">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            {/* Filters */}
            <div className="mb-4">
              <CategoryFilter selected={category} onSelect={handleCategoryChange} />
            </div>

            {/* Feed */}
            <div>
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {error && (
                <div className="rounded border border-destructive/30 bg-destructive/5 p-4 text-sm font-body text-destructive">
                  Failed to load articles. Please try again later.
                </div>
              )}

              {signals?.length === 0 && !isLoading && (
                <div className="py-20 text-center text-sm font-body text-muted-foreground">
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
              {signals && visibleCount + 5 < signals.length && (
                <div ref={loaderRef} className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <TrendingSidebar />
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pb-8 pt-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <h3 className="font-headline text-lg text-foreground">THE RADAR</h3>
              <p className="text-[11px] font-body text-muted-foreground mt-1">
                Global News Intelligence — Updated every minute
              </p>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-body text-muted-foreground">
              <a href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors uppercase tracking-wide">RSS</a>
              <a href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors uppercase tracking-wide">Sitemap</a>
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              © {new Date().getFullYear()} The Radar. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}