import { formatDistanceToNow } from "date-fns";
import { ExternalLink, TrendingUp } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Signal = Tables<"signals">;

const categoryStyles: Record<string, string> = {
  ai: "bg-signal-ai/10 text-signal-ai",
  web3: "bg-signal-web3/10 text-signal-web3",
  defi: "bg-signal-defi/10 text-signal-defi",
  nft: "bg-signal-nft/10 text-signal-nft",
  "dev-tools": "bg-signal-devtools/10 text-signal-devtools",
  opportunities: "bg-signal-opportunities/10 text-signal-opportunities",
  news: "bg-signal-news/10 text-signal-news",
  research: "bg-signal-research/10 text-signal-research",
};

const categoryLabels: Record<string, string> = {
  ai: "AI",
  web3: "Web3",
  defi: "DeFi",
  nft: "NFT",
  "dev-tools": "Dev Tools",
  opportunities: "Opportunities",
  news: "News",
  research: "Research",
};

export function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const timeAgo = formatDistanceToNow(new Date(signal.published_at), { addSuffix: true });

  return (
    <article
      className="animate-reveal group relative rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md active:scale-[0.99]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top row: category + time + importance */}
      <div className="mb-3 flex items-center gap-2 text-sm">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${categoryStyles[signal.category]}`}>
          {categoryLabels[signal.category]}
        </span>
        {signal.importance >= 8 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
            <TrendingUp className="h-3 w-3" />
            High signal
          </span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{timeAgo}</span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-semibold leading-snug tracking-tight text-card-foreground">
        {signal.title}
      </h3>

      {/* Summary */}
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {signal.summary}
      </p>

      {/* Footer: source + tags */}
      <div className="flex flex-wrap items-center gap-2">
        {signal.source && (
          <span className="text-xs text-muted-foreground">
            via <span className="font-medium text-foreground/70">{signal.source}</span>
          </span>
        )}
        {signal.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
        {signal.source_url && (
          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}
