import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Shield, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { categoryLabels } from "./CategoryFilter";

type Signal = Tables<"signals">;

export function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const timeAgo = formatDistanceToNow(new Date(signal.published_at), { addSuffix: true });
  const readingTime = Math.max(1, Math.ceil((signal.content || signal.summary).split(" ").length / 200));

  return (
    <article
      className="animate-reveal group relative border-b border-border bg-card transition-colors duration-150 hover:bg-muted/30"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <div className="flex gap-4 py-4">
        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Category & meta */}
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-body">
            <span className="font-semibold uppercase tracking-wide text-primary">
              {categoryLabels[signal.category] || signal.category}
            </span>
            {signal.importance >= 8 && (
              <span className="font-bold uppercase tracking-wider text-destructive">Breaking</span>
            )}
            {signal.moderated && (
              <span className="flex items-center gap-0.5 text-muted-foreground">
                <Shield className="h-2.5 w-2.5" />
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-1 text-[15px] font-headline leading-snug tracking-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {signal.title}
          </h3>

          {/* Summary */}
          <p className="mb-2 text-[12px] font-body leading-relaxed text-muted-foreground line-clamp-2">
            {signal.summary}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-body text-muted-foreground">
            <span className="font-medium text-foreground/60">Radar Desk</span>
            {signal.source && (
              <span>via {signal.source}</span>
            )}
            <span className="flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {readingTime}m read
            </span>
            <span>{timeAgo}</span>
            {signal.source_url && (
              <a
                href={signal.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Image thumbnail */}
        {signal.image_url && (
          <div className="hidden shrink-0 sm:block">
            <div className="h-24 w-32 overflow-hidden rounded">
              <img
                src={signal.image_url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}