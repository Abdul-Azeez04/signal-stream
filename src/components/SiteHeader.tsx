import { Zap, Settings, Rss, Moon, Sun, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
    } else if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-12 max-w-7xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm">SignalFlow</span>
          <span className="ml-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-semibold text-destructive">
            LIVE
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5">
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
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
