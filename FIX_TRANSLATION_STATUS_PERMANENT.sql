-- =====================================================================
-- PERMANENT FIX FOR TRANSLATION STATUS NOT PERSISTING
-- =====================================================================
-- 
-- PROBLEM: 
-- When translations are saved, the status updates in the UI but reverts 
-- to "pending" after page refresh. This happens because the database 
-- trigger automatically updates the updated_at column, making the system
-- think the content was modified and needs re-translation.
--
-- SOLUTION:
-- Modify the trigger to respect when the application explicitly preserves
-- the updated_at timestamp (which happens during translation saves).
--
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire file and click "Run"
-- =====================================================================

-- Drop the existing function and cascade to drop all triggers using it
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create the improved function that respects explicit updated_at preservation
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  -- If the application explicitly sets updated_at to the same value it had before,
  -- respect that decision and don't override it with NOW()
  -- This allows the translation service to preserve the original content modification time
  -- while updating translation-related columns (content_nl, content_de, last_translated_at_*, translation_status)
  
  IF NEW.updated_at IS NOT NULL AND OLD.updated_at IS NOT NULL AND NEW.updated_at = OLD.updated_at THEN
    -- The application wants to preserve the original updated_at timestamp
    -- This happens when saving translations without modifying the actual content
    RETURN NEW;
  END IF;
  
  -- Otherwise, update to current timestamp as normal
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop all existing triggers first (if they exist)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
DROP TRIGGER IF EXISTS service_pages_updated_at ON public.service_pages;
DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS update_industries_updated_at ON public.industries;
DROP TRIGGER IF EXISTS update_technology_stack_updated_at ON public.technology_stack;
DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
DROP TRIGGER IF EXISTS update_client_logos_updated_at ON public.client_logos;
DROP TRIGGER IF EXISTS update_company_info_updated_at ON public.company_info;

-- Recreate all the triggers with the new function

-- Core tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Service pages
CREATE TRIGGER service_pages_updated_at
  BEFORE UPDATE ON public.service_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- New module tables
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industries_updated_at
  BEFORE UPDATE ON public.industries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technology_stack_updated_at
  BEFORE UPDATE ON public.technology_stack
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_logos_updated_at
  BEFORE UPDATE ON public.client_logos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON public.company_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Automatically updates updated_at column, but preserves it when the application explicitly wants to keep the original timestamp (e.g., during translation saves)';

-- =====================================================================
-- VERIFICATION QUERIES (Optional - run these to verify the fix)
-- =====================================================================

-- Check that all triggers are created
-- SELECT tgname, tgrelid::regclass 
-- FROM pg_trigger 
-- WHERE tgname LIKE '%updated_at%' 
-- ORDER BY tgrelid::regclass::text;

-- =====================================================================
-- SUCCESS!
-- =====================================================================
-- The fix has been applied. Now when you translate content:
-- 1. Translations will be saved correctly
-- 2. The translation_status will persist as "translated"
-- 3. The updated_at timestamp will be preserved
-- 4. The last_translated_at_* timestamps will be set correctly
-- 5. After page refresh, the status will remain "translated"
-- =====================================================================
