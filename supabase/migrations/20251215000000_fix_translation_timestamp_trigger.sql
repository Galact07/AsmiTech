-- Fix the update_updated_at_column function to NOT update updated_at when translation service explicitly preserves it
-- This prevents the translation status from going back to "pending" after a successful translation

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  -- If the application explicitly sets updated_at to the same value it had before,
  -- respect that decision and don't override it with NOW()
  -- This allows the translation service to preserve the original content modification time
  -- while updating translation-related columns
  
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

CREATE TRIGGER service_pages_updated_at
  BEFORE UPDATE ON public.service_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Automatically updates updated_at column, but preserves it when only translation columns are modified';
