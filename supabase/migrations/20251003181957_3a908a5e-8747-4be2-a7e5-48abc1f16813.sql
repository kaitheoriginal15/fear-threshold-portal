-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('character-images', 'character-images', true);

-- Allow public access to view images
CREATE POLICY "Public can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload character images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'character-images' 
  AND (SELECT has_role(auth.uid(), 'admin'))
);

-- Allow admins to update images
CREATE POLICY "Admins can update character images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'character-images' 
  AND (SELECT has_role(auth.uid(), 'admin'))
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete character images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'character-images' 
  AND (SELECT has_role(auth.uid(), 'admin'))
);