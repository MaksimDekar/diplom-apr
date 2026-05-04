-- Create enum types for better data validation
CREATE TYPE service_category AS ENUM ('renovation', 'design', 'commercial', 'other');
CREATE TYPE project_status AS ENUM ('completed', 'in_progress', 'planned');
CREATE TYPE request_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  icon TEXT,
  features TEXT[],
  price_from DECIMAL(10, 2),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  status project_status DEFAULT 'completed',
  location TEXT,
  area DECIMAL(10, 2),
  duration_days INTEGER,
  budget DECIMAL(12, 2),
  completion_date DATE,
  client_name TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project images gallery
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  experience_years INTEGER,
  specialization TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact requests
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type service_category,
  message TEXT NOT NULL,
  budget_range TEXT,
  preferred_contact_method TEXT,
  status request_status DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation requests (from forms)
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  property_type TEXT,
  property_area DECIMAL(10, 2),
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status request_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company settings (single row for site configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT DEFAULT 'АбсолютПрофРемонт',
  company_description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  working_hours TEXT,
  social_vk TEXT,
  social_instagram TEXT,
  social_telegram TEXT,
  social_whatsapp TEXT,
  about_text TEXT,
  years_of_experience INTEGER DEFAULT 10,
  completed_projects INTEGER DEFAULT 0,
  happy_clients INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO public.site_settings (
  company_name,
  phone,
  email,
  address,
  working_hours,
  about_text,
  years_of_experience
) VALUES (
  'ООО АбсолютПрофРемонт',
  '+7 (495) 123-45-67',
  'info@absolutprofremont.ru',
  'г. Москва, ул. Примерная, д. 1',
  'Пн-Пт: 9:00-19:00, Сб: 10:00-16:00',
  'Мы — команда профессионалов с более чем 10-летним опытом в сфере строительства и ремонта. Наша миссия — создавать качественные и комфортные пространства для жизни и работы.',
  10
) ON CONFLICT DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can read published content)
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "project_images_public_read" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "team_members_public_read" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT USING (true);

-- Public insert policies (for contact forms - no auth required)
CREATE POLICY "contact_requests_public_insert" ON public.contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "consultation_requests_public_insert" ON public.consultation_requests FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_featured ON public.projects(is_featured);
CREATE INDEX idx_project_images_project ON public.project_images(project_id);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_consultation_requests_status ON public.consultation_requests(status);
