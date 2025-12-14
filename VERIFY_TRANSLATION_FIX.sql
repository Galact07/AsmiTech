-- =====================================================================
-- VERIFICATION SCRIPT FOR TRANSLATION FIX
-- =====================================================================
-- Run this after applying FIX_TRANSLATION_STATUS_PERMANENT.sql
-- to verify the fix was successful
-- =====================================================================

-- 1. Check if the trigger function exists and has the correct definition
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'update_updated_at_column';

-- 2. Check if all triggers are properly created
SELECT 
    tgname as trigger_name, 
    tgrelid::regclass as table_name,
    tgenabled as status
FROM pg_trigger 
WHERE tgname LIKE '%updated_at%' 
  AND tgrelid::regclass::text NOT LIKE 'pg_%'
ORDER BY tgrelid::regclass::text;

-- 3. Check translation columns exist on all tables
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'service_pages', 'jobs', 'team_members', 'testimonials', 
    'industries', 'technology_stack', 'faqs', 'client_logos', 'company_info'
  )
  AND (
    column_name LIKE 'content_%' 
    OR column_name LIKE 'last_translated_at_%'
    OR column_name = 'translation_status'
    OR column_name = 'updated_at'
  )
ORDER BY table_name, column_name;

-- 4. Sample check: See current translation status of service_pages
SELECT 
    id,
    title,
    translation_status,
    updated_at,
    last_translated_at_nl,
    last_translated_at_de,
    CASE 
        WHEN last_translated_at_nl IS NULL THEN 'Never translated (NL)'
        WHEN updated_at > last_translated_at_nl THEN 'Needs re-translation (NL) - content modified after translation'
        ELSE 'Up to date (NL)'
    END as nl_status,
    CASE 
        WHEN last_translated_at_de IS NULL THEN 'Never translated (DE)'
        WHEN updated_at > last_translated_at_de THEN 'Needs re-translation (DE) - content modified after translation'
        ELSE 'Up to date (DE)'
    END as de_status
FROM service_pages
ORDER BY updated_at DESC
LIMIT 5;

-- =====================================================================
-- EXPECTED RESULTS:
-- =====================================================================
-- Query 1: Should show the new trigger function with the improved logic
-- Query 2: Should list all triggers ending with _updated_at for relevant tables
-- Query 3: Should show all translation-related columns exist
-- Query 4: Should show current status of translations
-- =====================================================================
