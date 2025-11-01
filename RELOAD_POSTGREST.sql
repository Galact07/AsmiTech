-- ============================================================================
-- RELOAD POSTGREST SCHEMA CACHE
-- This forces PostgREST to reload the schema and recognize new permissions
-- ============================================================================

-- Method 1: Send reload signal to PostgREST
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Method 2: Verify and re-grant (force refresh)
DO $$
BEGIN
  -- Revoke and re-grant to force cache refresh
  REVOKE ALL ON public.inquiries FROM anon;
  GRANT INSERT ON public.inquiries TO anon;
  
  RAISE NOTICE '✅ Permissions refreshed';
  RAISE NOTICE '✅ PostgREST reload signal sent';
  RAISE NOTICE '🔄 Wait 5-10 seconds for PostgREST to reload';
END $$;

-- Verify final state
SELECT 
  grantee, 
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee = 'anon';
