
-- Create the prints table
CREATE TABLE prints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  category TEXT,
  metadata JSONB
);

-- Enable Row Level Security for the prints table
ALTER TABLE prints ENABLE ROW LEVEL SECURITY;

-- Create policies for the prints table
-- Allow public read access for all users
CREATE POLICY "Allow public read access" ON prints
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own prints
CREATE POLICY "Allow insert for authenticated users" ON prints
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own prints
CREATE POLICY "Allow update for owner" ON prints
  FOR UPDATE USING (auth.uid() = (SELECT owner FROM storage.objects WHERE bucket_id = 'prints' AND name = prints.filename))
  WITH CHECK (auth.uid() = (SELECT owner FROM storage.objects WHERE bucket_id = 'prints' AND name = prints.filename));

-- Allow users to delete their own prints
CREATE POLICY "Allow delete for owner" ON prints
  FOR DELETE USING (bucket_id = 'prints' AND auth.uid() = owner);

-- Create the prints storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('prints', 'prints', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the prints storage bucket
-- Allow public read access to files in the prints bucket
CREATE POLICY "Allow public read access on prints bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'prints');

-- Allow authenticated users to upload files to the prints bucket
CREATE POLICY "Allow insert for authenticated users on prints bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'prints' AND auth.role() = 'authenticated');

-- Allow users to update their own files in the prints bucket
CREATE POLICY "Allow update for owner on prints bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'prints' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'prints' AND auth.uid() = owner);

-- Allow users to delete their own files in the prints bucket
CREATE POLICY "Allow delete for owner on prints bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'prints' AND auth.uid() = owner);
