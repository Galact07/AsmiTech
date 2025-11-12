-- Add optional mini CTA fields for service pages
ALTER TABLE service_pages
  ADD COLUMN IF NOT EXISTS mini_cta_text TEXT,
  ADD COLUMN IF NOT EXISTS mini_cta_subtext TEXT,
  ADD COLUMN IF NOT EXISTS mini_cta_link TEXT;


