-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
-- Anyone can view active team members
CREATE POLICY "Anyone can view active team members" ON public.team_members
  FOR SELECT USING (is_active = true);

-- Admins can view all team members
CREATE POLICY "Admins can view all team members" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage team members
CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for team member images
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES 
  ('team-member-images', 'team-member-images', true, 5242880); -- 5MB limit

-- Storage policies for team member images
-- Anyone can view team member images
CREATE POLICY "Anyone can view team member images" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-member-images');

-- Admins can upload team member images
CREATE POLICY "Admins can upload team member images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'team-member-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update team member images
CREATE POLICY "Admins can update team member images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'team-member-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete team member images
CREATE POLICY "Admins can delete team member images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'team-member-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

