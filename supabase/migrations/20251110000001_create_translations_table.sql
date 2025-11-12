-- Create translations table for multi-language support
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_key TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'nl')),
  translation_value TEXT NOT NULL,
  category TEXT, -- e.g., 'navigation', 'home', 'services', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(translation_key, language)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_translations_key_lang ON translations(translation_key, language);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read all translations
CREATE POLICY "Public can view translations"
  ON translations FOR SELECT
  USING (true);

-- Policy: Authenticated users (admins) can manage translations
CREATE POLICY "Authenticated users can manage translations"
  ON translations FOR ALL
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translations_updated_at();

-- Insert default English translations
INSERT INTO translations (translation_key, language, translation_value, category) VALUES
-- Navigation
('nav.home', 'en', 'Home', 'navigation'),
('nav.about', 'en', 'About Us', 'navigation'),
('nav.services', 'en', 'Services', 'navigation'),
('nav.industries', 'en', 'Industries', 'navigation'),
('nav.careers', 'en', 'Careers', 'navigation'),
('nav.contact', 'en', 'Contact', 'navigation'),

-- Common buttons
('btn.getStarted', 'en', 'Get Started', 'common'),
('btn.learnMore', 'en', 'Learn More', 'common'),
('btn.contactUs', 'en', 'Contact Us', 'common'),
('btn.readMore', 'en', 'Read More', 'common'),
('btn.apply', 'en', 'Apply', 'common'),
('btn.submit', 'en', 'Submit', 'common'),

-- Home page
('home.hero.title', 'en', 'Transform Your Business with SAP Excellence', 'home'),
('home.hero.subtitle', 'en', 'Expert SAP consulting and implementation services to drive innovation and growth', 'home'),

-- Services page
('services.hero.title', 'en', 'SAP Services We Offer', 'services'),
('services.hero.description', 'en', 'We deliver a complete range of SAP services designed to improve processes, integrate systems, and drive business efficiency.', 'services'),
('services.clients.title', 'en', 'Clients We''ve Served', 'services'),
('services.ourServices', 'en', 'Our Services', 'services'),
('services.techStack', 'en', 'Technology Stack', 'services'),
('services.testimonials.title', 'en', 'What Clients Say', 'services'),

-- Footer
('footer.about', 'en', 'About ASMI', 'footer'),
('footer.quickLinks', 'en', 'Quick Links', 'footer'),
('footer.contact', 'en', 'Contact Us', 'footer'),
('footer.followUs', 'en', 'Follow Us', 'footer'),

-- Dutch translations (initial set)
('nav.home', 'nl', 'Thuis', 'navigation'),
('nav.about', 'nl', 'Over ons', 'navigation'),
('nav.services', 'nl', 'Diensten', 'navigation'),
('nav.industries', 'nl', 'Industrieën', 'navigation'),
('nav.careers', 'nl', 'Carrières', 'navigation'),
('nav.contact', 'nl', 'Contact', 'navigation'),

('btn.getStarted', 'nl', 'Beginnen', 'common'),
('btn.learnMore', 'nl', 'Meer informatie', 'common'),
('btn.contactUs', 'nl', 'Neem contact op', 'common'),
('btn.readMore', 'nl', 'Lees verder', 'common'),
('btn.apply', 'nl', 'Solliciteren', 'common'),
('btn.submit', 'nl', 'Indienen', 'common'),

('home.hero.title', 'nl', 'Transformeer uw bedrijf met SAP-excellentie', 'home'),
('home.hero.subtitle', 'nl', 'Deskundige SAP-consulting en implementatiediensten om innovatie en groei te stimuleren', 'home'),

('services.hero.title', 'nl', 'SAP-diensten die wij aanbieden', 'services'),
('services.hero.description', 'nl', 'Wij leveren een compleet scala aan SAP-diensten die zijn ontworpen om processen te verbeteren, systemen te integreren en de bedrijfsefficiëntie te verhogen.', 'services'),
('services.clients.title', 'nl', 'Klanten die wij hebben gediend', 'services'),
('services.ourServices', 'nl', 'Onze diensten', 'services'),
('services.techStack', 'nl', 'Technologie Stack', 'services'),
('services.testimonials.title', 'nl', 'Wat klanten zeggen', 'services'),

('footer.about', 'nl', 'Over ASMI', 'footer'),
('footer.quickLinks', 'nl', 'Snelle links', 'footer'),
('footer.contact', 'nl', 'Neem contact op', 'footer'),
('footer.followUs', 'nl', 'Volg ons', 'footer');

