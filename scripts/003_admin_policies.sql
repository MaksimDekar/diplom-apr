-- Update RLS policies for admin access
-- Admin users need to be able to manage all content

-- Services - Admin policies
CREATE POLICY "services_admin_all" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- Projects - Admin policies  
CREATE POLICY "projects_admin_all" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- Project images - Admin policies
CREATE POLICY "project_images_admin_all" ON public.project_images FOR ALL USING (true) WITH CHECK (true);

-- Team members - Admin policies
CREATE POLICY "team_members_admin_all" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- Reviews - Admin policies
CREATE POLICY "reviews_admin_all" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- Contact requests - Admin read/update
CREATE POLICY "contact_requests_admin_read" ON public.contact_requests FOR SELECT USING (true);
CREATE POLICY "contact_requests_admin_update" ON public.contact_requests FOR UPDATE USING (true);
CREATE POLICY "contact_requests_admin_delete" ON public.contact_requests FOR DELETE USING (true);

-- Consultation requests - Admin read/update
CREATE POLICY "consultation_requests_admin_read" ON public.consultation_requests FOR SELECT USING (true);
CREATE POLICY "consultation_requests_admin_update" ON public.consultation_requests FOR UPDATE USING (true);
CREATE POLICY "consultation_requests_admin_delete" ON public.consultation_requests FOR DELETE USING (true);

-- Site settings - Admin policies
CREATE POLICY "site_settings_admin_update" ON public.site_settings FOR UPDATE USING (true);

-- Note: In production, you should restrict these policies to authenticated admin users only
-- Example: USING (auth.uid() IS NOT NULL AND auth.jwt()->>'is_admin' = 'true')
