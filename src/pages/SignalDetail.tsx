import { useParams, Link } from "react-router-dom";
import { useSignal } from "@/hooks/useSignals";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft, ExternalLink, Clock, Calendar,
  Share2, Copy, Shield, Check, Facebook, Twitter
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
      supabase.from("signals").update({ views_count: ((signal?.views_count || 0) + 1) } as any).eq("id", id).then(() => {});
    }
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`${signal?.title} — The Radar`);
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
          <p className="font-body text-muted-foreground">Article not found.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm font-body text-primary hover:underline">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(signal.published_at), { addSuffix: true });
  const fullDate = format(new Date(signal.published_at), "EEEE, MMMM d, yyyy 'at' h:mm a");
  const readingTime = Math.max(1, Math.ceil((signal.content || signal.summary).split(" ").length / 200));
  const categoryUrl = `/?category=${signal.category}`;

  // Parse content into sections
  const contentSections = parseContent(signal.content || "", signal.summary);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* JSON-LD */}
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
            author: { "@type": "Organization", name: "The Radar" },
            publisher: {
              "@type": "Organization",
              name: "The Radar",
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
        <nav className="mb-6 flex items-center gap-2 text-[11px] font-body text-muted-foreground animate-reveal">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={categoryUrl} className="hover:text-foreground transition-colors uppercase tracking-wide">
            {categoryLabels[signal.category] || signal.category}
          </Link>
        </nav>

        <article className="animate-reveal" style={{ animationDelay: "80ms" }}>
          {/* Category & label */}
          <div className="mb-4 flex items-center gap-2">
            <Link to={categoryUrl} className="text-[11px] font-body font-bold uppercase tracking-wider text-primary hover:underline">
              {categoryLabels[signal.category] || signal.category}
            </Link>
            {signal.importance >= 8 && (
              <span className="text-[11px] font-body font-bold uppercase tracking-wider text-destructive">
                Breaking News
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="mb-2 font-headline text-3xl tracking-tight text-foreground sm:text-4xl" style={{ lineHeight: 1.1 }}>
            {signal.title}
          </h1>

          {/* Subheadline / summary */}
          <p className="mb-6 text-lg font-body leading-relaxed text-muted-foreground" style={{ lineHeight: 1.5 }}>
            {signal.summary}
          </p>

          {/* Byline */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-y border-border py-4 text-[12px] font-body text-muted-foreground">
            <div>
              <span className="text-foreground font-semibold">Radar Desk</span>
              {signal.source && (
                <span className="ml-1">— via {signal.source}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={signal.published_at} title={fullDate}>
                Published {fullDate}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
            {signal.moderated && (
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          {/* Hero image */}
          {signal.image_url && (
            <figure className="mb-8">
              <div className="overflow-hidden rounded">
                <img
                  src={signal.image_url}
                  alt={signal.title}
                  className="w-full h-auto max-h-96 object-cover"
                  loading="eager"
                />
              </div>
              <figcaption className="mt-2 text-[11px] font-body text-muted-foreground text-center">
                {signal.source ? `Source: ${signal.source}` : "Illustrative image"}
              </figcaption>
            </figure>
          )}

          {/* Article body with sections */}
          <div className="prose-radar">
            {contentSections.map((section, i) => (
              <div key={i} className="mb-6">
                {section.heading && (
                  <h2 className="mb-2 font-headline text-xl text-foreground border-l-2 border-primary pl-3">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, j) => (
                  p.trim() ? (
                    <p key={j} className="mb-3 text-[15px] font-body leading-[1.8] text-foreground/85">
                      {p}
                    </p>
                  ) : null
                ))}
              </div>
            ))}
          </div>

          {/* Source attribution */}
          {signal.source_url && (
            <div className="mt-6 rounded border border-border bg-muted/30 p-4">
              <p className="text-[11px] font-body font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
              <a href={signal.source_url} target="_blank" rel="noopener noreferrer" className="text-sm font-body text-primary hover:underline flex items-center gap-1">
                {signal.source || "Original article"} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Tags */}
          {signal.tags && signal.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {signal.tags.map((tag) => (
                <span key={tag} className="rounded border border-border px-2.5 py-1 text-[11px] font-body text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share buttons */}
          <div className="mt-8 flex items-center gap-2 border-t border-border pt-6">
            <span className="text-[11px] font-body font-semibold uppercase tracking-wider text-muted-foreground mr-2">Share</span>
            <button onClick={handleShareX} className="rounded border border-border px-3 py-1.5 text-xs font-body text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              𝕏 Post
            </button>
            <button onClick={handleCopyLink} className="rounded border border-border px-3 py-1.5 text-xs font-body text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              {copied ? "✓ Copied" : "Copy link"}
            </button>
          </div>

          {/* Importance bar */}
          <div className="mt-6 flex items-center gap-3 rounded bg-muted/30 p-3">
            <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-muted-foreground">Newsworthiness</span>
            <div className="flex-1">
              <div className="h-1 rounded-full bg-border">
                <div className="h-1 rounded-full bg-primary transition-all duration-500" style={{ width: `${signal.importance * 10}%` }} />
              </div>
            </div>
            <span className="font-mono text-xs font-medium text-foreground">{signal.importance}/10</span>
          </div>
        </article>

        {/* Back link */}
        <div className="mt-8">
          <Link to={categoryUrl} className="inline-flex items-center gap-1.5 text-sm font-body text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            More {categoryLabels[signal.category] || signal.category}
          </Link>
        </div>

        <footer className="mt-16 border-t border-border pb-8 pt-6 text-center">
          <p className="font-headline text-sm text-foreground">THE RADAR</p>
          <p className="text-[10px] font-body text-muted-foreground mt-1">Global News Intelligence</p>
        </footer>
      </main>
    </div>
  );
}

// Parse article content into structured sections
function parseContent(content: string, summary: string) {
  if (!content || content.trim().length === 0) {
    return [{ heading: null, paragraphs: [summary] }];
  }

  const paragraphs = content.split("\n").filter((p) => p.trim());
  const sections: { heading: string | null; paragraphs: string[] }[] = [];

  // If short, just return as single section
  if (paragraphs.length <= 3) {
    return [{ heading: null, paragraphs }];
  }

  // Split into structured sections
  const third = Math.ceil(paragraphs.length / 3);
  sections.push({
    heading: "The Report",
    paragraphs: paragraphs.slice(0, third),
  });
  sections.push({
    heading: "Context",
    paragraphs: paragraphs.slice(third, third * 2),
  });
  sections.push({
    heading: "Why This Matters",
    paragraphs: paragraphs.slice(third * 2),
  });

  return sections;
}