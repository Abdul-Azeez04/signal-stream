import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { categoryLabels } from "./CategoryFilter";

type Signal = Tables<"signals">;

export function HeroCarousel({ signals }: { signals: Signal[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const heroItems = signals.slice(0, 5);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  useEffect(() => {
    const timer = setInterval(advance, 6000);
    return () => clearInterval(timer);
  }, [advance]);

  if (!heroItems.length) return null;

  const active = heroItems[activeIndex];
  const timeAgo = formatDistanceToNow(new Date(active.published_at), { addSuffix: true });

  return (
    <section className="mb-8">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Main hero */}
        <div
          className="relative lg:col-span-8 cursor-pointer group overflow-hidden rounded-lg bg-card border border-border"
          onClick={() => navigate(`/signal/${active.id}`)}
        >
          {active.image_url && (
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={active.image_url}
                alt={active.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="eager"
              />
            </div>
          )}
          <div className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-body font-bold uppercase tracking-wider text-primary-foreground">
                {categoryLabels[active.category] || active.category}
              </span>
              {active.importance >= 8 && (
                <span className="text-[10px] font-body font-bold uppercase tracking-wider text-destructive">
                  🔴 Breaking
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>
            <h2 className="mb-2 text-xl font-headline tracking-tight text-card-foreground group-hover:text-primary transition-colors sm:text-2xl lg:text-3xl" style={{ lineHeight: 1.15 }}>
              {active.title}
            </h2>
            <p className="text-sm font-body leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-3">
              {active.summary}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs font-body text-muted-foreground">
              <span className="font-medium text-foreground/70">Radar Desk</span>
              {active.source && (
                <>
                  <span>•</span>
                  <span>via {active.source}</span>
                </>
              )}
            </div>
          </div>
          {/* Carousel dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {heroItems.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side stories */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          {heroItems.slice(1, 4).map((signal, i) => (
            <div
              key={signal.id}
              className="group cursor-pointer rounded-lg border border-border bg-card p-4 transition-all hover:shadow-sm hover:border-border/60"
              onClick={() => navigate(`/signal/${signal.id}`)}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-body font-semibold uppercase tracking-wide text-secondary-foreground">
                  {categoryLabels[signal.category] || signal.category}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(signal.published_at), { addSuffix: true })}
                </span>
              </div>
              <h3 className="text-sm font-headline leading-snug text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {signal.title}
              </h3>
              <p className="mt-1 text-[11px] font-body leading-relaxed text-muted-foreground line-clamp-2">
                {signal.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}