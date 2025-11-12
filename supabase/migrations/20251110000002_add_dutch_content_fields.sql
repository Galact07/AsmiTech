-- Add Dutch content fields to service_pages table
ALTER TABLE service_pages
ADD COLUMN content_nl JSONB DEFAULT '{}'::jsonb;

-- Add Dutch content fields to jobs table
ALTER TABLE jobs
ADD COLUMN content_nl JSONB DEFAULT '{}'::jsonb;

-- Add Dutch content fields to case_studies table
ALTER TABLE case_studies
ADD COLUMN content_nl JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN service_pages.content_nl IS 'Dutch translations stored as JSONB: {title, hero_headline, hero_subheadline, introduction_content, etc.}';
COMMENT ON COLUMN jobs.content_nl IS 'Dutch translations stored as JSONB: {title, description, requirements, etc.}';
COMMENT ON COLUMN case_studies.content_nl IS 'Dutch translations stored as JSONB: {title, summary, content, etc.}';

-- Create index for better JSON query performance
CREATE INDEX IF NOT EXISTS idx_service_pages_content_nl ON service_pages USING GIN (content_nl);
CREATE INDEX IF NOT EXISTS idx_jobs_content_nl ON jobs USING GIN (content_nl);
CREATE INDEX IF NOT EXISTS idx_case_studies_content_nl ON case_studies USING GIN (content_nl);

-- Add translation_status field to track translation state
ALTER TABLE service_pages
ADD COLUMN translation_status TEXT DEFAULT 'not_translated' CHECK (translation_status IN ('not_translated', 'translating', 'translated', 'failed'));

ALTER TABLE jobs
ADD COLUMN translation_status TEXT DEFAULT 'not_translated' CHECK (translation_status IN ('not_translated', 'translating', 'translated', 'failed'));

ALTER TABLE case_studies
ADD COLUMN translation_status TEXT DEFAULT 'not_translated' CHECK (translation_status IN ('not_translated', 'translating', 'translated', 'failed'));

-- Create a translation_logs table for API call tracking
CREATE TABLE IF NOT EXISTS translation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  tokens_used INTEGER,
  cost_usd NUMERIC(10, 6),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for translation logs
CREATE INDEX IF NOT EXISTS idx_translation_logs_created_at ON translation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translation_logs_table_record ON translation_logs(table_name, record_id);

-- Enable RLS on translation_logs
ALTER TABLE translation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can manage translation logs
CREATE POLICY "Authenticated users can manage translation logs"
  ON translation_logs FOR ALL
  USING (auth.role() = 'authenticated');

-- Drop the old translations table (we don't need it anymore)
DROP TABLE IF EXISTS translations CASCADE;

-- Update service_pages to mark all as not translated initially
UPDATE service_pages SET translation_status = 'not_translated';
UPDATE jobs SET translation_status = 'not_translated' WHERE TRUE;
UPDATE case_studies SET translation_status = 'not_translated' WHERE TRUE;

