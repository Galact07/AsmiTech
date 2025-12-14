-- Migration: Add delta translation timestamps for granular translation tracking
-- This enables the system to only translate content modified since the last translation

-- Add timestamp columns to service_pages
ALTER TABLE public.service_pages 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to jobs
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to team_members
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to testimonials
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to industries
ALTER TABLE public.industries 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to technology_stack
ALTER TABLE public.technology_stack 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to faqs
ALTER TABLE public.faqs 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to client_logos
ALTER TABLE public.client_logos 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add timestamp columns to company_info
ALTER TABLE public.company_info 
ADD COLUMN IF NOT EXISTS last_translated_at_nl TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_translated_at_de TIMESTAMPTZ;

-- Add indexes for faster delta queries (comparing updated_at with last_translated_at)
CREATE INDEX IF NOT EXISTS idx_service_pages_updated_at ON public.service_pages(updated_at);
CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON public.jobs(updated_at);
CREATE INDEX IF NOT EXISTS idx_team_members_updated_at ON public.team_members(updated_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_updated_at ON public.testimonials(updated_at);
CREATE INDEX IF NOT EXISTS idx_industries_updated_at ON public.industries(updated_at);
CREATE INDEX IF NOT EXISTS idx_technology_stack_updated_at ON public.technology_stack(updated_at);
CREATE INDEX IF NOT EXISTS idx_faqs_updated_at ON public.faqs(updated_at);
CREATE INDEX IF NOT EXISTS idx_client_logos_updated_at ON public.client_logos(updated_at);
CREATE INDEX IF NOT EXISTS idx_company_info_updated_at ON public.company_info(updated_at);

-- Comments for documentation
COMMENT ON COLUMN public.service_pages.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.service_pages.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.jobs.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.jobs.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.team_members.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.team_members.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.testimonials.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.testimonials.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.industries.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.industries.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.technology_stack.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.technology_stack.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.faqs.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.faqs.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.client_logos.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.client_logos.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';

COMMENT ON COLUMN public.company_info.last_translated_at_nl IS 'Timestamp of last Dutch translation for delta tracking';
COMMENT ON COLUMN public.company_info.last_translated_at_de IS 'Timestamp of last German translation for delta tracking';
