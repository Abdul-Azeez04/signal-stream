import { useParams, Link } from "react-router-dom";
import { useSignal } from "@/hooks/useSignals";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft, ExternalLink, TrendingUp, Clock, Calendar,
  Share2, Copy, Shield, Check
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export default function SignalDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: signal, isLoading, error } = useSignal(id!);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`${signal?.title} — SignalFlow`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !signal) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-muted-foreground">Signal not found.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-3 w-3" /> Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(signal.published_at), { addSuffix: true });
  const fullDate = format(new Date(signal.published_at), "MMM d, yyyy 'at' h:mm a");
  const readingTime = Math.max(1, Math.ceil((signal.content || signal.summary).split(" ").length / 200));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: signal.title,
            description: signal.summary,
            datePublished: signal.published_at,
            author: {
              "@type": "Person",
              name: signal.author_name || "SignalFlow",
            },
            publisher: {
              "@type": "Organization",
              name: "SignalFlow",
            },
            articleSection: signal.category,
            keywords: signal.tags?.join(", "),
          }),
        }}
      />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground animate-reveal"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to feed
        </Link>

        <article className="animate-reveal" style={{ animationDelay: "80ms" }}>
          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${categoryStyles[signal.category]}`}
            >
              {categoryLabels[signal.category]}
            </span>
            {signal.importance >= 8 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                <TrendingUp className="h-3 w-3" />
                High signal
              </span>
            )}
            {signal.moderated && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                AI Verified
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </div>
          </div>

          {/* Title */}
          <h1
            className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            style={{ lineHeight: 1.15 }}
          >
            {signal.title}
          </h1>

          {/* Author & date & share */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            {signal.author_name && (
              <span>
                by <span className="font-medium text-foreground/80">{signal.author_name}</span>
              </span>
            )}
            {signal.source && (
              <span>
                via <span className="font-medium text-foreground/70">{signal.source}</span>
              </span>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span title={fullDate}>{timeAgo}</span>
            </div>

            {/* Share buttons */}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
              >
                {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleShareX}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
              >
                <Share2 className="h-3 w-3" />
                Share on X
              </button>
              {signal.source_url && (
                <a
                  href={signal.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:underline"
                >
                  Source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 rounded-lg border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary/80">TL;DR</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">{signal.summary}</p>
          </div>

          {/* Full content */}
          {signal.content && (
            <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
              {signal.content.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Tags */}
          {signal.tags && signal.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              {signal.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Importance meter */}
          <div className="mt-6 flex items-center gap-3 rounded-lg bg-muted p-4">
            <span className="text-xs font-medium text-muted-foreground">Signal Strength</span>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-border">
                <div
                  className="h-1.5 rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${signal.importance * 10}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-xs font-medium text-foreground">{signal.importance}/10</span>
          </div>
        </article>

        <footer className="mt-16 border-t border-border pb-8 pt-6 text-center text-xs text-muted-foreground">
          <p>SignalFlow — AI-powered intelligence platform. Free and open.</p>
        </footer>
      </main>
    </div>
  );
}
