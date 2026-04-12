
-- Allow authenticated users to upload to post-images bucket
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- Allow public to view post images
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- Allow authenticated admins to delete post images
CREATE POLICY "Authenticated users can delete post images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images');
