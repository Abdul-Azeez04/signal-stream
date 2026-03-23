-- Add new categories to the signal_category enum
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'politics';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'business';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'health';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'science';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'education';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'entertainment';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'sports';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'africa';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'world';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'environment';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'finance';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'startups';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'security';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'culture';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'lifestyle';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'breaking';
ALTER TYPE public.signal_category ADD VALUE IF NOT EXISTS 'investigative';