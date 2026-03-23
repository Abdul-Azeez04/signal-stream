import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryLabels, ALL_CATEGORIES } from "@/components/CategoryFilter";
import type { Tables } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, ArrowLeft, Shield,
  BarChart3, Activity, Eye, Newspaper, Zap, Settings2,
  CheckCircle2, XCircle, RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Signal = Tables<"signals">;
type SignalInsert = Omit<Signal, "id" | "created_at">;

const emptySignal: SignalInsert = {
  title: "", summary: "", content: "", category: "news",
  source: "", source_url: "", author_name: "", author_avatar: null,
  importance: 5, tags: [], published_at: new Date().toISOString(),
  image_url: null, moderated: null, views_count: 0,
};

type AdminTab = "articles" | "analytics" | "ai-control";

function SignalForm({ initial, onSave, onCancel, saving }: {
  initial: SignalInsert; onSave: (d: SignalInsert) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<SignalInsert>(initial);
  const [tagsInput, setTagsInput] = useState(initial.tags?.join(", ") || "");
  const update = <K extends keyof SignalInsert>(k: K, v: SignalInsert[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) { toast.error("Title and summary required"); return; }
    onSave({ ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Title *</label>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Summary *</label>
        <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} rows={2} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Content</label>
        <textarea value={form.content || ""} onChange={(e) => update("content", e.target.value)} rows={5} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-y" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value as any)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabels[c] || c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Importance (1-10)</label>
          <input type="number" min={1} max={10} value={form.importance} onChange={(e) => update("importance", Math.min(10, Math.max(1, Number(e.target.value))))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Source</label>
          <input value={form.source || ""} onChange={(e) => update("source", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Author</label>
          <input value={form.author_name || ""} onChange={(e) => update("author_name", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Image URL</label>
        <input value={form.image_url || ""} onChange={(e) => update("image_url", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="https://images.unsplash.com/..." />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
        <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 active:scale-[0.97]">
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>
    </form>
  );
}

function AnalyticsTab() {
  const [stats, setStats] = useState<{
    total: number; today: number; moderated: number; unmoderated: number;
    byCategory: Record<string, number>; avgImportance: number; totalViews: number;
    topArticles: Signal[];
  } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: all } = await supabase.from("signals").select("*").order("published_at", { ascending: false });
      if (!all) return;

      const today = new Date().toISOString().split("T")[0];
      const todaySignals = all.filter((s) => s.published_at.startsWith(today));
      const byCategory: Record<string, number> = {};
      all.forEach((s) => { byCategory[s.category] = (byCategory[s.category] || 0) + 1; });
      const avgImportance = all.length ? all.reduce((a, s) => a + s.importance, 0) / all.length : 0;
      const totalViews = all.reduce((a, s) => a + (s.views_count || 0), 0);
      const topArticles = [...all].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);

      setStats({
        total: all.length,
        today: todaySignals.length,
        moderated: all.filter((s) => s.moderated).length,
        unmoderated: all.filter((s) => !s.moderated).length,
        byCategory,
        avgImportance,
        totalViews,
        topArticles,
      });
    }
    load();
  }, []);

  if (!stats) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Articles", value: stats.total, icon: Newspaper },
          { label: "Published Today", value: stats.today, icon: Activity },
          { label: "Total Views", value: stats.totalViews, icon: Eye },
          { label: "Avg Importance", value: stats.avgImportance.toFixed(1), icon: Zap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Moderation status */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Moderation Status</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">{stats.moderated} verified</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-muted-foreground">{stats.unmoderated} pending</span>
          </div>
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${stats.total ? (stats.moderated / stats.total) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Articles by Category</h3>
        <div className="space-y-2">
          {Object.entries(stats.byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-24 text-xs text-muted-foreground truncate">{categoryLabels[cat] || cat}</span>
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }} />
                </div>
                <span className="font-mono text-xs text-foreground/70 w-8 text-right">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Top articles */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Top Articles by Views</h3>
        <div className="space-y-2">
          {stats.topArticles.map((a, i) => (
            <div key={a.id} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-muted-foreground/50 w-5">{i + 1}</span>
              <span className="flex-1 truncate text-foreground/80">{a.title}</span>
              <span className="font-mono text-muted-foreground">{a.views_count || 0} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIControlTab() {
  const [generating, setGenerating] = useState(false);
  const [moderating, setModerating] = useState(false);

  const triggerGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-signals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const data = await res.json();
      if (data.success) toast.success(`Generated ${data.generated} articles`);
      else toast.error(data.error || "Generation failed");
    } catch { toast.error("Failed to trigger generation"); }
    setGenerating(false);
  };

  const triggerModerate = async () => {
    setModerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moderate-signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const data = await res.json();
      if (data.moderated !== undefined) toast.success(`Moderated ${data.moderated} articles`);
      else toast.error("Moderation failed");
    } catch { toast.error("Failed to trigger moderation"); }
    setModerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-1">AI Content Engine</h3>
        <p className="text-xs text-muted-foreground mb-4">The AI engine auto-generates 3 articles per minute across 25 categories. Use these controls to trigger manually.</p>
        <div className="flex gap-3">
          <button onClick={triggerGenerate} disabled={generating} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Generate Now
          </button>
          <button onClick={triggerModerate} disabled={moderating} className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50">
            {moderating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Run Moderation
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-1">Automation Status</h3>
        <div className="space-y-3 mt-3">
          {[
            { label: "Signal Generation", schedule: "Every minute", status: "active" },
            { label: "AI Moderation", schedule: "Every 5 minutes", status: "active" },
            { label: "RSS Feed", schedule: "On request", status: "active" },
            { label: "Sitemap", schedule: "On request", status: "active" },
          ].map((job) => (
            <div key={job.label} className="flex items-center gap-3 text-sm">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="flex-1 text-foreground/80">{job.label}</span>
              <span className="text-xs text-muted-foreground">{job.schedule}</span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent uppercase">{job.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-1">Content Pipeline</h3>
        <p className="text-xs text-muted-foreground mb-3">How the AI pipeline processes each article:</p>
        <div className="space-y-2">
          {["Source Selection → Random category & topic chosen", "AI Journalism → Professional article generated via Lovable AI", "Quality Check → AI moderation verifies content quality", "Publishing → Auto-published to live feed with real-time sync", "SEO → JSON-LD, meta tags, and sitemap auto-updated"].map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5 h-4 w-4 rounded-full border border-border flex items-center justify-center shrink-0 text-[9px] font-bold text-foreground/50">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("articles");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  const fetchSignals = async () => {
    setLoading(true);
    let query = supabase.from("signals").select("*").order("published_at", { ascending: false }).limit(200);
    if (filterCategory !== "all") query = query.eq("category", filterCategory as any);
    const { data, error } = await query;
    if (!error && data) setSignals(data);
    setLoading(false);
  };

  useEffect(() => { fetchSignals(); }, [filterCategory]);

  const handleCreate = async (data: SignalInsert) => {
    setSaving(true);
    const { error } = await supabase.from("signals").insert(data as any);
    setSaving(false);
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Article created");
    setShowForm(false);
    fetchSignals();
    queryClient.invalidateQueries({ queryKey: ["signals"] });
  };

  const handleUpdate = async (data: SignalInsert) => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase.from("signals").update(data as any).eq("id", editingId);
    setSaving(false);
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Article updated");
    setEditingId(null);
    fetchSignals();
    queryClient.invalidateQueries({ queryKey: ["signals"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article permanently?")) return;
    const { error } = await supabase.from("signals").delete().eq("id", id);
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Deleted");
    fetchSignals();
    queryClient.invalidateQueries({ queryKey: ["signals"] });
  };

  const handleApprove = async (id: string) => {
    await supabase.from("signals").update({ moderated: true } as any).eq("id", id);
    toast.success("Approved");
    fetchSignals();
  };

  const editingSignal = editingId ? signals.find((s) => s.id === editingId) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3 animate-reveal">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
          <Settings2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
          {([
            { key: "articles", label: "Articles", icon: Newspaper },
            { key: "analytics", label: "Analytics", icon: BarChart3 },
            { key: "ai-control", label: "AI Control", icon: Zap },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "analytics" && <AnalyticsTab />}
        {tab === "ai-control" && <AIControlTab />}
        {tab === "articles" && (
          <>
            {/* Filter + actions */}
            <div className="mb-4 flex items-center gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="all">All Categories</option>
                {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabels[c] || c}</option>)}
              </select>
              <span className="text-xs text-muted-foreground">{signals.length} articles</span>
              <button onClick={fetchSignals} className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {showForm ? (
              <div className="mb-6 animate-reveal">
                <SignalForm initial={emptySignal} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
              </div>
            ) : editingId && editingSignal ? (
              <div className="mb-6 animate-reveal">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Editing article</p>
                <SignalForm
                  initial={{
                    title: editingSignal.title, summary: editingSignal.summary, content: editingSignal.content,
                    category: editingSignal.category, source: editingSignal.source, source_url: editingSignal.source_url,
                    author_name: editingSignal.author_name, author_avatar: editingSignal.author_avatar,
                    importance: editingSignal.importance, tags: editingSignal.tags,
                    published_at: editingSignal.published_at, image_url: editingSignal.image_url,
                    moderated: editingSignal.moderated, views_count: editingSignal.views_count,
                  }}
                  onSave={handleUpdate}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <button onClick={() => setShowForm(true)} className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97]">
                <Plus className="h-4 w-4" /> New Article
              </button>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-1.5">
                {signals.map((signal) => (
                  <div key={signal.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:shadow-sm transition-shadow">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-secondary-foreground uppercase">{signal.category}</span>
                        <span className="font-mono text-[9px] text-muted-foreground">{signal.importance}/10</span>
                        {signal.moderated ? (
                          <CheckCircle2 className="h-3 w-3 text-accent" />
                        ) : (
                          <XCircle className="h-3 w-3 text-destructive/50" />
                        )}
                        <span className="font-mono text-[9px] text-muted-foreground">{signal.views_count || 0} views</span>
                      </div>
                      <h3 className="text-xs font-medium text-card-foreground truncate">{signal.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      {!signal.moderated && (
                        <button onClick={() => handleApprove(signal.id)} className="rounded-md p-1.5 text-accent hover:bg-accent/10 active:scale-95" title="Approve">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => { setShowForm(false); setEditingId(signal.id); }} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95" title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(signal.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive active:scale-95" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
