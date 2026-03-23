import { useParams, Link } from "react-router-dom";
import { useSignal } from "@/hooks/useSignals";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft, ExternalLink, TrendingUp, Clock, Calendar,
  Share2, Copy, Shield, Check
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { categoryLabels } from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";

export default function SignalDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: signal, isLoading, error } = useSignal(id!);
  const [copied, setCopied] = useState(false);

  // Increment view count
  useEffect(() => {
    if (id) {
      supabase.rpc("increment_views" as any, { signal_id: id }).then(() => {});
    }
  }, [id]);

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
          <p className="text-muted-foreground">Article not found.</p>
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

  // Build related tags for internal linking
  const categoryUrl = `/?category=${signal.category}`;

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
            dateModified: signal.created_at,
            image: signal.image_url || undefined,
            author: {
              "@type": signal.author_name === "Editorial Team" ? "Organization" : "Person",
              name: signal.author_name || "SignalFlow",
            },
            publisher: {
              "@type": "Organization",
              name: "SignalFlow",
              logo: { "@type": "ImageObject", url: `${window.location.origin}/placeholder.svg` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": window.location.href },
            articleSection: signal.category,
            keywords: signal.tags?.join(", "),
            wordCount: (signal.content || signal.summary).split(" ").length,
          }),
        }}
      />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground animate-reveal">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={categoryUrl} className="hover:text-foreground transition-colors">
            {categoryLabels[signal.category] || signal.category}
          </Link>
          <span>/</span>
          <span className="text-foreground/60 truncate max-w-[200px]">{signal.title}</span>
        </nav>

        <article className="animate-reveal" style={{ animationDelay: "80ms" }}>
          {/* Hero image */}
          {signal.image_url && (
            <div className="mb-6 overflow-hidden rounded-xl">
              <img
                src={signal.image_url}
                alt={signal.title}
                className="w-full h-48 sm:h-72 object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <Link to={categoryUrl} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary uppercase tracking-wide hover:bg-primary/20 transition-colors">
              {categoryLabels[signal.category] || signal.category}
            </Link>
            {signal.importance >= 8 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                <TrendingUp className="h-3 w-3" />
                Breaking
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
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl" style={{ lineHeight: 1.15 }}>
            {signal.title}
          </h1>

          {/* Author & date & share */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            {signal.author_name && (
              <span>By <span className="font-medium text-foreground/80">{signal.author_name}</span></span>
            )}
            {signal.source && (
              <span>via <span className="font-medium text-foreground/70">{signal.source}</span></span>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={signal.published_at} title={fullDate}>{timeAgo}</time>
            </div>
            {signal.views_count != null && signal.views_count > 0 && (
              <span className="font-mono text-[10px]">{signal.views_count} views</span>
            )}

            <div className="ml-auto flex items-center gap-1">
              <button onClick={handleCopyLink} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
                {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={handleShareX} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
                <Share2 className="h-3 w-3" />
                Share on X
              </button>
              {signal.source_url && (
                <a href={signal.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:underline">
                  Source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 rounded-lg border border-primary/10 bg-primary/5 p-4">
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-1">Key Takeaway</p>
            <p className="text-sm leading-relaxed text-foreground/80">{signal.summary}</p>
          </div>

          {/* Full content */}
          {signal.content && (
            <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed dark:prose-invert">
              {signal.content.split("\n").map((paragraph, i) => (
                paragraph.trim() ? <p key={i} className="mb-4">{paragraph}</p> : null
              ))}
            </div>
          )}

          {/* Tags with internal links */}
          {signal.tags && signal.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              <span className="text-xs font-medium text-muted-foreground mr-2">Topics:</span>
              {signal.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground hover:bg-secondary/80 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Signal strength */}
          <div className="mt-6 flex items-center gap-3 rounded-lg bg-muted p-4">
            <span className="text-xs font-medium text-muted-foreground">Newsworthiness</span>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-border">
                <div className="h-1.5 rounded-full bg-accent transition-all duration-500" style={{ width: `${signal.importance * 10}%` }} />
              </div>
            </div>
            <span className="font-mono text-xs font-medium text-foreground">{signal.importance}/10</span>
          </div>
        </article>

        {/* Back to category */}
        <div className="mt-8">
          <Link to={categoryUrl} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            More {categoryLabels[signal.category] || signal.category} articles
          </Link>
        </div>

        <footer className="mt-16 border-t border-border pb-8 pt-6 text-center text-xs text-muted-foreground">
          <p>SignalFlow — AI-powered global news intelligence. Free and open.</p>
        </footer>
      </main>
    </div>
  );
}
