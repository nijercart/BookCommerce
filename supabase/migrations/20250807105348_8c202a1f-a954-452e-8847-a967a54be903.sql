-- Create RLS policies for hero-banners storage bucket

-- Policy to allow admins to insert (upload) files to hero-banners bucket
CREATE POLICY "Admins can upload to hero-banners bucket" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'hero-banners' 
  AND is_admin(auth.uid())
);

-- Policy to allow everyone to view hero banner images (since they're public)
CREATE POLICY "Everyone can view hero-banners" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-banners');

-- Policy to allow admins to update hero banner files
CREATE POLICY "Admins can update hero-banners" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'hero-banners' 
  AND is_admin(auth.uid())
);

-- Policy to allow admins to delete hero banner files
CREATE POLICY "Admins can delete hero-banners" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'hero-banners' 
  AND is_admin(auth.uid())
);