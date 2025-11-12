-- Add Mini CTA columns to service_pages table
ALTER TABLE service_pages 
ADD COLUMN IF NOT EXISTS mini_cta_text TEXT,
ADD COLUMN IF NOT EXISTS mini_cta_subtext TEXT,
ADD COLUMN IF NOT EXISTS mini_cta_link TEXT DEFAULT '/contact';

-- Add comment for documentation
COMMENT ON COLUMN service_pages.mini_cta_text IS 'Mini CTA heading text displayed after benefits section';
COMMENT ON COLUMN service_pages.mini_cta_subtext IS 'Supporting text for mini CTA';
COMMENT ON COLUMN service_pages.mini_cta_link IS 'Link URL for mini CTA button';

