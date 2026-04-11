ALTER TABLE public.posts
  ADD COLUMN is_sponsored boolean DEFAULT false,
  ADD COLUMN sponsor_name text,
  ADD COLUMN sponsor_url text,
  ADD COLUMN sponsor_logo text,
  ADD COLUMN ad_banner_image text,
  ADD COLUMN ad_banner_url text;