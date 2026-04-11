
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete settings" ON public.site_settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'FrogTech'),
  ('site_tagline', 'The Future of Technology, Today'),
  ('site_description', 'A cutting-edge tech publication exploring AI, cybersecurity, web development, and emerging technologies.'),
  ('twitter_url', ''),
  ('github_url', ''),
  ('linkedin_url', ''),
  ('rss_enabled', 'true'),
  ('discord_url', ''),
  ('youtube_url', ''),
  ('contact_email', ''),
  ('posts_per_page', '12'),
  ('show_author_bio', 'true'),
  ('enable_comments', 'false'),
  ('analytics_id', '')
ON CONFLICT (key) DO NOTHING;
