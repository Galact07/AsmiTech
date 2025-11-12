-- Create service_pages table for dynamic service management
CREATE TABLE IF NOT EXISTS service_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Hero Section
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_cta_text TEXT DEFAULT 'Get Started',
  hero_image_url TEXT,
  
  -- Introduction / Why This Service
  introduction_title TEXT DEFAULT 'Why This Service',
  introduction_content TEXT,
  
  -- Key Differentiator
  differentiator_title TEXT DEFAULT 'What Makes It Unique',
  differentiator_content TEXT,
  differentiator_video_url TEXT,
  
  -- Core Offerings (stored as JSON array)
  core_offerings JSONB DEFAULT '[]'::jsonb,
  
  -- Benefits (stored as JSON array)
  benefits JSONB DEFAULT '[]'::jsonb,
  
  -- Process/Roadmap (stored as JSON array)
  process_steps JSONB DEFAULT '[]'::jsonb,
  
  -- Case Studies (stored as JSON array)
  case_studies JSONB DEFAULT '[]'::jsonb,
  
  -- Tools/Technology Stack (stored as JSON array)
  tech_stack JSONB DEFAULT '[]'::jsonb,
  
  -- Why Choose Us (stored as JSON array)
  why_choose_us JSONB DEFAULT '[]'::jsonb,
  
  -- Consultation Section
  consultation_title TEXT DEFAULT 'Book a Free Consultation',
  consultation_description TEXT,
  
  -- Social Proof
  social_proof_logos JSONB DEFAULT '[]'::jsonb,
  testimonials JSONB DEFAULT '[]'::jsonb,
  
  -- Final CTA
  final_cta_title TEXT,
  final_cta_description TEXT,
  final_cta_button_text TEXT DEFAULT 'Contact Us Now',
  
  -- Metadata
  meta_description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_service_pages_slug ON service_pages(slug);
CREATE INDEX IF NOT EXISTS idx_service_pages_status ON service_pages(status);
CREATE INDEX IF NOT EXISTS idx_service_pages_display_order ON service_pages(display_order);

-- Enable Row Level Security
ALTER TABLE service_pages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read published services
CREATE POLICY "Public can view published service pages"
  ON service_pages FOR SELECT
  USING (status = 'published');

-- Policy: Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage service pages"
  ON service_pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_service_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_pages_updated_at
  BEFORE UPDATE ON service_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_service_pages_updated_at();

-- Insert sample data for existing services
INSERT INTO service_pages (slug, title, status, hero_headline, hero_subheadline, hero_image_url, introduction_content, display_order) VALUES
('sap-public-cloud', 'SAP Public Cloud', 'published', 
  'SAP Public Cloud', 
  'Deploy secure, scalable SAP cloud solutions for streamlined operations and agility.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
  'Our SAP Public Cloud services enable you to leverage the power of SAP in the cloud, providing flexibility, scalability, and reduced infrastructure costs. We help you deploy, configure, and optimize SAP cloud solutions tailored to your business needs.',
  1),
  
('sap-implementations-and-rollouts', 'SAP Implementations and Rollouts', 'published',
  'SAP Implementations and Rollouts',
  'Execute tailored SAP deployments with proven Greenfield, Brownfield, or Bluefield strategies.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  'We provide comprehensive SAP implementation services, ensuring smooth deployments tailored to your business needs using industry best practices.',
  2),
  
('sap-document-and-reporting-compliance', 'SAP Document and Reporting Compliance', 'published',
  'SAP Document and Reporting Compliance',
  'Simplify e-Invoicing and tax reporting with seamless, compliant SAP solutions.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop',
  'Ensure compliance with local and international regulations through automated invoicing and reporting solutions.',
  3),
  
('sap-consulting-advisory', 'SAP Consulting & Advisory', 'published',
  'SAP Consulting & Advisory',
  'Unlock strategic value with expert SAP guidance tailored to your business goals.',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
  'Our consulting services help you identify opportunities, optimize processes, and maximize your SAP investment.',
  4),
  
('data-migration-services', 'Data & Migration Services', 'published',
  'Data & Migration Services',
  'Ensure smooth, secure data migration for optimized SAP performance.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
  'We handle data cleansing, validation, mapping, and migration to ensure accuracy and minimal downtime.',
  5),
  
('support-managed-services', 'Support & Managed Services', 'published',
  'Support & Managed Services',
  'Maintain peak SAP performance with proactive support and management.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
  '24/7 monitoring, system optimization, and preventive maintenance to keep your SAP systems running smoothly.',
  6),
  
('training-change-management', 'Training & Change Management', 'published',
  'Training & Change Management',
  'Empower teams with targeted training for seamless SAP adoption.',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
  'Customized training programs designed for different user roles to ensure successful SAP adoption.',
  7),
  
('sap-project-management-governance', 'SAP Project Management & Governance', 'published',
  'SAP Project Management & Governance',
  'Drive project success with expert oversight and disciplined governance.',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
  'Clear project planning, risk management, and stakeholder communication throughout the project lifecycle.',
  8);

