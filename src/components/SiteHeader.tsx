import { Zap } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
        <a href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <Zap className="h-5 w-5 text-primary" />
          <span>SignalFlow</span>
        </a>
        <nav className="ml-auto flex items-center gap-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs text-muted-foreground">Live</span>
        </nav>
      </div>
    </header>
  );
}
