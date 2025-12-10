-- Create storage bucket for team member images
-- Run this in Supabase SQL Editor if the bucket doesn't exist

INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES 
  ('team-member-images', 'team-member-images', true, 5242880) -- 5MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage policies for team member images
-- Anyone can view team member images
CREATE POLICY IF NOT EXISTS "Anyone can view team member images" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-member-images');

-- Admins can upload team member images
CREATE POLICY IF NOT EXISTS "Admins can upload team member images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'team-member-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update team member images
CREATE POLICY IF NOT EXISTS "Admins can update team member images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'team-member-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete team member images
CREATE POLICY IF NOT EXISTS "Admins can delete team member images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'team-member-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

