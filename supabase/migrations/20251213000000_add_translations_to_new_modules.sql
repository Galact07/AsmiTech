-- Add translation columns to team_members table
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add translation columns to testimonials table
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add translation columns to industries table
ALTER TABLE public.industries 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add translation columns to technology_stack table
ALTER TABLE public.technology_stack 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add translation columns to faqs table
ALTER TABLE public.faqs 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add translation columns to client_logos table
ALTER TABLE public.client_logos 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add translation columns to company_info table
ALTER TABLE public.company_info 
ADD COLUMN IF NOT EXISTS content_nl JSONB,
ADD COLUMN IF NOT EXISTS content_de JSONB,
ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT 'pending';

-- Add indexes for faster retrieval of translated content
CREATE INDEX IF NOT EXISTS idx_team_members_translation_status ON public.team_members(translation_status);
CREATE INDEX IF NOT EXISTS idx_testimonials_translation_status ON public.testimonials(translation_status);
CREATE INDEX IF NOT EXISTS idx_industries_translation_status ON public.industries(translation_status);
CREATE INDEX IF NOT EXISTS idx_technology_stack_translation_status ON public.technology_stack(translation_status);
CREATE INDEX IF NOT EXISTS idx_faqs_translation_status ON public.faqs(translation_status);
CREATE INDEX IF NOT EXISTS idx_client_logos_translation_status ON public.client_logos(translation_status);
CREATE INDEX IF NOT EXISTS idx_company_info_translation_status ON public.company_info(translation_status);

-- Comments for documentation
COMMENT ON COLUMN public.team_members.content_nl IS 'Dutch translations for name, role, and bio';
COMMENT ON COLUMN public.team_members.content_de IS 'German translations for name, role, and bio';
COMMENT ON COLUMN public.team_members.translation_status IS 'Translation status: pending, translated, needs_update';

COMMENT ON COLUMN public.testimonials.content_nl IS 'Dutch translations for quote, author_role, and company_name';
COMMENT ON COLUMN public.testimonials.content_de IS 'German translations for quote, author_role, and company_name';
COMMENT ON COLUMN public.testimonials.translation_status IS 'Translation status: pending, translated, needs_update';

COMMENT ON COLUMN public.industries.content_nl IS 'Dutch translations for name, description, and features';
COMMENT ON COLUMN public.industries.content_de IS 'German translations for name, description, and features';
COMMENT ON COLUMN public.industries.translation_status IS 'Translation status: pending, translated, needs_update';

COMMENT ON COLUMN public.technology_stack.content_nl IS 'Dutch translations for name and description';
COMMENT ON COLUMN public.technology_stack.content_de IS 'German translations for name and description';
COMMENT ON COLUMN public.technology_stack.translation_status IS 'Translation status: pending, translated, needs_update';

COMMENT ON COLUMN public.faqs.content_nl IS 'Dutch translations for question and answer';
COMMENT ON COLUMN public.faqs.content_de IS 'German translations for question and answer';
COMMENT ON COLUMN public.faqs.translation_status IS 'Translation status: pending, translated, needs_update';

COMMENT ON COLUMN public.client_logos.content_nl IS 'Dutch translation for company_name';
COMMENT ON COLUMN public.client_logos.content_de IS 'German translation for company_name';
COMMENT ON COLUMN public.client_logos.translation_status IS 'Translation status: pending, translated, needs_update';

COMMENT ON COLUMN public.company_info.content_nl IS 'Dutch translations for company_name, addresses, and copyright_text';
COMMENT ON COLUMN public.company_info.content_de IS 'German translations for company_name, addresses, and copyright_text';
COMMENT ON COLUMN public.company_info.translation_status IS 'Translation status: pending, translated, needs_update';

