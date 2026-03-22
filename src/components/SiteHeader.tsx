import { Zap, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <Zap className="h-5 w-5 text-primary" />
          <span>SignalFlow</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs text-muted-foreground">Live</span>
          <Link
            to="/admin"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Admin Panel"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
