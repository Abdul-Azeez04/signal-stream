import { formatDistanceToNow } from "date-fns";
import { ExternalLink, TrendingUp, Shield, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { categoryLabels } from "./CategoryFilter";

type Signal = Tables<"signals">;

export function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const timeAgo = formatDistanceToNow(new Date(signal.published_at), { addSuffix: true });
  const readingTime = Math.max(1, Math.ceil((signal.content || signal.summary).split(" ").length / 200));

  return (
    <article
      className="animate-reveal group relative rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-border/80 active:scale-[0.995] overflow-hidden"
      style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
    >
      <div className="flex">
        {/* Image thumbnail */}
        {signal.image_url && (
          <div className="hidden sm:block w-36 shrink-0 overflow-hidden">
            <img
              src={signal.image_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 p-4">
          {/* Top row */}
          <div className="mb-2 flex items-center gap-2 text-sm">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary tracking-wide">
              {categoryLabels[signal.category] || signal.category}
            </span>
            {signal.importance >= 8 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                <TrendingUp className="h-3 w-3" />
                Breaking
              </span>
            )}
            {signal.moderated && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Shield className="h-2.5 w-2.5" />
                Verified
              </span>
            )}
            <span className="ml-auto text-[10px] text-muted-foreground">{timeAgo}</span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 text-sm font-semibold leading-snug tracking-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {signal.title}
          </h3>

          {/* Summary */}
          <p className="mb-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{signal.summary}</p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
            {signal.source && (
              <span>via <span className="font-medium text-foreground/70">{signal.source}</span></span>
            )}
            {signal.author_name && (
              <span>• {signal.author_name}</span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {readingTime}m
            </span>
            {signal.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-secondary-foreground">
                {tag}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono">{signal.importance}/10</span>
              {signal.source_url && (
                <a
                  href={signal.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
