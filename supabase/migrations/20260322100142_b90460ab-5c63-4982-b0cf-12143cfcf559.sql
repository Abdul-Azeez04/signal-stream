-- Categories for signals
CREATE TYPE public.signal_category AS ENUM ('ai', 'web3', 'defi', 'nft', 'dev-tools', 'opportunities', 'news', 'research');

-- Signals table (the main content)
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  category signal_category NOT NULL DEFAULT 'news',
  source TEXT,
  source_url TEXT,
  author_name TEXT,
  author_avatar TEXT,
  importance INTEGER NOT NULL DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no write from client)
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Everyone can read signals (it's a public blog)
CREATE POLICY "Signals are publicly readable"
  ON public.signals FOR SELECT
  USING (true);

-- Index for fast filtering
CREATE INDEX idx_signals_category ON public.signals (category);
CREATE INDEX idx_signals_published_at ON public.signals (published_at DESC);
CREATE INDEX idx_signals_importance ON public.signals (importance DESC);
CREATE INDEX idx_signals_tags ON public.signals USING GIN (tags);