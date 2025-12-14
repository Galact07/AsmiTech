-- Remove translation functionality from client_logos table
-- Client logos are just images and don't require translation
-- This migration removes translation-related columns and triggers

-- Drop translation-related columns from client_logos
ALTER TABLE public.client_logos 
  DROP COLUMN IF EXISTS content_nl,
  DROP COLUMN IF EXISTS content_de,
  DROP COLUMN IF EXISTS translation_status,
  DROP COLUMN IF EXISTS last_translated_at_nl,
  DROP COLUMN IF EXISTS last_translated_at_de;

-- Drop translation status index
DROP INDEX IF EXISTS idx_client_logos_translation_status;

-- Note: The client_logos table and ClientLogosAdmin management page remain functional
-- Only translation functionality has been removed as logos don't need translation
