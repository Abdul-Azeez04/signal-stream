ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS moderated boolean DEFAULT null;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS image_url text DEFAULT null;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;

-- Mark existing signals as moderated
UPDATE public.signals SET moderated = true WHERE moderated IS NULL;