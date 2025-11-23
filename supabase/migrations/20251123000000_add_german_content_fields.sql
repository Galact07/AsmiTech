-- Add German content fields to service_pages table
ALTER TABLE service_pages
ADD COLUMN IF NOT EXISTS content_de JSONB DEFAULT '{}'::jsonb;

-- Add German content fields to jobs table
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS content_de JSONB DEFAULT '{}'::jsonb;

-- Add German content fields to case_studies table
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS content_de JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN service_pages.content_de IS 'German translations stored as JSONB: {title, hero_headline, hero_subheadline, introduction_content, etc.}';
COMMENT ON COLUMN jobs.content_de IS 'German translations stored as JSONB: {title, description, requirements, etc.}';
COMMENT ON COLUMN case_studies.content_de IS 'German translations stored as JSONB: {title, summary, content, etc.}';

-- Create index for better JSON query performance
CREATE INDEX IF NOT EXISTS idx_service_pages_content_de ON service_pages USING GIN (content_de);
CREATE INDEX IF NOT EXISTS idx_jobs_content_de ON jobs USING GIN (content_de);
CREATE INDEX IF NOT EXISTS idx_case_studies_content_de ON case_studies USING GIN (content_de);
