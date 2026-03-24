import { Moon, Sun, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NAV_CATEGORIES = [
  { label: "Breaking", path: "/?category=breaking" },
  { label: "World", path: "/?category=world" },
  { label: "Politics", path: "/?category=politics" },
  { label: "Business", path: "/?category=business" },
  { label: "Technology", path: "/?category=technology" },
  { label: "AI", path: "/?category=ai" },
  { label: "Finance", path: "/?category=finance" },
  { label: "Sports", path: "/?category=sports" },
  { label: "Health", path: "/?category=health" },
  { label: "Science", path: "/?category=science" },
  { label: "Entertainment", path: "/?category=entertainment" },
  { label: "Africa", path: "/?category=africa" },
];

export function SiteHeader() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
    } else if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">{dateStr}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-destructive animate-live-pulse" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
              <span className="font-medium text-destructive uppercase tracking-wider">Live</span>
            </span>
            <span className="hidden sm:inline">Updated every minute</span>
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded p-1 transition-colors hover:bg-secondary"
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <button
            className="rounded p-1.5 lg:hidden hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex flex-col items-center mx-auto sm:mx-0">
            <span className="font-headline text-2xl tracking-tight text-foreground sm:text-3xl">
              THE RADAR
            </span>
            <span className="hidden text-[9px] font-body font-medium uppercase tracking-[0.25em] text-muted-foreground sm:block">
              Global News Intelligence
            </span>
          </Link>

          <Link
            to="/admin"
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground text-xs font-body font-medium"
          >
            Admin
          </Link>
        </div>
      </div>

      {/* Category nav - Desktop */}
      <nav className="hidden border-t border-border lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-10 items-center gap-0.5 overflow-x-auto">
            <Link
              to="/"
              className="shrink-0 rounded px-3 py-1.5 text-[12px] font-body font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
            >
              Home
            </Link>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.path}
                className="shrink-0 rounded px-3 py-1.5 text-[12px] font-body font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card lg:hidden animate-fade-in-up">
          <div className="grid grid-cols-3 gap-1 p-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-center text-xs font-body font-semibold uppercase tracking-wide text-foreground hover:bg-secondary"
            >
              Home
            </Link>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-center text-xs font-body font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}