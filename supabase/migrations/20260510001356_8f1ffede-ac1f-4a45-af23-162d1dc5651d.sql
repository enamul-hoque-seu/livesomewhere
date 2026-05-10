
-- 1. Tighten newsletter_subscribers INSERT policy with email format validation
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe with valid email"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (
  email IS NOT NULL
  AND length(email) <= 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Allow admins to manage subscribers
CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Storage policies for post-images bucket (admin-only writes)
CREATE POLICY "Admins can upload post images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update post images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete post images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND has_role(auth.uid(), 'admin'::app_role));
