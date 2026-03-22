import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Constants } from "@/integrations/supabase/types";
import type { Tables } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Signal = Tables<"signals">;
type SignalInsert = Omit<Signal, "id" | "created_at">;

const categories = Constants.public.Enums.signal_category;

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

const emptySignal: SignalInsert = {
  title: "",
  summary: "",
  content: "",
  category: "news",
  source: "",
  source_url: "",
  author_name: "",
  author_avatar: null,
  importance: 5,
  tags: [],
  published_at: new Date().toISOString(),
  image_url: null,
  moderated: null,
  views_count: 0,
};

function SignalForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: SignalInsert;
  onSave: (data: SignalInsert) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<SignalInsert>(initial);
  const [tagsInput, setTagsInput] = useState(initial.tags?.join(", ") || "");

  const update = <K extends keyof SignalInsert>(key: K, value: SignalInsert[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      toast.error("Title and summary are required");
      return;
    }
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...form, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Title *</label>
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          placeholder="Signal title..."
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Summary *</label>
        <textarea
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          rows={2}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
          placeholder="Brief summary..."
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Content</label>
        <textarea
          value={form.content || ""}
          onChange={(e) => update("content", e.target.value)}
          rows={5}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-y"
          placeholder="Full article content..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as any)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{categoryLabels[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Importance (1-10)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={form.importance}
            onChange={(e) => update("importance", Math.min(10, Math.max(1, Number(e.target.value))))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Source</label>
          <input
            value={form.source || ""}
            onChange={(e) => update("source", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            placeholder="Twitter, Discord..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Author</label>
          <input
            value={form.author_name || ""}
            onChange={(e) => update("author_name", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            placeholder="Author name..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Source URL</label>
        <input
          value={form.source_url || ""}
          onChange={(e) => update("source_url", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          placeholder="ai, llm, funding..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 active:scale-[0.97]"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminPanel() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const fetchSignals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error && data) setSignals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleCreate = async (data: SignalInsert) => {
    setSaving(true);
    const { error } = await supabase.from("signals").insert(data as any);
    setSaving(false);
    if (error) {
      toast.error("Failed to create signal: " + error.message);
      return;
    }
    toast.success("Signal created");
    setShowForm(false);
    fetchSignals();
    queryClient.invalidateQueries({ queryKey: ["signals"] });
  };

  const handleUpdate = async (data: SignalInsert) => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase.from("signals").update(data as any).eq("id", editingId);
    setSaving(false);
    if (error) {
      toast.error("Failed to update signal: " + error.message);
      return;
    }
    toast.success("Signal updated");
    setEditingId(null);
    fetchSignals();
    queryClient.invalidateQueries({ queryKey: ["signals"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this signal permanently?")) return;
    const { error } = await supabase.from("signals").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
      return;
    }
    toast.success("Signal deleted");
    fetchSignals();
    queryClient.invalidateQueries({ queryKey: ["signals"] });
  };

  const editingSignal = editingId ? signals.find((s) => s.id === editingId) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3 animate-reveal">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <span className="ml-auto text-xs text-muted-foreground">{signals.length} signals</span>
        </div>

        {/* Create button or form */}
        {showForm ? (
          <div className="mb-6 animate-reveal">
            <SignalForm
              initial={emptySignal}
              onSave={handleCreate}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          </div>
        ) : editingId && editingSignal ? (
          <div className="mb-6 animate-reveal">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Editing signal</p>
            <SignalForm
              initial={{
                title: editingSignal.title,
                summary: editingSignal.summary,
                content: editingSignal.content,
                category: editingSignal.category,
                source: editingSignal.source,
                source_url: editingSignal.source_url,
                author_name: editingSignal.author_name,
                author_avatar: editingSignal.author_avatar,
                importance: editingSignal.importance,
                tags: editingSignal.tags,
                published_at: editingSignal.published_at,
              }}
              onSave={handleUpdate}
              onCancel={() => setEditingId(null)}
              saving={saving}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97] animate-reveal"
          >
            <Plus className="h-4 w-4" />
            New Signal
          </button>
        )}

        {/* Signals list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2">
            {signals.map((signal, i) => (
              <div
                key={signal.id}
                className="animate-reveal flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground uppercase">
                      {signal.category}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{signal.importance}/10</span>
                  </div>
                  <h3 className="text-sm font-medium text-card-foreground truncate">{signal.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{signal.summary}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(signal.id);
                    }}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(signal.id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-16 border-t border-border pb-8 pt-6 text-center text-xs text-muted-foreground">
          <p>SignalFlow Admin — Manage your signals</p>
        </footer>
      </main>
    </div>
  );
}
