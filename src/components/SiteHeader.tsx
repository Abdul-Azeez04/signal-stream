import { Zap, Settings, Rss, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>SignalFlow</span>
          <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
            LIVE
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          <a
            href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="RSS Feed"
          >
            <Rss className="h-4 w-4" />
          </a>
          <Link
            to="/admin"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Admin Panel"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
