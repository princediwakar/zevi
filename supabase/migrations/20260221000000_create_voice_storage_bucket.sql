-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES (
  'voice_recordings',
  'voice_recordings',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/m4a', 'audio/mp3', 'audio/webm', 'audio/wav'],
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Add storage policy to allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload voice recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voice_recordings');

-- Allow anyone to view voice recordings (for playback)
CREATE POLICY IF NOT EXISTS "Anyone can view voice recordings"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice_recordings');
