-- Fix for Support & Managed Services
-- Issue: Length mismatch: tech_stack (EN: 3, NL: 4)
-- Action: Keep only the first 3 items in the Dutch tech_stack array
UPDATE service_pages
SET content_nl = jsonb_set(
    content_nl,
    '{tech_stack}',
    (
        SELECT jsonb_agg(elem)
        FROM (
            SELECT elem
            FROM jsonb_array_elements(content_nl->'tech_stack') WITH ORDINALITY AS t(elem, ord)
            WHERE ord <= 3
        ) sub
    )
)
WHERE slug = 'support-and-managed-services';

-- Fix for Training & Change Management
-- Issue: Length mismatch: tech_stack (EN: 2, NL: 3)
-- Action: Keep only the first 2 items in the Dutch tech_stack array
UPDATE service_pages
SET content_nl = jsonb_set(
    content_nl,
    '{tech_stack}',
    (
        SELECT jsonb_agg(elem)
        FROM (
            SELECT elem
            FROM jsonb_array_elements(content_nl->'tech_stack') WITH ORDINALITY AS t(elem, ord)
            WHERE ord <= 2
        ) sub
    )
)
WHERE slug = 'training-and-change-management';
